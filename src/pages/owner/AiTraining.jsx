import Breadcrumb from "@/components/Breadcrumb";
import React, { useState } from "react";
import UploadPdf from "@/components/UploadPdf";
import UploadExcel from "@/components/UploadExcel";
import RecentTrainingList from "@/components/RecentTrainingList";

const AiTraining = () => {
  const [activeTab, setActiveTab] = useState("pdf");

  return (
    <div>
      <Breadcrumb
        text={`Train your AI assistant with voice and text to enhance its capabilities`}
      />

      <div className="mt-6">
        {/* Navigation Bar */}
        <div className="flex border-b border-white/10 mb-6">
          <button
            onClick={() => setActiveTab("pdf")}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "pdf"
                ? "text-white border-b-2 border-blue-600"
                : "text-gray-400 border-b-2 border-transparent "
            }`}
          >
            Upload file
          </button>
          <button
            onClick={() => setActiveTab("excel")}
            className={`px-4 py-2 text-sm font-medium transition-all ml-4 ${
              activeTab === "excel"
                ? "text-white border-b-2 border-blue-600"
                : "text-gray-400 border-b-2 border-transparent "
            }`}
          >
            Upload Product
          </button>
        </div>

        {/* Content Area */}
        <div>{activeTab === "pdf" ? <UploadPdf /> : <UploadExcel />}</div>

        {/* Recent Training List */}
        <RecentTrainingList />
      </div>
    </div>
  );
};

export default AiTraining;
