import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X, Wand2, AlertCircle, Eye, RefreshCw, Flame,
    ChevronDown, ChevronUp, Trophy, TrendingUp,
    AlertTriangle, Globe, HelpCircle, ArrowRight
} from 'lucide-react';

const OptimizationDrawer = ({ isOpen, onClose, product }) => {
    const { t } = useTranslation();
    const [showBenchmark, setShowBenchmark] = useState(false);

    if (!product) return null;

    // Safe data access
    const seo = product.seo_analysis || {};
    const comp = product.competitor || {};
    const ext = product.external_data || {};
    const vis = product.visual_analysis || {};

    // --- HANDLERS (To be connected to Modals later) ---
    const handleOpenVisualStudio = () => {
        console.log("TRIGGER: Open Visual Studio Modal");
        // TODO: Trigger Visual Modal State
    };

    const handleOpenSEOEditor = () => {
        console.log("TRIGGER: Open SEO Editor Modal");
        // TODO: Trigger SEO Modal State
    };

    return (
        <div className="fixed inset-0 z-40 flex justify-end pointer-events-none">

            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* DRAWER PANEL */}
            <div className={`relative w-full max-w-[500px] h-full bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out border-l border-gray-100 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* 1. HEADER */}
                <div className="px-6 py-5 bg-white border-b border-gray-100 flex-shrink-0 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase ${product.status === 'urgent' ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-100' : 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'}`}>
                                {product.status === 'urgent' ? 'Acil Müdahale' : 'İyileştirme Fırsatı'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded-full">#{product.listing_id}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 leading-snug w-full">{product.title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>

                {/* 2. DIAGNOSTIC STREAM */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">

                    {/* --- A. COMPETITOR (Read Only) --- */}
                    <div className="bg-white border border-amber-100 rounded-xl shadow-sm overflow-hidden">
                        <button
                            onClick={() => setShowBenchmark(!showBenchmark)}
                            className="w-full px-5 py-4 flex justify-between items-center hover:bg-amber-50/30 transition-colors"
                        >
                            <div className="flex items-center gap-2.5 text-amber-900/80 font-bold text-sm">
                                <Trophy size={16} className="text-amber-500" /> Kategori Lideri (Referans)
                            </div>
                            {showBenchmark ? <ChevronUp size={16} className="text-amber-400" /> : <ChevronDown size={16} className="text-amber-400" />}
                        </button>

                        {showBenchmark && (
                            <div className="p-5 border-t border-amber-50 grid grid-cols-3 gap-4 animate-in slide-in-from-top-1">
                                <img src={comp.img} className="col-span-1 w-full aspect-square object-cover rounded-lg border border-gray-100" alt="Benchmark" />
                                <div className="col-span-2 space-y-2">
                                    <div className="text-xs font-semibold text-gray-900 line-clamp-2">{comp.title}</div>
                                    <div className="flex gap-2">
                                        <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">${comp.price}</span>
                                        <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">{comp.sales} Satış</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- B. VISUAL DIAGNOSIS --- */}
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <div className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                                <Eye size={18} className="text-indigo-500" /> Görsel Çekicilik
                            </div>
                            <div className="font-bold text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
                                {product.visual_score}/35
                            </div>
                        </div>

                        <div className="flex gap-4 mb-4">
                            <div className="shrink-0 relative">
                                <img src={product.img} className="w-16 h-16 object-cover rounded-lg border border-gray-100" alt="Current" />
                                <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full border border-gray-100"><AlertCircle size={14} className="text-rose-500" /></div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Teşhis</div>
                                <p className="text-sm text-gray-600 font-medium leading-relaxed">{vis.issue}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleOpenVisualStudio}
                            className="w-full py-3 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-sm"
                        >
                            <Wand2 size={16} className="group-hover:scale-110 transition-transform" /> AI Görsel Stüdyosu'nu Aç
                        </button>
                    </div>

                    {/* --- C. SEO DIAGNOSIS --- */}
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <div className="font-bold text-sm text-blue-900 flex items-center gap-2">
                                <RefreshCw size={18} className="text-blue-500" /> SEO & Bulunabilirlik
                            </div>
                            <div className="font-bold text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
                                {product.seo_score}/35
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-start gap-2">
                                <AlertTriangle size={14} className="text-orange-400 mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-xs font-bold text-gray-700 block">Başlık Sorunu</span>
                                    <span className="text-xs text-gray-500">{seo.seo_analysis?.title_issue || "Başlık optimizasyonu gerekli."}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <AlertTriangle size={14} className="text-orange-400 mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-xs font-bold text-gray-700 block">Eksik Etiketler</span>
                                    <span className="text-xs text-gray-500">{seo.missing_tagsCount} adet etiket eksik veya zayıf.</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleOpenSEOEditor}
                            className="w-full py-3 bg-slate-900 text-white hover:bg-black text-sm font-bold rounded-xl shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} /> SEO Editörünü Aç
                        </button>
                    </div>

                    {/* --- D. MARKET INTELLIGENCE (Footer) --- */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Globe size={14} className="text-gray-400" />
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Performans Verileri</h4>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center relative group cursor-help">
                                <span className="text-[9px] text-gray-400 font-bold block mb-1">IMPRESSIONS</span>
                                <span className="text-sm font-black text-gray-800">{ext.google_impressions || "-"}</span>
                                <HelpCircle size={10} className="absolute top-1 right-1 text-gray-300" />
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center relative group cursor-help">
                                <span className="text-[9px] text-gray-400 font-bold block mb-1">CTR</span>
                                <span className="text-sm font-black text-gray-800">{ext.ctr || "-"}</span>
                                <HelpCircle size={10} className="absolute top-1 right-1 text-gray-300" />
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center relative group cursor-help">
                                <span className="text-[9px] text-gray-400 font-bold block mb-1">BOUNCE</span>
                                <span className="text-sm font-black text-gray-800">{ext.bounce_rate || "-"}</span>
                                <HelpCircle size={10} className="absolute top-1 right-1 text-gray-300" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* 3. DANGER ZONE */}
                {product.status === 'urgent' && (
                    <div className="p-5 border-t border-gray-100 bg-white z-10">
                        <button className="w-full py-3 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                            <Flame size={18} /> Phoenix Protokolü (Sil-Yükle)
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default OptimizationDrawer;
