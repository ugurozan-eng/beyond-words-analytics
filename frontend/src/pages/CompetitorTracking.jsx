import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Plus, Search, TrendingUp, Users } from 'lucide-react';

const CompetitorTracking = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in h-full flex flex-col">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center tracking-tight">
                        <ShieldAlert className="w-8 h-8 mr-3 text-indigo-600" />
                        {t('competitor_tracking.title')}
                    </h1>
                    <p className="text-gray-500 mt-2">{t('competitor_tracking.subtitle')}</p>
                </div>
                <button className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                    <Plus className="w-5 h-5 mr-2" />
                    {t('competitor_tracking.add_competitor')}
                </button>
            </div>

            {/* CONTENT */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col">
                {/* Search Bar */}
                <div className="p-6 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={t('competitor_tracking.placeholder')}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Empty State / List Placeholder */}
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <Users className="w-10 h-10 text-indigo-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('competitor_tracking.title')}</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        {t('competitor_tracking.subtitle')}
                    </p>

                    {/* Demo Stats Placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl opacity-50 pointer-events-none select-none blur-[2px]">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
                                <div className="h-8 w-16 bg-gray-300 rounded mb-2"></div>
                                <div className="flex items-center text-green-500 text-sm">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span>+12%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompetitorTracking;
