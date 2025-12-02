import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, Wand2, AlertCircle, Eye, Image, RefreshCw, Flame, Tag, ArrowRight } from 'lucide-react';

const OptimizationDrawer = ({ isOpen, onClose, product, onApply }) => {
    const { t } = useTranslation();
    if (!isOpen || !product) return null;

    // --- LOGIC: Traffic Diagnostics (Mock Data Check) ---
    const isMannequin = product.views > 500 && (product.visits / (product.views || 1)) < 0.01;
    const isGhost = product.views < 50;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* DRAWER PANEL */}
            <div className="relative w-full max-w-lg h-full bg-white shadow-2xl animate-slide-in-right flex flex-col overflow-hidden border-l border-gray-100">

                {/* --- 1. HEADER: IDENTITY & SCORECARD --- */}
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <Wand2 className="text-indigo-600" size={20} />
                            {t('drawer.title')}
                        </h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
                    </div>

                    {/* Product Mini Card */}
                    <div className="flex gap-4 mb-4">
                        <img src={product.img} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm" />
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{product.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${product.lqs < 50 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                    LQS: {product.lqs}
                                </span>
                                <span className="text-xs text-gray-400">ID: #{product.id}</span>
                            </div>
                        </div>
                    </div>

                    {/* LQS BREAKDOWN BARS */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                            <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1">
                                <span>{t('drawer.visual')}</span>
                                <span>{product.visual_score}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div style={{ width: `${product.visual_score}%` }} className="h-full bg-indigo-500"></div>
                            </div>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                            <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1">
                                <span>{t('drawer.seo')}</span>
                                <span>{product.seo_score}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div style={{ width: `${product.seo_score}%` }} className="h-full bg-blue-500"></div>
                            </div>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                            <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1">
                                <span>{t('drawer.trend')}</span>
                                <span>{product.trend_score}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div style={{ width: `${product.trend_score}%` }} className="h-full bg-purple-500"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SCROLLABLE CONTENT --- */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* --- 2. TRAFFIC INTELLIGENCE (Diagnosis) --- */}
                    {(isMannequin || isGhost) && (
                        <div className={`p-4 rounded-xl border flex gap-3 shadow-sm ${isMannequin ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div className={`mt-1 p-1.5 rounded-full ${isMannequin ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-600'}`}>
                                {isMannequin ? <Eye size={18} /> : <AlertCircle size={18} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">
                                    {isMannequin ? t('drawer.mannequin_alert') : t('drawer.ghost_alert')}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                    {isMannequin ? t('drawer.mannequin_desc') : t('drawer.ghost_desc')}
                                </p>
                                <div className="flex gap-3 mt-2">
                                    <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200 text-gray-600">Views: <strong>{product.views}</strong></span>
                                    <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200 text-gray-600">Visits: <strong>{product.visits}</strong></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- 3. QUICK WINS (Strike 1.0) --- */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('drawer.actions_title')}</h4>

                        {/* Title Fixer */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3 hover:border-blue-300 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <RefreshCw size={16} className="text-blue-500" /> {t('drawer.seo_fix_title')}
                                </div>
                                <button className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition-colors">
                                    🪄 {t('drawer.btn_seo_fix')}
                                </button>
                            </div>
                            <div className="space-y-2">
                                <div className="text-xs text-red-400 line-through bg-red-50 p-2 rounded block truncate opacity-70">
                                    {product.title}
                                </div>
                                <div className="text-xs text-green-700 bg-green-50 p-2 rounded block font-medium border border-green-100">
                                    {product.title} <span className="font-bold">+ 2025 Editable Template (SEO Optimized)</span>
                                </div>
                            </div>
                        </div>

                        {/* Tag Fixer */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-700">
                                <Tag size={16} className="text-amber-500" /> {t('drawer.missing_tags')}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {["Minimalist", "Digital Download", "Boho Style", "Wall Art"].map((tag, i) => (
                                    <button key={i} className="px-3 py-1 bg-gray-100 hover:bg-amber-100 hover:text-amber-700 hover:border-amber-200 border border-transparent rounded-full text-xs font-medium text-gray-600 transition-all flex items-center gap-1">
                                        + {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- 4. ADVANCED GATEWAYS (Strike 1.5) --- */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('drawer.advanced_title')}</h4>
                        <div className="grid grid-cols-1 gap-3">

                            {/* Visual Studio Button */}
                            <button className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 hover:shadow-sm transition-all group text-left">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg text-indigo-600 shadow-sm">
                                        <Image size={20} />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-indigo-900 text-sm">{t('drawer.btn_visual_studio')}</h5>
                                        <p className="text-xs text-indigo-600/80">{t('drawer.btn_visual_desc')}</p>
                                    </div>
                                </div>
                                <ArrowRight size={16} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Phoenix Protocol Button (Only if Critical/Ghost) */}
                            {product.lqs < 50 && (
                                <button className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-100 transition-all group text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-lg text-gray-600 group-hover:text-red-500 shadow-sm transition-colors">
                                            <Flame size={20} />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-gray-900 text-sm group-hover:text-red-700">{t('drawer.btn_phoenix')}</h5>
                                            <p className="text-xs text-gray-500 group-hover:text-red-500">{t('drawer.btn_phoenix_desc')}</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-gray-400 group-hover:text-red-400 group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}

                        </div>
                    </div>

                </div>

                {/* --- FOOTER --- */}
                <div className="p-6 border-t border-gray-100 bg-white">
                    <button onClick={onApply} className="w-full flex items-center justify-center py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
                        <Check size={20} className="mr-2" />
                        {t('common.save')}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OptimizationDrawer;
