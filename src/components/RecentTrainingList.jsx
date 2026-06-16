import React, { useState } from 'react'
import { FileText, MoreVertical, ChevronRight } from 'lucide-react'

const RecentTrainingList = () => {
  const [showAll, setShowAll] = useState(false)

  // Mock data
  const trainings = [
    { id: 1, title: 'Customer Support Doc File', type: 'File', filesCount: 2, status: 'Completed', date: 'Today' },
    { id: 2, title: 'Customer Support Doc File', type: 'File', filesCount: 2, status: 'Completed', date: 'Today' },
    { id: 3, title: 'Customer Support Doc File', type: 'File', filesCount: 2, status: 'Completed', date: 'Today' },
    { id: 4, title: 'Customer Support Doc File', type: 'File', filesCount: 2, status: 'Completed', date: 'Today' },
    { id: 5, title: 'Customer Support Doc File', type: 'File', filesCount: 2, status: 'Completed', date: 'Today' },
    { id: 6, title: 'Product Manuals', type: 'File', filesCount: 5, status: 'Completed', date: 'Yesterday' },
    { id: 7, title: 'Company Policies', type: 'File', filesCount: 1, status: 'Completed', date: 'Yesterday' },
    { id: 8, title: 'API Documentation', type: 'File', filesCount: 3, status: 'Completed', date: 'May 01' },
  ]

  const displayTrainings = showAll ? trainings : trainings.slice(0, 5)

  return (
    <div className="mt-8 bg-[#191919] p-6 rounded-xl border border-white/5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Recent Training</h2>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-[#0F42FF] hover:text-blue-400 text-sm font-medium flex items-center transition-colors"
        >
          {showAll ? 'Show less' : 'View all'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="flex flex-col space-y-3">
        {displayTrainings.map((training) => (
          <div 
            key={training.id} 
            className="bg-[#0E0E10] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-white/5 gap-4 sm:gap-0"
          >
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="w-12 h-12 bg-[#252525] rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-medium text-base mb-1 truncate">{training.title}</h3>
                <p className="text-gray-400 text-sm">
                  {training.type} <span className="mx-1">•</span> {training.filesCount} files
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8 pt-2 sm:pt-0 border-t border-white/5 sm:border-0">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 shrink-0"></div>
                <span className="text-white text-sm font-medium">{training.status}</span>
              </div>
              <div className="text-gray-400 text-sm sm:w-16 text-center sm:text-left">
                {training.date}
              </div>
              <button className="text-gray-400 hover:text-white transition-colors shrink-0">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTrainingList
