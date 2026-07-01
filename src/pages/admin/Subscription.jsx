import React, { useState } from 'react'
import { DollarSign, TrendingUp, CreditCard, Download, Sparkles, Check, X, Loader2 } from 'lucide-react'
import Table from '../../components/Table'
import ToggleButton from '../../components/ToogleButton'
import { useGetAdminSubscriptionPlans } from '../../hooks/useSubscription'

const PlanCard = ({ plan, isAnnual }) => (
  <div className={`bg-[#ffffff] border ${plan.isPopular ? 'border-blue-600/30 shadow-[0_0_20px_rgba(37,99,235,0.05)]' : 'border-[#e6e4df]'} p-6 rounded-[28px] flex flex-col gap-6 hover:border-[#e6e4df] transition-all group`}>
    <div className="flex flex-col gap-5">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium w-fit transition-colors ${plan.isPopular ? 'bg-blue-600/10 text-green-400 border border-blue-600/40' : 'bg-[#f6f3eb] text-[#9fa5ac] border border-[#e6e4df]'}`}>
        {plan.name}
        {plan.isPopular && <Sparkles className="w-3.5 h-3.5 text-green-400" />}
      </div>
      
      <div className="flex items-baseline gap-1.5">
        <span className="text-[#0e1217] text-[32px] font-bold tracking-tight">${isAnnual ? plan.yearlyPrice : plan.monthlyPrice}</span>
        <span className="text-[#9fa5ac] text-sm font-medium">/{isAnnual ? 'year' : 'month'}</span>
      </div>
      
      <p className="text-[#9fa5ac] text-[13px] leading-relaxed min-h-[40px]">
        {plan.description || "AI Smarter Support"}
      </p>
    </div>

    <div className="flex flex-col gap-4 mt-2">
      {plan.features?.map((feature, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <Check className="w-4 h-4 text-blue-500/80" />
          <span className="text-[13px] text-[#9fa5ac]">
            {feature}
          </span>
        </div>
      ))}
      
      {plan.callLimit > 0 ? (
        <div className="flex items-center gap-3">
          <Check className="w-4 h-4 text-blue-500/80" />
          <span className="text-[13px] text-[#9fa5ac]">
            {plan.callLimit} min call time
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Check className="w-4 h-4 text-blue-500/80" />
          <span className="text-[13px] text-[#9fa5ac]">
            Unlimited Calls
          </span>
        </div>
      )}
      
      {plan.orderLimit > 0 ? (
        <div className="flex items-center gap-3">
          <Check className="w-4 h-4 text-blue-500/80" />
          <span className="text-[13px] text-[#9fa5ac]">
            {plan.orderLimit} order limit
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Check className="w-4 h-4 text-blue-500/80" />
          <span className="text-[13px] text-[#9fa5ac]">
            Unlimited Orders
          </span>
        </div>
      )}
    </div>
  </div>
)

const Subscription = () => {
  const [isAnnual, setIsAnnual] = useState(false)
  const { data, isLoading, isError } = useGetAdminSubscriptionPlans();
  
  const plans = data?.data || [];

  const stats = [
    {
      title: "Total Revenue",
      value: "$32,310",
      label: "All time",
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      title: "This Month",
      value: "$8,540",
      label: (
        <div className="flex items-center gap-3">
          <span className="text-[#0e1217] text-[11px] font-medium">+5.09% ↗</span>
          <span className="text-[#9fa5ac] text-[11px]">+1.4 last month</span>
        </div>
      ),
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Active Plan",
      value: "2",
      label: "Available plans",
      labelColor: "text-green-500",
      icon: <CreditCard className="w-6 h-6" />,
    }
  ]

  const tableHeads = [
    { key: 'invoiceNo', Title: 'Invoice No.' },
    { key: 'companyName', Title: 'Company Name' },
    { key: 'plan', Title: 'Plan' },
    { key: 'amount', Title: 'Amount' },
    { key: 'expiryDate', Title: 'Expiry Date' },
    { 
      key: 'status', 
      Title: 'Status',
      render: (row) => (
        <span className="px-4 py-1.5 rounded-lg bg-blue-600 text-[#0e1217] text-[13px] font-medium">
          {row.status}
        </span>
      )
    },
    { key: 'billingCycle', Title: 'Billing Cycle' },
    { 
      key: 'action', 
      Title: 'Action',
      render: () => (
        <button className="text-[#9fa5ac] hover:text-[#0e1217] transition-colors">
          <Download className="w-5 h-5" />
        </button>
      )
    }
  ]

  const tableRows = [
    {
      invoiceNo: 'INV-001245',
      companyName: 'Tech Crop',
      plan: 'Classic',
      amount: '$599',
      expiryDate: '2026-03-01',
      status: 'Paid',
      billingCycle: 'Monthly'
    },
    {
      invoiceNo: 'INV-001246',
      companyName: 'Global Tech',
      plan: 'Premium',
      amount: '$999',
      expiryDate: '2026-04-15',
      status: 'Paid',
      billingCycle: 'Yearly'
    },
    {
      invoiceNo: 'INV-001247',
      companyName: 'Soft Solution',
      plan: 'Basic',
      amount: '$299',
      expiryDate: '2026-02-28',
      status: 'Paid',
      billingCycle: 'Monthly'
    }
  ]

  return (
    <div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className='bg-[#ffffff] border border-[#e6e4df] p-7 rounded-[32px] flex flex-col gap-6'
          >
            <div className="flex items-center gap-3 text-[#0e1217]">
               <div className="opacity-80">
                {stat.icon}
               </div>
               <h3 className="text-sm font-medium tracking-wide">{stat.title}</h3>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[#0e1217] text-[28px] font-semibold leading-none">{stat.value}</span>
              <div className="mt-2">
                {typeof stat.label === 'string' ? (
                  <span className={`text-[11px] font-medium ${stat.labelColor || 'text-[#9fa5ac]'}`}>{stat.label}</span>
                ) : stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan */}
      <div className="my-15">
        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-end mb-8 gap-6 sm:gap-0">
          
          <div className=" p-1.5 self-center sm:self-auto">
            <ToggleButton isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-[#9fa5ac]">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Loading plans...</p>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center p-12 text-red-500">
            Failed to load subscription plans.
          </div>
        ) : plans.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-[#9fa5ac]">
            No plans available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {plans.map((plan, index) => (
              <PlanCard key={plan.id || index} plan={plan} isAnnual={isAnnual} />
            ))}
          </div>
        )}
      </div>



      {/* Billing History */}
       <div className="bg-[#ffffff] rounded-2xl border border-[#e6e4df] overflow-hidden mt-15">
        
        
          <Table 
            TableHeads={tableHeads} 
            TableRows={tableRows} 
            headClass=" border-none text-gray-400 tracking-wider"
            tableClass="border-none"
          />
        
      </div>
    </div>
  )
}

export default Subscription

