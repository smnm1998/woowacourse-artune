import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SpotifyService } from './spotify.service';
import SpotifyWebApi from 'spotify-web-api-node';

jest.mock('spotify-web-api-node');

describe('SpotifyService', () => {
  let service;
  let configService;
  let mockSpotifyApi;

  beforeEach(async () => {
    // SpotifyWebApi 모킹 설정
    mockSpotifyApi = {
      setAccessToken: jest.fn(),
      clientCredentialsGrant: jest.fn(),
      getRecommendations: jest.fn(),
    };

    SpotifyWebApi.mockImplementation(() => mockSpotifyApi);

    const moduleRef = await Test.createTestingModule({
      providers: [
        SpotifyService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              const config = {
                SPOTIFY_CLIENT_ID: 'test-client-id',
                SPOTIFY_CLIENT_SECRET: 'test-client-secret',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(SpotifyService);
    configService = moduleRef.get(ConfigService);

    // 액세스 토큰 모킹
    mockSpotifyApi.clientCredentialsGrant.mockResolvedValue({
      body: {
        access_token: 'test-access-token',
        expires_in: 3600,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRecommendations', () => {
    it('유효한 파라미터로 추천 트랙을 반환해야 한다.', async () => {
      // Given
      const genres = ['pop', 'dance'];
      const valence = 0.8;
      const energy = 0.7;
      const tempo = 120;

      const mockTracks = {
        body: {
          tracks: [
            {
              id: '1',
              name: 'Happy Song',
              artists: [{ name: 'Artist 1', id: 'artist-1' }],
              album: {
                id: 'album-1',
                name: 'Album 1',
                images: [{ url: 'image-url' }],
                total_tracks: 10,
                release_date: '2023-01-01',
                external_urls: { spotify: 'album-spotify-url' },
              },
              preview_url: 'preview-url',
              external_urls: { spotify: 'spotify-url' },
              popularity: 95,
              duration_ms: 180000,
            },
          ],
        },
      };

      mockSpotifyApi.getRecommendations.mockResolvedValueOnce(mockTracks);

      // When
      const result = await service.getRecommendations(
        genres,
        valence,
        energy,
        tempo,
      );

      // Then
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Happy Song');
      expect(result[0].album.name).toBe('Album 1');
      expect(result[0].album.totalTracks).toBe(10);
      expect(result[0].popularity).toBe(95);
    });

    it('빈 장르 배열이 입력되면 에러를 던져야 한다.', async () => {
      // When & Then
      await expect(
        service.getRecommendations([], 0.5, 0.5, 120),
      ).rejects.toThrow('장르는 최소 1개 이상이 필요합니다.');
    });

    it('valence가 0~1 범위를 벗어나면 에러를 던져야 한다.', async () => {
      // When & Then
      await expect(
        service.getRecommendations(['pop'], 1.5, 0.5, 120),
      ).rejects.toThrow('valence는 0~1 사이여야 합니다.');

      await expect(
        service.getRecommendations(['pop'], -0.1, 0.5, 120),
      ).rejects.toThrow('valence는 0~1 사이여야 합니다.');
    });

    it('energy가 0~1 범위를 벗어나면 에러를 던져야 한다.', async () => {
      // When & Then
      await expect(
        service.getRecommendations(['pop'], 0.5, 1.5, 120),
      ).rejects.toThrow('energy는 0~1 사이여야 합니다.');
    });

    it('tempo가 유효하지 않으면 에러를 던져야 한다.', async () => {
      // When & Then
      await expect(
        service.getRecommendations(['pop'], 0.5, 0.5, -10),
      ).rejects.toThrow('tempo는 0보다 커야 합니다.');
    });

    it('Spotify API 호출 실패 시 에러를 던져야 한다.', async () => {
      // Given
      mockSpotifyApi.getRecommendations.mockRejectedValueOnce(
        new Error('Spotify API Error'),
      );

      // When & Then
      await expect(
        service.getRecommendations(['pop'], 0.5, 0.5, 120),
      ).rejects.toThrow();
    });

    it('액세스 토큰이 만료되면 자동으로 갱신해야 한다.', async () => {
      // Given
      const genres = ['pop'];
      const mockTracks = {
        body: { tracks: [] },
      };

      // 첫 호출은 401 에러
      mockSpotifyApi.getRecommendations
        .mockRejectedValueOnce({
          statusCode: 401,
          message: 'The access token expired',
        })
        .mockResolvedValueOnce(mockTracks);

      // When
      await service.getRecommendations(genres, 0.5, 0.5, 120);

      // Then: 토큰 갱신이 호출되었는지
      expect(mockSpotifyApi.clientCredentialsGrant).toHaveBeenCalledTimes(2); // 초기 1회 + 갱신 1회
    });
  });
});
