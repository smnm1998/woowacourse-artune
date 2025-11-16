import { Injectable, BadRequestException } from '@nestjs/common';
import { Dependencies } from '@nestjs/common';
import { OpenAIService } from '../openai/openai.service';
import { SpotifyService } from '../spotify/spotify.service';
import { DalleService } from '../dalle/dalle.service';

/**
 * Emotion Service - Orchestrator
 * OpenAI, Spotify, DALLE 서비스를 조합하여 감정 기반 추천 시스템 구현
 */
@Injectable()
@Dependencies(OpenAIService, SpotifyService, DalleService)
export class EmotionService {
  constructor(openAIService, spotifyService, dalleService) {
    this.openAIService = openAIService;
    this.spotifyService = spotifyService;
    this.dalleService = dalleService;
  }

  /**
   * 텍스트 분석 -> 감정 및 추천 음악 & 픽셀아트 디저트 이미지 생성
   *
   * @param {string} text - 분석할 사용자 입력 테스트
   * @returns {Promsie<emotion: Object, recommendations: Array, dessertImage: Object>}
   * @throws {BadRequestException} 빈 텍스트가 입력된 경우
   *
   * 흐름:
   * 1. OpenAI로 감정 분석 - {emotion, emotionLabel, immerse, soothe}
   * 2. Spotfy로 음악 추천 - immerse의 genres, valence, energy, tempo 사용
   * 3. DALLE로 디저트 이미지 생성 - emotion, emotionLabel, genrse 사용
   * 4. 모든 결과를 통합하여 반환
   */
  async analyzeAndRecommend(text) {
    // 유효성 검사 - 빈 텍스트 방지
    if (!text || text.trim() === '') {
      throw new BadRequestException('분석할 텍스트가 필요합니다.');
    }

    // 1. OpenAI로 감정 분석
    const emotion = await this.openAIService.analyzeEmotion(text);

    // 2. Spotify 음악 추천 (immerse 사용)
    const { genres, valence, energy, tempo } = emotion.immerse;
    const recommendations = await this.spotifyService.getRecommendations(
      genres,
      valence,
      energy,
      tempo,
    );

    // 3. DALLE 디저트 이미지 생성
    const dessertImage = await this.dalleService.generateDessertImage(
      emotion.emotion,
      emotion.emotionLabel,
      genres,
    );

    // 4. 통합 결과 반환
    return {
      emotion,
      recommendations,
      dessertImage,
    };
  }
}
