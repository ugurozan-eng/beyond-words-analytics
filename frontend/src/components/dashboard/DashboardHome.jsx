import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Activity,
    Stethoscope,
    Wand2,
    Palette,
    VenetianMask as Spy, // Using VenetianMask as a spy/incognito icon alternative or just Spy if available
    AlertTriangle,
    CheckCircle,
    Clock,
    ArrowRight,
    HeartPulse,
    Search
} from 'lucide-react';

const DashboardHome = ({ onNavigate }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('critical');

    // Mock Data for Health Score
    const healthScore = 72;

    // Mock Data for Triage System
    const triageData = {
        critical: [
            { id: 1, title: "Vintage Leather Journal", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=100&q=80", diagnosis: "Zombi Liste (0 Trafik)" },
            { id: 2, title: "Handmade Ceramic Mug", img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=100&q=80", diagnosis: "Kayıp Etiketler" },
            { id: 3, title: "Boho Wall Decor", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=100&q=80", diagnosis: "Fiyat Uyumsuzluğu" }
        ],
        warning: [
            { id: 4, title: "Silver Ring Set", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=100&q=80", diagnosis: "Düşük Dönüşüm" }
        ],
        healthy: [
            { id: 5, title: "Custom Name Necklace", img: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=100&q=80", diagnosis: "Mükemmel" }
        ]
    };

    // Random Diagnosis Scenario
    const diagnosisScenarios = [
        { title: "Vitrin Gezicisi", desc: "Ürünlerin çok görüntüleniyor ama tıklanmıyor. Ana görseli test etmelisin.", icon: Search, color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Kargo Şoku", desc: "Sepete ekleme yüksek ama satın alma düşük. Kargo fiyatlarını gözden geçir.", icon: Activity, color: "text-red-500", bg: "bg-red-50" },
        { title: "Hayalet Ürün", desc: "Bu ürün aramalarda hiç görünmüyor. SEO başlığını acilen yenile.", icon: Spy, color: "text-purple-500", bg: "bg-purple-50" }
    ];
    // Select a random scenario (stable for this render, in real app could be dynamic)
    const dailyDiagnosis = diagnosisScenarios[0];

    const renderTriageList = () => {
        const items = triageData[activeTab] || [];
        return (
            <div className="space-y-3 mt-4">
                {items.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">Bu kategoride ürün yok.</div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
                            <img src={item.img} alt={item.title} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                            <div className="ml-4 flex-1">
                                <h4 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                                <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block mt-1">
                                    {item.diagnosis}
                                </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500" />
                        </div>
                    ))
                )}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto pb-12 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

                {/* === SOL ALAN (ANALİZ MERKEZİ) - %70 === */}
                <div className="lg:col-span-7 space-y-6">

                    {/* A. HEALTH SCORE HEADER */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-10 -mt-10 blur-2xl opacity-50"></div>

                        {/* Circular Progress (Simplified with CSS conic-gradient) */}
                        <div className="relative w-32 h-32 flex-shrink-0">
                            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center"
                                style={{ background: `conic-gradient(#10b981 ${healthScore}%, #e5e7eb 0)` }}>
                                <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                                    <span className="text-3xl font-bold text-gray-800">{healthScore}</span>
                                    <span className="text-xs text-gray-400 font-medium">/ 100</span>
                                </div>
                            </div>
                            <HeartPulse className="absolute bottom-0 right-0 w-8 h-8 text-white bg-green-500 p-1.5 rounded-full shadow-lg border-2 border-white" />
                        </div>

                        <div className="flex-1 text-center sm:text-left z-10">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('dashboard.health_score_title')}</h2>
                            <p className="text-gray-600 text-base mb-4">{t('dashboard.health_msg_stable')}</p>
                            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                                <div className="flex items-center gap-1.5 text-xs font-medium bg-red-50 text-red-600 px-3 py-1.5 rounded-full border border-red-100">
                                    <AlertTriangle className="w-3.5 h-3.5" /> 3 {t('dashboard.tab_critical')}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-medium bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full border border-yellow-100">
                                    <Clock className="w-3.5 h-3.5" /> 1 {t('dashboard.tab_warning')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* B. TRİYAJ SİSTEMİ */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex border-b border-gray-100">
                            <button
                                onClick={() => setActiveTab('critical')}
                                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all relative ${activeTab === 'critical' ? 'text-red-600 bg-red-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <AlertTriangle className="w-4 h-4" />
                                {t('dashboard.tab_critical')}
                                {activeTab === 'critical' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></div>}
                            </button>
                            <button
                                onClick={() => setActiveTab('warning')}
                                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all relative ${activeTab === 'warning' ? 'text-yellow-600 bg-yellow-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <Clock className="w-4 h-4" />
                                {t('dashboard.tab_warning')}
                                {activeTab === 'warning' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500"></div>}
                            </button>
                            <button
                                onClick={() => setActiveTab('healthy')}
                                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all relative ${activeTab === 'healthy' ? 'text-green-600 bg-green-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <CheckCircle className="w-4 h-4" />
                                {t('dashboard.tab_healthy')}
                                {activeTab === 'healthy' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500"></div>}
                            </button>
                        </div>
                        <div className="p-4">
                            {renderTriageList()}
                        </div>
                    </div>

                    {/* C. GÜNÜN ANALİZİ (Diagnosis Card) */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                        <div className="relative z-10 flex items-start gap-4">
                            <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white`}>
                                <dailyDiagnosis.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-indigo-100 mb-1">{t('dashboard.diagnosis_title')}</h3>
                                <h2 className="text-xl font-bold mb-2">{dailyDiagnosis.title}</h2>
                                <p className="text-indigo-50 text-sm leading-relaxed max-w-lg">
                                    {dailyDiagnosis.desc}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* === SAĞ ALAN (AKSİYON KOKPİTİ) - %30 === */}
                <div className="lg:col-span-3 space-y-4">

                    {/* 1. Product Hospital */}
                    <button
                        onClick={() => onNavigate('analysis')}
                        className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all group text-left flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <Stethoscope className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 group-hover:text-red-600 transition-colors">{t('dashboard.action_hospital_title')}</h3>
                            <p className="text-xs text-gray-500">{t('dashboard.action_hospital_desc')}</p>
                        </div>
                    </button>

                    {/* 2. Create Magic */}
                    <button
                        onClick={() => onNavigate('ai_wizard')}
                        className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all group text-left flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <Wand2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{t('dashboard.action_magic_title')}</h3>
                            <p className="text-xs text-gray-500">{t('dashboard.action_magic_desc')}</p>
                        </div>
                    </button>

                    {/* 3. Color Lab */}
                    <button
                        className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-pink-100 transition-all group text-left flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors">
                            <Palette className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors">{t('dashboard.action_color_title')}</h3>
                            <p className="text-xs text-gray-500">{t('dashboard.action_color_desc')}</p>
                        </div>
                    </button>

                    {/* 4. Competitor Spy */}
                    <button
                        onClick={() => onNavigate('competitor_tracking')}
                        className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-300 transition-all group text-left flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-gray-800 group-hover:text-white transition-colors">
                            <Spy className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 group-hover:text-gray-900 transition-colors">{t('dashboard.action_spy_title')}</h3>
                            <p className="text-xs text-gray-500">{t('dashboard.action_spy_desc')}</p>
                        </div>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
