import React from 'react'

const CurrentPlan = () => {
  return (
    <div className="relative bg-[#ffffff] border border-[#e6e4df] rounded-2xl p-6 mt-6 mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      {/* Badge */}
      <div className="absolute -top-3.5 left-6 bg-[#ffffff] border border-[#e6e4df] px-4 py-1.5 rounded-full text-xs text-[#9fa5ac] font-medium">
        Current Plan
      </div>

      {/* Left Content */}
      <div className="flex flex-col gap-2 pt-2 sm:pt-0">
        <h2 className="text-[28px] sm:text-[32px] font-bold text-[#0e1217] tracking-tight leading-none mb-1">Pro Plan</h2>
        <p className="text-[15px] text-[#9fa5ac] mb-2">$9.99/month</p>
        <div className="flex items-center gap-3 text-[14px] text-[#9fa5ac] mt-2">
          <span>Start Date : 5/22/2025</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#f6f3eb]0"></span>
          <span>End Date : 5/22/2025</span>
        </div>
      </div>

      {/* Right Button */}
      <div>
        <button className="px-8 py-2.5 rounded-xl border border-[#419977] bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-sm font-medium text-white shadow-[0_0_15px_rgba(65,153,119,0.2)] hover:shadow-[0_0_20px_rgba(65,153,119,0.4)] transition-all whitespace-nowrap">
          Upgrade Plan
        </button>
      </div>
    </div>
  )
}

export default CurrentPlan