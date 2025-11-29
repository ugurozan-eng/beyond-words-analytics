import React from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const LQSChart = ({ listings }) => {
    const { t } = useTranslation();
    const analyzed = listings.filter(l => l.is_analyzed);

    const data = [
        { name: t('lqs_chart.excellent'), value: analyzed.filter(l => l.lqs_score >= 8).length, color: '#10b981' }, // Emerald-500
        { name: t('lqs_chart.good'), value: analyzed.filter(l => l.lqs_score >= 5 && l.lqs_score < 8).length, color: '#f59e0b' }, // Amber-500
        { name: t('lqs_chart.poor'), value: analyzed.filter(l => l.lqs_score < 5).length, color: '#ef4444' }, // Red-500
    ].filter(d => d.value > 0);

    if (analyzed.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl">📊</span>
                </div>
                <p className="text-gray-400 text-sm font-medium">{t('lqs_chart.no_data')}</p>
            </div>
        );
    }

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value, entry) => <span className="text-xs font-bold text-gray-600 ml-1">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LQSChart;
