import React, { useState } from 'react'
import InputField from '../../../components/Inputfield'

const BusinessInfo = () => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-semibold text-[#0e1217] mb-1">Business Info</h2>
      <p className="text-sm text-[#9fa5ac] mb-8">Update your business details and company information.</p>

      <div className="bg-[#ffffff] p-6 rounded-xl border border-[#cccccc] mb-8">
        <div className="flex flex-col gap-6 mb-8">
          <InputField 
            label="Business Name"
            placeholder="Al Support"
            readOnly={!isEditing}
            labelClass="!text-sm !font-medium !text-[#0e1217]"
            inputClass={`!bg-[#ffffff] !border-[#cccccc] !rounded-full !px-5 !py-3.5 !text-sm ${!isEditing ? '!text-[#9fa5ac] cursor-default' : '!text-[#0e1217]'} placeholder:!text-[#9fa5ac] focus:!outline-none focus:!border-blue-500/50`}
          />
          <InputField 
            label="Business Address"
            type="text"
            placeholder="Unknow"
            readOnly={!isEditing}
            labelClass="!text-sm !font-medium !text-[#0e1217]"
            inputClass={`!bg-[#ffffff] !border-[#cccccc] !rounded-full !px-5 !py-3.5 !text-sm ${!isEditing ? '!text-[#9fa5ac] cursor-default' : '!text-[#0e1217]'} placeholder:!text-[#9fa5ac] focus:!outline-none focus:!border-blue-500/50`}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-10 py-2.5 rounded-full border border-[#419977] bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-sm text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all"
            >
              Edit
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-8 py-2.5 rounded-full border border-[#e6e4df] text-sm font-medium text-[#0e1217] hover:bg-[#ffffff]/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-8 py-2.5 rounded-full border border-[#419977] bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] text-sm text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BusinessInfo
