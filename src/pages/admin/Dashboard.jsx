import React from 'react';
import { Icon } from '@iconify/react';
import PlanDistribution from '../../components/PlanDistribution';
import TenantDistribution from '../../components/TenantDistribution';

let StatCard = ({ title, value, icon, iconBg = "bg-[#edebe5]", trend, trendText }) => {
  const isNegative = trend.startsWith('-');
  
  return (
    <div className="relative overflow-hidden bg-[#ffffff] rounded-2xl p-3 border border-[#e6e4df] flex flex-col h-full ">
      {/* Header */}
      <div className="flex items-center gap-3 relative z-10">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
          <Icon icon={icon} className="text-[#0e1217] w-6 h-6" />
        </div>
        <span className="text-[15px] font-medium text-[#0e1217]">{title}</span>
      </div>

      {/* Value */}
      <div className="mt-5 mb-5 relative z-10">
        <h3 className="text-xl font-bold text-[#0e1217]">{value}</h3>
      </div>

      {/* Trend */}
      <div className="flex items-center justify-between mt-auto text-[11px] text-[#9fa5ac] relative z-10">
        <span className="flex items-center gap-1 font-medium">
          {trend} <Icon icon={isNegative ? "lucide:arrow-down-right" : "lucide:arrow-up-right"} className={`text-[10px] ${isNegative ? 'text-red-500' : 'text-[#0e1217]'}`} />
        </span>
        <span className="font-medium">{trendText}</span>
      </div>

      {/* Background Sparkline */}
      <div className="absolut bottom-0 left-0 w-full h-17 pointer-events-none opacity-80">
        <svg viewBox="0 0 200 50" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b6b4f" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b6b4f" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d="M0,45 C30,45 40,15 65,15 C90,15 100,40 130,40 C155,40 170,20 185,20 C195,20 198,30 200,30 L200,50 L0,50 Z" 
            fill={`url(#gradient-${title.replace(/\s+/g, '-')})`} 
          />
          <path 
            d="M0,45 C30,45 40,15 65,15 C90,15 100,40 130,40 C155,40 170,20 185,20 C195,20 198,30 200,30" 
            fill="none" 
            stroke="#4a8b66" 
            strokeWidth="2" 
          />
        </svg>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const statsData = [
    {
      title: "Total Tenants",
      value: "248",
      icon: "lucide:users",
      iconBg: "bg-transparent",
      trend: "+5.09%",
      trendText: "+1.4 last month"
    },
    {
      title: "Active Subscription",
      value: "186",
      icon: "lucide:phone-call",
      iconBg: "bg-transparent",
      trend: "+5.09%",
      trendText: "+1.4 last month"
    },
    {
      title: "Monthly Revenue",
      value: "$32500",
      icon: "lucide:dollar-sign",
      iconBg: "bg-transparent",
      trend: "+18%",
      trendText: "+1.4 last month"
    },
    {
      title: "Expiring Tenants",
      value: "12",
      icon: "lucide:alert-circle",
      iconBg: "bg-transparent",
      trend: "-75%",
      trendText: "+1.4 last month"
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-12 gap-5">
        {statsData.map((stat, index) => (
          <div key={index} className="col-span-12 md:col-span-6 xl:col-span-3">
            <StatCard {...stat} />
          </div>
        ))}



        <div className='col-span-12 md:col-span-12 lg:col-span-6'>
          <PlanDistribution/>
          
        </div>

        <div className='col-span-12 md:col-span-12 lg:col-span-6'>
          <TenantDistribution/>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;