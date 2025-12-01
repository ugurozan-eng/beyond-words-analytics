import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CompetitorTracking from './CompetitorTracking';
import TagSpy from './TagSpy';
import { ShieldAlert, Eye } from 'lucide-react';

const CompetitorAnalysis = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('tracking'); // 'tracking' or 'spy'

    return (
        <div className="flex flex-col h-full">
            {/* TAB HEADER */}
            <div className="bg-white border-b border-gray-200 px-6 pt-4">
                <div className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('tracking')}
                        className={`pb-4 flex items-center font-bold text-sm transition-all border-b-2 ${activeTab === 'tracking'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <ShieldAlert className={`w-5 h-5 mr-2 ${activeTab === 'tracking' ? 'text-indigo-600' : 'text-gray-400'}`} />
                        {t('competitor_analysis.tab_tracking')}
                    </button>

                    <button
                        onClick={() => setActiveTab('spy')}
                        className={`pb-4 flex items-center font-bold text-sm transition-all border-b-2 ${activeTab === 'spy'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Eye className={`w-5 h-5 mr-2 ${activeTab === 'spy' ? 'text-indigo-600' : 'text-gray-400'}`} />
                        {t('competitor_analysis.tab_spy')}
                    </button>
                </div>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 overflow-hidden relative bg-gray-50">
                <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'tracking' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <CompetitorTracking />
                </div>
                <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'spy' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <TagSpy />
                </div>
            </div>
        </div>
    );
};

export default CompetitorAnalysis;
