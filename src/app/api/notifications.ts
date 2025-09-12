import axiosInstance from './axiosInstance';

export const getNotifications = async (size = 99) => {
  const response = await axiosInstance.get('/my-notifications', {
    params: { size },
  });
  return response.data;
};

export const deleteNotification = async (id: number) => {
  const response = await axiosInstance.delete(`/my-notifications/${id}`);
  return response.data;
};
