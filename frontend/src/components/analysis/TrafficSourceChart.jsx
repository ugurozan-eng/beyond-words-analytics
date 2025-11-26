import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

const TrafficSourceChart = ({ data }) => {
    if (!data || !data.sources || data.sources.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg mt-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-blue-500" /> Trafik İstihbaratı (30 Günlük)
                    </h3>
                    {data.insight && (
                        <p className="text-sm text-gray-500 mt-1">{data.insight}</p>
                    )}
                </div>
                <div className="bg-blue-50 px-3 py-1 rounded-lg">
                    <span className="text-xs text-blue-600 font-bold uppercase">Toplam</span>
                    <div className="text-lg font-black text-blue-700">{data.total_visits}</div>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.sources} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={100}
                            tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: '#f9fafb' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                            {data.sources.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TrafficSourceChart;
