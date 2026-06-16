import React, { useState } from 'react'
import { FileText, X, Bot, User, Download } from 'lucide-react'
import { jsPDF } from "jspdf"


import Table from '../../components/Table'
import Breadcrumb from '../../components/Breadcrumb'
import Dropdown from '../../components/Dropdown'

const CallSummary = () => {
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });

  const handleActionSelect = (option, row) => {
    // option will be "Call Summary" or "Call Transcript"
    setModalState({ isOpen: true, type: option, data: row });
  };

  const columns = [
    { key: 'callerId', Title: 'Caller ID', width: '20%' },
    { key: 'callDuration', Title: 'Call Duration', width: '20%' },
    { key: 'time', Title: 'Time', width: '20%' },
    { key: 'date', Title: 'Date', width: '20%' },
    { 
      key: 'action', 
      Title: 'Summary', 
      width: '20%',
      sortable: false,
      render: (row) => ( 
        <div className="relative w-[180px]">
          {/* Custom icon positioning over the dropdown */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <FileText className="w-4 h-4 text-[#0e1217]" />
          </div>
          <Dropdown
            placeholder="Summary"
            options={["Call Summary", "Call Transcript"]}
            onSelect={(val) => handleActionSelect(val, row)}
            inputClass="!bg-[#edebe5] !placeholder-[#9fa5ac] !border-none !text-[#0e1217] !rounded-[8px] !py-2.5 !pl-11 !pr-10 !font-medium !text-[13px] !shadow-none !cursor-pointer hover:!bg-[#e6e4df] transition-colors"
            optionClass="!bg-[#edebe5] !text-[#0e1217] !border border-[#e6e4df] !rounded-[8px] !shadow-xl !mt-1.5"
            icon="!text-white !right-3"
          />
        </div>
      )
    }
  ]

  const calls = [
    { callerId: '20260223', callDuration: '5:48 minutes', time: '4:45 pm', date: '30/07/2025' },
    { callerId: '20260223', callDuration: '5:48 minutes', time: '4:45 pm', date: '30/07/2025' },
    { callerId: '20260223', callDuration: '5:48 minutes', time: '4:45 pm', date: '30/07/2025' },
    { callerId: '20260223', callDuration: '5:48 minutes', time: '4:45 pm', date: '30/07/2025' },
    { callerId: '20260223', callDuration: '5:48 minutes', time: '4:45 pm', date: '30/07/2025' },
    { callerId: '20260223', callDuration: '5:48 minutes', time: '4:45 pm', date: '30/07/2025' },
  ]

  return (
    <div >
      <Breadcrumb text="You can see your AI call summary" />

      <div className="bg-[#ffffff] border border-[#e6e4df] rounded-2xl shadow-sm overflow-x-auto">
        <Table 
          TableHeads={columns} 
          TableRows={calls} 
          headClass=" border-b border-[#e6e4df] text-[#0e1217] whitespace-nowrap"
          tableClass="border-none"
        />
      </div>

      {/* Dynamic Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-[#0e1217]">
           <div className={`bg-[#ffffff] border border-[#e6e4df] rounded-[20px] w-full relative shadow-2xl flex flex-col ${modalState.type === 'Call Transcript' ? 'max-w-[550px]' : 'max-w-[600px]'}`}>
              
              {/* Header */}
              <div className="px-8 py-6 border-b border-[#e6e4df] flex justify-between items-center">
                <h2 className="text-[17px] font-medium text-[#0e1217]">
                  {modalState.type}
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
                <div className="p-8 h-[400px] overflow-y-auto hide-scrollbar space-y-6">
                  {/* Bot Message */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#edebe5] flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="bg-[#f6f3eb] text-[#0e1217] px-5 py-3.5 rounded-2xl rounded-tl-sm text-[15px] max-w-[80%]">
                      Hello! How can I help you?
                    </div>
                  </div>

                  {/* User Message */}
                  <div className="flex items-start gap-4 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-[#edebe5] flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-blue-300" />
                    </div>
                    <div className="bg-[#f6f3eb] text-[#0e1217] px-5 py-3.5 rounded-2xl rounded-tr-sm text-[15px] max-w-[80%]">
                      I need some thing for your side
                    </div>
                  </div>

                  {/* Bot Message */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#edebe5] flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="bg-[#f6f3eb] text-[#0e1217] px-5 py-3.5 rounded-2xl rounded-tl-sm text-[15px] max-w-[80%]">
                      Hello! How can I help you?
                    </div>
                  </div>

                  {/* User Message */}
                  <div className="flex items-start gap-4 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-[#edebe5] flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-blue-300" />
                    </div>
                    <div className="bg-[#f6f3eb] text-[#0e1217] px-5 py-3.5 rounded-2xl rounded-tr-sm text-[15px] max-w-[80%]">
                      I need some thing for your side
                    </div>
                  </div>
                </div>
              )}

              {/* Call Summary Content */}
              {modalState.type === 'Call Summary' && (
                <div className="flex flex-col">
                  <div className="p-8">
                    <p className="text-[#9fa5ac] text-[15px] leading-[1.8]">
                      Today's call focused on introducing our AI-powered cold calling solution and understanding the client's current outreach process. We discussed their primary pain points, including low response rates and high time investment in manual dialing. The client expressed interest in automating their lead qualification process and improving conversion rates through personalized conversations. A live demo was scheduled for next week to showcase the platform's real-time voice capabilities, CRM integration, and analytics dashboard. The call concluded with the client requesting a pricing proposal and additional case studies for review before the demo.
                    </p>
                  </div>
                  
                  {/* Summary Footer with Download */}
                  <div className="border-t border-[#e6e4df] px-8 py-5 flex justify-end">
                    <button 
                      onClick={() => {
                        const doc = new jsPDF();
                        
                        // Title
                        doc.setFontSize(18);
                        doc.text("Call Summary", 20, 20);
                        
                        // Summary Text
                        doc.setFontSize(12);
                        const summaryText = "Today's call focused on introducing our AI-powered cold calling solution and understanding the client's current outreach process. We discussed their primary pain points, including low response rates and high time investment in manual dialing. The client expressed interest in automating their lead qualification process and improving conversion rates through personalized conversations. A live demo was scheduled for next week to showcase the platform's real-time voice capabilities, CRM integration, and analytics dashboard. The call concluded with the client requesting a pricing proposal and additional case studies for review before the demo.";
                        
                        // Split text to fit within page width (170 is approx width available)
                        const splitText = doc.splitTextToSize(summaryText, 170);
                        doc.text(splitText, 20, 35);
                        
                        // Save the PDF
                        doc.save(`call_summary_${modalState.data?.callerId || 'download'}.pdf`);
                      }}
                      className="flex items-center gap-2 bg-[#edebe5] hover:bg-[#e6e4df] transition-colors text-[#0e1217] px-6 py-2.5 rounded-[10px] text-[14px] font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
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
