import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Dropdown from './Dropdown';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#ffffff] shadow-sm border border-[#e6e4df] border border-[#e6e4df] p-3 rounded-lg shadow-xl">
        <p className="text-[#9fa5ac] text-xs mb-1">{label}</p>
        <p className="text-[#0e1217] font-semibold text-sm">
          {payload[0].value} Min
        </p>
      </div>
    );
  }
  return null;
};

const CallDuration = ({ data: apiData }) => {
  const [timeRange, setTimeRange] = useState('Last 15 days');

  const defaultData = [
    { name: '1 Feb', value: 34 },
    { name: '2 Feb', value: 54 },
    { name: '3 Feb', value: 35 },
    { name: '4 Feb', value: 43 },
    { name: '5 Feb', value: 52 },
    { name: '6 Feb', value: 87 },
    { name: '7 Feb', value: 41 },
    { name: '8 Feb', value: 63 },
    { name: '9 Feb', value: 41 },
    { name: '10 Feb', value: 51 },
    { name: '11 Feb', value: 52 },
    { name: '12 Feb', value: 52 },
    { name: '13 Feb', value: 77 },
  ];

  const chartData = apiData && apiData.length > 0
    ? apiData.map(item => ({
        name: item.date,
        value: item.duration
      }))
    : defaultData;

  return (
    <div className="w-full bg-[#ffffff] rounded-2xl px-6 py-10 border border-[#e6e4df]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-medium text-[#0e1217]">Total Call Duration</h2>
          <div className="flex items-center gap-2">
            <span className="text-[#9fa5ac] text-sm">8.06%</span>
            <div className="w-6 h-6 rounded-full bg-[#ffffff] flex items-center justify-center shadow-sm">
              <Icon icon="lucide:trending-up" className="text-black text-xs" />
            </div>
          </div>
        </div>
        
        <div className="w-44">
          <Dropdown
            options={["Last 7 days", "Last 15 days", "Last 30 days"]}
            value={timeRange}
            onSelect={(val) => setTimeRange(val)}
            inputClass="!bg-transparent !border-[#e6e4df] !text-[#9fa5ac] !py-2 !pl-4 !pr-10 !rounded-full !text-sm  !transition-colors !text-center"
            optionClass="!bg-[#ffffff] !hover:bg-[#15248380] !border-[#e6e4df] !text-[#9fa5ac]"
            icon="!text-gray-400 !right-2"
          />
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b6b4f" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b6b4f" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              horizontal={false} 
              vertical={false} 
              stroke="#e5e7eb" 
            
            />
            
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dx={-10}
              domain={[0, 'auto']}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#262626', strokeWidth: 1 }} />
            
            <Area
              type="linear"
              dataKey="value"
              stroke="#3b6b4f"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={{ r: 7, fill: '#0F2EC5', strokeWidth: 0 }}
              activeDot={{ r: 7, fill: '#0F2EC580', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CallDuration;