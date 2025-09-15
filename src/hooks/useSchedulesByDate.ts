import { useMemo } from 'react';
import { SchedulesByDate, Schedule, ScheduleTime } from '@/types/activities.type';
import { format } from 'date-fns';
/**
 * Schedule[]을 SchedulesByDate 형태로 변환하는 훅
 * 날짜별로 그룹화하여 O(1) 조회 성능 제공
 *
 * @param baseSchedules 원본 스케줄 배열
 * @returns 날짜를 키로 하는 객체 형태
 */
export function useSchedulesByDate(baseSchedules: Schedule[]): SchedulesByDate {
  return useMemo(() => {
    const schedulesByDate: SchedulesByDate = {};

    baseSchedules.forEach((schedule) => {
      if (!schedulesByDate[schedule.date]) {
        schedulesByDate[schedule.date] = [];
      }
      schedulesByDate[schedule.date].push({
        id: schedule.id,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      });
    });
    return schedulesByDate;
  }, [baseSchedules]);
}

/**
 * SchedulesByDate에서 특정 날짜의 시간 슬롯을 가져오는 유틸리티 함수
 *
 * @param schedulesByDate 날짜별 스케줄 객체
 * @param date 조회할 날짜 (Date 객체 또는 'YYYY-MM-DD' 문자열)
 * @returns 해당 날짜의 ScheduleTime 배열
 */
export function getScheduleSlots(
  schedulesByDate: SchedulesByDate,
  date: Date | string | undefined,
): ScheduleTime[] {
  if (!date) return [];

  const dateKey = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd'); // YYYY-MM-DD 형태로 변환

  return schedulesByDate[dateKey] || [];
}

/**
 * SchedulesByDate를 AvailableSchedule[] 형태로 변환하는 유틸리티 함수
 * 기존 컴포넌트와의 호환성을 위해 제공
 */
export function schedulesByDateToArray(schedulesByDate: SchedulesByDate) {
  return Object.entries(schedulesByDate).map(([date, times]) => ({
    date,
    times,
  }));
}
