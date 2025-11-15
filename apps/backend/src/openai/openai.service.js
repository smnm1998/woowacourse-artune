import { Injectable, BadRequestException, Dependencies } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

/**
 * OpenAI Chat Completions API를 활용한 감정 분석 서비스
 */
@Injectable()
@Dependencies(ConfigService)
export class OpenAIService {
  /**
   * @param {ConfigService} configService - NestJS ConfigService
   */
  constructor(configService) {
    this.apiKey = configService.get('OPENAI_API_KEY');
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  /**
   * 사용자 텍스트를 분석하여 감정 정보와 Spotify 파라미터를 반환
   *
   * @param {string} text - 분석할 텍스트
   * @returns {Promise<Object>} 감정 분석 결과
   * @throws {BadRequestException} 텍스트가 비어있을 때
   * @throws {Error} API 호출 실패 시
   */
  async analyzeEmotion(text) {
    // 입력 유효성 검증
    if (!text || text.trim().length === 0) {
      throw new BadRequestException('분석할 텍스트를 입력해주세요.');
    }

    try {
      // OpenAI Chat Completions API 호출
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-4.1-mini',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            {
              role: 'user',
              content: text,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      // 응답 파싱
      const content = response.data.choices[0].message.content;
      const result = JSON.parse(content);

      // 필수 필드 검증
      this.validateResult(result);

      return result;
    } catch (error) {
      // JSON 파싱 에러
      if (error instanceof SyntaxError) {
        throw new Error('JSON 파싱 실패');
      }

      // API 호출 에러
      if (error.response) {
        const status = error.response.status;
        const message =
          error.response.data?.error?.message || 'OpenAI API 오류';
        throw new Error(`OpenAI API 에러 (${status}): ${message}`);
      }
      // 기타 에러
      throw error;
    }
  }

  /**
   * 시스템 프롬프트 생성
   * 감정 분석 및 Spotify 파라미터 생성 지침 포함
   *
   * @returns {string} 시스템 프롬프트
   */
  getSystemPrompt() {
    return `당신은 감정 분석 전문가입니다. 사용자의 텍스트를 분석하여 다음 JSON 형식으로 반환하세요.
      
      **필수 응답 형식**
      {
        "emotion": "joy|sadness|anger|fear|surprise|neutral",
        "emotionLabel": "기쁨|슬픔|분노|두려움|놀람|중립",
        "intensity": 0.0~1.0 (감정 강도),
        "description": "감정에 대한 공감적 설명 (1~2문장)",
        "immerse": {
          "genres": ["장르1", "장르2", "장르3"],
          "valence": 0.0~1.0 (긍정도),
          "energy": 0.0~1.0 (에너지),
          "tempo": 60~200 (BPM)
        },
        "soothe": {
          "genres": ["장르1", "장르2", "장르3"],
          "valence": 0.0~1.0 (긍정도),
          "energy": 0.0~1.0 (에너지),
          "tempo": 60~200 (BPM)
        }
      }

      **감정별 가이드**
      - joy(기쁨): immerse는 밝고 에너지 넘치는 음악 (valence 0.8+, energy: 0.7+), soothe는 차분하고 따뜻한 음악
      - sadness(슬픔): immerse는 감성적인 발라드 (valence 0.3-, energy:0.4-), soothe는 밝고 희망찬 음악
      - anger(분노): immerse는 강렬한 록/힙합 (energy 0.8+), soothe는 차분한 음악
      - fear(두려움): immerse는 긴장감 있는 음악, soothe는 안정감 주는 음악
      - surprise(놀람): immerse는 역동적인 음악, soothe는 편안함을 주는 음악
      - neutral (중립): 균형 잡힌 다양한 장르 + 인기있는 음악

      **Spotify 장르 예시**
      pop, rock, hip-hop, r-n-b, jazz, classical, electronic, indie, folk, country, k-pop, dance, funk, soul, blues, acoustic, ambient, chill

      **중요사항**
      - immerse: 현재 감정을 더 깊이 느끼고 싶을 때
      - soothe: 현재 감정을 완화하고 전환하고 싶을 때
      - 반드시 JSON 형식으로만 응답하세요.
    `;
  }

  /**
   * 응답 결과 유효성 검증
   * 필수 필드가 모두 있는지 확인
   *
   * @param {Object} result - 검증할 결과 객체
   * @throws {Error} 필수 필드가 누락된 경우
   */
  validateResult(result) {
    const requiredFields = [
      'emotion',
      'emotionLabel',
      'intensity',
      'description',
      'immerse',
      'soothe',
    ];

    for (const field of requiredFields) {
      if (!(field in result)) {
        throw new Error(`필수 필드 누락: ${field}`);
      }
    }

    // immerse, sooth 내부 필드 검증
    const playlistFields = ['genres', 'valence', 'energy', 'tempo'];

    for (const mode of ['immerse', 'soothe']) {
      if (!result[mode] || typeof result[mode] !== 'object') {
        throw new Error(`필수 필드 누락: ${mode}`);
      }

      for (const field of playlistFields) {
        if (!(field in result[mode])) {
          throw new Error(`필수 필드 누락: ${mode}.${field}`);
        }
      }

      // genres는 배열
      if (!Array.isArray(result[mode].genres)) {
        throw new Error(`${mode}.genres는 배열이어야 합니다.`);
      }
    }
  }
}
