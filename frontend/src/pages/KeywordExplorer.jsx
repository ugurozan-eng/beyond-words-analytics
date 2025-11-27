import React, { useState } from 'react';
import { Search, TrendingUp, Copy, Check, AlertCircle, Loader2, ArrowUpRight, ArrowDownRight, List, Zap, BarChart3 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

import KeywordComparisonModal from '../components/modals/KeywordComparisonModal';

const KeywordExplorer = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copiedField, setCopiedField] = useState(null);
    const [viewMode, setViewMode] = useState('table');
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

    const handleSearch = async (e, searchQuery = null) => {
        if (e) e.preventDefault();
        const term = searchQuery || query;
        if (!term.trim()) return;

        if (searchQuery) setQuery(searchQuery);

        setLoading(true);
        setError(null);
        setResults(null);
        setSelectedKeywords([]); // Reset selection on new search

        try {
            const response = await fetch(`http://localhost:8000/api/v1/keywords/explore?query=${encodeURIComponent(term)}`);
            if (!response.ok) throw new Error('Arama sırasında bir hata oluştu.');

            const data = await response.json();
            setResults(data.results);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedField(id);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const toggleKeywordSelection = (keyword) => {
        if (selectedKeywords.find(k => k.term === keyword.term)) {
            setSelectedKeywords(prev => prev.filter(k => k.term !== keyword.term));
        } else {
            if (selectedKeywords.length >= 4) {
                alert("En fazla 4 kelime kıyaslanabilir.");
                return;
            }
            setSelectedKeywords(prev => [...prev, keyword]);
        }
    };

    const getCompetitionBadge = (level) => {
        switch (level) {
            case 'High':
                return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold border border-red-200">High</span>;
            case 'Medium':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold border border-yellow-200">Medium</span>;
            case 'Low':
                return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold border border-emerald-200">Low</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-bold">Unknown</span>;
        }
    };

    const getTrendBadge = (trend) => {
        const isPositive = trend.includes('+');
        return (
            <div className={`flex items-center font-bold text-sm ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {trend}
            </div>
        );
    };

    const generateSeasonalityData = (term) => {
        const lowerTerm = term.toLowerCase();
        let data = [];

        if (lowerTerm.includes('planner') || lowerTerm.includes('journal') || lowerTerm.includes('new year')) {
            // Peak in Jan (0) and Sep (8)
            data = [100, 80, 60, 50, 40, 40, 50, 70, 90, 60, 50, 80];
        } else if (lowerTerm.includes('christmas') || lowerTerm.includes('holiday')) {
            // Peak in Nov (10) and Dec (11)
            data = [20, 20, 20, 20, 30, 30, 40, 50, 60, 80, 100, 90];
        } else {
            // Relatively flat / random
            data = [40, 45, 42, 48, 50, 47, 45, 43, 46, 49, 52, 48];
        }

        return data.map((val, i) => ({ name: i, value: val }));
    };

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">

            {/* HERO SECTION */}
            <div className="text-center py-12 mb-8">
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                    Cyclear ile <span className="text-indigo-600">Kârlı Kelimeleri</span> Keşfet
                </h1>
                <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
                    Etsy'de en çok aranan anahtar kelimeleri bulun, rekabeti analiz edin ve satışlarınızı artırın.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto relative mb-8">
                    <form onSubmit={handleSearch} className="relative flex items-center shadow-xl rounded-2xl">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-indigo-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-14 pr-32 py-5 bg-white border-2 border-transparent focus:border-indigo-500 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-lg font-medium transition-all"
                            placeholder="Bir anahtar kelime girin..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02]"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Keşfet'}
                        </button>
                    </form>
                </div>

                {/* Compare Button */}
                {selectedKeywords.length >= 2 && (
                    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
                        <button
                            onClick={() => setIsCompareModalOpen(true)}
                            className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform flex items-center space-x-2 border border-gray-700"
                        >
                            <BarChart3 className="w-5 h-5 text-indigo-400" />
                            <span>{selectedKeywords.length} Kelimeyi Kıyasla</span>
                        </button>
                    </div>
                )}

                {/* Popular Searches (Empty State) */}
                {!results && !loading && (
                    <div className="animate-fade-in">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Popüler Aramalar</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {['Digital Planner', 'Wedding Invitation', 'Wall Art', 'Personalized Gift'].map((term) => (
                                <button
                                    key={term}
                                    onClick={(e) => handleSearch(e, term)}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-600 font-medium hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Results Header & View Toggle */}
            {results && (
                <div className="flex items-center justify-between mb-6 animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
                        Sonuçlar ({results.length})
                    </h2>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-lg transition-all flex items-center space-x-2 ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <List className="w-4 h-4" />
                            <span>Liste</span>
                        </button>
                        <button
                            onClick={() => setViewMode('storm')}
                            className={`p-2 rounded-lg transition-all flex items-center space-x-2 ${viewMode === 'storm' ? 'bg-indigo-600 text-white shadow-md font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Zap className="w-4 h-4" />
                            <span>Fırtına</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Results Content */}
            {results && (
                <>
                    {viewMode === 'table' ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in-up">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[800px]">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="w-12 px-6 py-4">
                                                <span className="sr-only">Seç</span>
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Anahtar Kelime</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Aranma Hacmi</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rekabet</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trend</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mevsimsellik (12 Ay)</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {results.map((item, index) => {
                                            const isSelected = selectedKeywords.find(k => k.term === item.term);
                                            return (
                                                <tr key={index} className={`hover:bg-gray-50/50 transition-colors group ${isSelected ? 'bg-indigo-50/30' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <div
                                                            onClick={() => toggleKeywordSelection(item)}
                                                            className={`w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 hover:border-indigo-400'}`}
                                                        >
                                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-gray-800 text-lg">{item.term}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center text-gray-600 font-medium">
                                                            <TrendingUp className="w-4 h-4 mr-2 text-indigo-400" />
                                                            {item.volume.toLocaleString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getCompetitionBadge(item.competition)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getTrendBadge(item.trend)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="h-10 w-24">
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                <AreaChart data={generateSeasonalityData(item.term)}>
                                                                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} strokeWidth={2} />
                                                                </AreaChart>
                                                            </ResponsiveContainer>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => copyToClipboard(item.term, `term-${index}`)}
                                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                            title="Kopyala"
                                                        >
                                                            {copiedField === `term-${index}` ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        /* STORM MODE VIEW */
                        <div className="bg-slate-900 rounded-3xl p-10 min-h-[600px] relative overflow-hidden flex flex-wrap content-center justify-center gap-6 shadow-2xl border border-slate-800 animate-fade-in">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none"></div>

                            {results.map((item, index) => {
                                const isSelected = selectedKeywords.find(k => k.term === item.term);
                                // Calculate Size
                                let sizeClass = 'w-24 h-24 text-xs';
                                if (item.volume > 10000) sizeClass = 'w-48 h-48 text-xl';
                                else if (item.volume > 5000) sizeClass = 'w-36 h-36 text-base';
                                else if (item.volume > 1000) sizeClass = 'w-28 h-28 text-sm';

                                // Calculate Color
                                let colorClass = 'bg-gray-500';
                                if (item.competition === 'High') colorClass = 'bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/40';
                                else if (item.competition === 'Medium') colorClass = 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/40';
                                else if (item.competition === 'Low') colorClass = 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-emerald-500/40';

                                return (
                                    <div
                                        key={index}
                                        className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center text-center p-4 font-black text-white shadow-xl cursor-pointer transform transition-all duration-500 hover:scale-110 hover:z-50 relative group select-none hover:shadow-2xl border-2 ${isSelected ? 'border-white ring-4 ring-indigo-500 scale-110' : 'border-white/10'} backdrop-blur-sm`}
                                        style={{
                                            animation: isSelected ? 'none' : `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                                            animationDelay: `${Math.random() * 2}s`
                                        }}
                                    >
                                        <span className="drop-shadow-md line-clamp-3 pointer-events-none">{item.term}</span>

                                        {/* Selection Checkbox (Top Right) */}
                                        <div
                                            onClick={(e) => { e.stopPropagation(); toggleKeywordSelection(item); }}
                                            className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all z-20 hover:scale-110 ${isSelected ? 'bg-white border-white text-indigo-600' : 'bg-black/20 border-white/50 text-transparent hover:bg-black/40'}`}
                                        >
                                            <Check className="w-3 h-3" />
                                        </div>

                                        {/* Copy Button (Bottom Center - visible on hover) */}
                                        <div
                                            onClick={(e) => { e.stopPropagation(); copyToClipboard(item.term, `storm-${index}`); }}
                                            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Kopyala"
                                        >
                                            {copiedField === `storm-${index}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        </div>

                                        {/* Tooltip */}
                                        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-xl text-gray-800 p-4 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 w-56 pointer-events-none z-50 text-xs text-left border border-white/20 scale-90 group-hover:scale-100 origin-bottom">
                                            <div className="font-black text-base mb-2 text-gray-900 border-b border-gray-100 pb-2">{item.term}</div>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 font-medium">Hacim</span>
                                                    <span className="font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">{item.volume.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 font-medium">Rekabet</span>
                                                    <span className={`font-bold px-2 py-0.5 rounded ${item.competition === 'High' ? 'bg-red-50 text-red-700' : item.competition === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{item.competition}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 font-medium">Trend</span>
                                                    <span className="font-bold text-gray-700">{item.trend}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* CSS for Float Animation */}
                            <style>{`
                                @keyframes float {
                                    0% { transform: translateY(0px); }
                                    50% { transform: translateY(-10px); }
                                    100% { transform: translateY(0px); }
                                }
                            `}</style>
                        </div>
                    )}
                </>
            )}

            {/* Comparison Modal */}
            <KeywordComparisonModal
                isOpen={isCompareModalOpen}
                onClose={() => setIsCompareModalOpen(false)}
                selectedKeywords={selectedKeywords}
            />
        </div>
    );
};

export default KeywordExplorer;
