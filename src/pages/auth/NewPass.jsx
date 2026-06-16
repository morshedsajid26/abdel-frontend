import React, { useState } from "react";
import Password from "../../components/Password";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const NewPass = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      toast.success("Password reset successfully!");
      navigate("/auth/success");
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-[32px] text-white font-semibold mb-2">
        Create New Password
      </h1>
      <p className="text-gray-400 text-[13px] mb-8 text-center">
        Your new password must be different from previously used password
      </p>

      <form onSubmit={handleReset} className="w-full space-y-6">
        <Password
          label="Password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          labelClass="!text-[13px] !text-gray-300 !font-medium !ml-1"
          leftIcon={<Icon icon="lucide:lock" width="18" />}
          inputClass="!bg-[#111424] !text-white !placeholder-gray-600 !rounded-full !py-3.5 !border-transparent focus:!border-[#2563EB]/50 !transition-colors !text-sm"
        />
        <Password
          label="Confirm Password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          labelClass="!text-[13px] !text-gray-300 !font-medium !ml-1"
          leftIcon={<Icon icon="lucide:lock" width="18" />}
          inputClass="!bg-[#111424] !text-white !placeholder-gray-600 !rounded-full !py-3.5 !border-transparent focus:!border-[#2563EB]/50 !transition-colors !text-sm"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-8 bg-linear-to-t from-[#00135B] via-[#02060F] to-[#00104E] text-white text-sm font-medium py-3.5 rounded-full border border-[#1D4ED8] shadow-[0_0_20px_rgba(29,78,216,0.25)] hover:shadow-[0_0_25px_rgba(29,78,216,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
