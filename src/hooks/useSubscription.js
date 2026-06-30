import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const useGetSubscriptionPlans = () => {
    const axiosSecure = useAxiosSecure();

    return useQuery({
        queryKey: ['subscription-plans'],
        queryFn: async () => {
            const res = await axiosSecure.get('/business-owner/subscription-plans');
            return res.data;
        }
    });
};

export const useCreateCheckoutSession = () => {
    const axiosSecure = useAxiosSecure();

    return useMutation({
        mutationFn: async (payload) => {
            const res = await axiosSecure.post('/business-owner/payment/create-checkout-session', payload);
            return res.data;
        }
    });
};
