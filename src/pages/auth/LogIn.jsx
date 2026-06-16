import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/Inputfield";
import Password from "../../components/Password";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import Cookies from "js-cookie";

export default function LogIn() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isPending, setIsPending] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      const user = { role: 'OWNER', name: 'Mock User' };
      Cookies.set('Access-Token', 'mock-token', { expires: 7 });
      Cookies.set('role', 'owner', { expires: 7 });
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      toast.success('Login successful!');
      navigate('/owner/dashboard');
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center ">
      
      
      

      <h1 className="text-[32px] text-white font-semibold mb-2">Welcome back!</h1>
      <p className="text-gray-400 text-[13px] mb-8">Sign in to access your resumes and tools</p>

      <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
        {/* Email Input */}
        <InputField
          label="Email"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          labelClass="!text-[13px] !text-gray-300 !font-medium !ml-1"
          leftIcon={<Icon icon="lucide:mail" width="18" />}
          inputClass="!bg-[#111424] !text-white !placeholder-gray-600 !rounded-full !py-3.5 !border-transparent focus:!border-[#2563EB]/50 !transition-colors !text-sm"
        />

        {/* Password Input */}
        <Password
          label="Password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          labelClass="!text-[13px] !text-gray-300 !font-medium !ml-1"
          leftIcon={<Icon icon="lucide:lock" width="18" />}
          inputClass="!bg-[#111424] !text-white !placeholder-gray-600 !rounded-full !py-3.5 !border-transparent focus:!border-[#2563EB]/50 !transition-colors !text-sm"
        />

        {/* Remember & Forgot Password */}
        <div className="flex items-center justify-between mt-1 px-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-3.5 h-3.5 accent-[#2563EB] bg-[#111424] border-gray-700 rounded cursor-pointer" 
            />
            <span className="text-[12px] text-gray-400">Remember Me</span>
          </label>
          <Link to="/auth/forgot/password" className="text-[12px] text-white hover:text-[#2563EB] transition-colors">
            Forgot Password?
          </Link>
        </div>


        <button 
          type="submit"
          disabled={isPending}
          className="w-full mt-4 bg-linear-to-t from-[#00135B] via-[#02060F] to-[#00104E] text-white text-sm font-medium py-3.5 rounded-full border border-[#1D4ED8] shadow-[0_0_20px_rgba(29,78,216,0.25)] hover:shadow-[0_0_25px_rgba(29,78,216,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
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
        <span className="text-[11px] text-gray-400 uppercase tracking-wider">Or Continue with</span>
        <div className="flex-1 h-[1px] bg-gray-800"></div>
      </div> */}

      {/* Google Button */}
      {/* <button className="w-28 h-11 bg-[#131622] rounded-full flex items-center justify-center hover:bg-[#1A1E2E] transition-colors border border-gray-800/50">
        <Icon icon="logos:google-icon" width="18" />
      </button> */}

      {/* Sign Up Link */}
      <div className="mt-8 text-[12px] text-gray-400">
        Don't have an account? <Link to="/auth/signup" className="text-[#2563EB] hover:text-blue-400">Sign Up</Link>
      </div>
    </div>
  );
}