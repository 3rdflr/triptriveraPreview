import { AvailableSchedule } from '@/types/activities.type';

/**
 * 예약 가능한 스케줄 목업 데이터
 */
export const mockAvailableSchedules: AvailableSchedule[] = [
  {
    date: new Date().toISOString().split('T')[0], // 오늘
    times: [
      { id: 1, startTime: '10:00', endTime: '12:00' },
      { id: 2, startTime: '14:00', endTime: '16:00' },
      { id: 3, startTime: '18:00', endTime: '20:00' },
    ],
  },
  {
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 내일
    times: [
      { id: 4, startTime: '09:00', endTime: '11:00' },
      { id: 5, startTime: '15:00', endTime: '17:00' },
      { id: 6, startTime: '19:00', endTime: '21:00' },
    ],
  },
  {
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 모레
    times: [
      { id: 7, startTime: '11:00', endTime: '13:00' },
      { id: 8, startTime: '16:00', endTime: '18:00' },
    ],
  },
  {
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 글피
    times: [
      { id: 9, startTime: '08:00', endTime: '10:00' },
      { id: 10, startTime: '13:00', endTime: '15:00' },
      { id: 11, startTime: '17:00', endTime: '19:00' },
    ],
  },
  {
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4일후
    times: [
      { id: 12, startTime: '10:00', endTime: '12:00' },
      { id: 13, startTime: '15:00', endTime: '17:00' },
    ],
  },
];

/**
 * 목업 스케줄 데이터 가져오기 함수
 * 실제 API 호출을 시뮬레이션
 */
export const getMockSchedules = async (
  activityId: number,
  params: { year: string; month: string },
): Promise<AvailableSchedule[]> => {
  // API 호출 시뮬레이션을 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 300));

  console.log('🎭 [Mock] 스케줄 데이터 조회:', { activityId, ...params });

  return mockAvailableSchedules;
};
