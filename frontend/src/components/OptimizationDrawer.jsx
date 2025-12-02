import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X, Check, Wand2, AlertCircle, Eye, Image, RefreshCw, Flame,
    ArrowRight, Zap, ChevronDown, ChevronUp, Trophy, TrendingUp
} from 'lucide-react';

const OptimizationDrawer = ({ isOpen, onClose, product, onApply }) => {
    const { t } = useTranslation();
    const [showBenchmark, setShowBenchmark] = useState(false); // Accordion State

    if (!product) return null;

    // Diagnostics
    const isMannequin = product.views > 500 && (product.visits / (product.views || 1)) < 0.01;
    const isGhost = product.views < 50;

    return (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">

            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* DRAWER PANEL */}
            <div className={`relative w-full max-w-[550px] h-full bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out border-l border-gray-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* HEADER */}
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex-shrink-0 flex justify-between items-center">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <Wand2 className="text-indigo-600" size={22} /> {t('drawer.title')}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">

                    {/* --- 0. BENCHMARK ACCORDION (The Reference) --- */}
                    <div className="border border-yellow-200 rounded-xl overflow-hidden bg-yellow-50/50">
                        <button
                            onClick={() => setShowBenchmark(!showBenchmark)}
                            className="w-full px-4 py-3 flex justify-between items-center hover:bg-yellow-50 transition-colors"
                        >
                            <div className="flex items-center gap-2 text-yellow-800 font-bold text-sm">
                                <Trophy size={16} className="text-yellow-600" />
                                {t('drawer.card_visual_benchmark')} (Referans)
                            </div>
                            {showBenchmark ? <ChevronUp size={16} className="text-yellow-600" /> : <ChevronDown size={16} className="text-yellow-600" />}
                        </button>

                        {showBenchmark && (
                            <div className="p-4 border-t border-yellow-200 bg-white animate-fade-in">
                                <div className="flex gap-4">
                                    <img src={product.bestSellerImg || "https://source.unsplash.com/random/150x150?sig=999"} className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm" alt="Benchmark" />
                                    <div className="flex-1">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">RAKİP BAŞLIK</p>
                                        <p className="text-sm text-gray-900 font-medium leading-snug">Boho Wall Art Set of 3 Prints | Minimalist Line Art | Neutral Tone Decor</p>
                                        <div className="mt-3 flex gap-2">
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">LQS: 98</span>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">2.5k Sales</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- 1. VISUAL BLOCK --- */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex justify-between items-center">
                            <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-2"><Image size={16} /> {t('drawer.card_visual_title')}</h4>
                            <span className="bg-white text-indigo-700 text-xs font-black px-2 py-0.5 rounded shadow-sm border border-indigo-100">{product.visual_score}/35</span>
                        </div>
                        <div className="p-4 bg-white">
                            <p className="text-xs text-red-500 mb-3 font-medium bg-red-50 p-2.5 rounded border border-red-100 flex gap-2">
                                <AlertCircle size={14} className="shrink-0 mt-0.5" /> {t('drawer.card_visual_problem')}
                            </p>
                            <div className="flex gap-4 mb-4">
                                <img src={product.img} className="w-20 h-20 object-cover rounded-lg border border-gray-200" alt="Current" />
                                <div className="flex-1 flex flex-col justify-center">
                                    <p className="text-xs text-gray-500 mb-2">Görseliniz karanlık ve kontrast düşük.</p>
                                    <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                        <Wand2 size={14} /> {t('drawer.btn_visual_studio')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- 2. SEO BLOCK --- */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex justify-between items-center">
                            <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2"><RefreshCw size={16} /> {t('drawer.card_seo_title')}</h4>
                            <span className="bg-white text-blue-700 text-xs font-black px-2 py-0.5 rounded shadow-sm border border-blue-100">{product.seo_score}/35</span>
                        </div>
                        <div className="p-4 bg-white">
                            <p className="text-xs text-red-500 mb-3 font-medium bg-red-50 p-2.5 rounded border border-red-100 flex gap-2">
                                <AlertCircle size={14} className="shrink-0 mt-0.5" /> {t('drawer.card_seo_problem')}
                            </p>

                            <div className="space-y-3 mb-4">
                                <div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{t('drawer.lbl_current_title')}</span>
                                    <div className="text-sm text-gray-400 line-through mt-1">{product.title}</div>
                                </div>
                                <div className="flex justify-center">
                                    <ArrowRight size={16} className="text-blue-300 rotate-90 md:rotate-0" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-green-600 font-bold uppercase">{t('drawer.lbl_suggested_title')}</span>
                                    <div className="text-sm text-gray-900 font-bold bg-green-50 p-2.5 rounded border border-green-100 mt-1 shadow-sm">
                                        {product.title} + <span className="text-green-700">2025 Editable Template (SEO Optimized)</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                <Check size={16} /> {t('drawer.btn_update_etsy')}
                            </button>
                        </div>
                    </div>

                    {/* --- 3. TREND BLOCK --- */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-purple-50 px-4 py-3 border-b border-purple-100 flex justify-between items-center">
                            <h4 className="font-bold text-purple-900 text-sm flex items-center gap-2"><TrendingUp size={16} /> {t('drawer.card_trend_title')}</h4>
                            <span className="bg-white text-purple-700 text-xs font-black px-2 py-0.5 rounded shadow-sm border border-purple-100">{product.trend_score}/30</span>
                        </div>
                        <div className="p-4 bg-white">
                            <p className="text-xs text-gray-600 leading-relaxed">{t('drawer.card_trend_problem')}</p>
                        </div>
                    </div>

                </div>

                {/* --- FOOTER: STRATEGIC ACTION --- */}
                {product.status === 'urgent' && (
                    <div className="p-5 border-t border-red-100 bg-red-50 flex-shrink-0">
                        <p className="text-[10px] text-red-600 font-bold uppercase mb-2 text-center">{t('drawer.footer_urgent')}</p>
                        <button className="w-full flex items-center justify-center py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95">
                            <Flame size={18} className="mr-2" /> {t('drawer.btn_relist')}
                        </button>
                    </div>
                )}

                {product.status !== 'urgent' && (
                    <div className="p-5 border-t border-gray-100 bg-white flex-shrink-0">
                        <button onClick={onApply} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-md">
                            {t('common.save')}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default OptimizationDrawer;
