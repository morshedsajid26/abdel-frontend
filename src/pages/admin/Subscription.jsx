import React, { useState } from 'react'
import { DollarSign, TrendingUp, CreditCard, Download, Sparkles, Check, X } from 'lucide-react'
import Table from '../../components/Table'
import ToggleButton from '../../components/ToogleButton'

const PlanCard = ({ plan, isAnnual }) => (
  <div className={`bg-[#131313] border ${plan.isPopular ? 'border-blue-600/30 shadow-[0_0_20px_rgba(37,99,235,0.05)]' : 'border-[#272727]'} p-6 rounded-[28px] flex flex-col gap-6 hover:border-[#333333] transition-all group`}>
    <div className="flex flex-col gap-5">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium w-fit transition-colors ${plan.isPopular ? 'bg-blue-600/10 text-blue-400 border border-blue-600/40' : 'bg-[#1A1A1A] text-gray-300 border border-[#272727]'}`}>
        {plan.name}
        <Sparkles className={`w-3.5 h-3.5 ${plan.isPopular ? 'text-blue-400' : 'text-gray-400'}`} />
      </div>
      
      <div className="flex items-baseline gap-1.5">
        <span className="text-white text-[32px] font-bold tracking-tight">{plan.price}</span>
        <span className="text-gray-500 text-sm font-medium">/{isAnnual ? 'year' : 'month'}</span>
      </div>
      
      <p className="text-gray-400 text-[13px] leading-relaxed min-h-[40px]">
        {plan.description}
      </p>
    </div>

    <div className="flex flex-col gap-4 mt-2">
      {plan.features.map((feature, idx) => (
        <div key={idx} className="flex items-center gap-3">
          {feature.included ? (
            <Check className="w-4 h-4 text-blue-500/80" />
          ) : (
            <X className="w-4 h-4 text-gray-600" />
          )}
          <span className={`text-[13px] ${feature.included ? 'text-gray-300' : 'text-gray-600'}`}>
            {feature.text}
          </span>
        </div>
      ))}
    </div>
  </div>
)

const Subscription = () => {
  const [isAnnual, setIsAnnual] = useState(false)

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
          <span className="text-white text-[11px] font-medium">+5.09% ↗</span>
          <span className="text-gray-500 text-[11px]">+1.4 last month</span>
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

  const plans = [
    {
      name: "Basic",
      price: isAnnual ? "$19.99" : "$1.99",
      description: "AI Smarter Support Essential",
      features: [
        { text: "500 min call time", included: true },
        { text: "1000 sms", included: true },
        { text: "Basic summary", included: true },
        { text: "Limited Access", included: true },
      ]
    },
    {
      name: "Classic",
      price: isAnnual ? "$39.99" : "$3.99",
      description: "AI Smarter Support Classic",
      features: [
        { text: "1500 min call time", included: true },
        { text: "10000 sms", included: false },
        { text: "Call summary", included: true },
        { text: "Limited Access", included: true },
      ]
    },
    {
      name: "Pro Plan",
      price: isAnnual ? "$99.99" : "$9.99",
      description: "AI Smarter Support grow Faster.",
      isPopular: true,
      features: [
        { text: "3000 min call time", included: true },
        { text: "Unlimited sms", included: true },
        { text: "Call summary", included: true },
        { text: "Full Access", included: true },
      ]
    },
    {
      name: "Advanced",
      price: isAnnual ? "$199.99" : "$19.99",
      description: "AI Smarter Support Power User.",
      features: [
        { text: "5000 min call time", included: true },
        { text: "Unlimited sms", included: true },
        { text: "Advanced AI", included: true },
        { text: "Full Access", included: true },
      ]
    },
    {
      name: "Enterprise",
      price: isAnnual ? "$499.99" : "$49.99",
      description: "AI Smarter Support for Business.",
      features: [
        { text: "Unlimited calls", included: true },
        { text: "Unlimited sms", included: true },
        { text: "Custom AI Model", included: true },
        { text: "Dedicated Support", included: true },
      ]
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
        <span className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-[13px] font-medium">
          {row.status}
        </span>
      )
    },
    { key: 'billingCycle', Title: 'Billing Cycle' },
    { 
      key: 'action', 
      Title: 'Action',
      render: () => (
        <button className="text-gray-400 hover:text-white transition-colors">
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
            className='bg-[#191919] border border-[#272727] p-7 rounded-[32px] flex flex-col gap-6'
          >
            <div className="flex items-center gap-3 text-white">
               <div className="opacity-80">
                {stat.icon}
               </div>
               <h3 className="text-sm font-medium tracking-wide">{stat.title}</h3>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-white text-[28px] font-semibold leading-none">{stat.value}</span>
              <div className="mt-2">
                {typeof stat.label === 'string' ? (
                  <span className={`text-[11px] font-medium ${stat.labelColor || 'text-gray-500'}`}>{stat.label}</span>
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {plans.map((plan, index) => (
            <PlanCard key={index} plan={plan} isAnnual={isAnnual} />
          ))}
        </div>
      </div>



      {/* Billing History */}
       <div className="bg-[#191919] rounded-2xl border border-gray-800/50 overflow-hidden mt-15">
        
        
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

