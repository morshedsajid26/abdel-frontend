import React, { useState } from 'react'
import { Sparkles, Check, X, Loader2 } from 'lucide-react'
import ToggleButton from '../../components/ToogleButton'
import { useGetSubscriptionPlans, useCreateCheckoutSession } from '../../hooks/useSubscription'
import toast from 'react-hot-toast'

const PlanCard = ({ plan, isAnnual }) => {
  const { mutate, isPending } = useCreateCheckoutSession();

  const handleUpgrade = () => {
    mutate({ 
      planId: plan.id, 
      billingCycle: isAnnual ? 'yearly' : 'monthly' 
    }, {
      onSuccess: (res) => {
        if (res.url) {
          window.location.href = res.url;
        } else if (res?.data?.url) {
          window.location.href = res.data.url;
        }
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to create checkout session");
      }
    });
  };

  return (
  <div className={`bg-[#ffffff] border ${plan.isCurrentPlan ? 'border-blue-600/30 shadow-[0_0_20px_rgba(37,99,235,0.05)]' : 'border-[#e6e4df]'} p-6 rounded-[28px] flex flex-col gap-6 hover:border-[#e6e4df] transition-all group h-full`}>
    <div className="flex flex-col gap-5">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium w-fit transition-colors ${plan.isCurrentPlan ? 'bg-blue-600/10 text-green-400 border border-blue-600/40' : 'bg-[#f6f3eb] text-[#9fa5ac] border border-[#e6e4df]'}`}>
        {plan.name}
        {plan.isCurrentPlan && <Sparkles className="w-3.5 h-3.5 text-green-400" />}
      </div>
      
      <div className="flex items-baseline gap-1.5">
        <span className="text-[#0e1217] text-[32px] font-bold tracking-tight">${isAnnual ? plan.yearly_price : plan.monthly_price}</span>
        <span className="text-[#9fa5ac] text-sm font-medium">/{isAnnual ? 'year' : 'month'}</span>
      </div>
      
      <p className="text-[#9fa5ac] text-[13px] leading-relaxed min-h-[40px]">
        {plan.description || "AI Smarter Support"}
      </p>
    </div>

    <div className="flex flex-col gap-4 mt-2 mb-6">
      {plan.features?.map((feature, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <Check className="w-4 h-4 text-blue-500/80" />
          <span className="text-[13px] text-[#9fa5ac]">
            {feature}
          </span>
        </div>
      ))}
      
      {plan.call_limit > 0 ? (
        <div className="flex items-center gap-3">
          <Check className="w-4 h-4 text-blue-500/80" />
          <span className="text-[13px] text-[#9fa5ac]">
            {plan.call_limit} min call time
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
      
      {plan.order_limit > 0 ? (
        <div className="flex items-center gap-3">
          <Check className="w-4 h-4 text-blue-500/80" />
          <span className="text-[13px] text-[#9fa5ac]">
            {plan.order_limit} order limit
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

    <div className="mt-auto">
      <button 
        className="w-full py-2.5 rounded-lg border border-[#419977] bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-sm text-white shadow-[0_0_15px_rgba(65,153,119,0.4)] hover:shadow-[0_0_20px_rgba(65,153,119,0.6)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        disabled={plan.isCurrentPlan || isPending}
        onClick={handleUpgrade}
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {plan.isCurrentPlan ? "Current Plan" : "Upgrade plan"}
      </button>
    </div>
  </div>
  )
}

const Plan = () => {
  const [isAnnual, setIsAnnual] = useState(false)
  const { data, isLoading, isError } = useGetSubscriptionPlans();
  
  const plans = data?.data || [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-6 sm:gap-0">
        <div>
          <h2 className="text-xl font-semibold text-[#0e1217] mb-1">Choose Your Plan</h2>
          <p className="text-sm text-[#9fa5ac]">Manage your subscription plan</p>
        </div>
        <div className="p-1.5 self-center sm:self-auto">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} isAnnual={isAnnual} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Plan