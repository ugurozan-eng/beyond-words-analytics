import React from 'react';
import { X, TrendingUp, BarChart3, Calendar, Award } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const KeywordComparisonModal = ({ isOpen, onClose, selectedKeywords }) => {
    if (!isOpen || selectedKeywords.length < 2) return null;

    // Helper to find best values
    const maxVolume = Math.max(...selectedKeywords.map(k => k.volume));
    const minCompetition = selectedKeywords.reduce((min, k) => {
        const score = k.competition === 'Low' ? 1 : k.competition === 'Medium' ? 2 : 3;
        return score < min.score ? { score, val: k.competition } : min;
    }, { score: 4, val: '' }).val;

    const getCompetitionScore = (comp) => comp === 'Low' ? 1 : comp === 'Medium' ? 2 : 3;

    const generateSeasonalityData = (term) => {
        // Reusing the logic from KeywordExplorer for consistency, or ideally this should be passed in
        // For now, mocking similar logic for visualization
        const lowerTerm = term.toLowerCase();
        let data = [];
        if (lowerTerm.includes('planner') || lowerTerm.includes('journal') || lowerTerm.includes('new year')) {
            data = [100, 80, 60, 50, 40, 40, 50, 70, 90, 60, 50, 80];
        } else if (lowerTerm.includes('christmas') || lowerTerm.includes('holiday')) {
            data = [20, 20, 20, 20, 30, 30, 40, 50, 60, 80, 100, 90];
        } else {
            data = [40, 45, 42, 48, 50, 47, 45, 43, 46, 49, 52, 48];
        }
        return data.map((val, i) => ({ name: i, value: val }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Kelime Karşılaştırma</h2>
                            <p className="text-sm text-gray-500 font-medium">{selectedKeywords.length} kelime analiz ediliyor</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-auto p-8">
                    <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(200px,1fr))] gap-4">
                        {/* Header Row */}
                        <div className="font-bold text-gray-400 uppercase text-xs tracking-wider flex items-center">Metrikler</div>
                        {selectedKeywords.map((k, i) => (
                            <div key={i} className="font-black text-gray-800 text-lg text-center p-2 bg-gray-50 rounded-xl border border-gray-100">
                                {k.term}
                            </div>
                        ))}

                        {/* Volume Row */}
                        <div className="flex items-center font-bold text-gray-600 border-b border-gray-50 py-4">
                            <TrendingUp className="w-4 h-4 mr-2 text-indigo-500" /> Aranma Hacmi
                        </div>
                        {selectedKeywords.map((k, i) => (
                            <div key={i} className={`flex items-center justify-center py-4 border-b border-gray-50 font-bold text-lg ${k.volume === maxVolume ? 'text-emerald-600 bg-emerald-50/30 rounded-lg' : 'text-gray-600'}`}>
                                {k.volume.toLocaleString()}
                                {k.volume === maxVolume && <Award className="w-4 h-4 ml-2 text-emerald-500" />}
                            </div>
                        ))}

                        {/* Competition Row */}
                        <div className="flex items-center font-bold text-gray-600 border-b border-gray-50 py-4">
                            <Award className="w-4 h-4 mr-2 text-orange-500" /> Rekabet
                        </div>
                        {selectedKeywords.map((k, i) => (
                            <div key={i} className="flex items-center justify-center py-4 border-b border-gray-50">
                                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${k.competition === 'Low' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                        k.competition === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                            'bg-red-100 text-red-700 border-red-200'
                                    }`}>
                                    {k.competition}
                                </span>
                            </div>
                        ))}

                        {/* Trend Row */}
                        <div className="flex items-center font-bold text-gray-600 border-b border-gray-50 py-4">
                            <TrendingUp className="w-4 h-4 mr-2 text-blue-500" /> Trend
                        </div>
                        {selectedKeywords.map((k, i) => (
                            <div key={i} className={`flex items-center justify-center py-4 border-b border-gray-50 font-bold ${k.trend.includes('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                                {k.trend}
                            </div>
                        ))}

                        {/* Seasonality Chart Row */}
                        <div className="flex items-center font-bold text-gray-600 py-4">
                            <Calendar className="w-4 h-4 mr-2 text-violet-500" /> Mevsimsellik
                        </div>
                        {selectedKeywords.map((k, i) => (
                            <div key={i} className="h-32 py-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={generateSeasonalityData(k.term)}>
                                        <defs>
                                            <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="value" stroke="#6366f1" fill={`url(#grad-${i})`} strokeWidth={2} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                    <p className="text-gray-500 text-sm">
                        <span className="font-bold text-indigo-600">İpucu:</span> Yeşil ile vurgulanan değerler, seçilenler arasındaki en iyi performansı gösterir.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default KeywordComparisonModal;
