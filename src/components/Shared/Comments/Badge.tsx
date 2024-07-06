import React from "react";

const Badge: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div className="group relative flex items-center">
    <img
      alt="badge"
      width={16}
      src={icon}
      className="object-contain pointer-events-none select-none"
      draggable="false"
    />
    <div className="opacity-0 transition-opacity duration-300 absolute text-xs bg-gray-800 text-white p-1 rounded-md -mt-6 -ml-4">
      {label}
    </div>
  </div>
);

export default Badge;
