import React from "react";

export default function Spinner() {
  return (
    <div className="flex flex-col justify-center items-center h-64 space-y-3">
      <div className="relative">
        {/* Outer Ring */}
        <div className="h-14 w-14 rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>

        {/* Inner Glow Circle */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-blue-500/10 to-blue-300/20 blur-sm"></div>

        {/* Inner Dot */}
        <div className="absolute inset-3 rounded-full bg-blue-100"></div>
      </div>

      <p className="text-sm text-gray-600 font-medium tracking-wide animate-pulse">
        Loading, please wait...
      </p>
    </div>
  );
}
