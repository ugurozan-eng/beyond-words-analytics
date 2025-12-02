import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X, Check, Wand2, AlertCircle, Eye, RefreshCw, Flame,
    ArrowRight, ChevronDown, ChevronUp, Trophy, TrendingUp,
    AlertTriangle, BarChart2, Globe, Tag, HelpCircle, Info
} from 'lucide-react';

const OptimizationDrawer = ({ isOpen, onClose, product, onApply }) => {
    const { t } = useTranslation();
    const [showBenchmark, setShowBenchmark] = useState(false);

    if (!product) return null;

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
                                {product.status === 'urgent' ? 'ACİL MÜDAHALE' : 'İYİLEŞTİRME FIRSATI'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">ID: #{product.listing_id}</span>
                        </div>
                        <h3 className="text-lg font-black text-gray-900 leading-tight w-full line-clamp-2">{product.title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
                </div>

                {/* 2. SCROLLABLE WORKSPACE */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">

                    {/* --- A. COMPETITOR INTELLIGENCE --- */}
                    <div className="bg-white border border-yellow-300 rounded-lg shadow-sm overflow-hidden">
                        <button
                            onClick={() => setShowBenchmark(!showBenchmark)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-yellow-50 to-white flex justify-between items-center hover:bg-yellow-100 transition-colors border-b border-yellow-100"
                        >
                            <div className="flex items-center gap-2 text-yellow-800 font-bold text-xs uppercase tracking-wider">
                                <Trophy size={14} /> Kategori Lideri (Referans)
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
                                            <span className="text-[10px] text-gray-500 block">Fiyat</span>
                                            <span className="text-sm font-black text-gray-800">${comp.price}</span>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                            <span className="text-[10px] text-gray-500 block">Satış</span>
                                            <span className="text-sm font-black text-gray-800">{comp.sales}</span>
                                        </div>
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
                            {/* 1. Problem & Advice */}
                            <div className="flex gap-3 items-start">
                                <img src={product.img} className="w-20 h-20 object-cover rounded border border-gray-200 shrink-0" alt="Current" />
                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-red-600 flex items-center gap-1">
                                        <AlertCircle size={12} /> Problem:
                                    </div>
                                    <div className="text-xs text-gray-700 leading-snug">{vis.issue}</div>

                                    <div className="text-xs font-bold text-indigo-600 flex items-center gap-1 mt-2">
                                        <Info size={12} /> Tavsiye:
                                    </div>
                                    <div className="text-xs text-gray-600 leading-snug italic">
                                        "{vis.advice_text || "Görsel netliğini artırın."}"
                                    </div>
                                </div>
                            </div>

                            {/* 2. Marketing Info Box */}
                            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-2 items-start">
                                <Wand2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-800 font-medium leading-relaxed">
                                    SEO ve ürününüz ile uyumlu görseller için AI Prompt ile ürün görseli oluşturma sihirbazımızı kullanabilirsiniz.
                                </p>
                            </div>

                            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded flex items-center justify-center gap-2">
                                <Wand2 size={14} /> AI Görsel Stüdyosu'nu Aç
                            </button>
                        </div>
                    </div>

                    {/* --- C. SEO FOUNDATION --- */}
                    <div className="bg-white border-2 border-blue-100 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
                            <div className="font-bold text-sm flex items-center gap-2"><RefreshCw size={16} /> LQS 2: SEO & BULUNABİLİRLİK</div>
                            <div className="font-black text-sm bg-blue-800 px-2 py-0.5 rounded">{product.seo_score}/35</div>
                        </div>

                        <div className="divide-y divide-blue-50">
                            {/* TITLE */}
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1"><AlertTriangle size={12} className="text-orange-500" /> Başlık (Title)</span>
                                    <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">Başlığı Güncelle</button>
                                </div>
                                <div className="text-xs text-gray-800 font-bold bg-green-50 p-2 rounded border border-green-100">
                                    {seo.suggested_title}
                                </div>
                            </div>

                            {/* TAGS (SPLIT VIEW) */}
                            <div className="p-4 bg-gray-50/50">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Current Tags */}
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Mevcut Etiketler</span>
                                        <div className="flex flex-wrap gap-1">
                                            {product.tags && product.tags.map((tag, i) => (
                                                <span key={i} className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded border border-gray-300">{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Suggested Tags */}
                                    <div>
                                        <span className="text-[10px] font-bold text-green-600 uppercase mb-2 block">AI Önerileri</span>
                                        <div className="flex flex-wrap gap-1">
                                            {seo.missing_tags && seo.missing_tags.map((tag, i) => (
                                                <span key={i} className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200 font-bold">+ {tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded">
                                    Önerilen Etiketleri Ekle
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- D. TREND --- */}
                    <div className="bg-white border-2 border-fuchsia-100 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-fuchsia-700 text-white px-4 py-2 flex justify-between items-center">
                            <div className="font-bold text-sm flex items-center gap-2"><TrendingUp size={16} /> LQS 3: TREND & STRATEJİ</div>
                            <div className="font-black text-sm bg-fuchsia-900 px-2 py-0.5 rounded">{product.trend_score}/30</div>
                        </div>
                        <div className="p-4">
                            <p className="text-xs text-gray-700">{ext.market_advice}</p>
                        </div>
                    </div>

                    {/* --- E. GOOGLE / EXTERNAL DATA (With Tooltips) --- */}
                    <div className="bg-gray-100 border border-gray-200 rounded-xl p-4">
                        <h4 className="text-xs font-black text-gray-500 uppercase mb-3 flex items-center gap-2">
                            <Globe size={14} /> Dış Kaynak Verileri (Google)
                        </h4>
                        <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="bg-white p-2 rounded shadow-sm relative group cursor-help">
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="text-[9px] text-gray-400 font-bold uppercase">Impressions</span>
                                    <HelpCircle size={10} className="text-gray-400" title="Görüntülenme: Ürününüzün arama sonuçlarında kaç kez göründüğü." />
                                </div>
                                <span className="block text-sm font-black text-gray-700">{ext.google_impressions || "-"}</span>
                            </div>

                            <div className="bg-white p-2 rounded shadow-sm relative group cursor-help">
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="text-[9px] text-gray-400 font-bold uppercase">CTR (Tık)</span>
                                    <HelpCircle size={10} className="text-gray-400" title="Click-Through Rate: Ürününüzü gören her 100 kişiden kaçının tıkladığı." />
                                </div>
                                <span className="block text-sm font-black text-gray-700">{ext.ctr || "-"}</span>
                            </div>

                            <div className="bg-white p-2 rounded shadow-sm relative group cursor-help">
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="text-[9px] text-gray-400 font-bold uppercase">Bounce Rate</span>
                                    <HelpCircle size={10} className="text-gray-400" title="Hemen Çıkma Oranı: Ürüne tıklayıp hiçbir şey yapmadan çıkanların oranı." />
                                </div>
                                <span className="block text-sm font-black text-gray-700">{ext.bounce_rate || "-"}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* 3. FOOTER ACTIONS */}
                <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0 z-10 shadow-lg">
                    {product.status === 'urgent' ? (
                        <button className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wide rounded-xl shadow-lg flex items-center justify-center gap-2">
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
