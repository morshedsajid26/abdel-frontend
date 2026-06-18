import React, { useState } from 'react';
import Table from '../../components/Table';
import { Icon } from '@iconify/react';
import { Switch } from "@/components/ui/switch";
import InputField from '../../components/Inputfield';
import Dropdown from '../../components/Dropdown';
import Password from '../../components/Password';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGetTenants, useAddTenant, useUpdateTenant, useUpdateTenantStatus, useDeleteTenant } from '../../hooks/useTenants';

const TenantManagement = () => {
  const { data: tenants = [], isLoading, isError, error } = useGetTenants();
  const addMutation = useAddTenant();
  const updateMutation = useUpdateTenant();
  const updateStatusMutation = useUpdateTenantStatus();
  const deleteMutation = useDeleteTenant();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTenantId, setDeletingTenantId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({ 
    first_name: "", 
    last_name: "", 
    email: "", 
    password: "", 
    business_name: "", 
    phone: "", 
    business_type: "restaurant" 
  });

  const handleEditClick = (tenant) => {
    setEditingTenant({ ...tenant });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingTenant) {
      updateStatusMutation.mutate({ 
        id: editingTenant.id, 
        name: editingTenant.name, 
        status: editingTenant.status 
      }, {
        onSuccess: () => setIsEditModalOpen(false)
      });
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingTenantId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingTenantId) {
      deleteMutation.mutate(deletingTenantId, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setDeletingTenantId(null);
        }
      });
    }
  };

  const handleAddTenant = () => {
    if (newTenant.first_name && newTenant.email && newTenant.password && newTenant.business_name) {
      addMutation.mutate(newTenant, {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setNewTenant({ first_name: "", last_name: "", email: "", password: "", business_name: "", phone: "", business_type: "restaurant" });
        }
      });
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const toggleTenantStatus = (id, currentStatus, name) => {
    const status = currentStatus?.toLowerCase();
    if (status === "expired") return; 

    updateStatusMutation.mutate({ 
      id, 
      name,
      status: status === "active" ? "suspended" : "active" 
    });
  };

  const columns = [
    {
      key: "name",
      Title: "Tenant Name",
      width: "20%",
      sortable: true,
      render: (row) => <div className="text-left text-[#0e1217]">{row.name}</div>
    },
    {
      key: "email",
      Title: "Email",
      width: "20%",
      sortable: true,
      render: (row) => <div className="text-left text-[#0e1217] max-w-[200px] truncate" title={row.email}>{row.email || 'N/A'}</div>
    },
    {
      key: "plan",
      Title: "Plan",
      width: "15%",
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
        const status = row.status?.toLowerCase();
        if (status === "active") bgClass = "bg-[#4285F4]";
        else if (status === "suspended") bgClass = "bg-[#EA4335]";
        else if (status === "expired") bgClass = "bg-[#7A8293]";

        return (
          <div className="text-left">
             <span className={`w-[85px] inline-block text-center px-2 py-1 text-[11px] font-medium text-[#0e1217] rounded-[4px] transition-colors duration-300 ${bgClass} capitalize`}>
              {row.status}
            </span>
          </div>
        );
      }
    },
    {
      key: "expiry",
      Title: "Expiry Date",
      width: "15%",
      sortable: true,
      render: (row) => {
        const date = row.expiry_date ? new Date(row.expiry_date).toLocaleDateString() : 'N/A';
        return <div className="text-left text-[#0e1217]">{date}</div>;
      }
    },
    {
      key: "actions",
      Title: "Action",
      width: "15%",
      sortable: false,
      render: (row) => {
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
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-[#9fa5ac]">
            <span className="animate-pulse">Loading tenants...</span>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-12 text-[#EA4335] px-4 text-center">
            Failed to load tenants. <br/>
            {error?.response?.data?.message || error?.message || 'Unknown error'}
          </div>
        ) : tenants.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-[#9fa5ac]">
            No tenants found.
          </div>
        ) : (
          <Table 
            TableHeads={columns} 
            TableRows={tenants} 
            headClass="[&>div]:justify-start border-none text-left whitespace-nowrap bg-[#f8f9fa]" 
            tableClass="border-none" 
          />
        )}
      </div>

      {/* Edit Tenant Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
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
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm !opacity-60 !cursor-not-allowed"
                disabled={true}
              />

              <Dropdown
                label="Status"
                options={["active", "suspended", "expired"]}
                value={editingTenant?.status || "active"}
                onSelect={(val) => setEditingTenant({...editingTenant, status: val})}
                labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm capitalize"
                optionClass="!bg-[#ffffff] !text-[#111] capitalize"
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
                disabled={updateStatusMutation.isPending}
                className="bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-white px-8 py-2.5 rounded-full font-semibold border border-[#e6e4df] shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] transition-all text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {updateStatusMutation.isPending && <Icon icon="lucide:loader-2" className="animate-spin" />}
                Save Changes
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
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
                disabled={deleteMutation.isPending}
                className="bg-[#ef4444] text-[#0e1217] px-10 py-2.5 rounded-full font-semibold hover:bg-red-600 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {deleteMutation.isPending && <Icon icon="lucide:loader-2" className="animate-spin" />}
                Delete
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-[#ffffff] border border-[#e6e4df] rounded-[20px] w-full max-w-[550px] p-8 relative shadow-2xl">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 text-[#9fa5ac] hover:text-[#0e1217] transition-colors"
              >
                <Icon icon="lucide:x" className="text-xl" />
              </button>

              <h2 className="text-[#0e1217] text-xl font-semibold mb-1">Add Tenant</h2>
              <p className="text-[#9fa5ac] text-[13px] mb-8">Add tenant information.</p>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  placeholder="John"
                  value={newTenant.first_name}
                  onChange={(e) => setNewTenant({...newTenant, first_name: e.target.value})}
                  labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                  inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
                />
                <InputField
                  label="Last Name"
                  placeholder="Doe"
                  value={newTenant.last_name}
                  onChange={(e) => setNewTenant({...newTenant, last_name: e.target.value})}
                  labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                  inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
                />
              </div>

              <InputField
                label="Business Name"
                placeholder="Rifat Burger"
                value={newTenant.business_name}
                onChange={(e) => setNewTenant({...newTenant, business_name: e.target.value})}
                labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
              />

              <InputField
                label="Email"
                placeholder="admin@restaurant.com"
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

              <InputField
                label="Phone Number"
                placeholder="+01737947972"
                value={newTenant.phone}
                onChange={(e) => setNewTenant({...newTenant, phone: e.target.value})}
                labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
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
                disabled={addMutation.isPending}
                className="bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-white px-8 py-2.5 rounded-full font-semibold border border-[#e6e4df] shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] transition-all text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {addMutation.isPending && <Icon icon="lucide:loader-2" className="animate-spin" />}
                Add Tenant
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;