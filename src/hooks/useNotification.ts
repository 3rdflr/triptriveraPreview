// hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, deleteNotification } from '@/app/api/notifications';
import { useUserStore } from '@/store/userStore';
import { NotificationItem } from '@/types/notification.type';

// 알림 조회 훅
export const useNotifications = () => {
  const user = useUserStore((state) => state.user);

  return useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    staleTime: 1000 * 60, // 1분
    gcTime: 1000 * 60 * 5, // 5분
    enabled: !!user,
  });
};

// 알림 삭제 훅

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteNotification(id),

    // 낙관적 업데이트
    onMutate: async (deletedId: number) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousData = queryClient.getQueryData<{
        totalCount: number;
        notifications: NotificationItem[];
      }>(['notifications']);

      if (previousData) {
        queryClient.setQueryData(['notifications'], {
          ...previousData,
          notifications: previousData.notifications.filter((n) => n.id !== deletedId),
          totalCount: previousData.totalCount - 1,
        });
      }

      return { previousData };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['notifications'], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
