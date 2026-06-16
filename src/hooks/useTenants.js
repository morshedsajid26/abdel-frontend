import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios';
import toast from 'react-hot-toast';

export const useGetTenants = () => {
  const axiosInstance = useAxios();
  return useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/system-owner/tenants');
      return data.data || [];
    }
  });
};

export const useGetTenant = (id) => {
  const axiosInstance = useAxios();
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/system-owner/tenants/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useAddTenant = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tenantData) => {
      const { data } = await axiosInstance.post('/system-owner/tenants', tenantData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success("Tenant added successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add tenant");
    }
  });
};

export const useUpdateTenant = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...tenantData }) => {
      const { data } = await axiosInstance.put(`/system-owner/tenants/${id}`, tenantData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success("Tenant updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update tenant");
    }
  });
};

export const useDeleteTenant = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/system-owner/tenants/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success("Tenant deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete tenant");
    }
  });
};
