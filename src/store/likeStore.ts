import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Activity } from '@/types/activities.type';

interface FavoritesState {
  favoritesByUser: Record<number, Activity[]>; // 모든 사용자의 찜 목록을 저장
  currentUserId: number | null; // 현재 로그인한 사용자 ID (세션 상태)
  favorites: Activity[]; // 현재 사용자의 찜 목록 (UI용)

  initializeUser: (userId: number) => void;
  isFavorite: (activityId: number) => boolean;
  removeFavorite: (activityId: number) => void;
  toggleFavorite: (activity: Activity) => void;
  clearFavorites: () => void;
}
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoritesByUser: {},
      currentUserId: null,
      favorites: [],

      initializeUser: (userId) => {
        const { currentUserId, favoritesByUser } = get();
        // 이미 같은 사용자로 초기화된 경우 중복 실행 방지
        if (currentUserId === userId) return;

        // `favoritesByUser`에서 현재 사용자의 찜 목록을 가져와 UI용 상태에 설정
        const userFavorites = favoritesByUser[userId] || [];
        set({
          currentUserId: userId,
          favorites: userFavorites,
        });
      },

      isFavorite: (activityId) => {
        // 현재 사용자의 찜 목록에서 확인
        return get().favorites.some((fav) => fav.id === activityId);
      },

      removeFavorite: (activityId) => {
        const { currentUserId, favorites } = get();
        if (!currentUserId) {
          console.warn('사용자가 로그인되지 않았습니다.');
          return;
        }

        const newFavorites = favorites.filter((fav) => fav.id !== activityId);

        set((state) => ({
          favorites: newFavorites, // UI 상태 업데이트
          favoritesByUser: {
            ...state.favoritesByUser,
            [currentUserId]: newFavorites, // 영속성 상태 업데이트
          },
        }));
      },

      toggleFavorite: (activity) => {
        const { currentUserId, favorites } = get();
        if (!currentUserId) {
          console.warn('사용자가 로그인되지 않았습니다.');
          return;
        }

        const isAlreadyFavorite = get().isFavorite(activity.id);
        const newFavorites = isAlreadyFavorite
          ? favorites.filter((fav) => fav.id !== activity.id)
          : [...favorites, activity];

        set((state) => ({
          favorites: newFavorites, // UI 상태 업데이트
          favoritesByUser: {
            ...state.favoritesByUser,
            [currentUserId]: newFavorites, // 영속성 상태 업데이트
          },
        }));
      },

      clearFavorites: () => {
        // 로그아웃 시 현재 사용자 정보만 초기화
        set({
          currentUserId: null,
          favorites: [],
        });
      },
    }),
    {
      name: 'favorites-storage', // localStorage에 저장될 고유한 키
      storage: createJSONStorage(() => localStorage),
      // `favoritesByUser` 상태만 localStorage에 저장
      partialize: (state) => ({ favoritesByUser: state.favoritesByUser }),
      // 스토리지에서 데이터를 성공적으로 불러왔을 때 실행
      onRehydrateStorage: () => () => {
        console.log('찜 목록을 성공적으로 불러왔습니다.');
      },
    },
  ),
);
