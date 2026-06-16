import Breadcrumb from "@/components/Breadcrumb";
import { Icon } from "@iconify/react";
import InputField from "@/components/Inputfield";
import Dropdown from "@/components/Dropdown";
import Table from "@/components/Table";

import React, { useState } from "react";

const Telephony = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNumber, setEditingNumber] = useState(null);
  const [numbers, setNumbers] = useState([
    { id: 1, provider: "Twilio", phoneNumber: "+12345678", forwardingNumber: "+123548968", agent: "Agent 1" },
    { id: 2, provider: "Vonage", phoneNumber: "+98765432", forwardingNumber: "+987654321", agent: "No Agent unlinked" },
  ]);
  const [newNumber, setNewNumber] = useState({ provider: "Twilio", phoneNumber: "", forwardingNumber: "", agent: "No Agent unlinked" });

  const handleAddNumber = () => {
    // Backend integration will be handled later
    setIsAddModalOpen(false);
  };

  const handleEditClick = (number) => {
    setEditingNumber({ ...number });
    setIsEditModalOpen(true);
  };

  const handleUpdateNumber = () => {
    // Backend integration will be handled later
    setIsEditModalOpen(false);
  };

  const handleDeleteNumber = (id) => {
    setNumbers(prev => prev.filter(n => n.id !== id));
  };

  const columns = [
    {
      key: "provider",
      Title: "Provider",
      width: "20%",
      sortable: true,
      render: (row) => <div className="text-left text-gray-200">{row.provider}</div>
    },
    {
      key: "phoneNumber",
      Title: "Phone Number",
      width: "25%",
      sortable: true,
      render: (row) => <div className="text-left text-gray-200">{row.phoneNumber}</div>
    },
    {
      key: "forwardingNumber",
      Title: "Forwarding Number",
      width: "25%",
      sortable: true,
      render: (row) => <div className="text-left text-gray-200">{row.forwardingNumber}</div>
    },
    {
      key: "agent",
      Title: "Linked Agent",
      width: "20%",
      sortable: true,
      render: (row) => <div className="text-left text-gray-200">{row.agent}</div>
    },
    {
      key: "actions",
      Title: "Action",
      width: "10%",
      sortable: false,
      render: (row) => (
        <div className="flex items-center justify-start gap-3">
          <button 
            onClick={() => handleEditClick(row)}
            className="text-gray-400 hover:text-white transition-colors" 
            title="Edit"
          >
            <Icon icon="lucide:square-pen" className="text-lg" />
          </button>
          <button 
            onClick={() => handleDeleteNumber(row.id)}
            className="text-[#EA4335] hover:text-red-400 transition-colors" 
            title="Delete"
          >
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
            className="flex items-center gap-2 bg-linear-to-t from-[#00135B] via-[#02060F] to-[#00104E] text-white px-5 py-3 rounded-full text-lg cursor-pointer"
          >
            <Icon icon="lucide:plus" className="text-lg" />
            Import Number
          </button>
        </div>
      </div>

      <div className="bg-[#191919] rounded-2xl border border-gray-800/50 overflow-hidden w-full">
        <Table 
          TableHeads={columns} 
          TableRows={numbers} 
          headClass="[&>div]:justify-start border-none text-left whitespace-nowrap" 
          tableClass="border-none" 
        />
      </div>

      {/* Add Number Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0E0E10] border border-gray-800 rounded-[20px] w-full max-w-[550px] px-8 py-12 relative shadow-2xl overflow-y-auto hide-scrollbar">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <Icon icon="lucide:x" className="text-xl" />
            </button>

            <h2 className="text-white text-xl font-semibold mb-1">Add Number</h2>
            <p className="text-gray-400 text-[13px] mb-8">Import Vapi Number</p>

            <div className="space-y-6">
              <Dropdown
                label="Provider"
                options={["Twilio", "Vonage", "Vapi"]}
                value={newNumber.provider}
                onSelect={(val) => setNewNumber({...newNumber, provider: val})}
                labelClass="!text-gray-200 !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
                optionClass="!bg-white !text-[#111]"
                icon="!text-gray-500"
              />

              <InputField
                label="Phone Number"
                placeholder="+12345678"
                value={newNumber.phoneNumber}
                onChange={(e) => setNewNumber({...newNumber, phoneNumber: e.target.value})}
                labelClass="!text-gray-200 !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
              />

              <InputField
                label="Forwarding Number"
                placeholder="+123548968"
                value={newNumber.forwardingNumber}
                onChange={(e) => setNewNumber({...newNumber, forwardingNumber: e.target.value})}
                labelClass="!text-gray-200 !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
              />

              <Dropdown
                label="Link to Agent"
                options={["No Agent unlinked", "Agent 1", "Agent 2"]}
                value={newNumber.agent}
                onSelect={(val) => setNewNumber({...newNumber, agent: val})}
                labelClass="!text-gray-200 !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
                optionClass="!bg-white !text-[#111]"
                icon="!text-gray-500"
              />
            </div>

            <div className="flex items-center justify-center gap-5 mt-10">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="bg-white text-black font-semibold px-8 py-2.5 rounded-full hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddNumber}
                className="bg-linear-to-t from-[#00135B] via-[#02060F] to-[#00104E] text-white px-8 py-2.5 rounded-full font-semibold border border-[#1e3a8a] shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] transition-all text-sm"
              >
                Add Number
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Number Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0E0E10] border border-gray-800 rounded-[20px] w-full max-w-[550px] px-8 py-12 relative shadow-2xl overflow-y-auto hide-scrollbar">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <Icon icon="lucide:x" className="text-xl" />
            </button>

            <h2 className="text-white text-xl font-semibold mb-1">Edit Number</h2>
            <p className="text-gray-400 text-[13px] mb-8">Update imported number details</p>

            <div className="space-y-6">
              <Dropdown
                label="Provider"
                options={["Twilio", "Vonage", "Vapi"]}
                value={editingNumber?.provider}
                onSelect={(val) => setEditingNumber({...editingNumber, provider: val})}
                labelClass="!text-gray-200 !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
                optionClass="!bg-white !text-[#111]"
                icon="!text-gray-500"
              />

              <InputField
                label="Phone Number"
                placeholder="+12345678"
                value={editingNumber?.phoneNumber}
                onChange={(e) => setEditingNumber({...editingNumber, phoneNumber: e.target.value})}
                labelClass="!text-gray-200 !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
              />

              <InputField
                label="Forwarding Number"
                placeholder="+123548968"
                value={editingNumber?.forwardingNumber}
                onChange={(e) => setEditingNumber({...editingNumber, forwardingNumber: e.target.value})}
                labelClass="!text-gray-200 !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
              />

              <Dropdown
                label="Link to Agent"
                options={["No Agent unlinked", "Agent 1", "Agent 2"]}
                value={editingNumber?.agent}
                onSelect={(val) => setEditingNumber({...editingNumber, agent: val})}
                labelClass="!text-gray-200 !text-[13px] !mb-1 !font-medium"
                inputClass="!bg-[#F5F5F5] !border-none !text-[#111] !rounded-xl !py-3.5 !px-4 !font-medium !text-sm"
                optionClass="!bg-white !text-[#111]"
                icon="!text-gray-500"
              />
            </div>

            <div className="flex items-center justify-center gap-5 mt-10">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="bg-white text-black font-semibold px-8 py-2.5 rounded-full hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateNumber}
                className="bg-linear-to-t from-[#00135B] via-[#02060F] to-[#00104E] text-white px-8 py-2.5 rounded-full font-semibold border border-[#1e3a8a] shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] transition-all text-sm"
              >
                Update Number
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Telephony;

