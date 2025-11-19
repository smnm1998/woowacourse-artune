import { Injectable } from '@nestjs/common';
import axios from 'axios';

/**
 * iTunes Search API 서비스
 *
 * - 30초 preview URL 제공
 * - Rate limit: ~20 calls/min
 * - 인증 x
 */
@Injectable()
export class ITunesService {
  static BASE_URL = 'https://itunes.apple.com/search';

  /**
   * 아티스트명과 트랙명으로 preview URL 검색
   *
   * @param {string} artistName - 아티스트 이름
   * @param {string} trackName - 트랙 이름
   * @returns {Promise<string|null>} 30초 미리듣기 URL
   */
  async getPreviewUrl(artistName, trackName) {
    try {
      const response = await axios.get(ITunesService.BASE_URL, {
        params: {
          term: `${artistName} ${trackName}`,
          media: 'music',
          entity: 'song',
          limit: 10,
          country: 'kr',
        },
        timeout: 5000,
      });

      const results = response.data.results;
      if (!results || results.length === 0) {
        return null;
      }

      // Spotify의 정보와 iTunes 결과를 비교하기 위한 정규화 값
      const targetArtist = this.normalize(artistName);
      const targetTrack = this.normalize(trackName);

      // 결과 목록 중에서 가수와 제목이 일치하는 것 찾기
      const bestMatch = results.find((item) => {
        const itemArtist = this.normalize(item.artistName);
        const itemTrack = this.normalize(item.trackName);

        // 정확도 높은 매칭: 가수가 포함되고, 제목도 포함되는 경우
        // (iTunes는 가끔 'Feat.' 정보를 제목이나 가수에 섞어서 줌)
        const isArtistMatch =
          itemArtist.includes(targetArtist) ||
          targetArtist.includes(itemArtist);
        const isTrackMatch =
          itemTrack.includes(targetTrack) || targetTrack.includes(itemTrack);

        return isArtistMatch && isTrackMatch && item.previewUrl;
      });

      // 일치하는 결과가 있으면 반환, 없으면 null (엉뚱한 노래 재생 방지)
      return bestMatch ? bestMatch.previewUrl : null;
    } catch (error) {
      console.error(
        `iTunes API error: ${artistName} - ${trackName}`,
        error.message,
      );
      return null;
    }
  }

  /**
   * 여러 트랙의 preview URL을 배치로 가져옴
   *
   * @param {Array<{artistName: string, trackName: string, id: string}>} tracks
   * @returns {Promise<Map<string, string>>} trackId - previewUrl 맵
   */
  async getPreviewUrlsBatch(tracks) {
    const previewMap = new Map();

    for (const track of tracks) {
      const previewUrl = await this.getPreviewUrl(
        track.artistName,
        track.trackName,
      );
      if (previewUrl) {
        previewMap.set(track.id, previewUrl);
      }

      // Rate Limit 고려
      await new Promise((resolve) => setTimeout(resolve, 60));
    }

    return previewMap;
  }
}
