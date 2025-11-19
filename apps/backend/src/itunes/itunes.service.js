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
          limit: 1,
          country: 'kr',
        },
        timeout: 5000,
      });

      const results = response.data.results;
      if (results && results.length > 0 && results[0].previewUrl) {
        return results[0].previewUrl;
      }

      return null;
    } catch (error) {
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
