import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SeasonalityChart = ({ dataString }) => {
    let data = [];
    try {
        const parsed = JSON.parse(dataString || "[]");
        if (parsed.length === 12) {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            data = parsed.map((val, i) => ({ name: months[i], value: val }));
        }
    } catch { }

    if (data.length === 0) return <div className="text-xs text-gray-400 italic p-4 text-center">Grafik verisi yok</div>;

    return (
        <div className="h-40 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <Tooltip
                        cursor={{ fill: '#f0f9ff' }}
                        contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            fontSize: '12px'
                        }}
                    />
                    <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                    <XAxis dataKey="name" hide />
                </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 px-2 font-medium uppercase tracking-wider">
                <span>Ocak</span><span>Haziran</span><span>Aralık</span>
            </div>
        </div>
    );
};

export default SeasonalityChart;
