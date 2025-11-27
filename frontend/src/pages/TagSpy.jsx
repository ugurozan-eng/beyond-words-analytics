import React, { useState } from 'react';
import { Search, Eye, Copy, Check, AlertCircle, Loader2, BarChart2, Tag } from 'lucide-react';

const TagSpy = () => {
    const [url, setUrl] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!url.trim()) return;

        setLoading(true);
        setError(null);
        setResults(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
            const response = await fetch('http://localhost:8000/api/v1/spy/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error('Analiz sırasında bir hata oluştu.');

            const data = await response.json();
            setResults(data);
        } catch (err) {
            if (err.name === 'AbortError') {
                setError('Sunucu yanıt vermedi (Zaman aşımı). Lütfen backend sunucusunun çalıştığından emin olun.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedField(id);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const copyAllTags = () => {
        if (!results) return;
        const allTags = results.top_tags.map(t => t.tag).join(', ');
        copyToClipboard(allTags, 'all-tags');
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

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">

            {/* HERO SECTION */}
            <div className="text-center py-12 mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
                    <Eye className="w-8 h-8 text-indigo-600" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                    Rakip <span className="text-indigo-600">Etiket Casusu</span>
                </h1>
                <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
                    Rakibinizin mağaza linkini yapıştırın, en çok kullandığı ve kazandıran etiketleri anında keşfedin.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto relative mb-8">
                    <form onSubmit={handleAnalyze} className="relative flex items-center shadow-xl rounded-2xl">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-indigo-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-14 pr-40 py-5 bg-white border-2 border-transparent focus:border-indigo-500 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-lg font-medium transition-all"
                            placeholder="https://etsy.com/shop/RakipMagaza"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading || !url.trim()}
                            className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02]"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Eye className="w-5 h-5 mr-2" />}
                            {loading ? 'Analiz...' : 'Casusluk Yap'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Results Section */}
            {results && (
                <div className="animate-fade-in-up space-y-6">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center">
                            <div className="p-3 bg-indigo-50 rounded-xl mr-4">
                                <BarChart2 className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase">Analiz Edilen Ürün</p>
                                <h3 className="text-2xl font-black text-gray-900">{results.analyzed_product_count}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center">
                            <div className="p-3 bg-purple-50 rounded-xl mr-4">
                                <Tag className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase">Bulunan Etiket</p>
                                <h3 className="text-2xl font-black text-gray-900">{results.top_tags.length}</h3>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-lg text-white flex items-center justify-between">
                            <div>
                                <p className="text-indigo-100 font-bold text-sm mb-1">Tüm Etiketleri Al</p>
                                <p className="text-xs text-indigo-200">Virgülle ayrılmış liste</p>
                            </div>
                            <button
                                onClick={copyAllTags}
                                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors flex items-center"
                            >
                                {copiedField === 'all-tags' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                Kopyala
                            </button>
                        </div>
                    </div>

                    {/* Frequency Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Etiket Frekans Analizi</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Etiket</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Kullanım Sıklığı</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Hacim</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rekabet</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {results.top_tags.map((item, index) => {
                                        const percentage = (item.frequency / results.analyzed_product_count) * 100;
                                        return (
                                            <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-gray-800">{item.tag}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <span className="text-xs font-bold text-gray-500 w-8">{item.frequency}</span>
                                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden ml-2">
                                                            <div
                                                                className={`h-full rounded-full ${percentage > 70 ? 'bg-emerald-500' : percentage > 40 ? 'bg-indigo-500' : 'bg-gray-400'}`}
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs text-gray-400 ml-2 w-8 text-right">%{Math.round(percentage)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                                    {item.volume.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getCompetitionBadge(item.competition)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => copyToClipboard(item.tag, `tag-${index}`)}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                        title="Kopyala"
                                                    >
                                                        {copiedField === `tag-${index}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagSpy;
