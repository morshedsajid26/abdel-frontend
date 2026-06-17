import React, { useState } from 'react'
import { FileText, X, Bot, User, Download, PlayCircle } from 'lucide-react'
import { jsPDF } from "jspdf"
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../hooks/useAxiosSecure'

import Table from '../../components/Table'
import Breadcrumb from '../../components/Breadcrumb'
import Dropdown from '../../components/Dropdown'

const CallSummary = () => {
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });
  const axiosSecure = useAxiosSecure();

  const { data: responseData, isLoading, error } = useQuery({
    queryKey: ['callHistory'],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get('/business-owner/call-history');
        console.log("Call History API Response:", res.data);
        return res.data;
      } catch (err) {
        console.error("Call History API Error:", err);
        throw err;
      }
    }
  });

  const calls = responseData?.data || [];

  const handleActionSelect = (option, row) => {
    // option will be "Audio" or "Call Transcript"
    setModalState({ isOpen: true, type: option, data: row });
  };

  const columns = [
    { key: 'agentName', Title: 'Agent Name', width: '20%' },
    { key: 'startedAt', Title: 'Started At', width: '20%' },
    { key: 'status', Title: 'Status', width: '15%' },
    { key: 'duration', Title: 'Duration', width: '15%' },
    { key: 'cost', Title: 'Cost', width: '10%' },
    { 
      key: 'action', 
      Title: 'Action', 
      width: '20%',
      sortable: false,
      render: (row) => ( 
        <div className="relative w-[180px]">
          {/* Custom icon positioning over the dropdown */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <PlayCircle className="w-4 h-4 text-[#0e1217]" />
          </div>
          <Dropdown
            placeholder="Options"
            options={["Audio", "Call Transcript"]}
            onSelect={(val) => handleActionSelect(val, row)}
            inputClass="!bg-[#edebe5] !placeholder-[#9fa5ac] !border-none !text-[#0e1217] !rounded-[8px] !py-2.5 !pl-11 !pr-10 !font-medium !text-[13px] !shadow-none !cursor-pointer hover:!bg-[#e6e4df] transition-colors"
            optionClass="!bg-[#edebe5] !text-[#0e1217] !border border-[#e6e4df] !rounded-[8px] !shadow-xl !mt-1.5"
            icon="!text-white !right-3"
          />
        </div>
      )
    }
  ]

  return (
    <div >
      <Breadcrumb text="You can see your AI call summary" />

      {/* Removed redundant overflow-x-auto, passing wrapperClass to Table to fix dropdown clipping scrollbar */}
      <div className="bg-[#ffffff] border border-[#e6e4df] rounded-2xl shadow-sm overflow-visible">
        {isLoading ? (
          <div className="p-8 text-center text-[#9fa5ac]">Loading call history...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Failed to load call history: {error.message || 'Unknown error'}</div>
        ) : calls.length === 0 ? (
          <div className="p-8 text-center text-[#9fa5ac]">No call history found.</div>
        ) : (
          <Table 
            TableHeads={columns} 
            TableRows={calls} 
            headClass=" border-b border-[#e6e4df] text-[#0e1217] whitespace-nowrap"
            tableClass="border-none"
            wrapperClass="min-h-[150px] !overflow-visible"
          />
        )}
      </div>

      {/* Dynamic Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-[#0e1217]">
           <div className={`bg-[#ffffff] border border-[#e6e4df] rounded-[20px] w-full relative shadow-2xl flex flex-col ${modalState.type === 'Call Transcript' ? 'max-w-[550px]' : 'max-w-[500px]'}`}>
              
              {/* Header */}
              <div className="px-8 py-6 border-b border-[#e6e4df] flex justify-between items-center">
                <h2 className="text-[17px] font-medium text-[#0e1217]">
                  {modalState.type} - {modalState.data?.agentName}
                </h2>
                <button 
                  onClick={() => setModalState({ isOpen: false, type: null, data: null })}
                  className="text-[#9fa5ac] hover:text-[#0e1217] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Call Transcript Content */}
              {modalState.type === 'Call Transcript' && (
                <div className="p-8 max-h-[500px] overflow-y-auto hide-scrollbar space-y-6">
                  {/* Audio Player in Transcript */}
                  {modalState.data?.recordingUrl && (
                    <div className="mb-6 w-full">
                      <p className="text-sm font-medium mb-2 text-[#0e1217]">Call Recording</p>
                      <audio controls className="w-full h-10 outline-none">
                        <source src={modalState.data.recordingUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium mb-4 text-[#0e1217]">Transcript</p>
                    {modalState.data?.transcript ? (
                       <div className="bg-[#f6f3eb] text-[#0e1217] p-5 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap">
                         {modalState.data.transcript}
                       </div>
                    ) : (
                       <p className="text-[#9fa5ac] italic text-sm">No transcript available for this call.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Audio Content */}
              {modalState.type === 'Audio' && (
                <div className="flex flex-col">
                  <div className="p-8">
                    {modalState.data?.recordingUrl ? (
                      <div className="w-full text-center">
                        <PlayCircle className="w-12 h-12 text-[#205943] mx-auto mb-4" />
                        <p className="text-sm font-medium mb-6 text-[#0e1217]">Listen to the call recording below</p>
                        <audio controls className="w-full outline-none" autoPlay>
                          <source src={modalState.data.recordingUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    ) : (
                      <p className="text-[#9fa5ac] italic text-center">No audio recording available for this call.</p>
                    )}
                  </div>
                </div>
              )}

           </div>
        </div>
      )}

    </div>
  )
}

export default CallSummary
