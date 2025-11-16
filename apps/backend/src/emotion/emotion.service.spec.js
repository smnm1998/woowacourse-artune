import { Test } from '@nestjs/testing';
import { EmotionService } from './emotion.service';
import { OpenAIService } from '../openai/openai.service';
import { SpotifyService } from '../spotify/spotify.service';
import { DalleService } from '../dalle/dalle.service';

describe('EmotionService', () => {
  let service;
  let openAIService;
  let spotifyService;
  let dalleService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EmotionService,
        {
          provide: OpenAIService,
          useValue: {
            analyzeEmotion: jest.fn(),
          },
        },
        {
          provide: SpotifyService,
          useValue: {
            getRecommendations: jest.fn(),
          },
        },
        {
          provide: DalleService,
          useValue: {
            generateDessertImage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(EmotionService);
    openAIService = moduleRef.get(OpenAIService);
    spotifyService = moduleRef.get(SpotifyService);
    dalleService = moduleRef.get(DalleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeAndRecommend', () => {
    it('텍스트를 분석하여 감정, 음악, 디저트 이미지를 모두 반환해야 한다.', async () => {
      // Given
      const mockEmotion = {
        emotion: 'joy',
        emotionLabel: '기쁨',
        intensity: 0.8,
        description: '매우 긍정적인 감정',
        immerse: {
          genres: ['pop', 'dance'],
          valence: 0.8,
          energy: 0.9,
          tempo: 120,
        },
        soothe: {
          genres: ['acoustic', 'indie'],
          valence: 0.7,
          energy: 0.5,
          tempo: 100,
        },
      };

      const mockRecommendations = [
        {
          id: 'track1',
          name: 'Happy Song',
          artists: [{ name: 'Artist 1', id: 'artist1' }],
          album: {
            id: 'album1',
            name: 'Happy Album',
            imageUrl: 'https://example.com/album.jpg',
          },
        },
      ];

      const mockDessertImage = {
        imageUrl: 'https://example.com/dessert.png',
        prompt: 'A pixel_art style dessert...',
      };

      openAIService.analyzeEmotion.mockResolvedValueOnce(mockEmotion);
      spotifyService.getRecommendations.mockResolvedValueOnce(
        mockRecommendations,
      );
      dalleService.generateDessertImage.mockResolvedValueOnce(mockDessertImage);

      // When
      const text = '오늘 정말 기분이 좋아!';
      const result = await service.analyzeAndRecommend(text);

      // Then
      expect(result).toEqual({
        emotion: mockEmotion,
        recommendations: mockRecommendations,
        dessertImage: mockDessertImage,
      });

      expect(openAIService.analyzeEmotion).toHaveBeenCalledWith(text);
      expect(spotifyService.getRecommendations).toHaveBeenCalledWith(
        ['pop', 'dance'],
        0.8,
        0.9,
        120,
      );
      expect(dalleService.generateDessertImage).toHaveBeenCalledWith(
        'joy',
        '기쁨',
        ['pop', 'dance'],
      );
    });

    it('빈 텍스트가 입력되면 에러를 던져야 한다.', async () => {
      // When & Then
      await expect(service.analyzeAndRecommend('')).rejects.toThrow(
        '분석할 텍스트가 필요합니다.',
      );
    });

    it('OpenAI 서비스 실패 시 에러를 던져야 한다.', async () => {
      // Given
      openAIService.analyzeEmotion.mockRejectedValueOnce(
        new Error('OpenAI API Error'),
      );

      // When & Then
      await expect(service.analyzeAndRecommend('테스트')).rejects.toThrow();
    });

    it('Spotify 서비스 실패 시 에러를 던져야 한다.', async () => {
      // Given
      const mockEmotion = {
        emotion: 'joy',
        emotionLabel: '기쁨',
        immerse: { genres: ['pop'], valence: 0.8, energy: 0.9, tempo: 120 },
      };

      openAIService.analyzeEmotion.mockResolvedValueOnce(mockEmotion);
      spotifyService.getRecommendations.mockRejectedValueOnce(
        new Error('Spotify API Error'),
      );

      // When & Then
      await expect(service.analyzeAndRecommend('테스트')).rejects.toThrow();
    });

    it('DALL-E 서비스 실패 시 에러를 던져야 한다.', async () => {
      // Given
      const mockEmotion = {
        emotion: 'joy',
        emotionLabel: '기쁨',
        immerse: { genres: ['pop'], valence: 0.8, energy: 0.9, tempo: 120 },
      };

      const mockRecommendations = [{ id: 'track1', name: 'Song' }];

      openAIService.analyzeEmotion.mockResolvedValueOnce(mockEmotion);
      spotifyService.getRecommendations.mockResolvedValueOnce(
        mockRecommendations,
      );
      dalleService.generateDessertImage.mockRejectedValueOnce(
        new Error('DALL-E API Error'),
      );

      // When & Then
      await expect(service.analyzeAndRecommend('테스트')).rejects.toThrow();
    });
  });
});
