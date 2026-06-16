import React from 'react'
import Table from '../../../components/Table'

const BillingHistory = () => {

  const tableHeads = [
    { key: "date", Title: "Date",width: "40%" },
    { key: "details", Title: "Details",width: "40%" },
    { key: "amount", Title: "Amount",width: "20%" },
  ];

  const tableRows = [
    { id: 1, date: "09/05/2025", details: "Pro plan, monthly", amount: "$9.99" },
    { id: 2, date: "09/05/2025", details: "Pro plan, monthly", amount: "$9.99" },
    { id: 3, date: "09/05/2025", details: "Pro plan, monthly", amount: "$9.99" },
    { id: 4, date: "09/05/2025", details: "Pro plan, monthly", amount: "$9.99" },
    { id: 5, date: "09/05/2025", details: "Pro plan, monthly", amount: "$9.99" },
    { id: 6, date: "09/05/2025", details: "Pro plan, monthly", amount: "$9.99" },
    { id: 7, date: "09/05/2025", details: "Pro plan, monthly", amount: "$9.99" },
    { id: 8, date: "09/05/2025", details: "Pro plan, monthly", amount: "$9.99" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-semibold text-white mb-1">Billing History</h2>
      <p className="text-sm text-gray-400 mb-8">Your subscription plan Billing</p>

      <div className="bg-[#191919] rounded-xl border border-white/5 overflow-hidden">
        <Table 
          TableHeads={tableHeads} 
          TableRows={tableRows}
          headClass=" border-b border-[#1A1A1A] text-gray-200 whitespace-nowrap last:[&>div]:justify-center"
          tableClass="border-none"
        />
      </div>
    </div>
  )
}

export default BillingHistory
