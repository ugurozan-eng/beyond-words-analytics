import React from 'react';

const AttributeBadge = ({ label, value, colorClass }) => {
    if (!value) return null;
    return (
        <div className="flex flex-col bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</span>
            <span className={`text-sm font-bold ${colorClass}`}>{value}</span>
        </div>
    );
};

export default AttributeBadge;
