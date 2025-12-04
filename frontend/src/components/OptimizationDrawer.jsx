import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X, Wand2, AlertCircle, Eye, RefreshCw, Flame,
    ChevronDown, ChevronUp, Trophy, TrendingUp,
    AlertTriangle, Globe, HelpCircle, Calendar, Zap, Tag, Copy, FileText, Check, ExternalLink, Lightbulb
} from 'lucide-react';
import VisualArchitectModal from './VisualArchitectModal';

const OptimizationDrawer = ({ isOpen, onClose, product }) => {
    const { t } = useTranslation();
    const [showBenchmark, setShowBenchmark] = useState(false);
    const [copiedTagId, setCopiedTagId] = useState(null);
    const [showVisualStudio, setShowVisualStudio] = useState(false);

    if (!product) return null;

    const seo = product.seo_analysis || {};
    const comp = product.competitor || {};
    const ext = product.external_data || {};
    const vis = product.visual_analysis || {};

    const fullCompTags = comp.tags || [];
    const compDescSnippet = comp.description_snippet || "Description unavailable...";

    // --- CALCULATIONS ---
    const monthlySales = Math.floor((parseFloat(comp.daily_sales || 5) * 30));
    // Revenue Calculation
    const priceVal = parseFloat(comp.price || "0");
    const salesVal = parseInt(comp.sales || "0", 10);
    const revenueRaw = priceVal * salesVal;
    // Format Revenue (Green Text)
    const totalRevenue = revenueRaw.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

    // --- HANDLERS ---
    const handleOpenVisualStudio = () => setShowVisualStudio(true);
    const handleOpenSEOEditor = () => console.log("OPEN: SEO Editor Modal");

    const handleCopySingleTag = (tag, index) => {
        navigator.clipboard.writeText(tag);
        setCopiedTagId(index);
        setTimeout(() => setCopiedTagId(null), 1500);
    };

    return (
        // MASTER CONTAINER: Fixed Overlay
        <div className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                onClick={onClose}
            ></div>

            {/* DRAWER PANEL - WIDTH FIXED TO 900px HERE */}
            <div className={`relative w-full max-w-[900px] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-gray-100 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* 1. HEADER */}
                <div className="px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0 flex justify-between items-center relative z-10">
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
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"><X size={24} /></button>
                </div>

                {/* 2. DIAGNOSTIC STREAM */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F8FAFC]">

                    {/* --- FRAME 1-2: CATEGORY LEADER CARD --- */}
                    <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden transition-all duration-300 group">

                        {/* Header (Closed State) */}
                        <div
                            onClick={() => setShowBenchmark(!showBenchmark)}
                            className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 hover:bg-white hover:shadow-md transition-all select-none"
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-700 flex items-center gap-2 text-base">
                                    <Trophy size={18} className="text-amber-500" /> Kategori Lideri
                                </span>

                                {!showBenchmark && (
                                    <div className="hidden sm:flex items-center gap-3 text-sm text-slate-500 animate-fadeIn">
                                        <span className="w-px h-5 bg-slate-300 mx-1"></span>
                                        <span className="font-semibold text-slate-800 line-clamp-1 max-w-[200px]">{comp.title}</span>
                                        <span className="text-xs text-slate-400">•</span>
                                        {/* TOTAL REVENUE (Green) */}
                                        <span className="text-green-600 font-black text-base">{totalRevenue} Ciro</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {!showBenchmark && (
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        Rakibini İncele
                                    </span>
                                )}
                                <div className={`transform transition-transform duration-300 text-slate-400 ${showBenchmark ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Body (Open State) */}
                        {showBenchmark && (
                            <div className="p-6 border-t border-slate-100 bg-white space-y-6">

                                <div className="flex gap-6">
                                    {/* Clean Image */}
                                    <div className="relative w-32 h-32 bg-gray-100 rounded-xl shrink-0 flex items-center justify-center border border-gray-200 overflow-hidden shadow-sm">
                                        <img src={comp.img} alt="Benchmark" className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* Stats Row */}
                                        <div className="flex flex-wrap gap-3 mb-3">
                                            <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs px-2.5 py-1 rounded font-semibold">
                                                Ürün Fiyatı: ${comp.price}
                                            </span>
                                            <span className="bg-orange-50 text-orange-700 border border-orange-200 text-xs px-2.5 py-1 rounded font-semibold">
                                                {comp.sales} Satış
                                            </span>
                                            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-1 rounded font-semibold">
                                                Aylık Ort: {monthlySales}
                                            </span>
                                        </div>

                                        <a href={comp.url || "#"} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline text-base leading-snug truncate pr-4 flex items-center gap-1 mb-3">
                                            {comp.title} <ExternalLink size={12} />
                                        </a>

                                        {/* LQS Bar */}
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-y-2">
                                            <div className="flex items-center gap-2 text-sm text-slate-700">

                                                {/* Main Score (No Tooltip Trigger Here) */}
                                                <div className="flex items-center gap-2 mr-4 border-r border-slate-300 pr-4">
                                                    <span className="font-bold text-slate-900 text-lg">LQS</span>
                                                    <span className="font-black text-indigo-600 text-lg">{comp.lqs_total || 92}</span>
                                                    <span className="text-xs text-slate-400 self-end mb-1">/100</span>

                                                    {/* ISOLATED Tooltip Trigger */}
                                                    <div className="relative ml-1 flex items-center justify-center cursor-help">
                                                        <HelpCircle size={16} className="text-slate-400 hover:text-indigo-600 transition-colors peer" />
                                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-3 bg-blue-100 text-blue-900 text-xs leading-snug rounded shadow-xl opacity-0 peer-hover:opacity-100 transition-opacity pointer-events-none z-50 font-medium text-center border border-blue-200">
                                                            LQS (Listing Quality Score): Görsel, SEO ve Trend başarısının 100 üzerinden puanıdır.
                                                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-100"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Breakdown */}
                                                <div className="flex items-center gap-3 text-xs">
                                                    <span className="bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">Vis <b className="text-indigo-600 text-sm">{comp.lqs_visual || 32}</b></span>
                                                    <span className="text-slate-300 text-lg">+</span>
                                                    <span className="bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">SEO <b className="text-indigo-600 text-sm">{comp.lqs_seo || 33}</b></span>
                                                    <span className="text-slate-300 text-lg">+</span>
                                                    <span className="bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">Trend <b className="text-pink-600 text-sm">{comp.lqs_trend || 27}</b></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ürün Açıklaması</span>
                                    </div>
                                    <p className="text-sm text-gray-600 italic bg-slate-50 p-4 rounded-lg border border-slate-100 border-l-4 border-l-blue-200 leading-relaxed">
                                        "{compDescSnippet}"
                                    </p>
                                </div>

                                {/* Tags (No Copy All) */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rakip Etiketleri ({fullCompTags.length})</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {fullCompTags.map((tag, i) => (
                                            <button key={i} onClick={() => handleCopySingleTag(tag, i)} className={`text-xs font-medium px-3 py-1.5 rounded border shadow-sm transition-all select-none ${copiedTagId === i ? 'bg-green-500 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'}`}>
                                                {copiedTagId === i ? "Kopyalandı!" : tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>

                    {/* --- FRAME 1-3: VISUAL ANALYSIS --- */}
                    <div className="border-2 border-blue-400 bg-blue-50 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6 flex gap-6 bg-blue-100/50 border-b border-blue-200">
                            <div className="w-24 h-24 bg-white rounded-lg border border-blue-200 shadow-sm shrink-0 flex items-center justify-center overflow-hidden relative">
                                <img src={product.img} alt="User Product" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex justify-between items-start">
                                <div className="pr-4">
                                    <h3 className="font-bold text-slate-800 text-base mb-2 leading-snug">{product.title}</h3>
                                    <a href="#" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-bold">Ürüne Git ↗</a>
                                </div>
                                <div className="flex flex-col items-center bg-white border-2 border-slate-800 p-3 rounded-lg shadow-sm shrink-0">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">VIS SCORE</span>
                                    <span className="text-2xl font-black text-slate-900">{product.visual_score}<span className="text-sm text-slate-400">/35</span></span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex gap-4 items-start">
                                <div className="bg-red-100 text-red-600 p-2 rounded-lg shrink-0"><AlertCircle size={22} /></div>
                                <div>
                                    <h4 className="font-bold text-slate-700 text-sm mb-1">Teşhis: Tespit Edilen Sorun</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">{vis.issue || "Analiz bekleniyor..."}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg shrink-0"><Lightbulb size={22} /></div>
                                <div className="bg-white/60 p-4 rounded-xl border border-blue-100 w-full">
                                    <h4 className="font-bold text-slate-700 text-sm mb-1">Etsy Kriteri & Öneri</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">{vis.advice_text || "Görsel kalitesini artırın."}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-indigo-50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-indigo-100">
                            <div className="text-indigo-900 text-sm flex-1">
                                <span className="text-amber-600 font-bold mr-2">💡 Fırsat:</span>
                                Yüksek LQS puanlı yeni görselleri otomatik üretebilirsiniz.
                            </div>
                            <button onClick={handleOpenVisualStudio} className="group relative flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 shrink-0">
                                <span>Sihirbazı Başlat</span>
                                <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                                <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            </button>
                        </div>
                    </div>

                    {/* --- C. SEO DIAGNOSIS --- */}
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 relative overflow-hidden">
                        <div className="absolute top-6 right-6 font-black text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">{product.seo_score}/35</div>
                        <div className="font-bold text-base text-blue-900 flex items-center gap-2 mb-6"><RefreshCw size={20} className="text-blue-500" /> SEO & Bulunabilirlik</div>
                        <div className="space-y-4 mb-6">
                            <div className="flex items-start gap-3 bg-blue-50/30 p-3 rounded-xl">
                                <AlertTriangle size={16} className="text-orange-400 mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-xs font-bold text-blue-900 block mb-1">Başlık</span>
                                    <span className="text-xs text-gray-600 leading-relaxed">{seo.seo_analysis?.title_issue}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-blue-50/30 p-3 rounded-xl">
                                <Tag size={16} className="text-blue-400 mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-xs font-bold text-blue-900 block mb-1">Etiketler</span>
                                    <span className="text-xs text-gray-600 leading-relaxed">{seo.missing_tagsCount} kritik etiket eksik.</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleOpenSEOEditor} className="w-full py-4 bg-slate-900 text-white hover:bg-black text-sm font-bold rounded-xl shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2">
                            <RefreshCw size={18} /> SEO Editörünü Aç
                        </button>
                    </div>

                    {/* --- D. FOOTER DATA --- */}
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe size={16} className="text-gray-400" />
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Performans Verileri</h4>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center relative group cursor-help">
                                <span className="text-[10px] text-gray-400 font-bold block mb-1">IMPRESSIONS</span>
                                <span className="text-lg font-black text-gray-800">{ext.google_impressions || "-"}</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center relative group cursor-help">
                                <span className="text-[10px] text-gray-400 font-bold block mb-1">CTR</span>
                                <span className="text-lg font-black text-gray-800">{ext.ctr || "-"}</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center relative group cursor-help">
                                <span className="text-[10px] text-gray-400 font-bold block mb-1">BOUNCE</span>
                                <span className="text-lg font-black text-gray-800">{ext.bounce_rate || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. DANGER ZONE */}
                {product.status === 'urgent' && (
                    <div className="p-6 border-t border-gray-100 bg-white z-10">
                        <button className="w-full py-4 bg-rose-500 text-white hover:bg-rose-600 font-bold rounded-xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 transition-all">
                            <Flame size={20} /> Phoenix Protokolü (Sil-Yükle)
                        </button>
                    </div>
                )}

            </div>

            {/* MODALS */}
            <VisualArchitectModal
                isOpen={showVisualStudio}
                onClose={() => setShowVisualStudio(false)}
                product={product}
            />
        </div>
    );
};

export default OptimizationDrawer;
