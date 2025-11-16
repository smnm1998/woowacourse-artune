import { Controller, Post, Scope, Inject } from '@nestjs/common';
import { Dependencies } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { EmotionService } from './emotion.service';

/**
 * Emotion Controller
 * 감정 분석 API 엔드포인트 제공
 */
@Controller({
  path: 'emotion',
  scope: Scope.REQUEST,
})
@Dependencies(EmotionService, REQUEST)
export class EmotionController {
  constructor(emotionService, request) {
    this.emotionService = emotionService;
    this.request = request;
  }

  /**
   * 텍스트 감정 분석 및 음악/디저트 추천 API
   *
   * @route POST /emotion/analyze
   * @param {Object} body - { text: string }
   * @returns {Promise<{emotion: Object, recommendations: Array, dessertImage: Object}>}
   *
   * 예시:
   * POST /emotion/analyze
   * Body: { "text": "오늘 정말 기분이 좋아!" }
   *
   * Response: {
   *   emotion: { emotion: 'joy', emotionLabel: '기쁨', ... },
   *   recommendations: [{ id: '...', name: '...', ... }],
   *   dessertImage: { imageUrl: '...', prompt: '...' }
   * }
   */
  @Post('analyze')
  async analyze() {
    const { text } = this.request.body;
    return await this.emotionService.analyzeAndRecommend(text);
  }
}
