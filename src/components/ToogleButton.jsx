"use client";
import React from "react";

export default function ToggleButton({ isAnnual, setIsAnnual }) {
  return (
    <div className="flex items-center justify-center gap-3 ">
      {/* Monthly Label */}
      <span
        className={` text-2xl ${
          !isAnnual ? "text-[#0e1217]" : "text-[#9fa5ac]"
        }`}
      >
        Monthly
      </span>

      {/* Toggle Switch */}
      <button
        onClick={() => setIsAnnual(!isAnnual)}
        className={`relative w-13 h-7 flex items-center rounded-full transition-colors duration-300 cursor-pointer ${
          isAnnual ? "bg-[#205943]" : "bg-[#D1D5DC]"
        }`}
      >
        <span
          className={`absolute w-5 h-5 rounded-full transition-transform duration-300 ${
            isAnnual ? "md:translate-x-7 translate-x-7 bg-[#ffffff]" : "md:translate-x-1 translate-x-1 bg-[#ffffff]"
          }`}
        ></span>
      </button>

      {/* Yearly Label */}
      <span
        className={`text-2xl ${
          isAnnual ? "text-[#0e1217]" : "text-[#9fa5ac]"
        }`}
      >
        Yearly
      </span>
    </div>
  );
}