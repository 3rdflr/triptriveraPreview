import { ReservationListStatus, ReservedSchedule } from '@/types/myReservation.type';
import { create } from 'zustand';

interface ReservedScheduleState {
  status: ReservationListStatus;
  setStatus: (status: ReservationListStatus) => void;

  activeScheduleId: {
    pending: string;
    confirmed: string;
    declined: string;
  };

  setActiveSchedule: (tab: ReservationListStatus, val: string) => void;

  scheduleLists: Record<ReservationListStatus, ReservedSchedule[]>;
  setScheduleList: (tab: ReservationListStatus, list: ReservedSchedule[]) => void;
}

export const useScheduleStore = create<ReservedScheduleState>((set) => ({
  status: 'pending',
  setStatus: (status) => set({ status }),
  activeScheduleId: { pending: '', confirmed: '', declined: '' },
  scheduleLists: { pending: [], confirmed: [], declined: [] },
  setActiveSchedule: (tab, val) =>
    set((state) => ({ activeScheduleId: { ...state.activeScheduleId, [tab]: val } })),
  setScheduleList: (tab, list) =>
    set((state) => ({ scheduleLists: { ...state.scheduleLists, [tab]: list } })),
}));
