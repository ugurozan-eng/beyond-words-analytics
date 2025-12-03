import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X, Wand2, AlertCircle, Eye, RefreshCw, Flame,
    ChevronDown, ChevronUp, Trophy, TrendingUp,
    AlertTriangle, Globe, HelpCircle, Calendar, Zap, Tag, Copy, FileText, Check, ExternalLink, Lightbulb
} from 'lucide-react';

const OptimizationDrawer = ({ isOpen, onClose, product }) => {
    const { t } = useTranslation();
    const [showBenchmark, setShowBenchmark] = useState(false);
    const [copiedTagId, setCopiedTagId] = useState(null);
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
    const fullCompTags = comp.tags || [];

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
            <div className={`relative w-full max-w-[600px] h-full bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out border-l border-gray-100 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* 1. HEADER */}
                <div className="px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-xs font-black text-slate-500 block leading-none">ID</span>
                            <span className="text-sm font-black text-slate-800 leading-none">#{product.listing_id}</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 leading-none">Operasyon Merkezi</h3>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${product.status === 'urgent' ? 'text-rose-600' : 'text-blue-600'}`}>
                                {product.status === 'urgent' ? 'Acil Müdahale Protokolü' : 'Standart İyileştirme'}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600"><X size={24} /></button>
                </div>

                {/* 2. DIAGNOSTIC STREAM */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">

                    {/* --- A. COMPETITOR SPYGLASS --- */}
                    <div className="bg-white border border-amber-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300">
                        <button
                            onClick={() => setShowBenchmark(!showBenchmark)}
                            className="w-full px-4 py-3 bg-amber-50/30 flex justify-between items-center hover:bg-amber-50/60 transition-colors group"
                        >
                            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                                <Trophy size={16} className="text-amber-500" /> Kategori Lideri
                            </div>

                            {!showBenchmark && (
                                <div className="flex items-center gap-3 animate-in fade-in zoom-in">
                                    <span className="text-xs text-amber-700/70 font-medium hidden sm:inline">LQS {comp.lqs_total || 95} • ${comp.price}</span>
                                    <span className="text-[10px] font-bold text-blue-600 bg-white border border-blue-100 px-2 py-0.5 rounded shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        Analizi Göster
                                    </span>
                                </div>
                            )}

                            <div className={`text-amber-400 transition-transform duration-300 ${showBenchmark ? 'rotate-180' : ''}`}>
                                <ChevronDown size={18} />
                            </div>
                        </button>

                        {showBenchmark && (
                            <div className="p-5 border-t border-amber-100 space-y-5 bg-white">
                                {/* Identity */}
                                <div className="flex gap-4">
                                    <div className="relative shrink-0">
                                        <img src={comp.img} className="w-20 h-20 object-cover rounded-lg border border-gray-100 shadow-sm" alt="Benchmark" />
                                        <div className="absolute -bottom-2 -right-2 bg-indigo-50 text-indigo-700 text-[9px] font-black px-1.5 py-0.5 rounded border border-indigo-100 shadow-sm z-10">Vis {comp.lqs_visual || 32}</div>
                                    </div>
                                    <div className="space-y-2 flex-1 min-w-0">
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">${comp.price}</span>
                                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{comp.sales} Satış</span>
                                            <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">Trend {comp.lqs_trend || 28}</span>
                                        </div>
                                        <a href={comp.url || "#"} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline leading-snug flex items-start gap-1">
                                            {comp.title} <ExternalLink size={10} className="mt-0.5 shrink-0" />
                                        </a>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1"><Tag size={10} /> Rakip Etiketleri</span>
                                        <button onClick={handleCopyAllTags} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                                            {allTagsCopied ? <Check size={12} /> : <Copy size={12} />} {allTagsCopied ? "Kopyalandı!" : "Tümünü Kopyala"}
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {fullCompTags.map((tag, i) => (
                                            <button key={i} onClick={() => handleCopySingleTag(tag, i)} className={`text-[10px] font-medium px-2 py-1 rounded border shadow-sm transition-all select-none ${copiedTagId === i ? 'bg-green-500 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'}`}>
                                                {copiedTagId === i ? "Kopyalandı!" : tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- B. VISUAL ANALYSIS (NEW USER DESIGN - SOFT FOOTER FIX) --- */}
                    <div className="border-2 border-blue-400 bg-blue-50 rounded-xl overflow-hidden shadow-sm">

                        {/* Header: Görsel ve Başlık */}
                        <div className="p-4 flex gap-4 bg-blue-100/50 border-b border-blue-200">
                            {/* Görsel */}
                            <div className="w-20 h-20 bg-white rounded-lg border border-blue-200 shadow-sm shrink-0 flex items-center justify-center overflow-hidden relative">
                                <img src={product.img} alt="User Product" className="w-full h-full object-cover" />
                            </div>

                            {/* Bilgi ve Puan */}
                            <div className="flex-1 flex justify-between items-start">
                                <div className="pr-2">
                                    <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">Senin Ürünün: {product.title}</h3>
                                    <a href="#" className="text-xs text-blue-600 hover:underline flex items-center gap-1">Ürüne Git ↗</a>
                                </div>
                                {/* VIS SCORE KUTUSU */}
                                <div className="flex flex-col items-center bg-white border-2 border-slate-800 p-2 rounded shadow-sm shrink-0">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">VIS SCORE</span>
                                    <span className="text-xl font-black text-slate-900">{product.visual_score}<span className="text-xs text-slate-400">/35</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Teşhis ve Öneri */}
                        <div className="p-4 space-y-4">
                            {/* Teşhis */}
                            <div className="flex gap-3 items-start">
                                <div className="bg-red-100 text-red-600 p-1.5 rounded-md shrink-0 mt-0.5">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-700 text-sm">Teşhis: Tespit Edilen Sorun</h4>
                                    <p className="text-sm text-slate-600 leading-snug">{vis.issue || "Analiz bekleniyor..."}</p>
                                </div>
                            </div>

                            {/* Öneri */}
                            <div className="flex gap-3 items-start">
                                <div className="bg-blue-100 text-blue-600 p-1.5 rounded-md shrink-0 mt-0.5">
                                    <Lightbulb size={20} />
                                </div>
                                <div className="bg-white/60 p-3 rounded-lg border border-blue-100 w-full">
                                    <h4 className="font-bold text-slate-700 text-sm mb-1">Etsy Kriteri & Öneri</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">{vis.advice_text || "Görsel kalitesini artırın."}</p>
                                </div>
                            </div>
                        </div>

                        {/* Aksiyon Alanı (Footer) - UPDATED COLOR */}
                        <div className="bg-indigo-50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-indigo-100">
                            <div className="text-indigo-900 text-sm flex-1">
                                <span className="text-amber-600 font-bold mr-2">💡 Fırsat:</span>
                                Yüksek LQS puanlı yeni görselleri otomatik üretebilirsiniz.
                            </div>
                            <button
                                onClick={handleOpenVisualStudio}
                                className="group relative flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all transform hover:scale-105 shrink-0"
                            >
                                <span>Sihirbazı Başlat</span>
                                <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                                <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            </button>
                        </div>
                    </div>

                    {/* --- C. SEO DIAGNOSIS (Classic Card) --- */}
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 relative overflow-hidden">
                        <div className="absolute top-5 right-5 font-black text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">{product.seo_score}/35</div>
                        <div className="font-bold text-sm text-blue-900 flex items-center gap-2 mb-4"><RefreshCw size={18} className="text-blue-500" /> SEO & Bulunabilirlik</div>
                        <div className="space-y-3 mb-5">
                            <div className="flex items-start gap-2 bg-blue-50/30 p-2 rounded">
                                <AlertTriangle size={14} className="text-orange-400 mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-[10px] font-bold text-blue-900 block">Başlık</span>
                                    <span className="text-[10px] text-gray-600 leading-snug">{seo.seo_analysis?.title_issue}</span>
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

                    {/* --- D. FOOTER DATA --- */}
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
