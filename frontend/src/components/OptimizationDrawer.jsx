import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, Wand2, AlertCircle, Eye, Image, RefreshCw, Flame, ArrowRight, Tag, Zap, ShieldCheck, TrendingUp } from 'lucide-react';

const OptimizationDrawer = ({ isOpen, onClose, product, onApply }) => {
    const { t } = useTranslation();

    // Early return but keep the DOM present for animation if needed (or simple null)
    if (!product && !isOpen) return null;

    // --- LOGIC: Traffic Diagnostics ---
    const isMannequin = product?.views > 500 && (product?.visits / (product?.views || 1)) < 0.01;
    const isGhost = product?.views < 50;

    // --- SCENARIO RENDERERS ---
    const renderUrgentScenario = () => (
        <div className="space-y-4">
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                <h4 className="font-bold text-red-800 flex items-center gap-2">
                    <AlertCircle size={18} /> {t('drawer.scenario_urgent_title')}
                </h4>
                <p className="text-sm text-red-600 mt-1">{t('drawer.scenario_urgent_msg')}</p>
            </div>
            <button className="w-full flex items-center justify-between p-4 bg-white border border-red-200 rounded-xl hover:shadow-md transition-all group text-left">
                <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-2 rounded-lg text-red-600"><Flame size={20} /></div>
                    <div>
                        <h5 className="font-bold text-gray-900 text-sm">{t('drawer.btn_relist')}</h5>
                        <p className="text-xs text-gray-500">{t('drawer.btn_relist_desc')}</p>
                    </div>
                </div>
                <ArrowRight size={16} className="text-red-400 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );

    const renderImproveScenario = () => (
        <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                <h4 className="font-bold text-orange-800 flex items-center gap-2">
                    <Wand2 size={18} /> {t('drawer.scenario_improve_title')}
                </h4>
                <p className="text-sm text-orange-600 mt-1">{t('drawer.scenario_improve_msg')}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Tag size={16} className="text-amber-500" /> {t('drawer.btn_fill_tags')}
                    </div>
                    <button className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-lg font-bold hover:bg-amber-100">{t('common.apply')}</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {["Minimalist", "Digital", "Boho", "Gift"].map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-50 text-xs text-gray-500 rounded border border-gray-200 dashed cursor-pointer hover:bg-amber-50">+ {tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPotentialScenario = () => (
        <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                <h4 className="font-bold text-blue-800 flex items-center gap-2">
                    <Zap size={18} /> {t('drawer.scenario_potential_title')}
                </h4>
                <p className="text-sm text-blue-600 mt-1">{t('drawer.scenario_potential_msg')}</p>
            </div>
            <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 transition-all group text-left">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><TrendingUp size={20} /></div>
                    <div>
                        <h5 className="font-bold text-gray-900 text-sm">{t('drawer.btn_price_war')}</h5>
                        <p className="text-xs text-gray-500">Market: $15.00 vs You: $18.00</p>
                    </div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-500 transition-transform" />
            </button>
        </div>
    );

    const renderStarScenario = () => (
        <div className="space-y-4">
            <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                <h4 className="font-bold text-green-800 flex items-center gap-2">
                    <ShieldCheck size={18} /> {t('drawer.scenario_star_title')}
                </h4>
                <p className="text-sm text-green-600 mt-1">{t('drawer.scenario_star_msg')}</p>
            </div>
        </div>
    );

    // --- RENDER MAIN DRAWER STRUCTURE ---
    return (
        <div
            className={`fixed inset-0 z-50 flex justify-end pointer-events-none overflow-hidden`}
        >
            {/* 1. BACKDROP (Click to Close) - Pointer events AUTO to catch clicks */}
            <div
                className={`absolute inset-0 bg-gray-900/20 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* 2. DRAWER PANEL - Slide from Right */}
            <div
                className={`relative w-full max-w-[500px] h-full bg-white shadow-2xl flex flex-col pointer-events-auto 
          transform transition-transform duration-300 ease-in-out border-l border-gray-100
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >

                {/* HEADER */}
                {product && (
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/80 backdrop-blur flex-shrink-0">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <Wand2 className="text-indigo-600" size={22} /> {t('drawer.title')}
                            </h3>
                            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
                        </div>

                        <div className="flex gap-4">
                            <img src={product.img} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm" />
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{product.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${product.lqs < 50 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>LQS: {product.lqs}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {product && (
                        <>
                            {/* Traffic Diagnosis */}
                            {(isMannequin || isGhost) && (
                                <div className={`p-4 rounded-xl border flex gap-3 shadow-sm ${isMannequin ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className={`mt-1 p-1.5 rounded-full ${isMannequin ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-600'}`}>
                                        {isMannequin ? <Eye size={18} /> : <AlertCircle size={18} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">{isMannequin ? t('drawer.mannequin_alert') : t('drawer.ghost_alert')}</h4>
                                        <p className="text-xs text-gray-600 mt-1">{isMannequin ? t('drawer.mannequin_desc') : t('drawer.ghost_desc')}</p>
                                    </div>
                                </div>
                            )}

                            {/* Dynamic Content Based on Status */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('drawer.actions_title')}</h4>
                                {product.status === 'urgent' && renderUrgentScenario()}
                                {product.status === 'improve' && renderImproveScenario()}
                                {product.status === 'potential' && renderPotentialScenario()}
                                {product.status === 'star' && renderStarScenario()}
                            </div>

                            {/* Advanced Link (Always Visible) */}
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('drawer.advanced_title')}</h4>
                                <button className="w-full flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-all group text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-lg text-indigo-600 shadow-sm"><Image size={20} /></div>
                                        <div>
                                            <h5 className="font-bold text-indigo-900 text-sm">{t('drawer.btn_visual_studio')}</h5>
                                            <p className="text-xs text-indigo-600/80">{t('drawer.btn_visual_desc')}</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* FOOTER */}
                <div className="p-6 border-t border-gray-100 bg-white z-10 flex-shrink-0">
                    <button onClick={onApply} className="w-full flex items-center justify-center py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
                        <Check size={20} className="mr-2" /> {t('common.save')}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OptimizationDrawer;
