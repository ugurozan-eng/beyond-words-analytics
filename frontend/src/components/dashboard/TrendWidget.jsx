import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

const TrendWidget = () => {
    const { t } = useTranslation();

    const trends = [
        "Minimalist Wall Art",
        "Digital Planner",
        "Personalized Gift"
    ];

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="w-24 h-24" />
            </div>

            <h3 className="font-bold text-indigo-100 text-sm mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                {t('trends.title')}
            </h3>

            <div className="space-y-3 relative z-10">
                {trends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/10 p-2.5 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer group">
                        <span className="font-medium text-sm">{trend}</span>
                        <ArrowUpRight className="w-4 h-4 text-indigo-200 group-hover:text-white transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendWidget;
