import React, { useState } from 'react';
import Table from '../../components/Table';
import { Icon } from '@iconify/react';
import { Switch } from "@/components/ui/switch";
import InputField from '../../components/Inputfield';
import Dropdown from '../../components/Dropdown';
import Password from '../../components/Password';
import { Link } from 'react-router-dom';

import { tenantsMockData } from '../../data/mockData';

const TenantManagement = () => {
  const [tenants, setTenants] = useState(tenantsMockData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTenantId, setDeletingTenantId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: "", email: "", password: "", plan: "Classic", duration: "Monthly" });

  const handleEditClick = (tenant) => {
    setEditingTenant({ ...tenant });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingTenant) {
      setTenants(prev => prev.map(t => t.id === editingTenant.id ? { ...t, name: editingTenant.name, plan: editingTenant.plan, email: editingTenant.email } : t));
    }
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = (id) => {
    setDeletingTenantId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingTenantId) {
      setTenants(prev => prev.filter(t => t.id !== deletingTenantId));
    }
    setIsDeleteModalOpen(false);
    setDeletingTenantId(null);
  };

  const handleAddTenant = () => {
    if (newTenant.name && newTenant.email) {
      const tenant = {
        id: tenants.length > 0 ? Math.max(...tenants.map(t => t.id)) + 1 : 1,
        name: newTenant.name,
        plan: newTenant.plan,
        status: "Active", // Default status
        expiry: "30/07/2026", // Mock expiry
      };
      setTenants([tenant, ...tenants]);
      setIsAddModalOpen(false);
      setNewTenant({ name: "", email: "", password: "", plan: "Classic", duration: "Monthly" });
    }
  };

  const toggleTenantStatus = (id, currentStatus) => {
    // Only toggle between Active and Suspended for demonstration
    if (currentStatus === "Expired") return; 

    setTenants(prev => prev.map(tenant => {
      if (tenant.id === id) {
        return {
          ...tenant,
          status: currentStatus === "Active" ? "Suspended" : "Active"
        };
      }
      return tenant;
    }));
  };

  const columns = [
    {
      key: "name",
      Title: "Tenant Name",
      width: "25%",
      sortable: true,
      render: (row) => <div className="text-left text-[#0e1217]">{row.name}</div>
    },
    {
      key: "plan",
      Title: "Plan",
      width: "20%",
      sortable: true,
      render: (row) => <div className="text-left text-[#0e1217]">{row.plan}</div>
    },
    {
      key: "status",
      Title: "Status",
      width: "15%",
      sortable: true,
      render: (row) => {
        let bgClass = "bg-[#f6f3eb]0";
        if (row.status === "Active") bgClass = "bg-[#4285F4]";
        else if (row.status === "Suspended") bgClass = "bg-[#EA4335]";
        else if (row.status === "Expired") bgClass = "bg-[#7A8293]";

        return (
          <div className="text-left">
             <span className={`w-[85px] inline-block text-center px-2 py-1 text-[11px] font-medium text-[#0e1217] rounded-[4px] transition-colors duration-300 ${bgClass}`}>
              {row.status}
            </span>
          </div>
        );
      }
    },
    {
      key: "expiry",
      Title: "Expiry Date",
      width: "20%",
      sortable: true,
      render: (row) => <div className="text-left text-[#0e1217]">{row.expiry}</div>
    },
    {
      key: "actions",
      Title: "Action",
      width: "20%",
      sortable: false,
      render: (row) => {
        const isActive = row.status === "Active";
        const isExpired = row.status === "Expired";

        return (
          <div className="flex items-center justify-start gap-8">
            <Link to={`/admin/tenant-management/view/${row.id}`}>
            <button className="text-[#9fa5ac] hover:text-[#0e1217] transition-colors" title="View">
              <Icon icon="lucide:eye" className="text-lg" />
            </button>
            </Link>
            <button 
              onClick={() => handleEditClick(row)}
              className="text-[#9fa5ac] hover:text-[#0e1217] transition-colors" title="Edit">
              <Icon icon="lucide:square-pen" className="text-lg" />
            </button>
            
            <button 
              onClick={() => toggleTenantStatus(row.id, row.status)}
              disabled={isExpired}
              className="w-5 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={isActive ? "Suspend Tenant" : "Activate Tenant"}
            >
              {isActive ? (
                <Icon icon="lucide:user-x" className="text-lg text-[#EA4335] hover:text-[#EA4335]" />
              ) : (
                <Icon icon="lucide:user-check" className="text-lg text-[#22C55E] hover:text-green-400" />
              )}
            </button>
            <button 
              onClick={() => handleDeleteClick(row.id)}
              className="text-[#EA4335] hover:text-red-400 transition-colors" title="Delete">
              <Icon icon="lucide:trash-2" className="text-lg" />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div>

        <div className="flex items-center justify-end mb-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-white px-5 py-3 rounded-full text-lg">
                <Icon icon="lucide:plus" className="text-lg" />
                Add Tenant
            </button>
        </div>
      <div className="bg-[#ffffff] rounded-2xl border border-[#e6e4df] overflow-hidden w-full">
        <Table 
          TableHeads={columns} 
          TableRows={tenants} 
          headClass="[&>div]:justify-start border-none text-left whitespace-nowrap" 
          tableClass="border-none" 
        />
      </div>

      {/* Edit Tenant Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#ffffff] border border-[#e6e4df] rounded-[20px] w-full max-w-[550px] p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 text-[#9fa5ac] hover:text-[#0e1217] transition-colors"
            >
              <Icon icon="lucide:x" className="text-xl" />
            </button>

            <h2 className="text-[#0e1217] text-xl font-semibold mb-1">Edit Tenant</h2>
            <p className="text-[#9fa5ac] text-[13px] mb-8">Update tenant information.</p>

            <div className="space-y-6">
              <InputField
                label="Company Name"
                value={editingTenant?.name || ""}
                onChange={(e) => setEditingTenant({...editingTenant, name: e.target.value})}
                labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
              />

              <InputField
                label="Email"
                value={editingTenant?.email || `${(editingTenant?.name || "").toLowerCase().replace(/\s+/g, '')}@test.com`}
                onChange={(e) => setEditingTenant({...editingTenant, email: e.target.value})}
                labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
              />

              <Dropdown
                label="Plan"
                options={["Classic", "Pro"]}
                value={editingTenant?.plan || "Classic"}
                onSelect={(val) => setEditingTenant({...editingTenant, plan: val})}
                labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
                optionClass="!bg-[#ffffff] !text-[#111]"
                icon="!text-[#9fa5ac]"
              />
            </div>

            <div className="flex items-center justify-center gap-5 mt-10">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="bg-[#ffffff] text-black font-semibold px-8 py-2.5 rounded-full hover:bg-[#e6e4df] transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-white px-8 py-2.5 rounded-full font-semibold border border-[#e6e4df] shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] transition-all text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#ffffff] border border-[#e6e4df] rounded-[20px] w-full max-w-[500px] p-8 relative shadow-2xl">
            <h2 className="text-[#0e1217] text-xl font-bold mb-3">Are you absolutely sure?</h2>
            <p className="text-[#9fa5ac] text-[14px] leading-relaxed mb-10 pr-4">
              This action cannot be undone. This will permanently delete the tenant account and remove all associated data from the platform.
            </p>

            <div className="flex items-center justify-center gap-5">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-[#ffffff] text-black font-semibold px-10 py-2.5 rounded-full hover:bg-[#e6e4df] transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="bg-[#ef4444] text-[#0e1217] px-10 py-2.5 rounded-full font-semibold hover:bg-red-600 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#ffffff] border border-[#e6e4df] rounded-[20px] w-full max-w-[550px] p-8 relative shadow-2xl overflow-y-auto max-h-[90vh] hide-scrollbar">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 text-[#9fa5ac] hover:text-[#0e1217] transition-colors"
            >
              <Icon icon="lucide:x" className="text-xl" />
            </button>

            <h2 className="text-[#0e1217] text-xl font-semibold mb-1">Add Tenant</h2>
            <p className="text-[#9fa5ac] text-[13px] mb-8">Add tenant information.</p>

            <div className="space-y-6">
              <InputField
                label="Company Name"
                placeholder="Tech Corp"
                value={newTenant.name}
                onChange={(e) => {
                  const name = e.target.value;
                  // Only auto-fill email if it hasn't been manually heavily edited, or just dynamically fill it
                  // For simplicity, just update the email dynamically if it's currently derived from the name
                  setNewTenant({...newTenant, name, email: `${name.toLowerCase().replace(/\\s+/g, '')}@test.com`})
                }}
                labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
              />

              <InputField
                label="Email"
                placeholder="admin@techcorp.com"
                value={newTenant.email}
                onChange={(e) => setNewTenant({...newTenant, email: e.target.value})}
                labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
              />

              <Password
                label="Password"
                placeholder="••••••••"
                value={newTenant.password}
                onChange={(e) => setNewTenant({...newTenant, password: e.target.value})}
                labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
              />

              <Dropdown
                label="Plan"
                options={["Classic", "Pro"]}
                value={newTenant.plan}
                onSelect={(val) => setNewTenant({...newTenant, plan: val})}
                labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
                optionClass="!bg-[#ffffff] !text-[#111]"
                icon="!text-[#9fa5ac]"
              />

              <Dropdown
                label="Subscription Duration"
                options={["Monthly", "Yearly"]}
                value={newTenant.duration}
                onSelect={(val) => setNewTenant({...newTenant, duration: val})}
                labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
                optionClass="!bg-[#ffffff] !text-[#111]"
                icon="!text-[#9fa5ac]"
              />
            </div>

            <div className="flex items-center justify-center gap-5 mt-10">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="bg-[#ffffff] text-black font-semibold px-8 py-2.5 rounded-full hover:bg-[#e6e4df] transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddTenant}
                className="bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-white px-8 py-2.5 rounded-full font-semibold border border-[#e6e4df] shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] transition-all text-sm"
              >
                Add Tenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;