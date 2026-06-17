import React, { useState } from 'react'
import { Plus, Trash2, X, Upload, AlertTriangle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

import Table from '../../components/Table'
import Breadcrumb from '../../components/Breadcrumb'

const AgentManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);
  
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: responseData, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get('/business-owner/ai-training/');
        return res.data;
      } catch (err) {
        console.error("Agents API Error:", err);
        throw err;
      }
    }
  });

  const agents = responseData?.data || [];

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/business-owner/ai-training/delete/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['agents']);
      setIsDeleteModalOpen(false);
      setAgentToDelete(null);
      toast.success("Agent deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete Agent Error:", error);
      toast.error(error.response?.data?.message || "Failed to delete agent");
      setIsDeleteModalOpen(false);
      setAgentToDelete(null);
    }
  });

  const handleDeleteClick = (id) => {
    setAgentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (agentToDelete) {
      deleteMutation.mutate(agentToDelete);
    }
  };

  const [formData, setFormData] = useState({
    assistant_name: '',
    welcome_message: '',
    files: null
  });

  const columns = [
    { key: 'agentName', Title: 'Agent Name', width: '15%' },
    { key: 'restaurantName', Title: 'Restaurant', width: '15%', render: (row) => row.restaurantName || row.restaurantId || 'N/A' },
    { key: 'twilioNumber', Title: 'Twilio Number', width: '15%', render: (row) => row.twilioNumber || 'N/A' },
    { 
      key: 'prompt', 
      Title: 'Prompt / Welcome Message', 
      width: '20%', 
      render: (row) => (
        <div className="truncate max-w-[200px]" title={row.prompt}>
          {row.prompt}
        </div>
      ) 
    },
    { key: 'createdAt', Title: 'Created At', width: '15%', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    { 
      key: 'status', 
      Title: 'Status', 
      width: '10%',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
          row.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>
          {row.status}
        </span>
      )
    },
    { 
      key: 'action', 
      Title: 'Action', 
      width: '10%',
      sortable: false,
      render: (row) => (
        <div className="flex gap-2 justify-center">
          <button 
            onClick={() => handleDeleteClick(row.id)}
            disabled={deleteMutation.isLoading && agentToDelete === row.id}
            className="text-[#9fa5ac] hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg disabled:opacity-50"
            title="Delete Agent"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const createMutation = useMutation({
    mutationFn: async (formDataPayload) => {
      const res = await axiosSecure.post('/business-owner/ai-training/create', formDataPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['agents']);
      handleCloseModal();
      toast.success("Agent created successfully!");
    },
    onError: (error) => {
      console.error("Create Agent Error:", error);
      toast.error(error.response?.data?.message || "Failed to create agent");
    }
  });

  const handleCreateAgent = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ assistant_name: '', welcome_message: '', files: null });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: e.target.files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('assistant_name', formData.assistant_name);
    payload.append('welcome_message', formData.welcome_message);
    
    if (formData.files) {
      for (let i = 0; i < formData.files.length; i++) {
        payload.append('file', formData.files[i]);
      }
    }
    
    createMutation.mutate(payload);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <Breadcrumb text="Manage your AI agents here" />
        <button 
          onClick={handleCreateAgent}
          className="flex items-center gap-2 bg-[#184a36] hover:bg-[#184a36]/90 text-white px-5 py-2.5 rounded-[10px] text-sm font-medium transition-colors shadow-md whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Create Agent
        </button>
      </div>

      <div className="bg-[#ffffff] border border-[#e6e4df] rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[#9fa5ac]">Loading agents...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Failed to load agents: {error.message || 'Unknown error'}</div>
        ) : agents.length === 0 ? (
          <div className="p-8 text-center text-[#9fa5ac]">No agents found. Click "Create Agent" to add one.</div>
        ) : (
          <Table 
            TableHeads={columns} 
            TableRows={agents} 
            headClass=" border-b border-[#e6e4df] text-[#0e1217] whitespace-nowrap"
            tableClass="border-none"
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-[#0e1217]">
          <div className="bg-[#ffffff] border border-[#e6e4df] rounded-[20px] w-full max-w-[400px] overflow-hidden relative shadow-2xl p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-[#0e1217] mb-2">Delete Agent</h3>
            <p className="text-[#9fa5ac] text-sm mb-6">
              Are you sure you want to delete this agent? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setAgentToDelete(null);
                }}
                disabled={deleteMutation.isLoading}
                className="px-5 py-2.5 rounded-[10px] text-[14px] font-medium text-[#0e1217] bg-[#fbfaf6] border border-[#e6e4df] hover:bg-[#edebe5] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={deleteMutation.isLoading}
                className="px-5 py-2.5 rounded-[10px] text-[14px] font-medium text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleteMutation.isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-[#0e1217]">
           <div className="bg-[#ffffff] border border-[#e6e4df] rounded-[20px] w-full max-w-[500px] overflow-hidden relative shadow-2xl">
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#e6e4df] flex justify-between items-center bg-[#fbfaf6]">
                <h2 className="text-[17px] font-medium text-[#0e1217]">
                  Create New Agent
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-[#9fa5ac] hover:text-[#0e1217] transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-5">
                  {/* Assistant Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#0e1217] mb-2">
                      Assistant Name
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. My Pizza Agent 002"
                      value={formData.assistant_name}
                      onChange={(e) => setFormData({...formData, assistant_name: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#e6e4df] bg-[#fbfaf6] focus:outline-none focus:border-[#205943] focus:ring-1 focus:ring-[#205943] transition-all text-[14px]"
                    />
                  </div>

                  {/* Welcome Message */}
                  <div>
                    <label className="block text-sm font-medium text-[#0e1217] mb-2">
                      Welcome Message
                    </label>
                    <textarea 
                      required
                      placeholder="e.g. Welcome to Pizzeria! How can I help you today?"
                      value={formData.welcome_message}
                      onChange={(e) => setFormData({...formData, welcome_message: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-[10px] border border-[#e6e4df] bg-[#fbfaf6] focus:outline-none focus:border-[#205943] focus:ring-1 focus:ring-[#205943] transition-all text-[14px] min-h-[100px] resize-y"
                    />
                  </div>

                  {/* Multiple File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-[#0e1217] mb-2">
                      Training Files
                    </label>
                    <div className="relative">
                      <input 
                        type="file" 
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label 
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-dashed border-[#e6e4df] rounded-xl appearance-none cursor-pointer hover:border-[#205943] hover:bg-[#fbfaf6] focus:outline-none"
                      >
                        <span className="flex items-center space-x-2 text-[#9fa5ac]">
                          <Upload className="w-5 h-5" />
                          <span className="font-medium text-[14px]">
                            {formData.files && formData.files.length > 0 
                              ? `${formData.files.length} file(s) selected` 
                              : 'Click to select multiple files'
                            }
                          </span>
                        </span>
                      </label>
                      {formData.files && formData.files.length > 0 && (
                        <div className="mt-3 text-xs text-[#9fa5ac]">
                          {Array.from(formData.files).map(f => f.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-5 border-t border-[#e6e4df] flex justify-end gap-3 bg-[#fbfaf6]">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 rounded-[10px] text-[14px] font-medium text-[#0e1217] border border-transparent hover:bg-[#e6e4df] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={createMutation.isLoading}
                    className="px-5 py-2.5 rounded-[10px] text-[14px] font-medium text-white bg-[#205943] hover:bg-[#184a36] shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {createMutation.isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                    {createMutation.isLoading ? "Creating..." : "Create Agent"}
                  </button>
                </div>
              </form>

           </div>
        </div>
      )}

    </div>
  )
}

export default AgentManagement
