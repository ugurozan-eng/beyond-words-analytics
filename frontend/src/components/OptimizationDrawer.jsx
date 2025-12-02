import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Check, Wand2, AlertCircle, Eye, Image, RefreshCw } from 'lucide-react';

const OptimizationDrawer = ({ isOpen, onClose, product, onApply }) => {
    const { t } = useTranslation();
    if (!isOpen || !product) return null;

    // Traffic Diagnostics Logic
    const isMannequin = product.views > 1000 && (product.visits / product.views) < 0.01;
    const isGhost = product.views < 50;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl animate-slide-in-right flex flex-col overflow-hidden">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-black text-gray-900">{t('drawer.title', 'Hızlı Optimizasyon')}</h3>
                        <p className="text-xs text-gray-500">{product.title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} className="text-gray-500" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* 1. LQS SCORECARD */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">{t('drawer.scorecard_title', 'LQS Karnesi')}</h4>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-indigo-50 p-3 rounded-xl text-center border border-indigo-100">
                                <div className="text-indigo-600 font-black text-xl">{product.visual_score}</div>
                                <div className="text-[10px] text-indigo-400 font-bold uppercase">{t('drawer.visual', 'Görsel')}</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-xl text-center border border-blue-100">
                                <div className="text-blue-600 font-black text-xl">{product.seo_score}</div>
                                <div className="text-[10px] text-blue-400 font-bold uppercase">{t('drawer.seo', 'SEO')}</div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-xl text-center border border-purple-100">
                                <div className="text-purple-600 font-black text-xl">{product.trend_score}</div>
                                <div className="text-[10px] text-purple-400 font-bold uppercase">{t('drawer.trend', 'Trend')}</div>
                            </div>
                        </div>
                    </div>

                    {/* 2. TRAFFIC DIAGNOSIS (Data Driven) */}
                    {(isMannequin || isGhost) && (
                        <div className={`p-4 rounded-xl border flex gap-3 ${isMannequin ? 'bg-amber-50 border-amber-100' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="mt-1">
                                {isMannequin ? <Eye className="text-amber-500" size={20} /> : <AlertCircle className="text-gray-400" size={20} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">
                                    {isMannequin ? t('drawer.mannequin_alert', 'Vitrin Mankeni!') : t('drawer.ghost_alert', 'Hayalet Ürün!')}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1">
                                    {isMannequin
                                        ? t('drawer.mannequin_desc', 'Çok görüntüleniyor ama tıklanmıyor. Görsel zayıf.')
                                        : t('drawer.ghost_desc', 'Etsy\'de görünmüyor. SEO veya Pazar sorunu.')}
                                </p>
                                <div className="flex gap-4 mt-2 text-xs font-mono text-gray-500">
                                    <span>Views: {product.views}</span>
                                    <span>Visits: {product.visits}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. SMART ACTIONS */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">{t('drawer.actions_title', 'Aksiyonlar')}</h4>

                        <div className="space-y-3">
                            {/* Visual Studio Trigger */}
                            <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Image size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-gray-900 text-sm">{t('drawer.btn_visual_studio', 'AI Görsel Stüdyosu')}</div>
                                        <div className="text-xs text-gray-500">Yeni mockup üret ve dene</div>
                                    </div>
                                </div>
                                <Wand2 size={16} className="text-gray-300 group-hover:text-indigo-500" />
                            </button>

                            {/* SEO Magic Trigger */}
                            <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <RefreshCw size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-gray-900 text-sm">{t('drawer.btn_seo_magic', 'Sihirli SEO')}</div>
                                        <div className="text-xs text-gray-500">Başlık ve etiketleri yenile</div>
                                    </div>
                                </div>
                                <Wand2 size={16} className="text-gray-300 group-hover:text-blue-500" />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <button onClick={onApply} className="w-full flex items-center justify-center py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
                        <Check size={20} className="mr-2" />
                        {t('common.save', 'Kaydet ve Kapat')}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OptimizationDrawer;
