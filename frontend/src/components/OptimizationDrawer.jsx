import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X, Check, Wand2, AlertCircle, Eye, RefreshCw, Flame,
    ArrowRight, ChevronDown, ChevronUp, Trophy, TrendingUp,
    AlertTriangle, BarChart2, Globe, Tag
} from 'lucide-react';

const OptimizationDrawer = ({ isOpen, onClose, product, onApply }) => {
    const { t } = useTranslation();
    const [showBenchmark, setShowBenchmark] = useState(false);

    if (!product) return null;

    // Helper for safe data access (in case mock data lags)
    const seo = product.seo_analysis || {};
    const comp = product.competitor || {};
    const ext = product.external_data || {};
    const vis = product.visual_analysis || {};

    return (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">

            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* DRAWER PANEL */}
            <div className={`relative w-full max-w-[650px] h-full bg-gray-50 shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out border-l border-gray-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* 1. HEADER */}
                <div className="px-5 py-4 bg-white border-b border-gray-200 flex-shrink-0 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded text-white tracking-wide uppercase ${product.status === 'urgent' ? 'bg-red-600' : 'bg-blue-600'}`}>
                                {product.status === 'urgent' ? 'ACİL MÜDAHALE (Critical)' : 'İYİLEŞTİRME FIRSATI'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">ID: #{product.listing_id}</span>
                        </div>
                        <h3 className="text-lg font-black text-gray-900 leading-tight w-full line-clamp-2">{product.title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
                </div>

                {/* 2. SCROLLABLE WORKSPACE */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">

                    {/* --- A. COMPETITOR INTELLIGENCE (Kategori Lideri) --- */}
                    <div className="bg-white border border-yellow-300 rounded-lg shadow-sm overflow-hidden">
                        <button
                            onClick={() => setShowBenchmark(!showBenchmark)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-yellow-50 to-white flex justify-between items-center hover:bg-yellow-100 transition-colors border-b border-yellow-100"
                        >
                            <div className="flex items-center gap-2 text-yellow-800 font-bold text-xs uppercase tracking-wider">
                                <Trophy size={14} /> Kategori Lideri Analizi
                            </div>
                            {showBenchmark ? <ChevronUp size={16} className="text-yellow-700" /> : <ChevronDown size={16} className="text-yellow-700" />}
                        </button>

                        {showBenchmark && (
                            <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2">
                                <div className="col-span-1">
                                    <img src={comp.img} className="w-full h-24 object-cover rounded border border-gray-200 shadow-sm" alt="Benchmark" />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <div className="text-xs font-bold text-gray-900 line-clamp-1">{comp.title}</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                            <span className="text-[10px] text-gray-500 block">Rakip Fiyat</span>
                                            <span className="text-sm font-black text-gray-800">${comp.price}</span>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                            <span className="text-[10px] text-gray-500 block">Tahmini Satış</span>
                                            <span className="text-sm font-black text-gray-800">{comp.sales} Adet</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {comp.tags && comp.tags.map((tag, i) => (
                                            <span key={i} className="text-[9px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-200">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- B. VISUAL IMPULSE (Görsel) --- */}
                    <div className="bg-white border-2 border-indigo-100 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-indigo-700 text-white px-4 py-2 flex justify-between items-center">
                            <div className="font-bold text-sm flex items-center gap-2"><Eye size={16} /> LQS 1: GÖRSEL ÇEKİCİLİK</div>
                            <div className="font-black text-sm bg-indigo-900 px-2 py-0.5 rounded">{product.visual_score}/35</div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex gap-3 items-start p-3 bg-red-50 border border-red-100 rounded-lg">
                                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-xs font-bold text-red-700 mb-1">Tespit Edilen Sorun:</div>
                                    <div className="text-xs text-gray-700">{vis.issue || "Görsel analizi bekleniyor..."}</div>
                                </div>
                            </div>

                            {vis.ai_prompt && (
                                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                                    <div className="text-[10px] font-bold text-indigo-600 uppercase mb-1 flex items-center gap-1"><Wand2 size={10} /> AI Önerisi (Prompt)</div>
                                    <div className="text-xs text-indigo-900 italic font-medium">"{vis.ai_prompt}"</div>
                                </div>
                            )}

                            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded flex items-center justify-center gap-2">
                                <Wand2 size={14} /> AI Görsel Stüdyosu'nu Aç
                            </button>
                        </div>
                    </div>

                    {/* --- C. SEO FOUNDATION (Detaylı Kırılım) --- */}
                    <div className="bg-white border-2 border-blue-100 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
                            <div className="font-bold text-sm flex items-center gap-2"><RefreshCw size={16} /> LQS 2: SEO & BULUNABİLİRLİK</div>
                            <div className="font-black text-sm bg-blue-800 px-2 py-0.5 rounded">{product.seo_score}/35</div>
                        </div>

                        <div className="divide-y divide-blue-50">

                            {/* 1. TITLE */}
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1"><AlertTriangle size={12} className="text-orange-500" /> Başlık (Title) Analizi</span>
                                    <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">Sadece Başlığı Güncelle</button>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-xs text-gray-400 line-through bg-gray-50 p-2 rounded">{product.title}</div>
                                    <div className="text-xs text-gray-800 font-bold bg-green-50 p-2 rounded border border-green-100 flex gap-2 items-start">
                                        <Check size={14} className="text-green-600 mt-0.5 shrink-0" />
                                        {seo.suggested_title}
                                    </div>
                                </div>
                            </div>

                            {/* 2. DESCRIPTION */}
                            <div className="p-4 bg-gray-50/30">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1"><AlertTriangle size={12} className="text-orange-500" /> Açıklama (Description)</span>
                                    <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">Açıklamayı Güncelle</button>
                                </div>
                                <p className="text-[10px] text-red-500 mb-2">{seo.description_issue}</p>
                                <div className="text-xs text-gray-600 italic bg-white p-2 border border-gray-200 rounded">
                                    "{seo.suggested_description || "AI Description generation..."}"
                                </div>
                            </div>

                            {/* 3. TAGS */}
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1"><Tag size={12} className="text-orange-500" /> Eksik Etiketler</span>
                                    <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">Etiketleri Ekle</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {seo.missing_tags && seo.missing_tags.map((tag, i) => (
                                        <span key={i} className="text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded-full flex items-center gap-1">
                                            + {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* --- D. TREND & STRATEGY --- */}
                    <div className="bg-white border-2 border-fuchsia-100 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-fuchsia-700 text-white px-4 py-2 flex justify-between items-center">
                            <div className="font-bold text-sm flex items-center gap-2"><TrendingUp size={16} /> LQS 3: TREND & STRATEJİ</div>
                            <div className="font-black text-sm bg-fuchsia-900 px-2 py-0.5 rounded">{product.trend_score}/30</div>
                        </div>
                        <div className="p-4">
                            <div className="bg-fuchsia-50 p-3 rounded border border-fuchsia-100">
                                <span className="text-[10px] font-bold text-fuchsia-800 uppercase block mb-1">Pazar Stratejisi:</span>
                                <p className="text-xs text-gray-700 leading-snug">
                                    {ext.market_advice || "Pazar verileri analiz ediliyor..."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- E. GOOGLE / EXTERNAL DATA INTELLIGENCE (Footer Info) --- */}
                    <div className="bg-gray-100 border border-gray-200 rounded-xl p-4">
                        <h4 className="text-xs font-black text-gray-500 uppercase mb-3 flex items-center gap-2">
                            <Globe size={14} /> Dış Kaynak Verileri (Google & Pinterest)
                        </h4>
                        <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="bg-white p-2 rounded shadow-sm">
                                <span className="block text-[9px] text-gray-400 font-bold uppercase">Impressions</span>
                                <span className="block text-sm font-black text-gray-700">{ext.google_impressions || "-"}</span>
                            </div>
                            <div className="bg-white p-2 rounded shadow-sm">
                                <span className="block text-[9px] text-gray-400 font-bold uppercase">CTR (Tık)</span>
                                <span className="block text-sm font-black text-gray-700">{ext.ctr || "-"}</span>
                            </div>
                            <div className="bg-white p-2 rounded shadow-sm">
                                <span className="block text-[9px] text-gray-400 font-bold uppercase">Bounce Rate</span>
                                <span className="block text-sm font-black text-gray-700">{ext.bounce_rate || "-"}</span>
                            </div>
                        </div>
                        <div className="bg-white p-2 rounded border border-gray-200 shadow-sm flex gap-2 items-start">
                            <BarChart2 size={16} className="text-gray-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-gray-500 leading-snug">
                                <span className="font-bold text-gray-700">Analist Notu:</span> Görüntülenme/Ziyaret oranı sektör ortalamasının altında. Görsel optimizasyonu öncelikli olmalı.
                            </p>
                        </div>
                    </div>

                </div>

                {/* 3. STICKY FOOTER ACTIONS */}
                <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0 z-10 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.1)]">
                    {product.status === 'urgent' ? (
                        <button className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wide rounded-xl shadow-lg shadow-red-200 flex items-center justify-center gap-2 transition-transform active:scale-95">
                            <Flame size={20} /> Akıllı Yeniden Listeleme (Phoenix)
                        </button>
                    ) : (
                        <button onClick={onApply} className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
                            <Check size={20} /> Tüm İyileştirmeleri Uygula
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default OptimizationDrawer;
