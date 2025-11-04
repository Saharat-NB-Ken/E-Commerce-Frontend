import React from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
}

export default function Card({ title, value, icon, subtitle }: CardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-green-100 rounded-lg text-green-800">
          {icon}
        </div>
        <div className="text-green-600 text-sm"></div>
      </div>
      <h3 className="text-gray-600 font-medium text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}
