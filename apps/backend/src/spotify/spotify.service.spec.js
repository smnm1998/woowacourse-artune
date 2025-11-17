import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SpotifyService } from './spotify.service';
import { ITunesService } from '../itunes/itunes.service.js';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';

jest.mock('spotify-web-api-node');
jest.mock('axios');

describe('SpotifyService', () => {
  let service;
  let configService;
  let itunesService;
  let mockSpotifyApi;

  beforeEach(async () => {
    mockSpotifyApi = {
      setAccessToken: jest.fn(),
      getAccessToken: jest.fn(() => 'test-access-token'),
      clientCredentialsGrant: jest.fn(),
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
        {
          provide: ITunesService,
          useValue: {
            getPreviewUrlsBatch: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(SpotifyService);
    configService = moduleRef.get(ConfigService);
    itunesService = moduleRef.get(ITunesService);

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
      const genres = ['pop', 'dance'];
      const valence = 0.8;
      const energy = 0.7;
      const tempo = 120;

      const mockSearchResponse = {
        data: {
          tracks: {
            items: [
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
                preview_url: null,
                external_urls: { spotify: 'spotify-url' },
                popularity: 95,
                duration_ms: 180000,
              },
            ],
          },
        },
      };

      const mockAudioFeaturesResponse = {
        data: {
          audio_features: [
            {
              valence: 0.8,
              energy: 0.7,
              tempo: 120,
            },
          ],
        },
      };

      // iTunes API 모킹
      const mockItunesPreviewMap = new Map([
        ['1', 'https://audio-ssl.itunes.apple.com/preview.m4a'],
      ]);
      itunesService.getPreviewUrlsBatch.mockResolvedValue(mockItunesPreviewMap);

      axios.get
        .mockResolvedValueOnce(mockSearchResponse)
        .mockResolvedValueOnce(mockAudioFeaturesResponse);

      const result = await service.getRecommendations(
        genres,
        valence,
        energy,
        tempo,
      );

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Happy Song');
      expect(result[0].album.name).toBe('Album 1');
      expect(result[0].album.totalTracks).toBe(10);
      expect(result[0].popularity).toBe(95);
      expect(result[0].previewUrl).toBe(
        'https://audio-ssl.itunes.apple.com/preview.m4a',
      );
      expect(itunesService.getPreviewUrlsBatch).toHaveBeenCalled();
    });

    it('빈 장르 배열이 입력되면 에러를 던져야 한다.', async () => {
      await expect(
        service.getRecommendations([], 0.5, 0.5, 120),
      ).rejects.toThrow('장르는 최소 1개 이상이 필요합니다.');
    });

    it('valence가 0~1 범위를 벗어나면 에러를 던져야 한다.', async () => {
      await expect(
        service.getRecommendations(['pop'], 1.5, 0.5, 120),
      ).rejects.toThrow('valence는 0~1 사이여야 합니다.');

      await expect(
        service.getRecommendations(['pop'], -0.1, 0.5, 120),
      ).rejects.toThrow('valence는 0~1 사이여야 합니다.');
    });

    it('energy가 0~1 범위를 벗어나면 에러를 던져야 한다.', async () => {
      await expect(
        service.getRecommendations(['pop'], 0.5, 1.5, 120),
      ).rejects.toThrow('energy는 0~1 사이여야 합니다.');
    });

    it('tempo가 유효하지 않으면 에러를 던져야 한다.', async () => {
      await expect(
        service.getRecommendations(['pop'], 0.5, 0.5, -10),
      ).rejects.toThrow('tempo는 0보다 커야 합니다.');
    });

    it('Spotify API 호출 실패 시 에러를 던져야 한다.', async () => {
      axios.get.mockRejectedValueOnce(new Error('Spotify API Error'));

      await expect(
        service.getRecommendations(['pop'], 0.5, 0.5, 120),
      ).rejects.toThrow();
    });

    it('액세스 토큰이 만료되면 자동으로 갱신해야 한다.', async () => {
      const genres = ['pop'];
      const mockSearchResponse = {
        data: {
          tracks: { items: [] },
        },
      };

      const mockAudioFeaturesResponse = {
        data: {
          audio_features: [],
        },
      };

      itunesService.getPreviewUrlsBatch.mockResolvedValue(new Map());

      axios.get
        .mockRejectedValueOnce({
          response: { status: 401 },
          message: 'Unauthorized',
        })
        .mockResolvedValueOnce(mockSearchResponse)
        .mockResolvedValueOnce(mockAudioFeaturesResponse);

      await service.getRecommendations(genres, 0.5, 0.5, 120);

      expect(mockSpotifyApi.clientCredentialsGrant).toHaveBeenCalledTimes(2);
    });
  });
});
