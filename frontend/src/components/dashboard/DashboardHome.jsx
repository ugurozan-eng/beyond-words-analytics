import React from 'react';
import { useTranslation } from 'react-i18next';
import CurrencyWidget from './CurrencyWidget';
import TrendWidget from './TrendWidget';
import UsageStatsWidget from './UsageStatsWidget';
import QuickActions from './QuickActions';
import DailyInsightWidget from './DailyInsightWidget';
import MiniStatCard from './MiniStatCard';
import { DollarSign, Package, TrendingUp, Zap } from 'lucide-react';

const DashboardHome = ({ onNavigate, userPlan }) => {
    const { t } = useTranslation();

    const handleQuickAction = (actionId) => {
        switch (actionId) {
            case 'create_listing':
                onNavigate('create-listing');
                break;
            case 'seo_analysis':
                onNavigate('analysis');
                break;
            case 'color_palette':
                // Future feature
                break;
            case 'image_prompt':
                onNavigate('create-listing'); // Assuming part of AI wizard
                break;
            default:
                break;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10 max-w-7xl mx-auto">
            {/* HEADER SECTION: Currency & Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <CurrencyWidget />
                </div>
                <div className="lg:col-span-1">
                    <DailyInsightWidget />
                </div>
            </div>

            {/* MAIN STATS STRIP */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MiniStatCard title={t('mini_stats.market_volume')} value="$4.2M" icon={DollarSign} color="bg-blue-500" />
                <MiniStatCard title={t('mini_stats.active_sellers')} value="12.5K" icon={Package} color="bg-emerald-500" />
                <MiniStatCard title={t('mini_stats.trend_keywords')} value="850+" icon={TrendingUp} color="bg-violet-500" />
                <MiniStatCard title={t('mini_stats.opportunity_score')} value="8.4" icon={Zap} color="bg-orange-500" />
            </div>

            {/* ACTION CENTER */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <h2 className="text-lg font-bold text-gray-800">{t('dashboard.quick_actions_title')}</h2>
                    <QuickActions onAction={handleQuickAction} />

                    {/* MARKET TRENDS PLACEHOLDER (Reused from old dashboard for now) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-center text-center h-64">
                        <div className="p-4 bg-indigo-50 rounded-full mb-4">
                            <TrendingUp className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{t('market_trends.summary_title')}</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                            {t('market_trends.summary_desc')}
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <TrendWidget />
                    <UsageStatsWidget userPlan={userPlan} />
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
