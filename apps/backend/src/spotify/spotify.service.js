import { Injectable, BadRequestException, Dependencies } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';

/**
 * Spotify Web API를 활용한 음악 추천 서비스
 * - Client Credentials Flow로 인증
 * - 감정 기반 음악 추천
 */
@Injectable()
@Dependencies(ConfigService)
export class SpotifyService {
  /**
   * @param {ConfigService} configService - NestJS ConfigService
   */
  constructor(configService) {
    this.spotifyApi = new SpotifyWebApi({
      clientId: configService.get('SPOTIFY_CLIENT_ID'),
      clientSecret: configService.get('SPOTIFY_CLIENT_SECRET'),
    });

    // 서비스 시작 시 액세스 토큰 획득
    this.authenticated = false;
  }

  /**
   * Spotify API 인증
   * 액세스 토큰을 획득하고 API 클라이언트에 설정
   */
  async authenticate() {
    try {
      console.log('Spotify 인증 시도 중...');
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
   *
   * @param {number} valence - 긍정도
   * @param {number} energy - 에너지
   * @returns {string} 감정 키워드
   */
  getEmotionKeywords(valence, energy) {
    if (valence > 0.7 && energy > 0.7) {
      return 'happy upbeat energetic';
    }
    if (valence > 0.7 && energy <= 0.7) {
      return 'happy chill relaxing';
    }
    if (valence <= 0.3 && energy > 0.7) {
      return 'intense powerful';
    }
    if (valence <= 0.3 && energy <= 0.3) {
      return 'sad melancholic';
    }
    if (energy > 0.7) {
      return 'energetic dynamic';
    } else {
      return 'chill mellow';
    }
  }

  /**
   * 장르, valence, energy, tempo 기반 음악 추천
   *
   * Spotify에서 지원하는 장르만을 이용할 것
   * 예시: acoustic, bossanova, country, dancehall 등
   *
   * @param {string[]} genres - 장르 배열 (최소 1개)
   * @param {number} valence - 긍정도 (0.0 ~ 1.0)
   * @param {number} energy - 에너지 (0.0 ~ 1.0)
   * @param {number} tempo - BPM (0 이상)
   * @returns {Promise<Array>} 추천 트랙 목록
   * @returns {BadRequestException} 파라미터 유효성 검증 실패 시
   */
  async getRecommendations(genres, valence, energy, tempo) {
    // 파라미터 유효성 검증
    this.validateParameters(genres, valence, energy, tempo);

    if (!this.authenticated) {
      await this.authenticate();
    }

    try {
      const accessToken = this.spotifyApi.getAccessToken();

      // 감정에 맞는 검색 키워드 생성
      const emotionKeywords = this.getEmotionKeywords(valence, energy);
      const searchQuery = `${genres.join(' ')} ${emotionKeywords}`;

      console.log('Search Query:', searchQuery);

      // Search API로 트랙 검색 (Recommendations API 대체)
      const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: searchQuery,
          type: 'track',
          limit: 20,
          market: 'KR',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map((artist) => ({
          name: artist.name,
          id: artist.id,
        })),
        album: {
          id: track.album.id,
          name: track.album.name,
          imageUrl: track.album.images[0]?.url,
          totalTracks: track.album.total_tracks,
          releaseDate: track.album.release_date,
          spotifyUrl: track.album.external_urls.spotify,
        },
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls.spotify,
        popularity: track.popularity,
        duration: track.duration_ms,
      }));
    } catch (error) {
      // 엑세스 토큰 만료 시 재인증 후 재시도
      if (error.response?.status === 401) {
        await this.authenticate();
        return this.getRecommendations(genres, valence, energy, tempo);
      }

      // 더 자세한 에러 정보 로깅
      console.error('Spotify API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
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
    // 장르 검증
    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      throw new BadRequestException('장르는 최소 1개 이상이 필요합니다.');
    }

    // valence 검증
    if (typeof valence !== 'number' || valence < 0 || valence > 1) {
      throw new BadRequestException('valence는 0~1 사이여야 합니다.');
    }

    // energy 검증 (0~1)
    if (typeof energy !== 'number' || energy < 0 || energy > 1) {
      throw new BadRequestException('energy는 0~1 사이여야 합니다.');
    }

    // tempo 검증 (0 초과)
    if (typeof tempo !== 'number' || tempo <= 0) {
      throw new BadRequestException('tempo는 0보다 커야 합니다.');
    }
  }
}
