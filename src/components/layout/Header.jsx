import { FiMenu } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import Image from "../Image";
import { FaAngleDown, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { IoIosNotificationsOutline } from "react-icons/io";
import useAuth from "../../hooks/useAuth";
import Cookies from "js-cookie";

export default function Header({ onMenuClick }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { logOutUser } = useAuth();
  const role = Cookies.get("role");

  return (
    <header className="bg-[#fbfaf6] flex items-center px-4 md:px-6 py-3.5 relative gap-2 sm:gap-4">
      <button
        onClick={onMenuClick}
        className="2xl:hidden p-2 rounded bg-[#205943] text-white cursor-pointer shrink-0"
      >
        <FiMenu className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
      </button>

      <div className="flex items-center justify-between w-full">

        {/* <div className="  hidden md:block relative ">

          <input
            type="text"
            placeholder="Search..."
            className="px-10 py-2.5 rounded-full border border-[#E2E8F0] outline-none  focus:ring-[#3b6b4f] w-[450px] text-[#64748B] placeholder:text-[#64748B]"
          />

          <FaSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-[#64748B]"/>
        </div> */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <h3 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-[#0e1217] truncate">
            Welcome to foodvoice
          </h3>
        </div>



        <div className="flex items-center ml-auto gap-2 sm:gap-4 shrink-0">
          {/* Notification Button */}
          <button className="flex items-center justify-center w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-[#ffffff] hover:bg-[#ffffff] transition-colors shrink-0">
            <IoIosNotificationsOutline className="w-6 h-6 sm:w-6 sm:h-6 text-[#0e1217]" />
          </button>

          {/* Language Selector */}
          {/* <button className="flex items-center gap-2 px-3 h-10 rounded-full bg-[#ffffff] hover:bg-[#ffffff] transition-colors text-[#0e1217]">
            <Icon icon="circle-flags:uk" className="w-6 h-6 rounded-full" />
            <span className="text-sm font-medium font-montserrat">Eng</span>
            <FaAngleDown className="w-3.5 h-3.5" />
          </button> */}

          {/* Profile Section */}
          <div className="relative ml-1 sm:ml-2 shrink-0">
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              <Image
                src="/logo.png"
                alt="User Avatar"
                className="w-10 h-10 sm:w-10 sm:h-10 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#4ADE80] border-2 border-[#e6e4df] rounded-full"></span>
            </div>

            {/* Dropdown */}
            {openDropdown && (
              <div className="absolute w-48 right-0 mt-3 p-2 bg-[#fbfaf6] rounded-lg shadow-xl border border-[#e6e4df] z-50">
                <Link to={role === "SYSTEM_OWNER" ? "/admin/settings" : "/owner/settings"} onClick={() => setOpenDropdown(false)}>
                  <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-[#0e1217] hover:bg-[#e8ecea] hover:text-[#205943] transition cursor-pointer">
                    <Icon icon="material-symbols:settings" width="20" />
                    <span className="font-montserrat text-sm font-medium">Settings</span>
                  </button>
                </Link>

                <button
                  onClick={() => {
                    logOutUser();
                    setOpenDropdown(false);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-[#d40c1a] hover:bg-[#e8ecea] transition cursor-pointer"
                >
                  <Icon icon="material-symbols:logout" width="20" />
                  <span className="font-montserrat text-sm font-medium">Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
