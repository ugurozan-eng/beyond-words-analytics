import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, AlertCircle, CheckCircle, ArrowRight, Zap, Siren } from 'lucide-react';

const HealthCheckWidget = ({ listings = [], onOptimize, horizontal = false }) => {
    const { t } = useTranslation();
    // Calculate health metrics
    const criticalLQS = listings.filter(l => l.lqs_score > 0 && l.lqs_score < 50).length;
    const missingTags = listings.filter(l => l.tags && l.tags.length < 13).length;
    const unanalyzed = listings.filter(l => !l.is_analyzed).length;

    // Calculate overall health score (mock logic)
    const totalListings = listings.length || 1;
    const healthScore = Math.round(100 - ((criticalLQS * 10 + missingTags * 5 + unanalyzed * 2) / totalListings * 10));
    const finalScore = Math.max(0, Math.min(100, healthScore));

    const getHealthColor = (score) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${horizontal ? 'mb-6' : 'h-full flex flex-col'}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="bg-rose-50 p-2 rounded-lg">
                        <Activity className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{t('health_check.title')}</h3>
                        <p className="text-xs text-gray-500">{t('health_check.subtitle')}</p>
                    </div>
                </div>
                <div className={`text-2xl font-black ${getHealthColor(finalScore)}`}>
                    {finalScore}%
                </div>
            </div>

            <div className={horizontal ? "grid grid-cols-1 md:grid-cols-3 gap-4" : "space-y-4 flex-1"}>
                {/* CRITICAL LQS */}
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <div>
                            <p className="text-sm font-bold text-gray-800">{criticalLQS} {t('health_check.critical_product')}</p>
                            <p className="text-xs text-red-400">{t('health_check.lqs_below_50')}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onOptimize && onOptimize()}
                        className="px-3 py-1.5 bg-white text-red-600 text-xs font-bold rounded-lg shadow-sm border border-red-100 hover:bg-red-50 transition-colors"
                    >
                        <Siren className="text-red-600 animate-pulse w-5 h-5 mr-2" />
                        {t('health_check.fix_button')}
                    </button>
                </div>

                {/* MISSING TAGS */}
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="flex items-center space-x-3">
                        <Zap className="w-5 h-5 text-amber-500" />
                        <div>
                            <p className="text-sm font-bold text-gray-800">{missingTags} {t('health_check.missing_tags')}</p>
                            <p className="text-xs text-amber-400">{t('health_check.tags_below_13')}</p>
                        </div>
                    </div>
                    <button className="px-3 py-1.5 bg-white text-amber-600 text-xs font-bold rounded-lg shadow-sm border border-amber-100 hover:bg-amber-50 transition-colors">
                        {t('health_check.complete_button')}
                    </button>
                </div>

                {/* UNANALYZED */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                        <div>
                            <p className="text-sm font-bold text-gray-800">{unanalyzed} {t('health_check.unanalyzed')}</p>
                            <p className="text-xs text-blue-400">{t('health_check.not_scanned_yet')}</p>
                        </div>
                    </div>
                    <button className="p-1.5 bg-white text-blue-600 rounded-lg shadow-sm border border-blue-100 hover:bg-blue-50 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HealthCheckWidget;
