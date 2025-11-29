import React from 'react';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Sparkles } from 'lucide-react';

const DailyInsightWidget = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-5 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 bg-amber-100 rounded-full w-24 h-24 opacity-50"></div>

            <div className="flex items-start space-x-4 relative z-10">
                <div className="p-2 bg-white rounded-lg shadow-sm text-amber-500">
                    <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1 flex items-center">
                        {t('daily_insight.title')}
                        <Sparkles className="w-3 h-3 text-amber-400 ml-2" />
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        {t('daily_insight.content')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DailyInsightWidget;
