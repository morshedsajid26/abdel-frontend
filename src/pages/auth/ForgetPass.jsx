import React, { useState } from 'react'
import InputField from '../../components/Inputfield'
import { Icon } from '@iconify/react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const ForgetPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleForgotPass = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      toast.success('OTP code sent successfully!');
      navigate('/auth/verify/otp', { state: { email } });
    }, 1000);
  };

  return (
    <div className='flex flex-col items-center w-full'>
      <h1 className="text-[32px] text-white font-semibold mb-2">Forgot Password?</h1>
      <p className="text-gray-400 text-[13px] mb-8 text-center">
        Enter your email address, and we'll send you a link to reset your password.
      </p>
      
      <form onSubmit={handleForgotPass} className="w-full flex flex-col gap-5">
        <InputField
          label="Your Registered Email"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          labelClass="!text-[13px] !text-gray-300 !font-medium !ml-1"
          leftIcon={<Icon icon="lucide:mail" width="18" />}
          inputClass="!bg-[#111424] !text-white !placeholder-gray-600 !rounded-full !py-3.5 !border-transparent focus:!border-[#2563EB]/50 !transition-colors !text-sm"
        />
        
        <button 
          type="submit"
          disabled={isPending}
          className="w-full mt-4 bg-linear-to-t from-[#00135B] via-[#02060F] to-[#00104E] text-white text-sm font-medium py-3.5 rounded-full border border-[#1D4ED8] shadow-[0_0_20px_rgba(29,78,216,0.25)] hover:shadow-[0_0_25px_rgba(29,78,216,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Icon icon="lucide:loader-2" className="animate-spin" width="18" />
              Sending...
            </>
          ) : (
            'Send OTP Code'
          )}
        </button>
      </form>
    </div>
  )
}

export default ForgetPass