import React, { useState } from "react";
import Password from "../../components/Password";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Cookies from "js-cookie";

const NewPass = () => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const axiosPublic = useAxiosPublic();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    const resetToken = Cookies.get('resetToken');
    if (!resetToken) {
      toast.error("Reset token is missing or expired. Please verify OTP again.");
      navigate('/auth/forgot/password');
      return;
    }

    setIsPending(true);
    try {
      const response = await axiosPublic.post('/auth/reset-password', 
        { newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${resetToken}` } }
      );
      if (response.data.success || response.status === 200) {
        Cookies.remove('resetToken'); // Clean up token after successful reset
        toast.success(response.data.message || "Password reset successfully!");
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-[32px] text-[#0e1217] font-semibold mb-2">
        Create New Password
      </h1>
      <p className="text-[#9fa5ac] text-[13px] mb-8 text-center">
        Your new password must be different from previously used password
      </p>

      <form onSubmit={handleReset} className="w-full space-y-6">
        <Password
          label="Password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          labelClass="!text-[13px] !text-[#0e1217] !font-medium !ml-1"
          leftIcon={<Icon icon="lucide:lock" width="18" />}
          inputClass="!bg-[#ffffff] !text-[#0e1217] !placeholder-[#9fa5ac] !rounded-full !py-3.5 !border-[#e6e4df] focus:!border-[#205943] !transition-colors !text-sm"
        />
        <Password
          label="Confirm Password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          labelClass="!text-[13px] !text-[#0e1217] !font-medium !ml-1"
          leftIcon={<Icon icon="lucide:lock" width="18" />}
          inputClass="!bg-[#ffffff] !text-[#0e1217] !placeholder-[#9fa5ac] !rounded-full !py-3.5 !border-[#e6e4df] focus:!border-[#205943] !transition-colors !text-sm"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-8 bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-white text-sm font-medium py-3.5 rounded-full border border-[#e6e4df] shadow-[0_0_20px_rgba(59,107,79,0.25)] hover:shadow-[0_0_25px_rgba(59,107,79,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Icon icon="lucide:loader-2" className="animate-spin" width="18" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default NewPass;
