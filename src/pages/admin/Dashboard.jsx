import React from 'react';
import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import PlanDistribution from '../../components/PlanDistribution';
import TenantDistribution from '../../components/TenantDistribution';
import Table from '../../components/Table';

let StatCard = ({ title, value, icon, iconBg = "bg-[#edebe5]", trend, trendText, changeType = 'neutral', chartData = [0,0,0,0,0,0], isLoading = false }) => {
  const isNegative = changeType === 'negative';
  
  if (isLoading) {
    return (
      <div className="relative overflow-hidden bg-[#ffffff] rounded-2xl p-5 border border-[#e6e4df] flex flex-col h-full animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f4f4f4] rounded-full"></div>
          <div className="h-4 bg-[#f4f4f4] rounded w-24"></div>
        </div>
        <div className="mt-5 mb-5">
          <div className="h-8 bg-[#f4f4f4] rounded w-16"></div>
        </div>
        <div className="flex justify-between mt-auto">
          <div className="h-3 bg-[#f4f4f4] rounded w-12"></div>
          <div className="h-3 bg-[#f4f4f4] rounded w-20"></div>
        </div>
      </div>
    );
  }

  // Calculate dynamic sparkline
  const max = Math.max(...chartData, 1);
  const min = Math.min(...chartData, 0);
  const range = max - min || 1;
  const points = chartData.map((val, index) => {
    // Space points evenly across 200px width
    const x = (index / Math.max(chartData.length - 1, 1)) * 200;
    // Map Y from 15 (top) to 45 (bottom)
    const y = 45 - ((val - min) / range) * 30; 
    return `${x},${y}`;
  });
  
  const pathD = `M${points.join(' L')}`;
  const fillPath = `${pathD} L200,50 L0,50 Z`;

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
      <div className="absolute bottom-0 left-0 w-full h-17 pointer-events-none opacity-80">
        <svg viewBox="0 0 200 50" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b6b4f" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b6b4f" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d={fillPath} 
            fill={`url(#gradient-${title.replace(/\s+/g, '-')})`} 
          />
          <path 
            d={pathD} 
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
  const axiosInstance = useAxios();

  const { data: usageData, isLoading } = useQuery({
    queryKey: ['tenantUsageMinutes'],
    queryFn: async () => {
      const response = await axiosInstance.get('/system-owner/dashboard/usage-minutes');
      return response.data;
    }
  });

  const { data: overviewRes, isLoading: isOverviewLoading } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: async () => {
      const response = await axiosInstance.get('/system-owner/dashboard');
      return response.data;
    }
  });

  const overviewData = overviewRes?.data || {};

  const formatTrend = (percentage) => {
    if (percentage > 0) return `+${percentage}%`;
    if (percentage < 0) return `${percentage}%`;
    return "0%";
  };

  const statsData = [
    {
      title: "Total Tenants",
      value: overviewData.totalTenants?.count ?? 0,
      icon: "lucide:users",
      iconBg: "bg-transparent",
      trend: formatTrend(overviewData.totalTenants?.percentageChange ?? 0),
      trendText: `${(overviewData.totalTenants?.deltaLastMonth || 0) > 0 ? '+' : ''}${overviewData.totalTenants?.deltaLastMonth ?? 0} last month`,
      changeType: overviewData.totalTenants?.changeType ?? 'neutral',
      chartData: overviewData.totalTenants?.chartData ?? [0,0,0,0,0,0],
      isLoading: isOverviewLoading
    },
    {
      title: "Active Subscription",
      value: overviewData.activeSubscriptions?.count ?? 0,
      icon: "lucide:phone-call",
      iconBg: "bg-transparent",
      trend: formatTrend(overviewData.activeSubscriptions?.percentageChange ?? 0),
      trendText: `${(overviewData.activeSubscriptions?.deltaLastMonth || 0) > 0 ? '+' : ''}${overviewData.activeSubscriptions?.deltaLastMonth ?? 0} last month`,
      changeType: overviewData.activeSubscriptions?.changeType ?? 'neutral',
      chartData: overviewData.activeSubscriptions?.chartData ?? [0,0,0,0,0,0],
      isLoading: isOverviewLoading
    },
    {
      title: "Monthly Revenue",
      value: `$${overviewData.monthlyRevenue?.count ?? 0}`,
      icon: "lucide:dollar-sign",
      iconBg: "bg-transparent",
      trend: formatTrend(overviewData.monthlyRevenue?.percentageChange ?? 0),
      trendText: `${(overviewData.monthlyRevenue?.deltaLastMonth || 0) > 0 ? '+' : ''}${overviewData.monthlyRevenue?.deltaLastMonth ?? 0} last month`,
      changeType: overviewData.monthlyRevenue?.changeType ?? 'neutral',
      chartData: overviewData.monthlyRevenue?.chartData ?? [0,0,0,0,0,0],
      isLoading: isOverviewLoading
    },
    {
      title: "Expiring Tenants",
      value: overviewData.expiringTenants?.count ?? 0,
      icon: "lucide:alert-circle",
      iconBg: "bg-transparent",
      trend: formatTrend(overviewData.expiringTenants?.percentageChange ?? 0),
      trendText: `${(overviewData.expiringTenants?.deltaLastMonth || 0) > 0 ? '+' : ''}${overviewData.expiringTenants?.deltaLastMonth ?? 0} last month`,
      changeType: overviewData.expiringTenants?.changeType ?? 'neutral',
      chartData: overviewData.expiringTenants?.chartData ?? [0,0,0,0,0,0],
      isLoading: isOverviewLoading
    }
  ];

  const TableHeads = [
    { key: "name", Title: "Tenant Name", sortable: true },
    { key: "ownerEmail", Title: "Owner Email", sortable: true },
    { 
      key: "status", 
      Title: "Status", 
      sortable: true,
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${row.status === 'active' ? 'bg-[#e2f5ec] text-[#205943]' : 'bg-red-100 text-red-700'}`}>
          {row.status}
        </span>
      )
    },
    { 
      key: "totalUsageMinutes", 
      Title: "Total Usage", 
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[14px] font-medium text-[#0e1217]">{row.totalUsageMinutes} min</span>
          <span className="text-[12px] text-[#9fa5ac]">{row.totalUsageSeconds} sec</span>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
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

      <div className="bg-[#ffffff] rounded-2xl border border-[#e6e4df] p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#0e1217]">Tenant Usage Statistics</h2>
        </div>
        
        {isLoading ? (
          <div className="py-10 flex justify-center items-center">
            <Icon icon="lucide:loader-2" className="animate-spin text-[#9fa5ac] w-8 h-8" />
          </div>
        ) : (
          <Table 
            TableHeads={TableHeads} 
            TableRows={usageData?.data || []} 
            wrapperClass="rounded-xl border border-[#e6e4df] overflow-hidden"
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;