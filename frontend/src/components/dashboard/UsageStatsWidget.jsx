import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Crown } from 'lucide-react';

const UsageStatsWidget = ({ userPlan = 'free', usage = 80 }) => {
    const { t } = useTranslation();

    // Mock usage percentage
    const percentage = 80;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700 text-sm flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-amber-500" />
                    {t('usage.title')}
                </h3>
                <span className="text-xs font-black bg-gray-100 text-gray-600 px-2 py-1 rounded-md uppercase">
                    {userPlan === 'pro' ? 'PRO' : 'FREE'}
                </span>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-gray-500">
                    <span>{t('usage.remaining_credits')}</span>
                    <span>{percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                        className={`h-full rounded-full ${percentage > 20 ? 'bg-indigo-500' : 'bg-red-500'}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">
                    {t('usage.reset_date', { date: '01.12.2025' })}
                </p>
            </div>

            {userPlan !== 'pro' && (
                <button className="mt-4 w-full py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg text-xs font-bold flex items-center justify-center hover:shadow-md transition-all">
                    <Crown className="w-3 h-3 mr-1" />
                    {t('usage.upgrade')}
                </button>
            )}
        </div>
    );
};

export default UsageStatsWidget;
