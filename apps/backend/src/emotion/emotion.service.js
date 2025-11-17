import { Injectable, BadRequestException } from '@nestjs/common';
import { Dependencies } from '@nestjs/common';
import { OpenAIService } from '../openai/openai.service';
import { SpotifyService } from '../spotify/spotify.service';
import { DalleService } from '../dalle/dalle.service';
import { mapToFrontendTrack } from '../spotify/utils/track-mapper.util';

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
   * 감정에 따른 immerse 모드 설명 생성
   *
   * @param {string} emotionLabel - 감정 라벨 (예: '기쁨', '슬픔')
   * @returns {string} immerse 모드 설명
   */
  getImmerseDescription(emotionLabel) {
    const descriptions = {
      기쁨: '이 기쁨을 더 깊이 느껴보세요',
      슬픔: '이 슬픔에 깊이 공감해보세요',
      분노: '이 감정을 충분히 표현해보세요',
      불안: '지금 느끼는 불안을 인정해보세요',
      평온: '이 평온함을 더 깊이 만끽해보세요',
      사랑: '이 따뜻한 감정에 빠져보세요',
    };
    return (
      descriptions[emotionLabel] || `이 ${emotionLabel}을 더 깊이 느껴보세요`
    );
  }

  /**
   * 감정에 따른 soothe 모드 설명 생성
   *
   * @param {string} emotionLabel - 감정 라벨
   * @returns {string} soothe 모드 설명
   */
  getSootheDescription(emotionLabel) {
    const descriptions = {
      기쁨: '차분히 마음을 정리해보세요',
      슬픔: '천천히 마음을 위로해보세요',
      분노: '조금씩 마음을 진정시켜보세요',
      불안: '차근차근 안정을 찾아보세요',
      평온: '이 평온함을 유지해보세요',
      사랑: '따뜻한 여운을 간직해보세요',
    };
    return (
      descriptions[emotionLabel] || `차분히 ${emotionLabel}을 정리해보세요`
    );
  }

  /**
   * 텍스트 분석 -> 감정 및 추천 음악 & 픽셀아트 디저트 이미지 생성
   *
   * @param {string} text - 분석할 사용자 입력 텍스트
   * @returns {Promise<Object>} 프론트엔드 형식의 응답
   * @throws {BadRequestException} 빈 텍스트가 입력된 경우
   *
   * 흐름:
   * 1. OpenAI로 감정 분석 - {emotion, emotionLabel, immerse, soothe}
   * 2. Spotify로 음악 추천 (immerse, soothe 각각)
   * 3. DALLE로 디저트 이미지 생성
   * 4. 프론트엔드 형식으로 변환하여 반환
   */
  async analyzeAndRecommend(text) {
    if (!text || text.trim() === '') {
      throw new BadRequestException('분석할 텍스트가 필요합니다.');
    }

    // 1. OpenAI로 감정 분석
    const emotion = await this.openAIService.analyzeEmotion(text);

    // 2. Spotify 음악 추천 - immerse (병렬 처리)
    const [immerseRecommendations, sootheRecommendations, dessertImage] =
      await Promise.all([
        // immerse 플레이리스트
        this.spotifyService.getRecommendations(
          emotion.immerse.genres,
          emotion.immerse.valence,
          emotion.immerse.energy,
          emotion.immerse.tempo,
        ),
        // soothe 플레이리스트
        this.spotifyService.getRecommendations(
          emotion.soothe.genres,
          emotion.soothe.valence,
          emotion.soothe.energy,
          emotion.soothe.tempo,
        ),
        // DALLE 디저트 이미지
        this.dalleService.generateDessertImage(
          emotion.emotion,
          emotion.emotionLabel,
          emotion.immerse.genres,
        ),
      ]);

    // 3. 프론트엔드 형식으로 변환
    return {
      emotionLabel: emotion.emotionLabel,
      description: emotion.description,
      artwork: {
        url: dessertImage.imageUrl,
        prompt: dessertImage.prompt,
      },
      playlists: {
        immerse: {
          modeLabel: '감정 심취',
          description: this.getImmerseDescription(emotion.emotionLabel),
          tracks: immerseRecommendations.map(mapToFrontendTrack),
        },
        soothe: {
          modeLabel: '감정 완화',
          description: this.getSootheDescription(emotion.emotionLabel),
          tracks: sootheRecommendations.map(mapToFrontendTrack),
        },
      },
    };
  }
}
