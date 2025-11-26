import React from 'react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg flex items-center space-x-5 transition-all hover:scale-105 hover:shadow-xl group">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
            <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">{title}</p>
            <p className="text-3xl font-extrabold text-gray-800 tracking-tight">{value}</p>
        </div>
    </div>
);

export default StatCard;
