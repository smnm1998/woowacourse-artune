import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { OpenAIService } from './openai.service';
import axios from 'axios';

jest.mock('axios');

describe('OpenAIService', () => {
  let service;
  let configService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OpenAIService,
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

    service = moduleRef.get(OpenAIService);
    configService = moduleRef.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeEmotion', () => {
    it('텍스트를 받아 감정 분석 결과를 반환해야 한다.', async () => {
      // Given: OpenAI Chat Completions API 응답 모킹
      const mockText = '오늘 정말 행복한 하루였어요!';
      const mockAnalysisResult = {
        emotion: 'joy',
        emotionLabel: '기쁨',
        intensity: 0.85,
        description: '오늘 하루 정말 행복한 일들이 가득했네요!',
        immerse: {
          genres: ['pop', 'dance', 'funk'],
          valence: 0.9,
          energy: 0.85,
          tempo: 128,
        },
        soothe: {
          genres: ['acoustic', 'indie', 'chill'],
          valence: 0.6,
          energy: 0.3,
          tempo: 85,
        },
      };

      // Chat Completions 응답 모킹
      axios.post.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                role: 'assistant',
                content: JSON.stringify(mockAnalysisResult),
              },
            },
          ],
        },
      });

      // When: 감정 분석 실행
      const result = await service.analyzeEmotion(mockText);

      // Then: 결과 검증
      expect(result).toEqual(mockAnalysisResult);
      expect(result.emotion).toBe('joy');
      expect(result.immerse).toBeDefined();
      expect(result.soothe).toBeDefined();

      // API 호출 검증
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          model: 'gpt-4.1-mini',
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'system' }),
            expect.objectContaining({ role: 'user', content: mockText }),
          ]),
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
        }),
      );
    });

    it('빈 텍스트가 입력되면 에러를 던져야 한다.', async () => {
      // When & Then
      await expect(service.analyzeEmotion('')).rejects.toThrow(
        '분석할 텍스트를 입력해주세요.',
      );

      // API 호출 x
      expect(axios.post).not.toHaveBeenCalled();
    });

    it('null이 입력되면 에러를 던져야 한다.', async () => {
      // When & Then
      await expect(service.analyzeEmotion(null)).rejects.toThrow();
      expect(axios.post).not.toHaveBeenCalled();
    });

    it('OpenAI API 호출 실패 시 에러를 던져야 한다.', async () => {
      // Given: API 호출 실패 모킹
      axios.post.mockRejectedValueOnce(new Error('API Error'));

      // When & Then
      await expect(service.analyzeEmotion('테스트 텍스트')).rejects.toThrow();
    });

    it('OpenAI가 유효하지 않은 JSON을 반환하면 에러를 던져야 한다.', async () => {
      // Given
      axios.post.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                role: 'assistant',
                content: '이것은 JSON이 아닙니다.',
              },
            },
          ],
        },
      });

      // When & Then
      await expect(service.analyzeEmotion('테스트 텍스트')).rejects.toThrow(
        'JSON 파싱 실패',
      );
    });

    it('필수 필드가 누락된 응답을 받으면 에러를 던져야 한다.', async () => {
      // Given
      axios.post.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                role: 'assistant',
                content: JSON.stringify({
                  emotion: 'joy',
                  // emotionLabel, intensity 등 누락
                }),
              },
            },
          ],
        },
      });

      // When & Then
      await expect(service.analyzeEmotion('테스트 텍스트')).rejects.toThrow(
        '필수 필드 누락',
      );
    });
  });
});
