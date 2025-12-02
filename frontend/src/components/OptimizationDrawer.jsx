import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, Wand2, AlertCircle, Eye, Image, RefreshCw, Flame, ArrowRight, Tag, Zap, ShieldCheck, TrendingUp, ArrowLeftRight } from 'lucide-react';

const OptimizationDrawer = ({ isOpen, onClose, product, onApply }) => {
    const { t } = useTranslation();
    if (!product) return null;

    // Diagnostics
    const isMannequin = product.views > 500 && (product.visits / (product.views || 1)) < 0.01;
    const isGhost = product.views < 50;

    return (
        <div className="h-full flex flex-col bg-white border-l border-gray-200 shadow-xl w-full">

            {/* HEADER: Identity */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <Wand2 className="text-indigo-600" size={20} /> {t('drawer.title')}
                    </h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"><X size={18} className="text-gray-500" /></button>
                </div>

                {/* Traffic Alert Box */}
                {(isMannequin || isGhost) && (
                    <div className={`p-3 rounded-lg border flex gap-3 ${isMannequin ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="mt-0.5">{isMannequin ? <Eye size={16} className="text-amber-600" /> : <AlertCircle size={16} className="text-gray-400" />}</div>
                        <div>
                            <h4 className="font-bold text-xs text-gray-900">{isMannequin ? t('drawer.mannequin_alert') : t('drawer.ghost_alert')}</h4>
                            <p className="text-[10px] text-gray-600 mt-0.5 leading-snug">{isMannequin ? t('drawer.mannequin_desc') : t('drawer.ghost_desc')}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* SCROLLABLE CONTENT: 3 VERTICAL BLOCKS */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

                {/* --- BLOCK 1: VISUAL (Comparison) --- */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-100 flex justify-between items-center">
                        <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-2"><Image size={16} /> {t('drawer.card_visual_title')}</h4>
                        <span className="bg-white text-indigo-700 text-xs font-black px-2 py-0.5 rounded shadow-sm">{product.visual_score}/35</span>
                    </div>
                    <div className="p-4 bg-white">
                        <p className="text-xs text-red-500 mb-3 font-medium bg-red-50 p-2 rounded border border-red-100">
                            {t('drawer.card_visual_problem')}
                        </p>

                        {/* COMPARISON VIEW */}
                        <div className="flex gap-2 mb-4">
                            <div className="flex-1">
                                <span className="text-[10px] text-gray-400 font-bold block mb-1">SENİN GÖRSELİN</span>
                                <img src={product.img} className="w-full h-24 object-cover rounded-lg border border-gray-200 opacity-80" alt="Current" />
                            </div>
                            <div className="flex items-center justify-center text-gray-300"><ArrowLeftRight size={16} /></div>
                            <div className="flex-1">
                                <span className="text-[10px] text-green-600 font-bold block mb-1 flex items-center gap-1"><Zap size={10} /> {t('drawer.card_visual_benchmark')}</span>
                                <img src={product.bestSellerImg} className="w-full h-24 object-cover rounded-lg border-2 border-green-400 shadow-sm" alt="Best Seller" />
                            </div>
                        </div>

                        <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors">
                            {t('drawer.btn_visual_studio')}
                        </button>
                    </div>
                </div>

                {/* --- BLOCK 2: SEO (Actionable) --- */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex justify-between items-center">
                        <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2"><RefreshCw size={16} /> {t('drawer.card_seo_title')}</h4>
                        <span className="bg-white text-blue-700 text-xs font-black px-2 py-0.5 rounded shadow-sm">{product.seo_score}/35</span>
                    </div>
                    <div className="p-4 bg-white">
                        <p className="text-xs text-red-500 mb-3 font-medium bg-red-50 p-2 rounded border border-red-100">
                            {t('drawer.card_seo_problem')}
                        </p>

                        <div className="space-y-2 mb-4">
                            <div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase">{t('drawer.lbl_current_title')}</span>
                                <div className="text-xs text-gray-500 line-through">{product.title}</div>
                            </div>
                            <div>
                                <span className="text-[10px] text-green-600 font-bold uppercase">{t('drawer.lbl_suggested_title')}</span>
                                <div className="text-xs text-gray-900 font-bold bg-green-50 p-2 rounded border border-green-100">
                                    {product.title} + 2025 Editable Template
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                            <Check size={14} /> {t('drawer.btn_update_etsy')}
                        </button>
                    </div>
                </div>

                {/* --- BLOCK 3: TREND --- */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-purple-50 px-4 py-2 border-b border-purple-100 flex justify-between items-center">
                        <h4 className="font-bold text-purple-900 text-sm flex items-center gap-2"><TrendingUp size={16} /> {t('drawer.card_trend_title')}</h4>
                        <span className="bg-white text-purple-700 text-xs font-black px-2 py-0.5 rounded shadow-sm">{product.trend_score}/30</span>
                    </div>
                    <div className="p-4 bg-white">
                        <p className="text-xs text-gray-600">{t('drawer.card_trend_problem')}</p>
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
                <div className="p-5 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                    <button onClick={onApply} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all">
                        {t('common.save')}
                    </button>
                </div>
            )}

        </div>
    );
};

export default OptimizationDrawer;
