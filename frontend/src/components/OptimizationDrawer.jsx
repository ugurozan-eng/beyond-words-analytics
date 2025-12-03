import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X, Wand2, AlertCircle, Eye, RefreshCw, Flame,
    ChevronDown, ChevronUp, Trophy, TrendingUp,
    AlertTriangle, Globe, HelpCircle, Calendar, Zap, Tag, Copy, FileText, Check, ExternalLink
} from 'lucide-react';

const OptimizationDrawer = ({ isOpen, onClose, product }) => {
    const { t } = useTranslation();
    const [showBenchmark, setShowBenchmark] = useState(false);
    const [copiedTagId, setCopiedTagId] = useState(null); // Track which tag was copied


    if (!product) return null;

    const seo = product.seo_analysis || {};
    const comp = product.competitor || {};
    const ext = product.external_data || {};
    const vis = product.visual_analysis || {};

    // Mock data fallbacks
    const compAge = comp.age || "14 Ay";
    const compDaily = comp.daily_sales || "5.2";
    const compDescSnippet = comp.description_snippet || "Description unavailable...";
    const fullCompTags = comp.tags || ["Mock Tag 1", "Mock Tag 2"];

    // --- HANDLERS ---
    const handleOpenVisualStudio = () => console.log("OPEN: Visual Studio Modal");
    const handleOpenSEOEditor = () => console.log("OPEN: SEO Editor Modal");



    const handleCopySingleTag = (tag, index) => {
        navigator.clipboard.writeText(tag);
        setCopiedTagId(index);
        setTimeout(() => setCopiedTagId(null), 1500);
    };

    return (
        <div className="fixed inset-0 z-40 flex justify-end pointer-events-none">

            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* DRAWER PANEL */}
            <div className={`relative w-full max-w-[550px] h-full bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out border-l border-gray-100 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* 1. HEADER */}
                <div className="px-6 py-5 bg-white border-b border-gray-100 flex-shrink-0 flex justify-between items-start gap-4">
                    <div className="flex gap-4 items-center flex-1">
                        <img src={product.img} className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm shrink-0" alt="Product" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase ${product.status === 'urgent' ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-100' : 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'}`}>
                                    {product.status === 'urgent' ? 'Acil Müdahale' : 'İyileştirme'}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">#{product.listing_id}</span>
                            </div>
                            <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-1">{product.title}</h3>
                            <div className="text-sm font-black text-slate-800">${product.price}</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>

                {/* 2. DIAGNOSTIC STREAM */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">

                    {/* --- A. COMPETITOR SPYGLASS (Refined Accordion) --- */}
                    <div className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden mb-4 transition-all duration-300 group">
                        <div
                            onClick={() => setShowBenchmark(!showBenchmark)}
                            className="flex items-center justify-between p-3 cursor-pointer bg-slate-50 hover:bg-white hover:shadow-md transition-all select-none"
                        >
                            {/* Left Side: Title & Teaser */}
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-700 flex items-center gap-2">
                                    <Trophy size={16} className="text-amber-500" /> Kategori Lideri
                                </span>

                                {/* Teaser Summary (Only when CLOSED) */}
                                {!showBenchmark && (
                                    <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <span className="w-px h-4 bg-slate-300 mx-1"></span>
                                        <span className="font-semibold text-slate-800">{comp.shop_name || "ArtPrintStudio"}</span>
                                        <span className="text-xs text-slate-400">•</span>
                                        <span className="text-green-600 font-medium">{comp.revenue_monthly || "₺145K Ciro"}</span>
                                    </div>
                                )}
                            </div>

                            {/* Right Side: CTA & Arrow */}
                            <div className="flex items-center gap-2">
                                {/* CTA (Only when CLOSED) */}
                                {!showBenchmark && (
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        Analizi Göster
                                    </span>
                                )}

                                <div className={`transform transition-transform duration-300 text-slate-400 ${showBenchmark ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        </div>

                        {showBenchmark && (
                            <div className="p-4 border-t border-slate-100 bg-white space-y-4 animate-in slide-in-from-top-2 duration-200">

                                {/* 1. Identity & Basic Stats */}
                                <div className="flex gap-4">
                                    {/* Clean Image (No Badges) */}
                                    <div className="relative w-24 h-24 bg-gray-100 rounded-md shrink-0 flex items-center justify-center border border-gray-200 overflow-hidden">
                                        <img src={comp.img} className="w-full h-full object-cover" alt="Benchmark" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* Stats Row */}
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs px-2 py-0.5 rounded font-semibold">
                                                Ürün Fiyatı: ${comp.price}
                                            </span>
                                            <span className="bg-orange-50 text-orange-700 border border-orange-200 text-xs px-2 py-0.5 rounded font-semibold">
                                                {comp.sales} Satış
                                            </span>
                                            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-0.5 rounded font-semibold">
                                                Aylık Ort: {Math.round(comp.daily_sales * 30) || 124}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h4 className="font-bold text-blue-600 text-sm leading-snug truncate pr-4 mb-2">
                                            <a href={comp.url || "#"} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {comp.title}
                                            </a>
                                        </h4>

                                        {/* --- LQS BAR (Compact) --- */}
                                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2 text-sm overflow-x-auto">
                                            {/* Main LQS Block + Question Mark */}
                                            <div className="flex items-center relative pr-3 border-r border-slate-300 gap-1 shrink-0">
                                                <span className="font-bold text-slate-900 text-base">LQS</span>
                                                <span className="font-bold text-indigo-600 text-base">{comp.lqs_total || 92}</span>
                                                <span className="text-xs text-slate-400 self-end mb-1">/100</span>

                                                {/* Mini Question Mark */}
                                                <div className="group relative ml-1">
                                                    <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold cursor-help hover:bg-indigo-600 hover:text-white transition-colors">
                                                        ?
                                                    </div>
                                                    {/* Tooltip */}
                                                    <div className="absolute left-0 bottom-full mb-1 w-48 p-2 bg-gray-800 text-white text-xs rounded hidden group-hover:block z-20">
                                                        Listing Quality Score: Görsel, SEO ve Trend puanlarınızın toplamıdır.
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Equation Parts */}
                                            <div className="flex items-center gap-2 text-xs whitespace-nowrap">
                                                <span className="text-slate-400">=</span>
                                                <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                                                    Vis <b className="text-indigo-600">{comp.lqs_visual || 32}</b>
                                                </span>
                                                <span className="text-slate-300">+</span>
                                                <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                                                    SEO <b className="text-indigo-600">{comp.lqs_seo || 33}</b>
                                                </span>
                                                <span className="text-slate-300">+</span>
                                                <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                                                    Trend <b className="text-pink-600">{comp.lqs_trend || 27}</b>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Description (Cleaned) */}
                                <div className="mt-4">
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                        Ürün Açıklaması
                                    </h5>
                                    <p className="text-sm text-gray-600 italic bg-slate-50 p-3 rounded border border-slate-100 border-l-4 border-l-blue-200 leading-relaxed">
                                        "{compDescSnippet}..."
                                    </p>
                                </div>

                                {/* 3. Tags (Cleaned - No Copy All) */}
                                <div className="mt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Rakip Etiketleri ({fullCompTags.length})
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {fullCompTags.map((tag, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleCopySingleTag(tag, i)}
                                                className={`text-xs border px-2 py-1 rounded transition-all select-none
                                                    ${copiedTagId === i
                                                        ? 'bg-green-500 text-white border-green-600 scale-105'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 active:scale-95'}`}
                                            >
                                                {copiedTagId === i ? "Kopyalandı!" : tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>

                    {/* --- B. VISUAL DIAGNOSIS --- */}
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 relative overflow-hidden">
                        <div className="absolute top-5 right-5 font-black text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
                            {product.visual_score}/35
                        </div>
                        <div className="font-bold text-sm text-indigo-900 flex items-center gap-2 mb-4">
                            <Eye size={18} className="text-indigo-500" /> Görsel Çekicilik
                        </div>
                        <div className="flex gap-4 mb-5">
                            <div className="shrink-0 relative">
                                <img src={product.img} className="w-14 h-14 object-cover rounded-lg border border-gray-100 opacity-80" alt="Current" />
                                <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full border border-gray-100"><AlertCircle size={14} className="text-rose-500" /></div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Teşhis</div>
                                <p className="text-xs text-gray-700 font-medium leading-relaxed">{vis.issue}</p>
                            </div>
                        </div>
                        <button onClick={handleOpenVisualStudio} className="w-full py-3 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-sm">
                            <Wand2 size={16} className="group-hover:scale-110 transition-transform" /> AI Görsel Stüdyosu'nu Aç
                        </button>
                    </div>

                    {/* --- C. SEO DIAGNOSIS --- */}
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 relative overflow-hidden">
                        <div className="absolute top-5 right-5 font-black text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
                            {product.seo_score}/35
                        </div>
                        <div className="font-bold text-sm text-blue-900 flex items-center gap-2 mb-4">
                            <RefreshCw size={18} className="text-blue-500" /> SEO & Bulunabilirlik
                        </div>
                        <div className="space-y-3 mb-5">
                            <div className="flex items-start gap-2 bg-blue-50/30 p-2 rounded">
                                <AlertTriangle size={14} className="text-orange-400 mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-[10px] font-bold text-blue-900 block">Başlık</span>
                                    <span className="text-[10px] text-gray-600 leading-snug">{seo.seo_analysis?.title_issue || "Başlık optimizasyonu gerekli."}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 bg-blue-50/30 p-2 rounded">
                                <Tag size={14} className="text-blue-400 mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-[10px] font-bold text-blue-900 block">Etiketler</span>
                                    <span className="text-[10px] text-gray-600 leading-snug">{seo.missing_tagsCount} kritik etiket eksik.</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleOpenSEOEditor} className="w-full py-3 bg-slate-900 text-white hover:bg-black text-sm font-bold rounded-xl shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2">
                            <RefreshCw size={16} /> SEO Editörünü Aç
                        </button>
                    </div>

                    {/* --- D. FOOTER --- */}
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Globe size={14} className="text-gray-400" />
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Performans Verileri</h4>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center relative group cursor-help">
                                <span className="text-[9px] text-gray-400 font-bold block mb-1">IMPRESSIONS</span>
                                <span className="text-sm font-black text-gray-800">{ext.google_impressions || "-"}</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center relative group cursor-help">
                                <span className="text-[9px] text-gray-400 font-bold block mb-1">CTR</span>
                                <span className="text-sm font-black text-gray-800">{ext.ctr || "-"}</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center relative group cursor-help">
                                <span className="text-[9px] text-gray-400 font-bold block mb-1">BOUNCE</span>
                                <span className="text-sm font-black text-gray-800">{ext.bounce_rate || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. DANGER ZONE */}
                {product.status === 'urgent' && (
                    <div className="p-5 border-t border-gray-100 bg-white z-10">
                        <button className="w-full py-3 bg-rose-500 text-white hover:bg-rose-600 font-bold rounded-xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 transition-all">
                            <Flame size={18} /> Phoenix Protokolü (Sil-Yükle)
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default OptimizationDrawer;
