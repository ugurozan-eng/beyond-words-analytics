import React, { useState } from 'react';
import { Search, TrendingUp, Copy, Check, AlertCircle, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KeywordExplorer = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    const handleSearch = async (e, searchQuery = null) => {
        if (e) e.preventDefault();
        const term = searchQuery || query;
        if (!term.trim()) return;

        if (searchQuery) setQuery(searchQuery);

        setLoading(true);
        setError(null);
        setResults(null);

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

            {/* Results Table */}
            {results && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in-up">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Anahtar Kelime</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Aranma Hacmi</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rekabet</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trend</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {results.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KeywordExplorer;
