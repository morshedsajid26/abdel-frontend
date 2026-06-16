import React from 'react'

const CurrentPlan = () => {
  return (
    <div className="relative bg-[#0E0E10] border border-[#272727] rounded-2xl p-6 mt-6 mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      {/* Badge */}
      <div className="absolute -top-3.5 left-6 bg-[#131313] border border-[#272727] px-4 py-1.5 rounded-full text-xs text-gray-300 font-medium">
        Current Plan
      </div>

      {/* Left Content */}
      <div className="flex flex-col gap-2 pt-2 sm:pt-0">
        <h2 className="text-[28px] sm:text-[32px] font-bold text-white tracking-tight leading-none mb-1">Pro Plan</h2>
        <p className="text-[15px] text-gray-400 mb-2">$9.99/month</p>
        <div className="flex items-center gap-3 text-[14px] text-gray-400 mt-2">
          <span>Start Date : 5/22/2025</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
          <span>End Date : 5/22/2025</span>
        </div>
      </div>

      {/* Right Button */}
      <div>
        <button className="px-8 py-2.5 rounded-xl border border-[#0F42FF] bg-linear-to-t from-[#00135B] via-[#02060F] to-[#00104E] text-sm font-medium text-white shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all whitespace-nowrap">
          Upgrade Plan
        </button>
      </div>
    </div>
  )
}

export default CurrentPlan