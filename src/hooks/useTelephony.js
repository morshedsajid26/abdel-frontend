import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios';
import toast from 'react-hot-toast';

export const useGetTelephony = () => {
  const axiosInstance = useAxios();
  return useQuery({
    queryKey: ['telephony'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/system-owner/telephony');
      return data.data || [];
    }
  });
};

export const useAddTelephony = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (telephonyData) => {
      const { data } = await axiosInstance.post('/system-owner/telephony', telephonyData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telephony'] });
      toast.success("Telephony number added successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add telephony number");
    }
  });
};

export const useUpdateTelephony = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.patch(`/system-owner/telephony/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telephony'] });
      toast.success("Telephony number updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update telephony number");
    }
  });
};

export const useDeleteTelephony = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/system-owner/telephony/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telephony'] });
      toast.success("Telephony number deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete telephony number");
    }
  });
};
