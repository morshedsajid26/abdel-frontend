import { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import useAuth from "../hooks/useAuth";
import Cookies from "js-cookie";

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const role = Cookies.get("role");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#9fa5ac]">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Role-based protection: prevent owner from accessing admin routes and vice-versa
  if (location.pathname.startsWith('/admin') && role !== 'admin') {
    return <Navigate to="/owner/dashboard" replace />;
  }
  if (location.pathname.startsWith('/owner') && role !== 'owner' && role !== 'admin') { // if admin has access to owner? No, let's keep it strict or allow. Admin is admin.
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-[#f6f3eb] text-[#0e1217]">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">

        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />


        <main className="flex-1 overflow-y-auto hide-scrollbar bg-[#fbfaf6] text-[#0e1217] relative p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}