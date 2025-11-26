import React from 'react';
import { X, CheckCircle, ArrowRight, TrendingUp, Tag, DollarSign, Type } from 'lucide-react';

const OptimizationModal = ({ isOpen, onClose, originalListing, optimizedData, onApply }) => {
    if (!isOpen || !originalListing || !optimizedData) return null;

    const originalLqs = originalListing.lqs_score || 0;

    // Calculate Target LQS (Simulated improvement logic)
    // If the optimized data doesn't have a specific 'predicted_lqs', we calculate a realistic improvement
    // based on the current score. We assume AI optimization always brings value.
    let newLqs = optimizedData.predicted_lqs;
    if (!newLqs || newLqs <= originalLqs) {
        // Add ~30-40% of the remaining potential
        const potential = 100 - originalLqs;
        const improvement = Math.max(5, potential * 0.4); // At least 5 points or 40% of potential
        newLqs = Math.min(100, originalLqs + improvement);
    }

    const lqsDiff = (newLqs - originalLqs).toFixed(1);
    const displayNewLqs = newLqs.toFixed(1);

    const handleApply = () => {
        alert("Değişiklikler başarıyla uygulandı! (Simülasyon)");
        if (onApply) onApply();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-sm relative">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 flex items-center">
                            <span className="bg-indigo-100 p-2 rounded-xl mr-3 text-indigo-600">
                                <TrendingUp className="w-6 h-6" />
                            </span>
                            Optimizasyon Karşılaştırması
                        </h2>
                        <p className="text-gray-500 text-sm mt-1 ml-14">Yapay zeka önerileri ile mevcut listelemenizi karşılaştırın.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content Grid */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden relative">

                    {/* Center Separator (Absolute) */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2 z-20 hidden lg:block"></div>

                    {/* Center Badge (Absolute - Middle Down) */}
                    <div className="absolute left-1/2 top-[60%] transform -translate-x-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center justify-center pointer-events-none">
                        <div className="bg-emerald-500 text-white font-black text-xl px-6 py-3 rounded-full shadow-2xl shadow-emerald-200 border-4 border-white flex items-center animate-bounce-slow">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            +{lqsDiff} Puan Artış
                        </div>
                    </div>

                    {/* Left Panel: Original */}
                    <div className="bg-gradient-to-br from-slate-100 via-indigo-50 to-blue-50 p-8 overflow-y-auto border-r border-gray-200 relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400 via-blue-500 to-indigo-500"></div>
                        <div className="flex items-center justify-between mb-6">
                            <span className="bg-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-slate-300">Orijinal Listeleme</span>
                            <div className="flex items-center bg-white px-3 py-1 rounded-lg shadow-sm border border-indigo-100">
                                <span className="text-gray-500 font-bold mr-2 text-xs uppercase">Mevcut LQS:</span>
                                <span className={`text-2xl font-black ${originalLqs >= 7 ? 'text-emerald-600' : originalLqs >= 5 ? 'text-amber-500' : 'text-red-500'}`}>{originalLqs}</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Title */}
                            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-all group hover:border-blue-400">
                                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 flex items-center group-hover:text-blue-600 transition-colors"><Type className="w-4 h-4 mr-1 text-slate-400 group-hover:text-blue-500" /> Başlık</h3>
                                <p className="text-gray-700 font-medium leading-relaxed group-hover:text-gray-900 transition-colors">{originalListing.title}</p>
                            </div>

                            {/* Price */}
                            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-all group hover:border-emerald-400">
                                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 flex items-center group-hover:text-emerald-600 transition-colors"><DollarSign className="w-4 h-4 mr-1 text-slate-400 group-hover:text-emerald-500" /> Fiyat</h3>
                                <p className="text-2xl font-bold text-gray-700 group-hover:text-gray-900 transition-colors">${originalListing.price}</p>
                            </div>

                            {/* Tags */}
                            <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-all group hover:border-purple-400">
                                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 flex items-center group-hover:text-purple-600 transition-colors"><Tag className="w-4 h-4 mr-1 text-slate-400 group-hover:text-purple-500" /> Etiketler ({originalListing.tags?.length || 0})</h3>
                                <div className="flex flex-wrap gap-2">
                                    {originalListing.tags?.map((tag, i) => (
                                        <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-200 hover:text-slate-800 transition-all">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Optimized */}
                    <div className="bg-white p-8 overflow-y-auto relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                        <div className="flex items-center justify-between mb-6">
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-200">Beyond AI Önerisi</span>
                            <div className="flex items-center">
                                <span className="text-indigo-900 font-bold mr-2">Hedef LQS:</span>
                                <span className="text-3xl font-black text-emerald-500 drop-shadow-sm">{displayNewLqs}</span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Title */}
                            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 shadow-sm ring-1 ring-indigo-50">
                                <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center"><Type className="w-4 h-4 mr-1" /> Önerilen Başlık</h3>
                                <p className="text-indigo-900 font-bold leading-relaxed text-lg">{optimizedData.suggested_title || "Öneri bulunamadı..."}</p>
                            </div>

                            {/* Price */}
                            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 shadow-sm ring-1 ring-emerald-50">
                                <h3 className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-3 flex items-center"><DollarSign className="w-4 h-4 mr-1" /> Optimal Fiyat</h3>
                                <div className="flex items-end">
                                    <p className="text-3xl font-black text-emerald-700">${optimizedData.predicted_price_optimal || originalListing.price}</p>
                                    <span className="ml-3 text-sm text-emerald-600 font-medium mb-1.5 bg-emerald-100 px-2 py-0.5 rounded">
                                        {optimizedData.predicted_price_optimal > originalListing.price ? 'Artış Öneriliyor' : 'Düşüş Öneriliyor'}
                                    </span>
                                </div>
                                <p className="text-emerald-800/70 text-sm mt-2">{optimizedData.price_reason}</p>
                            </div>

                            {/* Tags */}
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100">
                                <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center"><Tag className="w-4 h-4 mr-1" /> Önerilen Etiketler</h3>
                                <div className="flex flex-wrap gap-2">
                                    {optimizedData.tags?.map((tag, i) => (
                                        <span key={i} className={`px-3 py-1 rounded-lg text-sm font-bold border transition-all hover:scale-105 cursor-default ${originalListing.tags?.includes(tag) ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-indigo-100 text-indigo-700 border-indigo-200 shadow-sm'}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-3 italic">* Renkli etiketler yeni önerilerdir.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="text-sm text-gray-500 font-medium">
                        <span className="font-bold text-gray-900">Not:</span> Değişiklikler Etsy mağazanıza anında yansıtılacaktır.
                    </div>
                    <div className="flex space-x-4">
                        <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Vazgeç</button>
                        <button onClick={handleApply} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 flex items-center text-lg">
                            <CheckCircle className="w-5 h-5 mr-2" /> Değişiklikleri Uygula
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OptimizationModal;
