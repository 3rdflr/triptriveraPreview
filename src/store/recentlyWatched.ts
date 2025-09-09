import { create } from 'zustand';
import { Activity } from '@/types/activities.type';

interface ViewedActivity extends Activity {
  viewedAt: string; // ISO string
}

interface RecentViewedState {
  recentViewed: ViewedActivity[];
  grouped: Record<string, ViewedActivity[]>;
  addViewed: (activity: Activity) => void;
  removeViewed: (activityId: number) => void;
  clearViewed: () => void;
}

const MAX_ITEMS = 10;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'recent-viewed';

const loadRecent = (): ViewedActivity[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveRecent = (items: ViewedActivity[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('최근 본 목록 저장 실패:', e);
  }
};

const formatDateLabel = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);

  if (date.toDateString() === today.toDateString()) return '오늘';
  if (date.toDateString() === yesterday.toDateString()) return '어제';

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
};

// 최근 본 목록 → 날짜 라벨별 그룹 변환
const groupByLabel = (items: ViewedActivity[]) => {
  const sorted = [...items].sort(
    (a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime(),
  );

  const groups: Record<string, ViewedActivity[]> = {};
  sorted.forEach((item) => {
    const label = formatDateLabel(new Date(item.viewedAt));
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });

  return groups;
};

export const useRecentViewedStore = create<RecentViewedState>((set) => {
  const initial = loadRecent();
  return {
    recentViewed: initial,
    grouped: groupByLabel(initial),

    addViewed: (activity) => {
      const now = new Date();
      const weekAgo = now.getTime() - WEEK_MS;

      set((state) => {
        const filtered = state.recentViewed.filter(
          (a) => a.id !== activity.id && new Date(a.viewedAt).getTime() >= weekAgo,
        );

        let newItems = [{ ...activity, viewedAt: now.toISOString() }, ...filtered];
        if (newItems.length > MAX_ITEMS) {
          newItems = newItems.slice(0, MAX_ITEMS);
        }

        saveRecent(newItems);
        return { recentViewed: newItems, grouped: groupByLabel(newItems) };
      });
    },

    removeViewed: (activityId) =>
      set((state) => {
        const newItems = state.recentViewed.filter((a) => a.id !== activityId);
        saveRecent(newItems);
        return { recentViewed: newItems, grouped: groupByLabel(newItems) };
      }),

    clearViewed: () => {
      saveRecent([]);
      set({ recentViewed: [], grouped: {} });
    },
  };
});
