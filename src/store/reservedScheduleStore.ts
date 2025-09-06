import { ReservedSchedule } from '@/types/myActivity.type';
import { create } from 'zustand';

interface ReservedScheduleState {
  selectedSchedules: {
    pending: string;
    confirmed: string;
    declined: string;
  };
  setSelectedSchedule: (tab: keyof ReservedScheduleState['selectedSchedules'], val: string) => void;
  scheduleLists: {
    pending: ReservedSchedule[];
    confirmed: ReservedSchedule[];
    declined: ReservedSchedule[];
  };
  setScheduleList: (
    tab: keyof ReservedScheduleState['scheduleLists'],
    list: ReservedSchedule[],
  ) => void;
}

export const useScheduleStore = create<ReservedScheduleState>((set) => ({
  selectedSchedules: { pending: '', confirmed: '', declined: '' },
  scheduleLists: { pending: [], confirmed: [], declined: [] },
  setSelectedSchedule: (tab, val) =>
    set((state) => ({ selectedSchedules: { ...state.selectedSchedules, [tab]: val } })),
  setScheduleList: (tab, list) =>
    set((state) => ({ scheduleLists: { ...state.scheduleLists, [tab]: list } })),
}));
