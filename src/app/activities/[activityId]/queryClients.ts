/**
 * 클라이언트에서 실시간 데이터 쿼리 키 생성
 */
export const activityQueryKeys = {
  // 기본 정보 (캐시됨)
  detail: (activityId: number) => ['activity-detail', activityId] as const,

  // 실시간 가격 (캐시 안됨)
  price: (activityId: number) => ['activity-price', activityId] as const,

  // 실시간 스케줄 (짧은 캐시)
  schedule: (activityId: number) => ['activity-schedule', activityId] as const,

  // 실시간 통계
  stats: (activityId: number) => ['activity-stats', activityId] as const,
} as const;
