import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X, Check, Wand2, AlertCircle, Eye, RefreshCw, Flame,
    ArrowRight, ChevronDown, ChevronUp, Trophy, TrendingUp,
    AlertTriangle, Microscope
} from 'lucide-react';

const OptimizationDrawer = ({ isOpen, onClose, product, onApply }) => {
    const { t } = useTranslation();
    const [showBenchmark, setShowBenchmark] = useState(false);

    if (!product) return null;

    // --- MOCK DATA FOR EXCEL SIMULATION ---
    // In a real scenario, this comes from the Python Backend Analysis
    const diagnosis = {
        visual: {
            problem: "Görsel karanlık ve ürün odaklı değil (Low Exposure).",
            solution: "Ürünün ana hatlarını koruyarak ışık dengesini 'Studio Lighting' seviyesine getirmeliyiz.",
            action: "AI Görsel Stüdyosu'nu Aç"
        },
        seo: {
            title_problem: "Başlık çok kısa ve 'Long Tail' anahtar kelime içermiyor.",
            title_fix: product.title + " | 2025 Boho Decor (SEO Optimized)",
            tags_problem: "13 Etiket hakkının sadece 8'i kullanılmış. Eksik etiket var.",
            tags_fix: ["Minimalist Art", "Line Drawing", "Neutral Home", "Gift for Her"]
        },
        trend: {
            problem: "Ürün sezon trendlerine uygun ancak fiyat rekabeti yüksek.",
            solution: "Fiyatı koruyarak 'Bundle' (Set) algısı yaratılmalı.",
            action: "Rakip Fiyat Analizini Gör"
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">

            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* DRAWER PANEL */}
            <div className={`relative w-full max-w-[600px] h-full bg-gray-50 shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out border-l border-gray-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* 1. HEADER (Kimlik Kartı) */}
                <div className="px-5 py-4 bg-white border-b border-gray-200 flex-shrink-0 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-black px-2 py-0.5 rounded text-white ${product.status === 'urgent' ? 'bg-red-600' : 'bg-blue-600'}`}>
                                {product.status === 'urgent' ? 'ACİL MÜDAHALE' : 'İYİLEŞTİRME'}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">ID: #{product.listing_id || '99283'}</span>
                        </div>
                        <h3 className="text-lg font-black text-gray-900 leading-tight w-full line-clamp-2">{product.title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
                </div>

                {/* 2. SCROLLABLE WORKSPACE */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">

                    {/* --- 0. BENCHMARK (Referans) --- */}
                    <div className="bg-white border border-yellow-300 rounded-lg shadow-sm overflow-hidden">
                        <button
                            onClick={() => setShowBenchmark(!showBenchmark)}
                            className="w-full px-4 py-2 bg-yellow-50 flex justify-between items-center hover:bg-yellow-100 transition-colors border-b border-yellow-100"
                        >
                            <div className="flex items-center gap-2 text-yellow-800 font-bold text-xs uppercase tracking-wider">
                                <Trophy size={14} /> Kategori Lideri (Referans)
                            </div>
                            {showBenchmark ? <ChevronUp size={16} className="text-yellow-700" /> : <ChevronDown size={16} className="text-yellow-700" />}
                        </button>

                        {showBenchmark && (
                            <div className="p-3 bg-white flex gap-3 animate-in slide-in-from-top-2">
                                <img src={product.bestSellerImg || "https://source.unsplash.com/random/100x100?sig=99"} className="w-20 h-20 object-cover rounded border border-gray-200" alt="Benchmark" />
                                <div className="flex-1 space-y-1">
                                    <div className="text-xs font-bold text-gray-900 bg-gray-100 p-1.5 rounded">
                                        "Boho Wall Art Set..." (2.5k Sales)
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">LQS: 98</span>
                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">Fiyat: $12.99</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* =========================================================
              LQS KIRILIM 1: GÖRSEL (VISUAL) - THE PURPLE ZONE
             ========================================================= */}
                    <div className="bg-white border-2 border-indigo-100 rounded-xl overflow-hidden shadow-sm">
                        {/* Header */}
                        <div className="bg-indigo-700 text-white px-4 py-2 flex justify-between items-center">
                            <div className="font-bold text-sm flex items-center gap-2">
                                <Eye size={16} /> LQS Kırılım 1: GÖRSEL ÇEKİCİLİK
                            </div>
                            <div className="font-black text-sm bg-indigo-800 px-2 py-0.5 rounded">{product.visual_score}/35</div>
                        </div>

                        {/* Content Table */}
                        <div className="divide-y divide-indigo-50">
                            {/* Row 1: Diagnosis */}
                            <div className="p-3 bg-indigo-50/30">
                                <div className="text-[10px] font-bold text-indigo-400 uppercase mb-1 flex items-center gap-1"><AlertCircle size={10} /> Problemin Sebebi</div>
                                <div className="text-sm font-medium text-gray-800">{diagnosis.visual.problem}</div>
                            </div>

                            {/* Row 2: Solution */}
                            <div className="p-3">
                                <div className="flex gap-3">
                                    <div className="shrink-0">
                                        <img src={product.img} className="w-16 h-16 object-cover rounded border border-gray-200" alt="Current" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-bold text-green-600 uppercase mb-1">Çözüm Önerisi</div>
                                        <div className="text-xs text-gray-600 leading-snug">{diagnosis.visual.solution}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Action Button */}
                            <div className="p-3 bg-gray-50">
                                <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                                    <Wand2 size={16} /> {diagnosis.visual.action}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* =========================================================
              LQS KIRILIM 2: BULUNABİLİRLİK (SEO) - THE BLUE ZONE
             ========================================================= */}
                    <div className="bg-white border-2 border-blue-100 rounded-xl overflow-hidden shadow-sm">
                        {/* Header */}
                        <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
                            <div className="font-bold text-sm flex items-center gap-2">
                                <RefreshCw size={16} /> LQS Kırılım 2: SEO & ETİKET
                            </div>
                            <div className="font-black text-sm bg-blue-700 px-2 py-0.5 rounded">{product.seo_score}/35</div>
                        </div>

                        <div className="divide-y divide-blue-50">

                            {/* SUB-SECTION: TITLE */}
                            <div className="p-3">
                                <div className="flex items-start gap-2 mb-2">
                                    <AlertTriangle size={14} className="text-orange-500 mt-0.5" />
                                    <div>
                                        <div className="text-xs font-bold text-gray-700">Problem: Başlık</div>
                                        <div className="text-xs text-gray-500">{diagnosis.seo.title_problem}</div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 p-2 rounded text-xs space-y-2">
                                    <div className="opacity-50 line-through text-[10px]">{product.title.substring(0, 50)}...</div>
                                    <div className="flex justify-center"><ArrowRight size={12} className="text-blue-400 rotate-90" /></div>
                                    <div className="font-bold text-blue-900">{diagnosis.seo.title_fix}</div>
                                </div>

                                <button className="w-full mt-3 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded shadow-sm">
                                    Başlığı Etsy'de Güncelle
                                </button>
                            </div>

                            {/* SUB-SECTION: TAGS */}
                            <div className="p-3 bg-gray-50/50">
                                <div className="flex items-start gap-2 mb-2">
                                    <AlertTriangle size={14} className="text-orange-500 mt-0.5" />
                                    <div>
                                        <div className="text-xs font-bold text-gray-700">Problem: Etiketler (Tags)</div>
                                        <div className="text-xs text-gray-500">{diagnosis.seo.tags_problem}</div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-3">
                                    {diagnosis.seo.tags_fix.map((tag, i) => (
                                        <span key={i} className="text-[10px] bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                            + {tag}
                                        </span>
                                    ))}
                                </div>

                                <button className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded shadow-sm border border-gray-300">
                                    Eksik Etiketleri Ekle
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* =========================================================
              LQS KIRILIM 3: TREND (ZEITGEIST) - THE PURPLE/PINK ZONE
             ========================================================= */}
                    <div className="bg-white border-2 border-fuchsia-100 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-fuchsia-700 text-white px-4 py-2 flex justify-between items-center">
                            <div className="font-bold text-sm flex items-center gap-2">
                                <TrendingUp size={16} /> LQS Kırılım 3: TREND UYUMU
                            </div>
                            <div className="font-black text-sm bg-fuchsia-800 px-2 py-0.5 rounded">{product.trend_score}/30</div>
                        </div>
                        <div className="p-4">
                            <div className="text-xs text-gray-600 mb-3">{diagnosis.trend.problem}</div>
                            <div className="p-3 bg-fuchsia-50 rounded border border-fuchsia-100">
                                <span className="text-xs font-bold text-fuchsia-800 block mb-1">Stratejik Öneri:</span>
                                <p className="text-xs text-gray-700">{diagnosis.trend.solution}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* 3. FOOTER (GLOBAL ACTIONS) */}
                <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    {product.status === 'urgent' ? (
                        <button className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wide rounded-xl shadow-lg shadow-red-200 flex items-center justify-center gap-2 transition-transform active:scale-95">
                            <Flame size={20} /> Akıllı Yeniden Listeleme (Phoenix)
                        </button>
                    ) : (
                        <button onClick={onApply} className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
                            <Check size={20} /> Tüm İyileştirmeleri Kaydet
                        </button>
                    )}
                    <p className="text-[10px] text-center text-gray-400 mt-2">Cyclear v4.3 Operational Protocol</p>
                </div>

            </div>
        </div>
    );
};

export default OptimizationDrawer;
