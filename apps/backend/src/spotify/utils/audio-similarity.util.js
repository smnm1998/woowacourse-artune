/**
 * 타겟 감정 파라미터와 트랙의 audio features 간 유사도 계산
 *
 * @param {Object} audioFeatures - 트랙의 audio features
 * @param {number} targetValence - 타겟 긍정도 (0~1)
 * @param {number} targetEnergy - 타겟 에너지 (0~1)
 * @param {number} targetTempo - 타겟 템포 (BPM)
 * @returns {number} 유사도 점수 (0~1, 높을수록 유사함)
 */
export function calculateSimilarity(
  audioFeatures,
  targetValence,
  targetEnergy,
  targetTempo,
) {
  const valenceDiff = Math.abs(audioFeatures.valence - targetValence);
  const energyDiff = Math.abs(audioFeatures.energy - targetEnergy);
  const normalizedTrackTempo = (audioFeatures.tempo - 60) / 140;
  const normalizedTargetTempo = (targetTempo - 60) / 140;
  const tempoDiff = Math.abs(normalizedTrackTempo - normalizedTargetTempo);
  const similarity =
    1 - (valenceDiff * 0.4 + energyDiff * 0.4 + tempoDiff * 0.2);
  return Math.max(0, Math.min(1, similarity));
}

/**
 * 트랙 배열 유사도 점수 추가
 *
 * @param {Array} tracks - 트랙 배열
 * @param {Object} audioFeaturesMap - 트랙 ID별 audio features 맵
 * @param {number} targetValence - 타겟 긍정도
 * @param {number} targetEnergy - 타겟 에너지
 * @param {number} targetTempo - 타겟 템포
 * @returns {Array} 유사도가 추가된 트랙 배열
 */
export function addSimilarityScores(
  tracks,
  audioFeaturesMap,
  targetValence,
  targetEnergy,
  targetTempo,
) {
  return tracks.map((track) => {
    const audioFeatures = audioFeaturesMap[track.id];
    const similarity = audioFeatures
      ? calculateSimilarity(
          audioFeatures,
          targetValence,
          targetEnergy,
          targetTempo,
        )
      : 0;

    return {
      track,
      similarity,
      audioFeatures,
    };
  });
}

/**
 * 유사도와 인기도 기반 정렬
 *
 * @param {Array} tracksWithSimilarity - 유사도 포함된 트랙 배열
 * @returns {Array} 정렬된 트랙 배열
 */
export function sortBySimlilarityAndPopularity(tracksWithSimilarity) {
  return tracksWithSimilarity.sort((a, b) => {
    if (Math.abs(a.similarity - b.similarity) > 0.01) {
      return b.similarity - a.similarity;
    }
    return b.track.popularity - a.track.popularity;
  });
}
