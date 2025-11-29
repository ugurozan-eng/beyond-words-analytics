import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, TrendingUp, ChevronDown, MapPin } from 'lucide-react';

const GlobalMarketPulse = () => {
    const { t } = useTranslation();
    const [selectedCountry, setSelectedCountry] = useState('USA');

    const marketData = {
        'USA': {
            flag: '🇺🇸',
            categories: [
                { name: 'Personalized Gifts', growth: '+125%' },
                { name: 'Digital Planners', growth: '+85%' },
                { name: 'Wall Art Prints', growth: '+60%' },
                { name: 'Wedding Decor', growth: '+45%' },
                { name: 'Jewelry', growth: '+30%' }
            ],
            keywords: ['minimalist', 'boho', 'custom name', 'printable', 'retro']
        },
        'UK': {
            flag: '🇬🇧',
            categories: [
                { name: 'Home Living', growth: '+90%' },
                { name: 'Vintage Clothing', growth: '+70%' },
                { name: 'Craft Supplies', growth: '+55%' },
                { name: 'Pet Accessories', growth: '+40%' },
                { name: 'Art & Collectibles', growth: '+25%' }
            ],
            keywords: ['cottagecore', 'eco friendly', 'handmade', 'royal', 'tea party']
        },
        'Germany': {
            flag: '🇩🇪',
            categories: [
                { name: 'Sustainable Fashion', growth: '+110%' },
                { name: 'Woodworking', growth: '+80%' },
                { name: 'Baby Products', growth: '+65%' },
                { name: 'Outdoor Gear', growth: '+50%' },
                { name: 'DIY Kits', growth: '+35%' }
            ],
            keywords: ['bio', 'natur', 'holz', 'kinder', 'garten']
        }
    };

    const currentData = marketData[selectedCountry];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="bg-indigo-50 p-2 rounded-lg">
                        <Globe className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{t('global_market_pulse.title')}</h3>
                        <p className="text-xs text-gray-500">{t('global_market_pulse.subtitle')}</p>
                    </div>
                </div>

                <div className="relative">
                    <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                    >
                        <option value="USA">USA 🇺🇸</option>
                        <option value="UK">UK 🇬🇧</option>
                        <option value="Germany">Germany 🇩🇪</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                {/* TOP CATEGORIES */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                        {t('global_market_pulse.rising_categories')}
                    </h4>
                    <div className="space-y-3">
                        {currentData.categories.map((cat, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center space-x-3">
                                    <span className="text-xs font-bold text-gray-400 w-4">{idx + 1}</span>
                                    <span className="text-sm text-gray-600 font-medium group-hover:text-indigo-600 transition-colors">{cat.name}</span>
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{cat.growth}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TRENDING KEYWORDS */}
                <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                    <h4 className="text-sm font-bold text-indigo-900 mb-4 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                        {currentData.flag} {t('global_market_pulse.trending_keywords')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {currentData.keywords.map((keyword, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1.5 bg-white text-indigo-600 text-xs font-bold rounded-lg shadow-sm border border-indigo-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default"
                            >
                                #{keyword}
                            </span>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-indigo-100">
                        <p className="text-xs text-indigo-400 leading-relaxed">
                            {t('global_market_pulse.disclaimer')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalMarketPulse;
