import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Image from "../Image";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  

  const isActivePath = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  

  
  const role = Cookies.get("role") || "owner"; 

  const ownerNavLinks = [
    { name: "Dashboard", path: "/owner/dashboard", icon: "lucide:layout-dashboard" },
    { name: "AI Training", path: "/owner/ai-training", icon: "lucide:bot" },
    { name: "Test Call Window", path: "/owner/test-voice", icon: "lucide:phone-call" },
    { name: "Call Summary", path: "/owner/call-summary", icon: "lucide:file-text" },
    { name: "Order list", path: "/owner/order-list", icon: "lucide:list-checks" },
    { name: "Item Management", path: "/owner/item-management", icon: "lucide:monitor-cog" },
    { name: "Settings", path: "/owner/settings", icon: "lucide:settings" },
  ];

  const adminNavLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "lucide:layout-grid" },
    { name: "Tenants", path: "/admin/tenant-management", icon: "lucide:users" },
    { name: "Telephony", path: "/admin/telephony-integration", icon: "lucide:phone" },
    { name: "Subscriptions & Billing", path: "/admin/subscriptions-billing", icon: "lucide:credit-card" },
    { name: "API Keys", path: "/admin/api-keys", icon: "lucide:key" },
    { name: "Settings", path: "/admin/settings", icon: "lucide:settings" },
  ];

  const navLinks = role === "admin" ? adminNavLinks : ownerNavLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 2xl:hidden"
          onClick={onClose}
        />
      )}
      

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#ffffff] text-[#0e1217]
        border-r border-[#e6e4df]
        transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        2xl:static 2xl:translate-x-0`}
      >
        {/* Mobile Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 rounded-md bg-[#205943] text-white 2xl:hidden cursor-pointer"
        >
          <FiX size={20} />
        </button>

        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="px-6 py-6 flex items-center gap-2 text-[#0e1217]">
            <Icon icon="lucide:audio-lines" className="text-2xl text-[#205943]" />
            <span className="text-xl font-bold tracking-wider">FOODVOICE</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1536 && onClose()}
                className={`flex  items-center gap-4 px-2 py-3.5 rounded-xl transition-all border border-l-[4px]
                  ${
                    isActivePath(item.path)
                      ? "border-[#205943]/30 border-l-[#419977] bg-[#e8ecea] text-[#0e1217]"
                      : "border-transparent border-l-transparent text-[#50565c] hover:bg-[#e8ecea] hover:text-[#0e1217]"
                  }`}
              >
                <Icon icon={item.icon} width="24" className="text-current" />
                <span className="text-sm ">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          {/* <div className="p-4 ">
            <button
              // onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-[#E7000B] hover:bg-[#F6A62D] hover:text-[#0e1217] transition cursor-pointer"
            >
              <Icon icon="material-symbols:logout" width="20" />
              Log Out
            </button>
          </div> */}
        </div>
      </aside>
    </>
  );
}
