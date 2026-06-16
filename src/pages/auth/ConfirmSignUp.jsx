import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";

const ConfirmSignUp = () => {
  const inputs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [isPending, setIsPending] = useState(false);
  const [isResendPending, setIsResendPending] = useState(false);

  const handleChange = (event, index) => {
    const { value } = event.target;

    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    // Update current index
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move to next field
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    // Handle backspace
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return; // Allow only numeric pastes
    
    const digits = pastedData.slice(0, 6).split("");
    const newOtp = [...otp];
    
    for (let i = 0; i < 6; i++) {
      if (digits[i] !== undefined) {
        newOtp[i] = digits[i];
      }
    }
    setOtp(newOtp);

    // Focus the appropriate input
    const focusIndex = Math.min(digits.length - 1, 5);
    inputs.current[focusIndex]?.focus();
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast.error("Please enter the full 6-digit OTP");
      return;
    }
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      toast.success('Account verified successfully!');
      navigate('/auth/login');
    }, 1000);
  };

  const handleResend = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email not found. Please try signing up again.");
      return;
    }
    setIsResendPending(true);
    setTimeout(() => {
      setIsResendPending(false);
      toast.success('Verification code resent successfully!');
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-[32px] text-[#0e1217] font-semibold mb-2">
        Confirm Your Account
      </h1>
      <p className="text-[#9fa5ac] text-[13px] mb-8 text-center">
        We’ve sent a verification code to <span className="text-[#205943] font-medium">{email || 'your email'}</span>. Enter the code below to confirm your account and get started.
      </p>

      <form onSubmit={handleConfirm} className="w-full flex flex-col items-center">
        <div className="flex gap-4 justify-center mb-10">
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              ref={(el) => (inputs.current[i] = el)}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              value={otp[i]}
              className="w-[47px] h-[49px] bg-[#ffffff] rounded-2xl text-center text-xl font-bold text-[#0e1217] outline-none border border-[#e6e4df] focus:border-[#205943]"
            />
          ))}
        </div>

        <button 
          type="submit"
          disabled={isPending}
          className="w-full mt-2 bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-white text-sm font-medium py-3.5 rounded-full border border-[#e6e4df] shadow-[0_0_20px_rgba(59,107,79,0.25)] hover:shadow-[0_0_25px_rgba(59,107,79,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Icon icon="lucide:loader-2" className="animate-spin" width="18" />
              Confirming...
            </>
          ) : (
            'Confirm'
          )}
        </button>
      </form>
      
      <div className="mt-4 text-[12px] text-[#9fa5ac]">
        Did not receive code?{" "}
        <button 
          onClick={handleResend} 
          disabled={isResendPending}
          className="text-[#205943] hover:text-green-400 font-medium cursor-pointer bg-transparent border-none outline-none disabled:opacity-50 disabled:cursor-not-allowed ml-1"
        >
          {isResendPending ? 'Resending...' : 'Resend Code'}
        </button>
      </div>
    </div>
  );
};

export default ConfirmSignUp;
