import React from 'react';

const MiniStatCard = ({ title, value, icon: Icon, color }) => {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                    <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
                    <h3 className="text-xl font-black text-gray-900">{value}</h3>
                </div>
            </div>
        </div>
    );
};

export default MiniStatCard;
