import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Icon } from '@iconify/react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const currentMonthIndex = new Date().getMonth();

const generateMockData = () => {
  const data = {};
  months.forEach((month) => {
    // Random monthly total between 500 and 2800
    const runningTotal = Math.floor(Math.random() * 2300) + 500;
    data[month] = {
      total: runningTotal,
    };
  });
  return data;
};

const mockUsageData = generateMockData();
const USAGE_LIMIT = 2500;
const COLORS = ['#205943', '#e6e4df']; // Used (Green), Remaining (Gray)

const TenantUsageChart = () => {
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);

  const monthData = mockUsageData[selectedMonth];
  const totalUsed = monthData.total;
  const usagePercentage = Math.min((totalUsed / USAGE_LIMIT) * 100, 100);
  const isOverLimit = totalUsed > USAGE_LIMIT;

  const pieData = [
    { name: 'Used', value: totalUsed, color: COLORS[0] },
    { name: 'Remaining', value: Math.max(0, USAGE_LIMIT - totalUsed), color: COLORS[1] }
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
    if (value === 0) return null;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.35;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const textColor = index === 1 ? '#7a8293' : pieData[index].color;

    return (
      <text 
        x={x} 
        y={y} 
        fill={textColor} 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central" 
        fontSize={13} 
        fontWeight={500}
      >
        {`${name}: ${value} min`}
      </text>
    );
  };

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-[#e6e4df] p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-[#0e1217] text-xl font-semibold">Usage Overview</h2>
          <p className="text-[#9fa5ac] text-sm mt-1">Track monthly minute usage</p>
        </div>
        
        <div className="relative">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="appearance-none bg-[#fbfaf6] border border-[#e6e4df] text-[#0e1217] text-sm rounded-xl pl-4 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-[#205943] focus:border-[#205943] font-medium cursor-pointer"
          >
            {months.map(m => (
              <option key={m} value={m}>{m} 2026</option>
            ))}
          </select>
          <Icon icon="lucide:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9fa5ac] pointer-events-none" />
        </div>
      </div>

      <div className="">
       

        {/* Monthly Usage Pie Chart */}
        <div className="h-[320px] w-full flex flex-col items-center justify-center bg-[#fbfaf6] rounded-xl border border-[#e6e4df] p-4">
          <div className="flex-1 w-full min-h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={85}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} min`]}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Custom Legend at Bottom */}
          <div className="flex items-center justify-center gap-6 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm font-medium text-[#9fa5ac]">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantUsageChart;
