import { Test } from '@nestjs/testing';
import { ITunesService } from './itunes.service';
import axios from 'axios';

jest.mock('axios');

describe('ITunesService', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ITunesService],
    }).compile();

    service = module.get(ITunesService);
    jest.clearAllMocks();
  });

  describe('getPreviewUrl', () => {
    it('preview URL을 성공적으로 변환해야 함', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              trackName: '좋은날',
              artistName: '아이유',
              previewUrl: 'https://audio-ssl.itunes.apple.com/preview.m4a',
            },
          ],
        },
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await service.getPreviewUrl('아이유', '좋은날');

      expect(result).toBe('https://audio-ssl.itunes.apple.com/preview.m4a');
      expect(axios.get).toHaveBeenCalledWith(ITunesService.BASE_URL, {
        params: {
          term: '아이유 좋은날',
          media: 'music',
          entity: 'song',
          limit: 1,
          country: 'kr',
        },
        timeout: 5000,
      });
    });

    it('결과가 없으면 null을 반환해야 함', async () => {
      const mockResponse = {
        data: {
          results: [],
        },
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await service.getPreviewUrl('Unknown', 'Track');

      expect(result).toBeNull();
    });

    it('previewUrl이 없으면 null을 반환해야 함', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              trackName: 'Test',
              artistName: 'Artist',
            },
          ],
        },
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await service.getPreviewUrl('Artist', 'Test');

      expect(result).toBeNull();
    });

    it('API 에러 발생 시 null을 반환해야 함', async () => {
      axios.get.mockRejectedValue(new Error('Network error'));

      const result = await service.getPreviewUrl('Artist', 'Track');

      expect(result).toBeNull();
    });
  });

  describe('getPreviewUrlsBatch', () => {
    it('여러 트랙의 preview URL을 Map으로 반환해야 함', async () => {
      const tracks = [
        { id: '1', artistName: '아이유', trackName: '좋은날' },
        { id: '2', artistName: 'BTS', trackName: 'Dynamite' },
        { id: '3', artistName: 'Unknown', trackName: 'NoPreview' },
      ];

      axios.get
        .mockResolvedValueOnce({
          data: {
            results: [{ previewUrl: 'https://preview1.m4a' }],
          },
        })
        .mockResolvedValueOnce({
          data: {
            results: [{ previewUrl: 'https://preview2.m4a' }],
          },
        })
        .mockResolvedValueOnce({
          data: {
            results: [],
          },
        });

      const result = await service.getPreviewUrlsBatch(tracks);

      expect(result.size).toBe(2);
      expect(result.get('1')).toBe('https://preview1.m4a');
      expect(result.get('2')).toBe('https://preview2.m4a');
      expect(result.has('3')).toBe(false);
    });

    it('빈 배열이면 빈 Map을 반환해야 함', async () => {
      const result = await service.getPreviewUrlsBatch([]);

      expect(result.size).toBe(0);
      expect(axios.get).not.toHaveBeenCalled();
    });
  });
});
