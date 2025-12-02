import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, Wand2, AlertCircle, Eye, Image, RefreshCw, Flame, ArrowRight, Tag, Zap, ShieldCheck, TrendingUp } from 'lucide-react';

const OptimizationDrawer = ({ isOpen, onClose, product, onApply }) => {
    const { t } = useTranslation();
    // Ensure we don't return null immediately so animation can play, 
    // but we need product to render content. 
    // If not open, we can still render the structure but hidden, 
    // however if product is null we might have issues.
    // The user's request implies we should render the wrapper even if closed for animation.
    // But if product is null, we can't render inner content.
    // Let's check if product is null. If so, return null (or handle gracefully).
    if (!product && !isOpen) return null;

    // --- LOGIC: Traffic Diagnostics ---
    // Safe access in case product is null during closing animation
    const safeProduct = product || {};
    const isMannequin = safeProduct.views > 500 && (safeProduct.visits / (safeProduct.views || 1)) < 0.01;
    const isGhost = safeProduct.views < 50;

    // --- RENDERERS FOR SCENARIOS ---

    // 1. URGENT (Red)
    const renderUrgentScenario = () => (
        <div className="space-y-4">
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                <h4 className="font-bold text-red-800 flex items-center gap-2">
                    <AlertCircle size={18} /> {t('drawer.scenario_urgent_title')}
                </h4>
                <p className="text-sm text-red-600 mt-1">{t('drawer.scenario_urgent_msg')}</p>
            </div>

            {/* Smart Relist Button */}
            <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-white border border-red-200 rounded-xl hover:shadow-md transition-all group text-left">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg text-red-600 shadow-sm">
                        <Flame size={20} />
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 text-sm">{t('drawer.btn_relist')}</h5>
                        <p className="text-xs text-gray-500">{t('drawer.btn_relist_desc')}</p>
                    </div>
                </div>
                <ArrowRight size={16} className="text-red-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Visual Studio (Alternative) */}
            <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 transition-all group text-left">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-2 rounded-lg text-indigo-600">
                        <Image size={20} />
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 text-sm">{t('drawer.btn_visual_studio')}</h5>
                        <p className="text-xs text-gray-500">{t('drawer.btn_visual_desc')}</p>
                    </div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );

    // 2. IMPROVE (Orange)
    const renderImproveScenario = () => (
        <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                <h4 className="font-bold text-orange-800 flex items-center gap-2">
                    <Wand2 size={18} /> {t('drawer.scenario_improve_title')}
                </h4>
                <p className="text-sm text-orange-600 mt-1">{t('drawer.scenario_improve_msg')}</p>
            </div>

            {/* Tag Fill */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Tag size={16} className="text-amber-500" /> {t('drawer.btn_fill_tags')}
                    </div>
                    <button className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-lg font-bold hover:bg-amber-100">
                        {t('common.apply')}
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {["Minimalist", "Digital", "Boho", "Gift"].map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-50 text-xs text-gray-500 rounded border border-gray-200 dashed">+ {tag}</span>
                    ))}
                </div>
            </div>

            {/* Title Expand */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <RefreshCw size={16} className="text-blue-500" /> {t('drawer.btn_expand_title')}
                    </div>
                    <button className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold hover:bg-blue-100">
                        {t('common.apply')}
                    </button>
                </div>
                <p className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-100 font-medium">
                    {safeProduct.title} + <span className="font-bold">2025 Editable</span>
                </p>
            </div>
        </div>
    );

    // 3. POTENTIAL (Blue)
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
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 text-sm">{t('drawer.btn_price_war')}</h5>
                        <p className="text-xs text-gray-500">Market: $15.00 vs You: $18.00</p>
                    </div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-500 transition-transform" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 transition-all group text-left">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                        <Image size={20} />
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 text-sm">{t('drawer.btn_ab_test')}</h5>
                        <p className="text-xs text-gray-500">Try Lifestyle Image</p>
                    </div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-indigo-500 transition-transform" />
            </button>
        </div>
    );

    // 4. STAR (Green)
    const renderStarScenario = () => (
        <div className="space-y-4">
            <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                <h4 className="font-bold text-green-800 flex items-center gap-2">
                    <ShieldCheck size={18} /> {t('drawer.scenario_star_title')}
                </h4>
                <p className="text-sm text-green-600 mt-1">{t('drawer.scenario_star_msg')}</p>
            </div>

            <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all group text-left cursor-default">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                        <Check size={20} />
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 text-sm">Stok Durumu: İyi</h5>
                        <p className="text-xs text-gray-500">Yeterli stok var.</p>
                    </div>
                </div>
            </button>
        </div>
    );

    return (
        <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>

            {/* Backdrop (Dimmed Background) */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer Panel (Sliding Element) */}
            <div className={`relative w-full max-w-[480px] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* --- HEADER --- */}
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/80 backdrop-blur flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <Wand2 className="text-indigo-600" size={22} />
                            {t('drawer.title')}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
                </div>

                {/* --- CONTENT (Scrollable Area) --- */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Product Mini Card */}
                    {product && (
                        <div className="flex gap-4 mb-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <img src={product.img} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-100" />
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{product.title}</h4>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold 
                      ${product.status === 'urgent' ? 'bg-red-100 text-red-700' :
                                            product.status === 'improve' ? 'bg-orange-100 text-orange-700' :
                                                product.status === 'potential' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                        LQS: {product.lqs}
                                    </span>
                                    <span className="text-xs text-gray-400">ID: #{product.id}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LQS BREAKDOWN */}
                    {product && (
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1"><span>{t('drawer.visual')}</span><span>{product.visual_score}</span></div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div style={{ width: `${product.visual_score}%` }} className="h-full bg-indigo-500"></div></div>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1"><span>{t('drawer.seo')}</span><span>{product.seo_score}</span></div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div style={{ width: `${product.seo_score}%` }} className="h-full bg-blue-500"></div></div>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-1"><span>{t('drawer.trend')}</span><span>{product.trend_score}</span></div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div style={{ width: `${product.trend_score}%` }} className="h-full bg-purple-500"></div></div>
                            </div>
                        </div>
                    )}

                    {/* TRAFFIC DIAGNOSIS */}
                    {(isMannequin || isGhost) && (
                        <div className={`p-4 rounded-xl border flex gap-3 shadow-sm ${isMannequin ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div className={`mt-1 p-1.5 rounded-full ${isMannequin ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-600'}`}>
                                {isMannequin ? <Eye size={18} /> : <AlertCircle size={18} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">{isMannequin ? t('drawer.mannequin_alert') : t('drawer.ghost_alert')}</h4>
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{isMannequin ? t('drawer.mannequin_desc') : t('drawer.ghost_desc')}</p>
                                <div className="flex gap-3 mt-2">
                                    <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200 text-gray-600">Views: <strong>{safeProduct.views}</strong></span>
                                    <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200 text-gray-600">Visits: <strong>{safeProduct.visits}</strong></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC SCENARIO RENDER */}
                    {product && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                {t('drawer.actions_title')}
                            </h4>

                            {/* SWITCH LOGIC */}
                            {product.status === 'urgent' && renderUrgentScenario()}
                            {product.status === 'improve' && renderImproveScenario()}
                            {product.status === 'potential' && renderPotentialScenario()}
                            {product.status === 'star' && renderStarScenario()}
                            {/* Fallback for unanalyzed */}
                            {product.status === 'unanalyzed' && (
                                <div className="text-center p-4 text-gray-500 text-sm">Önce analiz etmelisiniz.</div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- FOOTER (Fixed at bottom) --- */}
                <div className="p-6 border-t border-gray-100 bg-white z-10">
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
