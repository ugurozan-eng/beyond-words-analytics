import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X, Check, Wand2, AlertCircle, Eye, RefreshCw, Flame,
    ArrowRight, ChevronDown, ChevronUp, Trophy, TrendingUp,
    AlertTriangle, Globe, Tag, HelpCircle, Info, Sparkles
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
                className={`absolute inset-0 bg-gray-900/20 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* DRAWER PANEL */}
            <div className={`relative w-full max-w-[650px] h-full bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out border-l border-gray-100 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* 1. HEADER (Clean & Minimal) */}
                <div className="px-6 py-5 bg-white border-b border-gray-100 flex-shrink-0 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase ${product.status === 'urgent' ? 'bg-red-50 text-red-600 ring-1 ring-red-100' : 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'}`}>
                                {product.status === 'urgent' ? 'Acil Müdahale' : 'İyileştirme Fırsatı'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded-full">#{product.listing_id}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 leading-snug w-full">{product.title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>

                {/* 2. SCROLLABLE WORKSPACE */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24 bg-gray-50/50">

                    {/* --- A. COMPETITOR INTELLIGENCE (Golden/Amber Theme) --- */}
                    <div className="bg-white border border-amber-100 rounded-2xl shadow-sm overflow-hidden group hover:border-amber-200 transition-colors">
                        <button
                            onClick={() => setShowBenchmark(!showBenchmark)}
                            className="w-full px-5 py-4 bg-gradient-to-r from-amber-50/50 to-transparent flex justify-between items-center"
                        >
                            <div className="flex items-center gap-2.5 text-amber-700 font-bold text-sm">
                                <div className="p-1.5 bg-amber-100 rounded-lg"><Trophy size={16} /></div>
                                Kategori Lideri (Referans)
                            </div>
                            {showBenchmark ? <ChevronUp size={18} className="text-amber-400" /> : <ChevronDown size={18} className="text-amber-400" />}
                        </button>

                        {showBenchmark && (
                            <div className="p-5 border-t border-amber-50 grid grid-cols-1 md:grid-cols-3 gap-5 animate-in slide-in-from-top-1">
                                <div className="col-span-1">
                                    <img src={comp.img} className="w-full aspect-square object-cover rounded-xl border border-gray-100 shadow-sm" alt="Benchmark" />
                                </div>
                                <div className="col-span-2 space-y-3">
                                    <div className="text-sm font-semibold text-gray-900 line-clamp-2 leading-relaxed">{comp.title}</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                                            <span className="text-[10px] font-bold text-amber-600/70 uppercase tracking-wider block mb-0.5">Fiyat</span>
                                            <span className="text-lg font-black text-amber-900">${comp.price}</span>
                                        </div>
                                        <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                                            <span className="text-[10px] font-bold text-amber-600/70 uppercase tracking-wider block mb-0.5">Satış</span>
                                            <span className="text-lg font-black text-amber-900">{comp.sales}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- B. VISUAL IMPULSE (Indigo Theme) --- */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        {/* Soft Header */}
                        <div className="bg-indigo-50/40 px-5 py-3 border-b border-indigo-50 flex justify-between items-center">
                            <div className="font-bold text-sm text-indigo-900 flex items-center gap-2.5">
                                <Eye size={18} className="text-indigo-500" /> Görsel Çekicilik (Visual)
                            </div>
                            <div className="font-bold text-xs bg-white text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full shadow-sm">
                                {product.visual_score}/35
                            </div>
                        </div>

                        <div className="p-5 space-y-5">
                            {/* 1. Problem & Advice */}
                            <div className="flex gap-4 items-start">
                                <div className="shrink-0 relative">
                                    <img src={product.img} className="w-24 h-24 object-cover rounded-xl border border-gray-100 shadow-sm" alt="Current" />
                                    <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow border border-gray-100"><AlertCircle size={16} className="text-red-500" /></div>
                                </div>
                                <div className="space-y-3 flex-1">
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tespit Edilen Sorun</div>
                                        <div className="text-sm text-gray-700 font-medium leading-relaxed">{vis.issue}</div>
                                    </div>

                                    <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-50">
                                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Info size={12} /> Tavsiye</div>
                                        <div className="text-xs text-indigo-900 leading-relaxed">
                                            "{vis.advice_text || "Görsel netliğini artırın."}"
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Marketing Info Box (Modern Gradient) */}
                            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-4 rounded-xl flex gap-3 items-start relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Sparkles size={40} className="text-blue-500" /></div>
                                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-500 shrink-0"><Wand2 size={18} /></div>
                                <div>
                                    <h5 className="text-xs font-bold text-blue-900 mb-0.5">Profesyonel Dokunuş</h5>
                                    <p className="text-xs text-blue-700/80 leading-relaxed">
                                        SEO ve ürününüz ile uyumlu görseller için <span className="font-bold text-blue-800">AI Prompt ile Görsel Sihirbazı</span>mızı kullanabilirsiniz.
                                    </p>
                                </div>
                            </div>

                            <button className="w-full py-2.5 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 group">
                                <Wand2 size={16} className="group-hover:scale-110 transition-transform" /> AI Görsel Stüdyosu'nu Aç
                            </button>
                        </div>
                    </div>

                    {/* --- C. SEO FOUNDATION (Blue Theme) --- */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-blue-50/40 px-5 py-3 border-b border-blue-50 flex justify-between items-center">
                            <div className="font-bold text-sm text-blue-900 flex items-center gap-2.5">
                                <RefreshCw size={18} className="text-blue-500" /> SEO & Bulunabilirlik
                            </div>
                            <div className="font-bold text-xs bg-white text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full shadow-sm">
                                {product.seo_score}/35
                            </div>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {/* TITLE */}
                            <div className="p-5">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><AlertTriangle size={12} className="text-orange-400" /> Başlık (Title)</span>
                                    <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">Başlığı Güncelle</button>
                                </div>
                                <div className="text-sm text-gray-800 font-medium bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100/50 flex gap-3">
                                    <Check size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                    {seo.suggested_title}
                                </div>
                            </div>

                            {/* TAGS (Clean Split) */}
                            <div className="p-5 bg-gray-50/30">
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Current */}
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Mevcut Etiketler</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {product.tags && product.tags.map((tag, i) => (
                                                <span key={i} className="text-[10px] bg-white text-gray-500 px-2 py-1 rounded-md border border-gray-200 shadow-sm">{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Suggested */}
                                    <div>
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2 block flex items-center gap-1"><Sparkles size={10} /> AI Önerileri</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {seo.missing_tags && seo.missing_tags.map((tag, i) => (
                                                <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-100 font-bold hover:bg-emerald-100 cursor-pointer transition-colors">+ {tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full mt-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold rounded-xl shadow-md shadow-blue-200 transition-all">
                                    Önerilen Etiketleri Ekle
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- D. TREND (Fuchsia/Rose Theme) --- */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-fuchsia-50/40 px-5 py-3 border-b border-fuchsia-50 flex justify-between items-center">
                            <div className="font-bold text-sm text-fuchsia-900 flex items-center gap-2.5">
                                <TrendingUp size={18} className="text-fuchsia-500" /> Pazar Stratejisi
                            </div>
                            <div className="font-bold text-xs bg-white text-fuchsia-700 border border-fuchsia-100 px-2.5 py-1 rounded-full shadow-sm">
                                {product.trend_score}/30
                            </div>
                        </div>
                        <div className="p-5">
                            <p className="text-sm text-gray-600 leading-relaxed">{ext.market_advice}</p>
                        </div>
                    </div>

                    {/* --- E. EXTERNAL DATA (Footer) --- */}
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Globe size={14} className="text-gray-400" />
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dış Kaynak Verileri</h4>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {/* Metric Card */}
                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative cursor-help">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-[9px] text-gray-400 font-bold uppercase">Impressions</span>
                                    <HelpCircle size={10} className="text-gray-300 group-hover:text-gray-500" />
                                </div>
                                <span className="text-lg font-black text-gray-800">{ext.google_impressions || "-"}</span>

                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-gray-900 text-white text-[9px] p-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-center">
                                    Arama sonuçlarında görünme sayısı.
                                </div>
                            </div>

                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative cursor-help">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-[9px] text-gray-400 font-bold uppercase">CTR (Tık)</span>
                                    <HelpCircle size={10} className="text-gray-300 group-hover:text-gray-500" />
                                </div>
                                <span className="text-lg font-black text-gray-800">{ext.ctr || "-"}</span>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-gray-900 text-white text-[9px] p-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-center">
                                    Tıklama Oranı: Görenlerin yüzde kaçı tıkladı?
                                </div>
                            </div>

                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative cursor-help">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-[9px] text-gray-400 font-bold uppercase">Bounce Rate</span>
                                    <HelpCircle size={10} className="text-gray-300 group-hover:text-gray-500" />
                                </div>
                                <span className="text-lg font-black text-gray-800">{ext.bounce_rate || "-"}</span>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-gray-900 text-white text-[9px] p-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-center">
                                    Hemen Çıkma: İncelemeden çıkanların oranı.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* 3. FOOTER ACTIONS */}
                <div className="p-5 border-t border-gray-100 bg-white/80 backdrop-blur-md flex-shrink-0 z-10">
                    {product.status === 'urgent' ? (
                        <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-xl shadow-red-200 hover:shadow-red-300 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98]">
                            <Flame size={20} /> Akıllı Yeniden Listeleme (Phoenix)
                        </button>
                    ) : (
                        <button onClick={onApply} className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98]">
                            <Check size={20} /> Değişiklikleri Kaydet
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default OptimizationDrawer;
