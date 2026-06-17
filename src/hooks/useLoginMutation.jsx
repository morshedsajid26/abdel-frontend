import { useMutation } from "@tanstack/react-query";
import useAxios from "./useAxios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "./useAuth";

export const useLoginMutation = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await axiosInstance.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      const { user, accessToken } = data.data;

      Cookies.set("Access-Token", accessToken, { expires: 7, path: '/' });

      Cookies.set("role", user.role, { expires: 7, path: '/' });

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      toast.success(data.message || "Login successful!");

      if (user.role === "SYSTEM_OWNER") {
        navigate("/admin/dashboard");
      } else {
        navigate("/owner/dashboard");
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    },
  });
};
