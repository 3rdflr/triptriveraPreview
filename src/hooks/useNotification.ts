import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, deleteNotification } from '@/app/api/notifications';
import { useUserStore } from '@/store/userStore';
import { NotificationItem } from '@/types/notification.type';

interface NotificationsResponse {
  totalCount: number;
  notifications: NotificationItem[];
}

// 알림 조회 훅
export const useNotifications = () => {
  const user = useUserStore((state) => state.user);

  return useQuery<NotificationsResponse>({
    queryKey: ['notifications', user?.id],
    queryFn: () => getNotifications(99),
    staleTime: 1000 * 60, // 1분
    gcTime: 1000 * 60 * 5, // 5분
    enabled: !!user,
  });
};

// 알림 삭제 훅
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  return useMutation({
    mutationFn: (id: number) => deleteNotification(id),

    onMutate: async (deletedId: number) => {
      if (!user) return;

      const queryKey = ['notifications', user.id];

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<NotificationsResponse>(queryKey);

      if (previousData) {
        queryClient.setQueryData<NotificationsResponse>(queryKey, {
          ...previousData,
          notifications: previousData.notifications.filter((n) => n.id !== deletedId),
          totalCount: previousData.totalCount - 1,
        });
      }

      return { previousData };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousData && user) {
        queryClient.setQueryData(['notifications', user.id], context.previousData);
      }
    },

    onSettled: () => {
      if (user) queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
    },
  });
};
