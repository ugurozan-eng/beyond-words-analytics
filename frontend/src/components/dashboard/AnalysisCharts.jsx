import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalysisCharts = ({ listings }) => {
    const { t } = useTranslation();
    const [rightChartType, setRightChartType] = useState('price');
    if (listings.length === 0) return null;

    const lqsData = [
        { name: t('analysis_charts.excellent'), value: listings.filter(i => i.is_analyzed && i.lqs_score >= 8).length, color: '#10B981' },
        { name: t('analysis_charts.good'), value: listings.filter(i => i.is_analyzed && i.lqs_score >= 5 && i.lqs_score < 8).length, color: '#F59E0B' },
        { name: t('analysis_charts.needs_improvement'), value: listings.filter(i => i.is_analyzed && i.lqs_score < 5).length, color: '#EF4444' }
    ].filter(i => i.value > 0);

    let rightChartData = [];
    if (rightChartType === 'price') {
        rightChartData = listings.map(i => ({ name: i.title.substring(0, 10) + "...", value: i.price })).slice(0, 10);
    } else {
        const counts = {};
        listings.forEach(item => {
            if (item.suggested_materials) {
                item.suggested_materials.split(',').forEach(m => {
                    const key = m.trim();
                    if (key) counts[key] = (counts[key] || 0) + 1;
                });
            }
        });
        rightChartData = Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 mb-16 animate-fade-in">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center"><PieIcon className="w-6 h-6 mr-3 text-indigo-500" /> {t('analysis_charts.lqs_distribution')}</h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={lqsData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" label>
                                {lqsData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center"><BarChart2 className="w-6 h-6 mr-3 text-indigo-500" /> {rightChartType === 'price' ? t('analysis_charts.price_analysis') : t('analysis_charts.material_distribution')}</h3>
                    <div className="flex bg-gray-100 p-1.5 rounded-xl">
                        <button onClick={() => setRightChartType('price')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${rightChartType === 'price' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{t('analysis_charts.price')}</button>
                        <button onClick={() => setRightChartType('materials')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${rightChartType === 'materials' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{t('analysis_charts.material')}</button>
                    </div>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={rightChartData} layout={rightChartType === 'materials' ? 'vertical' : 'horizontal'}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            {rightChartType === 'materials' ? (
                                <><XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} /><YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} /></>
                            ) : (
                                <><XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} interval={0} axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /></>
                            )}
                            <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 6, 6]} barSize={32} name={rightChartType === 'price' ? t('analysis_charts.price_label') : t('analysis_charts.count_label')} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalysisCharts;
