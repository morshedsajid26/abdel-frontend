import { Outlet } from "react-router-dom";
import Password from "../components/Password";
import InputField from "../components/Inputfield";
import Image from "../components/Image";
import { Icon } from "@iconify/react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f3eb] p-4">
      <div className="w-[580px] bg-[#ffffff] border border-[#e6e4df] rounded-[32px] px-20 py-12 flex flex-col items-center border border-[#e6e4df]/40 shadow-2xl font-montserrat">
      
      {/* Logo */}
        <div className="relative z-10 flex items-center gap-2 text-[#0e1217] mb-6">
          <Icon icon="lucide:audio-lines" className="text-2xl text-[#205943]" />
          <span className="text-xl font-bold tracking-wider">FOODVOICE</span>
        </div>

     

     <div className="w-full">
      <Outlet/>
     </div>
    </div>
    </div>
  );
}
