import { createBrowserRouter, Navigate } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import AuthLayout from "../layout/AuthLayout";

// admin
import AdminDashboard from "../pages/admin/Dashboard";
import Settings from "../pages/admin/Settings";
import ApiKeys from "../pages/admin/ApiKeys";
import TenantManagement from "../pages/admin/TenantManagement";
import ViewTenant from "../pages/admin/ViewTenant";


// owner
import OwnerDashboard from "../pages/owner/Dashboard";
import AgentManagement from "../pages/owner/AgentManagement";
import CallSummary from "../pages/owner/CallSummary";
import OrderList from "../pages/owner/OrderList";
import ItemManagement from "../pages/owner/ItemManagement";
import OwnerSettings from "../pages/owner/Settings";
import ProfileSettings from "../pages/owner/settings/ProfileSettings";
import ConnectEmail from "../pages/owner/settings/ConnectEmail";
import BusinessInfo from "../pages/owner/settings/BusinessInfo";
import OwnerSubscription from "../pages/owner/settings/Subscription";
import PrivacySetting from "../pages/owner/settings/PrivacySetting";


// auth
import LogIn from "../pages/auth/LogIn";
import SignUp from "../pages/auth/SignUp";
import ConfirmSignUp from "../pages/auth/ConfirmSignUp";
import ForgetPass from "../pages/auth/ForgetPass";
import OTP from "../pages/auth/OTP";
import NewPass from "../pages/auth/NewPass";
import Success from "../pages/auth/Success";
import Subscription from "@/pages/admin/Subscription";
import TestCallWindow from "@/pages/owner/TestCallWindow";
import Telephony from "@/pages/admin/Telephony";

const router = createBrowserRouter([
  //  AUTH ROUTES
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LogIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "signup/confirm", element: <ConfirmSignUp /> },
      { path: "forgot/password", element: <ForgetPass /> },
      { path: "verify/otp", element: <OTP /> },
      { path: "new/password", element: <NewPass /> },
      { path: "success", element: <Success /> },
    ],
  },

  // ADMIN DASHBOARD ROUTES
   {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/tenant-management", element: <TenantManagement /> },
      { path: "/admin/tenant-management/view/:id", element: <ViewTenant /> },
      { path: "/admin/subscriptions-billing", element: <Subscription /> },
      { path: "/admin/api-keys", element: <ApiKeys /> },
      { path: "/admin/settings", element: <Settings /> },
      { path: "/admin/telephony-integration", element: <Telephony /> },
    ],
  },
  
  // Business OWNER DASHBOARD ROUTES
  {
    path: "/owner",
    element: <DashboardLayout />,
    children: [
       // owner
      { path: "/owner/dashboard", element: <OwnerDashboard /> },
      { path: "/owner/agent-management", element: <AgentManagement /> },
      { path: "/owner/call-summary", element: <CallSummary /> },
      { path: "/owner/order-list", element: <OrderList /> },
      { path: "/owner/item-management", element: <ItemManagement /> },
      { path: "/owner/test-voice", element: <TestCallWindow /> },
      { 
        path: "/owner/settings", 
        element: <OwnerSettings />,
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          { path: "profile", element: <ProfileSettings /> },
          { path: "connect", element: <ConnectEmail /> },
          { path: "business", element: <BusinessInfo /> },
          { path: "subscription", element: <OwnerSubscription /> },
          { path: "privacy", element: <PrivacySetting /> }
        
        ]
      },
    ],
  },


   // Redirect root to auth login
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },

]);

export default router;