import React from 'react';
import { useTranslation } from 'react-i18next';

const PricingCard = ({ min, max, optimal, reason, currency = "$" }) => {
    const { t } = useTranslation();
    const range = max - min;
    const targetPrice = optimal || ((min + max) / 2);
    const position = range > 0 ? ((targetPrice - min) / range) * 100 : 50;

    return (
        <div className="bg-gradient-to-br from-white to-indigo-50/50 border border-indigo-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden mb-6 group">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl shadow-sm">
                {t('pricing.neuro_pricing')}
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="text-center md:text-left min-w-[160px]">
                    <div className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">{t('pricing.suggested_price')}</div>
                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tighter">
                        {currency}{targetPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-indigo-500 mt-2 font-bold bg-indigo-50 px-2 py-1 rounded-lg inline-block">
                        {t('pricing.confidence_interval')}: {currency}{min} - {currency}{max}
                    </div>
                </div>

                <div className="flex-1 w-full pt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono">
                        <span>{t('pricing.min')} ({currency}{min})</span>
                        <span>{t('pricing.max')} ({currency}{max})</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full relative w-full shadow-inner overflow-hidden">
                        <div
                            className="absolute h-full bg-gradient-to-r from-indigo-300 to-indigo-500 rounded-l-full opacity-50"
                            style={{ width: `${Math.min(Math.max(position, 0), 100)}%` }}
                        ></div>
                        <div
                            className="absolute h-6 w-6 bg-white rounded-full border-4 border-indigo-600 shadow-md transform -translate-x-1/2 -translate-y-1 transition-all duration-500 top-0"
                            style={{ left: `${Math.min(Math.max(position, 0), 100)}%` }}
                        ></div>
                    </div>
                    <div className="mt-4 text-sm text-gray-700 bg-white/60 p-4 rounded-xl border border-indigo-50/50 shadow-sm backdrop-blur-sm">
                        <span className="font-bold text-indigo-600">🤖 {t('pricing.strategy')}: </span>
                        {reason || t('pricing.analyzing')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingCard;
