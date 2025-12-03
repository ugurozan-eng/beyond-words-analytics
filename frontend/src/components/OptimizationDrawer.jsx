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
    const [allTagsCopied, setAllTagsCopied] = useState(false);

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

    const handleCopyAllTags = (e) => {
        e.stopPropagation();
        const textToCopy = fullCompTags.join(", ");
        navigator.clipboard.writeText(textToCopy);
        setAllTagsCopied(true);
        setTimeout(() => setAllTagsCopied(false), 2000);
    };

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

                    {/* --- A. COMPETITOR SPYGLASS (With LQS Scores) --- */}
                    <div className="bg-white border border-amber-100 rounded-xl shadow-sm overflow-hidden">
                        <button
                            onClick={() => setShowBenchmark(!showBenchmark)}
                            className="w-full px-5 py-4 flex justify-between items-center hover:bg-amber-50/30 transition-colors group"
                        >
                            <div className="flex items-center gap-2.5 text-amber-900/80 font-bold text-sm">
                                <Trophy size={16} className="text-amber-500" /> Kategori Lideri (Referans)
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Total LQS Badge */}
                                <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                                    LQS {comp.lqs_total || 95}
                                </span>
                                {showBenchmark ? <ChevronUp size={16} className="text-amber-400" /> : <ChevronDown size={16} className="text-amber-400" />}
                            </div>
                        </button>

                        {showBenchmark && (
                            <div className="p-5 border-t border-amber-50 animate-in slide-in-from-top-1 space-y-5">

                                {/* 1. Identity & Visual Score */}
                                <div className="flex gap-4">
                                    <div className="relative shrink-0">
                                        <img src={comp.img} className="w-20 h-20 object-cover rounded-lg border border-gray-100 shadow-sm" alt="Benchmark" />
                                        {/* Visual LQS Badge */}
                                        <div className="absolute -bottom-2 -right-2 bg-indigo-50 text-indigo-700 text-[9px] font-black px-1.5 py-0.5 rounded border border-indigo-100 shadow-sm z-10">
                                            Vis {comp.lqs_visual || 32}
                                        </div>
                                    </div>

                                    <div className="space-y-2 flex-1 min-w-0">
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">${comp.price}</span>
                                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{comp.sales} Satış</span>
                                            {/* Trend Score Badge */}
                                            <span className="text-[9px] font-black text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">Trend {comp.lqs_trend || 28}</span>
                                        </div>

                                        {/* Linkable Title */}
                                        <a
                                            href={comp.url || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline leading-snug flex items-start gap-1"
                                        >
                                            {comp.title} <ExternalLink size={10} className="mt-0.5 shrink-0" />
                                        </a>
                                    </div>
                                </div>

                                {/* --- LQS SCORE BAR --- */}
                                <div className="bg-slate-50 border border-slate-200 rounded-md p-3 flex items-center justify-between mb-4">
                                    {/* Left Side: Score Equation */}
                                    <div className="flex items-center flex-wrap gap-x-2 text-sm text-slate-700">
                                        {/* Main Score (LQS) */}
                                        <div className="flex items-baseline gap-1 mr-2 border-r border-slate-300 pr-3">
                                            <span className="font-bold text-slate-900 text-lg">LQS</span>
                                            <span className="font-bold text-indigo-600 text-lg">{comp.lqs_total || 92}</span>
                                            <span className="text-xs text-slate-400">/100</span>
                                            <span className="text-slate-400 ml-1">=</span>
                                        </div>

                                        {/* Sub Scores (Equation) */}
                                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                                            {/* Vis Score */}
                                            <div className="flex flex-col sm:flex-row items-center sm:gap-1">
                                                <span className="font-medium text-slate-600">Vis</span>
                                                <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 font-semibold">
                                                    {comp.lqs_visual || 32}<span className="text-[10px] text-indigo-400">/35</span>
                                                </span>
                                            </div>

                                            <span className="text-slate-300 font-light text-lg">+</span>

                                            {/* SEO Score */}
                                            <div className="flex flex-col sm:flex-row items-center sm:gap-1">
                                                <span className="font-medium text-slate-600">SEO</span>
                                                <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 font-semibold">
                                                    {comp.lqs_seo || 33}<span className="text-[10px] text-indigo-400">/35</span>
                                                </span>
                                            </div>

                                            <span className="text-slate-300 font-light text-lg">+</span>

                                            {/* Trend Score */}
                                            <div className="flex flex-col sm:flex-row items-center sm:gap-1">
                                                <span className="font-medium text-slate-600">Trend</span>
                                                <span className="bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded border border-pink-100 font-semibold">
                                                    {comp.lqs_trend || 27}<span className="text-[10px] text-pink-400">/30</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Tooltip (Question Mark) */}
                                    <div className="relative group cursor-help ml-2">
                                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold hover:bg-indigo-600 hover:text-white transition-colors">
                                            ?
                                        </div>

                                        {/* Tooltip Content */}
                                        <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            <p className="font-bold mb-1 text-yellow-400">LQS (Listing Quality Score) Nedir?</p>
                                            <p>Ürününüzün genel kalite puanıdır. Şu kriterlerin toplamından oluşur:</p>
                                            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-300">
                                                <li><strong>Vis (Görsel):</strong> Ana görselin çekiciliği (Max: 35).</li>
                                                <li><strong>SEO:</strong> Başlık ve etiket uyumu (Max: 35).</li>
                                                <li><strong>Trend:</strong> Son dönem satış ivmesi (Max: 30).</li>
                                            </ul>
                                            <div className="absolute -bottom-1 right-2 w-3 h-3 bg-gray-800 transform rotate-45"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Description & SEO Score */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1"><FileText size={10} /> Açıklama</span>
                                        {/* SEO Score Badge */}
                                        <span className="text-[9px] font-black text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">SEO {comp.lqs_seo || 34}</span>
                                    </div>
                                    <div className="text-xs text-gray-600 italic bg-amber-50/20 p-2.5 rounded border border-amber-100/50 leading-relaxed">
                                        "{compDescSnippet}..."
                                    </div>
                                </div>

                                {/* 3. ALL TAGS (Click to Copy) */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1"><Tag size={10} /> Rakip Etiketleri ({fullCompTags.length})</span>
                                        <button
                                            onClick={handleCopyAllTags}
                                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                                        >
                                            {allTagsCopied ? <Check size={12} /> : <Copy size={12} />}
                                            {allTagsCopied ? "Tümü Kopyalandı!" : "Tümünü Kopyala"}
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        {fullCompTags.map((tag, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleCopySingleTag(tag, i)}
                                                className={`text-[10px] font-medium px-2 py-1 rounded border shadow-sm transition-all select-none
                               ${copiedTagId === i
                                                        ? 'bg-green-500 text-white border-green-600 scale-105'
                                                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600 active:scale-95'}`}
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
