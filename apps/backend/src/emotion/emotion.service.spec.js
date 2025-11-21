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

      const mockImmerseRecommendations = [
        {
          id: 'track1',
          name: 'Happy Song',
          artists: [{ name: 'Artist 1', id: 'artist1' }],
          album: {
            id: 'album1',
            name: 'Happy Album',
            imageUrl: 'https://example.com/album.jpg',
            totalTracks: 10,
            releaseDate: '2024-01-01',
            spotifyUrl: 'https://spotify.com/album1',
          },
          previewUrl: 'https://preview1.url',
          spotifyUrl: 'https://spotify.com/track1',
          popularity: 95,
          duration: 180000,
        },
      ];

      const mockSootheRecommendations = [
        {
          id: 'track2',
          name: 'Calm Song',
          artists: [{ name: 'Artist 2', id: 'artist2' }],
          album: {
            id: 'album2',
            name: 'Calm Album',
            imageUrl: 'https://example.com/album2.jpg',
            totalTracks: 12,
            releaseDate: '2024-02-01',
            spotifyUrl: 'https://spotify.com/album2',
          },
          previewUrl: 'https://preview2.url',
          spotifyUrl: 'https://spotify.com/track2',
          popularity: 90,
          duration: 200000,
        },
      ];

      const mockDessertImage = {
        imageUrl: 'https://example.com/dessert.png',
        prompt: 'A pixel_art style dessert...',
      };

      openAIService.analyzeEmotion.mockResolvedValueOnce(mockEmotion);
      spotifyService.getRecommendations
        .mockResolvedValueOnce(mockImmerseRecommendations)
        .mockResolvedValueOnce(mockSootheRecommendations);
      dalleService.generateDessertImage.mockResolvedValueOnce(mockDessertImage);

      // When
      const text = '오늘 정말 기분이 좋아!';
      const result = await service.analyzeAndRecommend(text);

      // Then
      expect(result).toEqual({
        emotionLabel: '기쁨',
        description: '매우 긍정적인 감정',
        artwork: {
          url: 'https://example.com/dessert.png',
          prompt: 'A pixel_art style dessert...',
        },
        playlists: {
          immerse: {
            modeLabel: '감정 심취',
            description: expect.any(String),
            tracks: [
              {
                id: 'track1',
                name: 'Happy Song',
                artists: [{ name: 'Artist 1', id: 'artist1' }],
                album: {
                  name: 'Happy Album',
                  images: [{ url: 'https://example.com/album.jpg' }],
                },
                duration_ms: 180000,
                preview_url: 'https://preview1.url',
                external_urls: {
                  spotify: 'https://spotify.com/track1',
                },
              },
            ],
          },
          soothe: {
            modeLabel: '감정 완화',
            description: expect.any(String),
            tracks: [
              {
                id: 'track2',
                name: 'Calm Song',
                artists: [{ name: 'Artist 2', id: 'artist2' }],
                album: {
                  name: 'Calm Album',
                  images: [{ url: 'https://example.com/album2.jpg' }],
                },
                duration_ms: 200000,
                preview_url: 'https://preview2.url',
                external_urls: {
                  spotify: 'https://spotify.com/track2',
                },
              },
            ],
          },
        },
      });

      expect(openAIService.analyzeEmotion).toHaveBeenCalledWith(text);

      // immerse 플레이리스트 호출
      expect(spotifyService.getRecommendations).toHaveBeenNthCalledWith(
        1,
        ['pop', 'dance'],
        0.8,
        0.9,
        120,
      );

      // soothe 플레이리스트 호출
      expect(spotifyService.getRecommendations).toHaveBeenNthCalledWith(
        2,
        ['acoustic', 'indie'],
        0.7,
        0.5,
        100,
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
        soothe: { genres: ['acoustic'], valence: 0.7, energy: 0.5, tempo: 100 },
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
        soothe: { genres: ['acoustic'], valence: 0.7, energy: 0.5, tempo: 100 },
      };

      const mockRecommendations = [{ id: 'track1', name: 'Song' }];

      openAIService.analyzeEmotion.mockResolvedValueOnce(mockEmotion);
      spotifyService.getRecommendations
        .mockResolvedValueOnce(mockRecommendations)
        .mockResolvedValueOnce(mockRecommendations);
      dalleService.generateDessertImage.mockRejectedValueOnce(
        new Error('DALL-E API Error'),
      );

      // When & Then
      await expect(service.analyzeAndRecommend('테스트')).rejects.toThrow();
    });
  });

  describe('analyzeAndRecommendWithProgress', () => {
    it('진행률 콜백과 함께 텍스트를 분석하여 결과를 반환해야 한다.', async () => {
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

      const mockImmerseRecommendations = [
        {
          id: 'track1',
          name: 'Happy Song',
          artists: [{ name: 'Artist 1', id: 'artist1' }],
          album: {
            id: 'album1',
            name: 'Happy Album',
            imageUrl: 'https://example.com/album.jpg',
            totalTracks: 10,
            releaseDate: '2024-01-01',
            spotifyUrl: 'https://spotify.com/album1',
          },
          previewUrl: 'https://preview1.url',
          spotifyUrl: 'https://spotify.com/track1',
          popularity: 95,
          duration: 180000,
        },
      ];

      const mockSootheRecommendations = [
        {
          id: 'track2',
          name: 'Calm Song',
          artists: [{ name: 'Artist 2', id: 'artist2' }],
          album: {
            id: 'album2',
            name: 'Calm Album',
            imageUrl: 'https://example.com/album2.jpg',
            totalTracks: 12,
            releaseDate: '2024-02-01',
            spotifyUrl: 'https://spotify.com/album2',
          },
          previewUrl: 'https://preview2.url',
          spotifyUrl: 'https://spotify.com/track2',
          popularity: 90,
          duration: 200000,
        },
      ];

      const mockDessertImage = {
        imageUrl: 'https://example.com/dessert.png',
        prompt: 'A pixel_art style dessert...',
      };

      const progressCallback = jest.fn();

      openAIService.analyzeEmotion.mockResolvedValueOnce(mockEmotion);
      spotifyService.getRecommendations
        .mockResolvedValueOnce(mockImmerseRecommendations)
        .mockResolvedValueOnce(mockSootheRecommendations);
      dalleService.generateDessertImage.mockResolvedValueOnce(mockDessertImage);

      // When
      const text = '오늘 정말 기분이 좋아!';
      const result = await service.analyzeAndRecommendWithProgress(
        text,
        progressCallback,
      );

      // Then
      expect(result).toEqual({
        emotionLabel: '기쁨',
        description: '매우 긍정적인 감정',
        artwork: {
          url: 'https://example.com/dessert.png',
          prompt: 'A pixel_art style dessert...',
        },
        playlists: {
          immerse: {
            modeLabel: '감정 심취',
            description: expect.any(String),
            tracks: [
              {
                id: 'track1',
                name: 'Happy Song',
                artists: [{ name: 'Artist 1', id: 'artist1' }],
                album: {
                  name: 'Happy Album',
                  images: [{ url: 'https://example.com/album.jpg' }],
                },
                duration_ms: 180000,
                preview_url: 'https://preview1.url',
                external_urls: {
                  spotify: 'https://spotify.com/track1',
                },
              },
            ],
          },
          soothe: {
            modeLabel: '감정 완화',
            description: expect.any(String),
            tracks: [
              {
                id: 'track2',
                name: 'Calm Song',
                artists: [{ name: 'Artist 2', id: 'artist2' }],
                album: {
                  name: 'Calm Album',
                  images: [{ url: 'https://example.com/album2.jpg' }],
                },
                duration_ms: 200000,
                preview_url: 'https://preview2.url',
                external_urls: {
                  spotify: 'https://spotify.com/track2',
                },
              },
            ],
          },
        },
      });

      // 진행률 콜백이 여러 번 호출되었는지 확인
      expect(progressCallback).toHaveBeenCalled();
      expect(progressCallback.mock.calls.length).toBeGreaterThan(5);

      // 주요 진행률 체크
      expect(progressCallback).toHaveBeenCalledWith(0, expect.any(String));
      expect(progressCallback).toHaveBeenCalledWith(10, expect.any(String));
      expect(progressCallback).toHaveBeenCalledWith(30, expect.any(String));
      expect(progressCallback).toHaveBeenCalledWith(40, expect.any(String));
      expect(progressCallback).toHaveBeenCalledWith(60, expect.any(String));
      expect(progressCallback).toHaveBeenCalledWith(80, expect.any(String));
      expect(progressCallback).toHaveBeenCalledWith(95, expect.any(String));
      expect(progressCallback).toHaveBeenCalledWith(100, '완료!');
    });

    it('빈 텍스트가 입력되면 에러를 던져야 한다.', async () => {
      const progressCallback = jest.fn();

      await expect(
        service.analyzeAndRecommendWithProgress('', progressCallback),
      ).rejects.toThrow('분석할 텍스트가 필요합니다.');
    });
  });

  describe('getImmerseDescription', () => {
    it('기쁨 감정에 대한 immerse 설명을 반환해야 한다.', () => {
      const description = service.getImmerseDescription('기쁨');
      expect(description).toBe('이 기쁨을 더 깊이 느껴보세요');
    });

    it('등록되지 않은 감정은 기본 템플릿을 사용해야 한다.', () => {
      const description = service.getImmerseDescription('알수없는감정');
      expect(description).toBe('이 알수없는감정을 더 깊이 느껴보세요');
    });
  });

  describe('getSootheDescription', () => {
    it('기쁨 감정에 대한 soothe 설명을 반환해야 한다.', () => {
      const description = service.getSootheDescription('기쁨');
      expect(description).toBe('차분히 마음을 정리해보세요');
    });

    it('등록되지 않은 감정은 기본 템플릿을 사용해야 한다.', () => {
      const description = service.getSootheDescription('알수없는감정');
      expect(description).toBe('차분히 알수없는감정을 정리해보세요');
    });
  });
});
