import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const Settings = () => {
  const [logoPreview, setLogoPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLogoPreview(imageUrl);
    }
  };

  return (
    <div>
      <div className="bg-[#191919] rounded-2xl p-6 border border-gray-800/50">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] flex items-center justify-center">
            <Icon icon="lucide:palette" className="text-[#A855F7] text-xl" />
          </div>
          <h2 className="text-white text-[17px] font-medium">Platform Branding</h2>
        </div>

        {/* Logo Upload Section */}
        <div>
          <label className="block text-[13px] text-[#FFFFFF] mb-3">
            Platform Logo
          </label>
          
          <label className="w-25 h-25 rounded-xl border border-gray-600 bg-[#151515] flex items-center justify-center cursor-pointer hover:bg-gray-800/50 transition-colors overflow-hidden relative group">
            {logoPreview ? (
              <>
                <img src={logoPreview} alt="Platform Logo" className="w-full h-full object-cover" />
                {/* Optional hover overlay to indicate it can be changed again */}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                  <Icon icon="lucide:pencil" className="text-white text-lg" />
                </div>
              </>
            ) : (
              <span className="text-[13px] text-gray-500 font-medium">Logo</span>
            )}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange}
            />
          </label>
        </div>

      </div>
    </div>
  );
}

export default Settings;