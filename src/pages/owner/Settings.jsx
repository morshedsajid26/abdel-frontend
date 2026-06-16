import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const Settings = () => {
  const location = useLocation();

  const tabs = [
    { name: "Profile Settings", path: "/owner/settings/profile" },
    { name: "Connect email & number", path: "/owner/settings/connect" },
    { name: "Business Info", path: "/owner/settings/business" },
    { name: "Subscription", path: "/owner/settings/subscription" },
    { name: "Privacy Setting", path: "/owner/settings/privacy" },
  ];

  const isActivePath = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="flex flex-col h-full min-h-[80vh]">
      <div className="w-full border-b border-[#e6e4df] mb-8 bg-[#fbfaf6]">
        <div className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-8 px-2 md:px-0 pt-2">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={`whitespace-nowrap flex items-center pb-3 text-[13px] md:text-sm font-medium transition-all border-b-2 ${
                isActivePath(tab.path)
                  ? "border-[#419977] text-[#205943]"
                  : "border-transparent text-[#9fa5ac] hover:text-[#50565c]"
              }`}
            >
              {tab.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-6 ">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
