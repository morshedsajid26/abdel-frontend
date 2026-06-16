import React, { useState } from 'react'
import { Sparkles, Check, X } from 'lucide-react'
import ToggleButton from '../../../components/ToogleButton'

const PlanCard = ({ plan, isAnnual }) => (
  <div className={`bg-[#ffffff] border ${plan.isPopular ? 'border-blue-600/30 shadow-[0_0_20px_rgba(37,99,235,0.05)]' : 'border-[#e6e4df]'} p-6 rounded-[28px] flex flex-col gap-6 hover:border-[#e6e4df] transition-all group h-full`}>
    <div className="flex flex-col gap-5">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium w-fit transition-colors ${plan.isPopular ? 'bg-blue-600/10 text-green-400 border border-blue-600/40' : 'bg-[#f6f3eb] text-[#9fa5ac] border border-[#e6e4df]'}`}>
        {plan.name}
        <Sparkles className={`w-3.5 h-3.5 ${plan.isPopular ? 'text-green-400' : 'text-[#9fa5ac]'}`} />
      </div>
      
      <div className="flex items-baseline gap-1.5">
        <span className="text-[#0e1217] text-[32px] font-bold tracking-tight">{plan.price}</span>
        <span className="text-[#9fa5ac] text-sm font-medium">/{isAnnual ? 'year' : 'month'}</span>
      </div>
      
      <p className="text-[#9fa5ac] text-[13px] leading-relaxed min-h-[40px]">
        {plan.description}
      </p>
    </div>

    <div className="flex flex-col gap-4 mt-2 mb-6">
      {plan.features.map((feature, idx) => (
        <div key={idx} className="flex items-center gap-3">
          {feature.included ? (
            <Check className="w-4 h-4 text-blue-500/80" />
          ) : (
            <X className="w-4 h-4 text-[#50565c]" />
          )}
          <span className={`text-[13px] ${feature.included ? 'text-[#9fa5ac]' : 'text-[#50565c]'}`}>
            {feature.text}
          </span>
        </div>
      ))}
    </div>

    <div className="mt-auto">
      <button className="w-full py-2.5 rounded-lg border border-[#419977] bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-sm text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all">
        {plan.buttonText || "Upgrade plan"}
      </button>
    </div>
  </div>
)

const Plan = () => {
  const [isAnnual, setIsAnnual] = useState(false)

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
      ],
      buttonText: "Upgrade plan"
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
      ],
      buttonText: "Upgrade plan"
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
      ],
      buttonText: "Current Plan"
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
      ],
      buttonText: "Upgrade plan"
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
      ],
      buttonText: "Upgrade plan"
    }
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-6 sm:gap-0">
        <div>
          <h2 className="text-xl font-semibold text-[#0e1217] mb-1">Choose Your Plan</h2>
          <p className="text-sm text-[#9fa5ac]">Manage your subscription plan</p>
        </div>
        <div className=" p-1.5   self-center sm:self-auto">
          <ToggleButton isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {plans.map((plan, index) => (
          <PlanCard key={index} plan={plan} isAnnual={isAnnual} />
        ))}
      </div>
    </div>
  )
}

export default Plan