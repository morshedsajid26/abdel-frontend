import React from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Table from '../../components/Table';
import { useGetTenant } from '../../hooks/useTenants';

import { billingHistoryMock } from '../../data/mockData';

const ViewTenant = () => {
  const { id } = useParams();
  const { data: tenant, isLoading, isError } = useGetTenant(id);
  const billingData = billingHistoryMock[id] || [];

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Icon icon="lucide:loader-2" className="animate-spin text-[#205943] text-4xl" />
      </div>
    );
  }

  if (isError || !tenant) {
    return (
      <div className="p-6 text-[#0e1217] text-center">
        <h2 className="text-2xl font-bold">Tenant not found or error loading data</h2>
      </div>
    );
  }

  const columns = [
    {
      key: "date",
      Title: "Date",
      width: "20%",
      sortable: true,
      render: (row) => <div className="text-left text-[#0e1217]">{row.date}</div>
    },
    {
      key: "plan",
      Title: "Plan",
      width: "20%",
      sortable: true,
      render: (row) => <div className="text-left text-[#0e1217]">{row.plan}</div>
    },
    {
      key: "invoice",
      Title: "Invoice",
      width: "20%",
      sortable: true,
      render: (row) => <div className="text-left text-[#0e1217]">{row.invoice}</div>
    },
    {
      key: "amount",
      Title: "Amount",
      width: "20%",
      sortable: true,
      render: (row) => <div className="text-left text-[#0e1217]">{row.amount}</div>
    },
    {
      key: "status",
      Title: "Status",
      width: "20%",
      sortable: true,
      render: (row) => (
        <div className="text-left">
          <span className="w-[85px] inline-block text-center px-2 py-1 text-[11px] font-medium text-[#0e1217] rounded-[4px] bg-[#4285F4]">
            {row.status}
          </span>
        </div>
      )
    },
  ];

  return (
    <div className=" space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-[#0e1217] text-2xl font-bold">{tenant.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-[#9fa5ac] text-sm">
            <div className="flex items-center gap-1.5">
              <Icon icon="lucide:mail" className="text-lg" />
              <span>{tenant.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon icon="lucide:calendar" className="text-lg" />
              <span>Joined {tenant.joined}</span>
            </div>
          </div>
        </div>

        <div>
          <span className={`inline-block px-4 py-1.5 text-xs font-semibold rounded-full capitalize ${
            tenant.status?.toLowerCase() === "active" ? "bg-[#4285F4] text-white" : 
            tenant.status?.toLowerCase() === "suspended" ? "bg-[#EA4335] text-white" : 
            "bg-[#7A8293] text-white"
          }`}>
            {tenant.status}
          </span>
        </div>
      </div>

      {/* Billing History Section */}
      <div className="space-y-4">
        <h2 className="text-[#0e1217] text-xl font-semibold">Billing History</h2>
        <div className="bg-[#ffffff] rounded-2xl border border-[#e6e4df] overflow-hidden w-full">
          <Table 
            TableHeads={columns} 
            TableRows={billingData} 
            headClass="[&>div]:justify-start border-none text-left whitespace-nowrap" 
            tableClass="border-none table-fixed min-w-[800px]" 
          />
        </div>
      </div>
    </div>
  );
};

export default ViewTenant;