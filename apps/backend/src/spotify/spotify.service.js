import { Injectable, BadRequestException, Dependencies } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
import { filterTracks } from './utils/track-filter.util.js';
import {
  addSimilarityScores,
  sortBySimlilarityAndPopularity,
} from './utils/audio-similarity.util.js';
import { ensureArtistDiversity } from './utils/artist-diversity.util.js';
import { mapTracksToDTO } from './utils/track-mapper.util.js';
import { ITunesService } from '../itunes/itunes.service.js';

/**
 * Spotify Web API를 활용한 음악 추천 서비스
 * - Client Credentials Flow로 인증
 * - 감정 기반 음악 추천
 */
@Injectable()
@Dependencies(ConfigService, ITunesService)
export class SpotifyService {
  /**
   * @param {ConfigService} configService
   * @param {ITunesService} itunesService
   */
  constructor(configService, itunesService) {
    this.spotifyApi = new SpotifyWebApi({
      clientId: configService.get('SPOTIFY_CLIENT_ID'),
      clientSecret: configService.get('SPOTIFY_CLIENT_SECRET'),
    });

    this.itunesService = itunesService;
    this.authenticated = false;
  }

  /**
   * Spotify API 인증
   * 액세스 토큰을 획득하고 API 클라이언트에 설정
   */
  async authenticate() {
    try {
      const data = await this.spotifyApi.clientCredentialsGrant();
      this.spotifyApi.setAccessToken(data.body.access_token);
      this.authenticated = true;
    } catch (error) {
      console.error('Spotify 인증 실패:', error);
      throw new Error(`Spotify 인증 에러: ${error.message}`);
    }
  }

  /**
   * valence와 energy 값에 따라 감정 키워드 반환
   * @param {number} valence - 긍정도
   * @param {number} energy - 에너지
   * @returns {string} 감정 키워드
   */
  getEmotionKeywords(valence, energy) {
    const getKey = (value) => {
      if (value > 0.7) return 'high';
      if (value > 0.3) return 'mid';
      return 'low';
    };

    const vKey = getKey(valence);
    const eKey = getKey(energy);

    const keywordMap = {
      'high-high': 'happy upbeat energetic',
      'high-mid': 'uplifting positive',
      'high-low': 'happy chill relaxing',
      'mid-high': 'energetic dynamic',
      'mid-mid': 'balanced moderate',
      'mid-low': 'calm peaceful',
      'low-high': 'intense powerful',
      'low-mid': 'melancholic emotional',
      'low-low': 'sad melancholic',
    };

    return keywordMap[`${vKey}-${eKey}`];
  }

  /**
   * 여러 트랙의 Audio Features를 가져옴
   * @param {string[]} trackIds - 트랙 ID 배열 (최대 100개)
   * @returns {Promise<Object>} 트랙 ID별 audio features 맵
   */
  async getAudioFeatures(trackIds) {
    if (!this.authenticated) {
      await this.authenticate();
    }

    try {
      const accessToken = this.spotifyApi.getAccessToken();

      const response = await axios.get(
        'https://api.spotify.com/v1/audio-features',
        {
          params: {
            ids: trackIds.join(','),
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const featuresMap = {};
      response.data.audio_features.forEach((features, index) => {
        if (features) {
          featuresMap[trackIds[index]] = features;
        }
      });

      return featuresMap;
    } catch (error) {
      console.error('Audio Features 가져오기 실패:', error.message);
      return {};
    }
  }

  /**
   * 장르, valence, energy, tempo 기반 음악 추천 (하이브리드 방식)
   *
   * 개선 사항:
   * 1. 인기도 필터링 (최소 35 이상)
   * 2. Audio Features 기반 유사도 정렬
   * 3. 중복 트랙 제거
   * 4. 아티스트 다양성 보장
   * 5. 한국 시장 고려 (market=KR)
   *
   * @param {string[]} genres - 장르 배열 (최소 1개)
   * @param {number} valence - 긍정도 (0.0 ~ 1.0)
   * @param {number} energy - 에너지 (0.0 ~ 1.0)
   * @param {number} tempo - BPM (0 이상)
   * @returns {Promise<Array>} 추천 트랙 목록
   */
  async getRecommendations(genres, valence, energy, tempo) {
    this.validateParameters(genres, valence, energy, tempo);

    if (!this.authenticated) {
      await this.authenticate();
    }

    try {
      const accessToken = this.spotifyApi.getAccessToken();
      const emotionKeywords = this.getEmotionKeywords(valence, energy);

      // 가장 중요한 NOT 필터만 선택 (앰비언트, 클래식, 명상음악 제외)
      const excludeKeywords = 'NOT classical NOT ambient NOT meditation';
      const includeKeywords = 'artist';

      // 장르는 최대 2개까지만 사용
      const genreQuery = genres.slice(0, 2).join(' ');

      const searchQuery = `${genreQuery} ${emotionKeywords} ${includeKeywords} ${excludeKeywords}`;

      const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: searchQuery,
          type: 'track',
          limit: 50,
          market: 'KR',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const rawTracks = response.data.tracks.items;

      // 컴필레이션 앨범 및 Various Artists 제외
      const realArtistTracks = rawTracks.filter((track) => {
        const artistName = track.artists[0]?.name?.toLowerCase() || '';
        const albumType = track.album?.album_type;

        // Various Artists, VA, 묶음 제외
        if (
          artistName.includes('various') ||
          artistName === 'va' ||
          artistName.includes('ost') ||
          artistName.includes('compilation')
        ) {
          return false;
        }

        // 컴필레이션 앨범 제외
        if (albumType === 'compilation') {
          return false;
        }

        return true;
      });

      // preview_url 통계 확인
      const previewUrlStats = {
        total: rawTracks.length,
        withPreview: rawTracks.filter((t) => t.preview_url !== null).length,
        withoutPreview: rawTracks.filter((t) => t.preview_url === null).length,
      };

      // 1단계: 트랙 필터링 (중복 제거 + 인기도)
      const { tracks: filteredTracks, stats } = filterTracks(realArtistTracks, {
        minPopularity: 50,
        minResults: 40,
      });

      // 2단계: Audio Features 가져오기
      const trackIds = filteredTracks.map((track) => track.id);
      const audioFeaturesMap = await this.getAudioFeatures(trackIds);

      // 3단계: 유사도 계산 및 정렬
      const tracksWithSimilarity = addSimilarityScores(
        filteredTracks,
        audioFeaturesMap,
        valence,
        energy,
        tempo,
      );

      const sortedTracks = sortBySimlilarityAndPopularity(tracksWithSimilarity);

      // instrumentalness 필터링 (보컬 없는 순수 연주곡 제외)
      const vocalTracks = sortedTracks.filter((item) => {
        const instrumentalness = item.audioFeatures?.instrumentalness;
        // instrumentalness > 0.5: 순수 연주곡으로 간주하고 제외
        if (instrumentalness !== undefined && instrumentalness > 0.5) {
          return false;
        }
        return true;
      });

      // 4단계: 아티스트 다양성 보장
      const diverseTracks = ensureArtistDiversity(vocalTracks, 20, 2);

      // 5단계: iTunes에서 preview URL 가져오기
      const trackList = diverseTracks.map((item) => ({
        id: item.track.id,
        artistName: item.track.artists[0]?.name,
        trackName: item.track.name,
      }));

      const itunesPreviewMap =
        await this.itunesService.getPreviewUrlsBatch(trackList);

      // preview_url을 iTunes URL로 교체
      const tracksWithItunes = diverseTracks.map((item) => {
        const itunesPreview = itunesPreviewMap.get(item.track.id);
        if (itunesPreview) {
          return {
            ...item,
            track: {
              ...item.track,
              preview_url: itunesPreview,
            },
          };
        }
        return item;
      });

      // 6단계: DTO 매핑
      return mapTracksToDTO(tracksWithItunes.map((item) => item.track));
    } catch (error) {
      if (error.response?.status === 401) {
        await this.authenticate();
        return this.getRecommendations(genres, valence, energy, tempo);
      }

      console.error('Spotify API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      throw new Error(
        `Spotify API 호출 실패: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }

  /**
   * getRecomendations 파라미터 유효성 검증
   *
   * @param {string[]} genres - 장르 배열
   * @param {number} valence - 긍정도
   * @param {number} energy - 에너지
   * @param {number} tempo - BPM
   * @throws {BadRequestException} 유효성 검증 실패 시
   */
  validateParameters(genres, valence, energy, tempo) {
    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      throw new BadRequestException('장르는 최소 1개 이상이 필요합니다.');
    }

    if (typeof valence !== 'number' || valence < 0 || valence > 1) {
      throw new BadRequestException('valence는 0~1 사이여야 합니다.');
    }

    if (typeof energy !== 'number' || energy < 0 || energy > 1) {
      throw new BadRequestException('energy는 0~1 사이여야 합니다.');
    }

    if (typeof tempo !== 'number' || tempo <= 0) {
      throw new BadRequestException('tempo는 0보다 커야 합니다.');
    }
  }
}
