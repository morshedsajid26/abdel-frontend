import Breadcrumb from "@/components/Breadcrumb";
import { Icon } from "@iconify/react";
import InputField from "@/components/Inputfield";
import Dropdown from "@/components/Dropdown";
import Table from "@/components/Table";
import toast from 'react-hot-toast';

import React, { useState } from "react";
import { useGetTelephony, useAddTelephony, useUpdateTelephony, useDeleteTelephony } from "../../hooks/useTelephony";

const Telephony = () => {
  const { data: telephonyData = [], isLoading, isError, error } = useGetTelephony();
  const addMutation = useAddTelephony();
  const updateMutation = useUpdateTelephony();
  const deleteMutation = useDeleteTelephony();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingNumberId, setDeletingNumberId] = useState(null);
  const [editingNumber, setEditingNumber] = useState(null);
  const [newNumber, setNewNumber] = useState({ twilioNumber: "", managerNumber: "", vapiAgentId: "" });

  const handleAddNumber = () => {
    if (newNumber.twilioNumber && newNumber.managerNumber && newNumber.vapiAgentId) {
      addMutation.mutate(newNumber, {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setNewNumber({ twilioNumber: "", managerNumber: "", vapiAgentId: "" });
        }
      });
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleEditClick = (number) => {
    setEditingNumber({ ...number });
    setIsEditModalOpen(true);
  };

  const handleUpdateNumber = () => {
    if (!editingNumber?.id) {
      toast.error("Error: ID is missing! Available keys: " + Object.keys(editingNumber || {}).join(", "));
      return;
    }
    updateMutation.mutate(
      { id: editingNumber.id, data: { twilioNumber: editingNumber.twilioNumber, managerNumber: editingNumber.managerNumber } },
      { onSuccess: () => setIsEditModalOpen(false) }
    );
  };

  const handleDeleteClick = (id) => {
    setDeletingNumberId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingNumberId) {
      deleteMutation.mutate(deletingNumberId, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setDeletingNumberId(null);
        }
      });
    }
  };

  const columns = [
    {
      key: "businessName",
      Title: "Business Name",
      width: "20%",
      sortable: true,
      render: (row) => <div className="text-left text-[#0e1217] font-medium text-[13px] capitalize">{row.business?.name || 'N/A'}</div>
    },
    
    {
      key: "twilioNumber",
      Title: "Twilio Number",
      width: "20%",
      sortable: true,
      render: (row) => <div className="text-left text-[#0e1217] text-[13px]">{row.twilioNumber || 'N/A'}</div>
    },
    {
      key: "managerNumber",
      Title: "Manager Number",
      width: "20%",
      sortable: true,
      render: (row) => <div className="text-left text-[#0e1217] text-[13px]">{row.managerNumber || 'N/A'}</div>
    },
    {
      key: "agentName",
      Title: "Agent Name",
      width: "20%",
      sortable: true,
      render: (row) => <div className="text-left text-[#0e1217] text-[13px]">{row.agentName || 'N/A'}</div>
    },
    {
      key: "actions",
      Title: "Action",
      width: "10%",
      sortable: false,
      render: (row) => (
        <div className="flex items-center justify-start gap-4">
          <button 
            onClick={() => handleEditClick(row)}
            className="text-[#9fa5ac] hover:text-[#0e1217] transition-colors" title="Edit">
            <Icon icon="lucide:square-pen" className="text-lg" />
          </button>
          <button 
            onClick={() => handleDeleteClick(row.id)}
            className="text-[#EA4335] hover:text-red-400 transition-colors" title="Delete">
            <Icon icon="lucide:trash-2" className="text-lg" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <Breadcrumb
          text={`Import and manage Twilio / Vonage phone numbers linked to your AI Agents.`}
        />

        <div className=" mb-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-white px-5 py-3 rounded-full text-lg cursor-pointer"
          >
            <Icon icon="lucide:plus" className="text-lg" />
            Import Number
          </button>
        </div>
      </div>

        <div className="bg-[#ffffff] rounded-2xl border border-[#e6e4df] overflow-hidden w-full relative">
          {isLoading ? (
            <div className="flex items-center justify-center p-12 text-[#9fa5ac]">
              <span className="animate-pulse">Loading telephony...</span>
            </div>
          ) : isError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#EA4335] px-4 text-center">
              Failed to load telephony data. <br/>
              {error?.response?.data?.message || error?.message || 'Unknown error'}
            </div>
          ) : telephonyData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-[#9fa5ac]">
              No telephony data found
            </div>
          ) : null}
          <Table 
            TableHeads={columns} 
            TableRows={telephonyData} 
            headClass="[&>div]:justify-start border-none text-left whitespace-nowrap" 
            tableClass="border-none" 
          />
        </div>

      {/* Add Number Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#ffffff] border border-[#e6e4df] rounded-[20px] w-full max-w-[550px] px-8 py-12 relative shadow-2xl overflow-y-auto hide-scrollbar">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 text-[#9fa5ac] hover:text-[#0e1217] transition-colors"
            >
              <Icon icon="lucide:x" className="text-xl" />
            </button>

            <h2 className="text-[#0e1217] text-xl font-semibold mb-1">Add Number</h2>
            <p className="text-[#9fa5ac] text-[13px] mb-8">Import Vapi Number</p>

            <div className="space-y-6">
              <InputField
                label="Twilio Number"
                placeholder="+12345678"
                value={newNumber.twilioNumber}
                onChange={(e) => setNewNumber({...newNumber, twilioNumber: e.target.value})}
                labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
              />

              <InputField
                label="Manager Number"
                placeholder="+1235489"
                value={newNumber.managerNumber}
                onChange={(e) => setNewNumber({...newNumber, managerNumber: e.target.value})}
                labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
              />

              <InputField
                label="Vapi Agent ID"
                placeholder="05a89c6c-ed2c-4ec2-b5be-73aed6b7ac23"
                value={newNumber.vapiAgentId}
                onChange={(e) => setNewNumber({...newNumber, vapiAgentId: e.target.value})}
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
                onClick={handleAddNumber}
                disabled={addMutation.isPending}
                className="bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-white px-8 py-2.5 rounded-full font-semibold border border-[#e6e4df] shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] transition-all text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {addMutation.isPending && <Icon icon="lucide:loader-2" className="animate-spin" />}
                Add Number
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Number Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#ffffff] border border-[#e6e4df] rounded-[20px] w-full max-w-[550px] px-8 py-12 relative shadow-2xl overflow-y-auto hide-scrollbar">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 text-[#9fa5ac] hover:text-[#0e1217] transition-colors"
            >
              <Icon icon="lucide:x" className="text-xl" />
            </button>

            <h2 className="text-[#0e1217] text-xl font-semibold mb-1">Edit Number</h2>
            <p className="text-[#9fa5ac] text-[13px] mb-8">Update imported number details</p>

            <div className="space-y-6">
              <InputField
                label="Twilio Number"
                placeholder="+12345678"
                value={editingNumber?.twilioNumber}
                onChange={(e) => setEditingNumber({...editingNumber, twilioNumber: e.target.value})}
                labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
              />

              <InputField
                label="Manager Number"
                placeholder="+123548968"
                value={editingNumber?.managerNumber}
                onChange={(e) => setEditingNumber({...editingNumber, managerNumber: e.target.value})}
                labelClass="!text-[#0e1217] !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
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
                onClick={handleUpdateNumber}
                disabled={updateMutation.isPending}
                className="bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-white px-8 py-2.5 rounded-full font-semibold border border-[#e6e4df] shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] transition-all text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {updateMutation.isPending && <Icon icon="lucide:loader-2" className="animate-spin" />}
                Update Number
              </button>
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
                This action cannot be undone. This will permanently delete the telephony number and remove all associated data.
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
    </div>
  );
};

export default Telephony;

