import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, PlusCircle, MousePointer, Zap } from 'lucide-react';

const WelcomePanel = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-10 flex flex-col items-center justify-center h-full min-h-[600px] text-center animate-fade-in sticky top-6">
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-6 rounded-full mb-8 shadow-inner">
                <LayoutDashboard className="w-20 h-20 text-indigo-600" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{t('welcome_panel.title')}</h2>
            <p className="text-gray-500 max-w-md mb-12 text-lg leading-relaxed">{t('welcome_panel.subtitle')}</p>

            <div className="w-full max-w-md space-y-5">
                <div className="flex items-center p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-default group">
                    <div className="bg-blue-50 p-3.5 rounded-xl mr-5 group-hover:bg-blue-100 transition-colors">
                        <PlusCircle className="w-7 h-7 text-blue-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-lg font-bold text-gray-800">{t('welcome_panel.step1_title')}</p>
                        <p className="text-sm text-gray-500">{t('welcome_panel.step1_desc')}</p>
                    </div>
                </div>
                <div className="flex items-center p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-default group">
                    <div className="bg-purple-50 p-3.5 rounded-xl mr-5 group-hover:bg-purple-100 transition-colors">
                        <MousePointer className="w-7 h-7 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-lg font-bold text-gray-800">{t('welcome_panel.step2_title')}</p>
                        <p className="text-sm text-gray-500">{t('welcome_panel.step2_desc')}</p>
                    </div>
                </div>
                <div className="flex items-center p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-yellow-200 transition-all cursor-default group">
                    <div className="bg-yellow-50 p-3.5 rounded-xl mr-5 group-hover:bg-yellow-100 transition-colors">
                        <Zap className="w-7 h-7 text-yellow-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-lg font-bold text-gray-800">{t('welcome_panel.step3_title')}</p>
                        <p className="text-sm text-gray-500">{t('welcome_panel.step3_desc')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomePanel;
