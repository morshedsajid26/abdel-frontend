import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import InputField from "../../components/Inputfield";
import Password from "../../components/Password";
import toast from "react-hot-toast";
import { useLoginMutation } from "../../hooks/useLoginMutation";

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useLoginMutation();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    
    mutation.mutate({ email, password });
  };

  return (
    <div className="flex flex-col items-center ">
      
      
      

      <h1 className="text-[32px] text-[#0e1217] font-semibold mb-2">Welcome back!</h1>
      <p className="text-[#9fa5ac] text-[13px] mb-8">Sign in to access your resumes and tools</p>

      <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
        {/* Email Input */}
        <InputField
          label="Email"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          labelClass="!text-[13px] !text-[#0e1217] !font-medium !ml-1"
          leftIcon={<Icon icon="lucide:mail" width="18" />}
          inputClass="!bg-[#ffffff] !text-[#0e1217] !placeholder-[#9fa5ac] !rounded-full !py-3.5 !border-[#e6e4df] focus:!border-[#205943] !transition-colors !text-sm"
        />

        {/* Password Input */}
        <Password
          label="Password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          labelClass="!text-[13px] !text-[#0e1217] !font-medium !ml-1"
          leftIcon={<Icon icon="lucide:lock" width="18" />}
          inputClass="!bg-[#ffffff] !text-[#0e1217] !placeholder-[#9fa5ac] !rounded-full !py-3.5 !border-[#e6e4df] focus:!border-[#205943] !transition-colors !text-sm"
        />

        {/* Remember & Forgot Password */}
        <div className="flex items-center justify-between mt-1 px-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-3.5 h-3.5 accent-[#3b6b4f] bg-[#ffffff] border border-[#e6e4df] border-[#e6e4df] rounded cursor-pointer" 
            />
            <span className="text-[12px] text-[#9fa5ac]">Remember Me</span>
          </label>
          <Link to="/auth/forgot/password" className="text-[12px] text-[#0e1217] hover:text-[#205943] transition-colors">
            Forgot Password?
          </Link>
        </div>


        <button 
          type="submit"
          disabled={mutation.isPending}
          className="w-full mt-4 bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-white text-sm font-medium py-3.5 rounded-full border border-[#e6e4df] shadow-[0_0_20px_rgba(59,107,79,0.25)] hover:shadow-[0_0_25px_rgba(59,107,79,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? (
            <>
              <Icon icon="lucide:loader-2" className="animate-spin" width="18" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      {/* Or Continue with */}
      {/* <div className="flex items-center w-full gap-4 mt-8 mb-6">
        <div className="flex-1 h-[1px] bg-gray-800"></div>
        <span className="text-[11px] text-[#9fa5ac] uppercase tracking-wider">Or Continue with</span>
        <div className="flex-1 h-[1px] bg-gray-800"></div>
      </div> */}

      {/* Google Button */}
      {/* <button className="w-28 h-11 bg-[#fbfaf6] rounded-full flex items-center justify-center hover:bg-[#ffffff] transition-colors border border-[#e6e4df]">
        <Icon icon="logos:google-icon" width="18" />
      </button> */}

      {/* Sign Up Link */}
      {/* <div className="mt-8 text-[12px] text-[#9fa5ac]">
        Don't have an account? <Link to="/auth/signup" className="text-[#205943] hover:text-green-400">Sign Up</Link>
      </div> */}
    </div>
  );
}