import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DalleService } from './dalle.service';
import axios from 'axios';

jest.mock('axios');

describe('DalleService', () => {
  let service;
  let configService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DalleService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              const config = {
                OPENAI_API_KEY: 'test-api-key',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(DalleService);
    configService = moduleRef.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateDessertImage', () => {
    it('감정과 장르 정보로 디저트 이미지를 생성해야 한다.', async () => {
      // Given
      const emotion = 'joy';
      const emotionLabel = '기쁨';
      const genres = ['pop', 'dance'];

      const mockResponse = {
        data: {
          data: [{ url: 'https://example.com/generated-dessert.png' }],
        },
      };

      axios.post.mockResolvedValueOnce(mockResponse);

      // When
      const result = await service.generateDessertImage(
        emotion,
        emotionLabel,
        genres,
      );

      // Then
      expect(result.imageUrl).toBe('https://example.com/generated-dessert.png');
      expect(result.prompt).toContain('pixel_art');
      expect(result.prompt).toContain('dessert');
      expect(result.prompt).toContain('기쁨');

      // API 호출 검증
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.openai.com/v1/images/generations',
        expect.objectContaining({
          model: 'dall-e-3',
          prompt: expect.stringContaining('pixel art'),
          n: 1,
          size: '1024x1024',
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
        }),
      );
    });

    it('빈 감정이 입력되면 에러를 던져야 한다.', async () => {
      // When & Then
      await expect(
        service.generateDessertImage('', '기쁨', ['pop']),
      ).rejects.toThrow('감정 정보가 필요합니다.');
    });

    it('빈 감정 라벨이 입력되면 에러를 던져야 한다.', async () => {
      // When & Then
      await expect(
        service.generateDessertImage('joy', '', ['pop']),
      ).rejects.toThrow('감정 라벨이 필요합니다.');
    });

    it('빈 장르 배열이 입력되면 에러를 던져야 한다.', async () => {
      // When & Then
      await expect(
        service.generateDessertImage('joy', '기쁨', []),
      ).rejects.toThrow('장르 정보가 필요합니다.');
    });

    it('DALL-E API 호출 실패 시 에러를 던져야 한다.', async () => {
      // Given
      axios.post.mockRejectedValueOnce(new Error('DALL-E API Error'));

      // When & Then
      await expect(
        service.generateDessertImage('joy', '기쁨', ['pop']),
      ).rejects.toThrow();
    });

    it('각 감정에 맞는 디저트 프롬프트를 생성해야 한다.', async () => {
      // Given
      const mockResponse = {
        data: {
          data: [{ url: 'https://example.com/image.png' }],
        },
      };
      axios.post.mockResolvedValue(mockResponse);

      // When - 기쁨
      await service.generateDessertImage('joy', '기쁨', ['pop']);
      let lastCall = axios.post.mock.calls[axios.post.mock.calls.length - 1];
      expect(lastCall[1].prompt).toMatch(/bright|colorful|sweet/i);

      // When - 슬픔
      await service.generateDessertImage('sadness', '슬픔', ['ballad']);
      lastCall = axios.post.mock.calls[axios.post.mock.calls.length - 1];
      expect(lastCall[1].prompt).toMatch(/warm|comfort|soft/i);
    });
  });
});
