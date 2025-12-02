import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, Wand2, AlertCircle, Eye, Image, RefreshCw, Flame, ArrowRight, Tag, Zap, ShieldCheck, TrendingUp } from 'lucide-react';

const OptimizationDrawer = ({ isOpen, onClose, product, onApply }) => {
    const { t } = useTranslation();
    if (!product) return null;

    // Traffic Diagnostics
    const isMannequin = product.views > 500 && (product.visits / (product.views || 1)) < 0.01;
    const isGhost = product.views < 50;

    // --- SCENARIO RENDERERS (Same Logic, Just Rendering) ---
    const renderUrgentScenario = () => (
        <div className="space-y-4">
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                <h4 className="font-bold text-red-800 flex items-center gap-2"><AlertCircle size={18} /> {t('drawer.scenario_urgent_title')}</h4>
                <p className="text-sm text-red-600 mt-1">{t('drawer.scenario_urgent_msg')}</p>
            </div>
            <button className="w-full flex items-center justify-between p-4 bg-white border border-red-200 rounded-xl hover:shadow-md transition-all group text-left">
                <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-2 rounded-lg text-red-600"><Flame size={20} /></div>
                    <div><h5 className="font-bold text-gray-900 text-sm">{t('drawer.btn_relist')}</h5><p className="text-xs text-gray-500">{t('drawer.btn_relist_desc')}</p></div>
                </div>
                <ArrowRight size={16} className="text-red-400 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );

    const renderImproveScenario = () => (
        <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                <h4 className="font-bold text-orange-800 flex items-center gap-2"><Wand2 size={18} /> {t('drawer.scenario_improve_title')}</h4>
                <p className="text-sm text-orange-600 mt-1">{t('drawer.scenario_improve_msg')}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700"><Tag size={16} className="text-amber-500" /> {t('drawer.btn_fill_tags')}</div>
                    <button className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-lg font-bold hover:bg-amber-100">{t('common.apply')}</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {["Minimalist", "Digital", "Boho", "Gift"].map((tag, i) => (<span key={i} className="px-2 py-1 bg-gray-50 text-xs text-gray-500 rounded border border-gray-200 dashed cursor-pointer hover:bg-amber-50">+ {tag}</span>))}
                </div>
            </div>
        </div>
    );

    const renderPotentialScenario = () => (
        <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                <h4 className="font-bold text-blue-800 flex items-center gap-2"><Zap size={18} /> {t('drawer.scenario_potential_title')}</h4>
                <p className="text-sm text-blue-600 mt-1">{t('drawer.scenario_potential_msg')}</p>
            </div>
            <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 transition-all group text-left">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><TrendingUp size={20} /></div>
                    <div><h5 className="font-bold text-gray-900 text-sm">{t('drawer.btn_price_war')}</h5><p className="text-xs text-gray-500">Market: $15.00 vs You: $18.00</p></div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-500 transition-transform" />
            </button>
        </div>
    );

    const renderStarScenario = () => (
        <div className="space-y-4">
            <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                <h4 className="font-bold text-green-800 flex items-center gap-2"><ShieldCheck size={18} /> {t('drawer.scenario_star_title')}</h4>
                <p className="text-sm text-green-600 mt-1">{t('drawer.scenario_star_msg')}</p>
            </div>
        </div>
    );

    // --- NEW STRUCTURE: STATIC PANEL (Not Fixed Overlay) ---
    // This component will sit inside a Flex container, taking up 100% height of its parent.
    return (
        <div className="h-full flex flex-col bg-white border-l border-gray-200 shadow-xl w-full">

            {/* HEADER */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0 flex justify-between items-center">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <Wand2 className="text-indigo-600" size={20} /> {t('drawer.title')}
                </h3>
                <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"><X size={18} className="text-gray-500" /></button>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Product Mini Card */}
                <div className="flex gap-3 mb-2 bg-white p-3 border border-gray-100 rounded-xl shadow-sm">
                    <img src={product.img} alt="" className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{product.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${product.lqs < 50 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>LQS: {product.lqs}</span>
                        </div>
                    </div>
                </div>

                {/* LQS BREAKDOWN */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-50 p-2 rounded border border-gray-100 text-center"><span className="block text-[10px] text-gray-400 font-bold">VIS</span><span className="text-sm font-black text-indigo-600">{product.visual_score}</span></div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-100 text-center"><span className="block text-[10px] text-gray-400 font-bold">SEO</span><span className="text-sm font-black text-blue-600">{product.seo_score}</span></div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-100 text-center"><span className="block text-[10px] text-gray-400 font-bold">TRD</span><span className="text-sm font-black text-purple-600">{product.trend_score}</span></div>
                </div>

                {/* TRAFFIC DIAGNOSIS */}
                {(isMannequin || isGhost) && (
                    <div className={`p-3 rounded-lg border flex gap-3 ${isMannequin ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="mt-0.5">{isMannequin ? <Eye size={16} className="text-amber-600" /> : <AlertCircle size={16} className="text-gray-400" />}</div>
                        <div>
                            <h4 className="font-bold text-xs text-gray-900">{isMannequin ? t('drawer.mannequin_alert') : t('drawer.ghost_alert')}</h4>
                            <p className="text-[10px] text-gray-600 mt-0.5 leading-snug">{isMannequin ? t('drawer.mannequin_desc') : t('drawer.ghost_desc')}</p>
                        </div>
                    </div>
                )}

                {/* DYNAMIC ACTIONS */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('drawer.actions_title')}</h4>
                    {product.status === 'urgent' && renderUrgentScenario()}
                    {product.status === 'improve' && renderImproveScenario()}
                    {product.status === 'potential' && renderPotentialScenario()}
                    {product.status === 'star' && renderStarScenario()}
                </div>

                {/* ADVANCED */}
                <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('drawer.advanced_title')}</h4>
                    <button className="w-full flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-all group text-left">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-1.5 rounded-lg text-indigo-600 shadow-sm"><Image size={18} /></div>
                            <div><h5 className="font-bold text-indigo-900 text-sm">{t('drawer.btn_visual_studio')}</h5></div>
                        </div>
                        <ArrowRight size={14} className="text-indigo-400" />
                    </button>
                </div>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                <button onClick={onApply} className="w-full flex items-center justify-center py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
                    <Check size={18} className="mr-2" /> {t('common.save')}
                </button>
            </div>
        </div>
    );
};

export default OptimizationDrawer;
