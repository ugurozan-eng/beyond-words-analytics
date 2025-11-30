import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Activity,
    Stethoscope,
    Wand2,
    Palette,
    VenetianMask as Spy,
    AlertTriangle,
    CheckCircle,
    Clock,
    ArrowRight,
    HeartPulse,
    Search
} from 'lucide-react';
import { calculateLQS, getHealthStatus } from '../../utils/lqsCalculator';

const DashboardHome = ({ onNavigate, listings = [] }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('critical');
    const [displayListings, setDisplayListings] = useState([]);

    // --- DEMO MODE DATA ---
    const mockProducts = [
        {
            id: "demo-red",
            title: "Leather Bag",
            description: "A nice leather bag.",
            tags: ["bag", "leather"],
            images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=200"],
            price: { amount: 50, currency_code: "USD" },
            views: 12,
            favorites: 1,
            is_mock: true
        },
        {
            id: "demo-yellow",
            title: "Handmade Brown Leather Crossbody Bag for Women Summer Style",
            description: "Beautiful handmade crossbody bag for women. Perfect for summer.",
            tags: ["leather bag", "crossbody", "women bag", "summer fashion", "brown purse"],
            images: [
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=200",
                "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=200",
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200"
            ],
            price: { amount: 85, currency_code: "USD" },
            views: 145,
            favorites: 23,
            is_mock: true
        },
        {
            id: "demo-green",
            title: "Personalized Leather Tote Bag, Large Zipper Tote, Work Bag for Women, Custom Laptop Bag with Pockets, Teacher Gift, Graduation Gift",
            description: "High quality personalized leather tote bag. Great for work and daily use.",
            tags: ["personalized bag", "leather tote", "work bag women", "custom laptop bag", "teacher gift", "graduation gift", "large zipper tote", "leather handbag", "custom tote", "monogram bag", "office bag", "gift for her", "shoulder bag"],
            images: [
                "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=200",
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=200",
                "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=200",
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200",
                "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=200",
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=200"
            ],
            price: { amount: 120, currency_code: "USD" },
            views: 1250,
            favorites: 450,
            is_mock: true
        }
    ];

    useEffect(() => {
        if (listings && listings.length > 0) {
            setDisplayListings(listings);
        } else {
            setDisplayListings(mockProducts);
        }
    }, [listings]);

    // Calculate Real Health Score & Triage
    const processedListings = displayListings.map(item => {
        const score = calculateLQS(item);
        const status = getHealthStatus(score);
        let diagnosis = "";
        if (status === 'critical') diagnosis = "Kritik Seviye (LQS < 50)";
        else if (status === 'warning') diagnosis = "İyileştirilebilir (LQS 50-80)";
        else diagnosis = "Mükemmel";

        return {
            ...item,
            lqs: score,
            status: status,
            diagnosis: diagnosis,
            img: item.images && item.images.length > 0 ? item.images[0] : (item.image_url || "https://via.placeholder.com/100")
        };
    });

    const totalScore = processedListings.reduce((acc, curr) => acc + curr.lqs, 0);
    const avgHealthScore = processedListings.length > 0 ? Math.round(totalScore / processedListings.length) : 0;

    const triageData = {
        critical: processedListings.filter(i => i.status === 'critical'),
        warning: processedListings.filter(i => i.status === 'warning'),
        healthy: processedListings.filter(i => i.status === 'healthy')
    };

    // Random Diagnosis Scenario
    const diagnosisScenarios = [
        { title: "Vitrin Gezicisi", desc: "Ürünlerin çok görüntüleniyor ama tıklanmıyor. Ana görseli test etmelisin.", icon: Search, color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Kargo Şoku", desc: "Sepete ekleme yüksek ama satın alma düşük. Kargo fiyatlarını gözden geçir.", icon: Activity, color: "text-red-500", bg: "bg-red-50" },
        { title: "Hayalet Ürün", desc: "Bu ürün aramalarda hiç görünmüyor. SEO başlığını acilen yenile.", icon: Spy, color: "text-purple-500", bg: "bg-purple-50" }
    ];
    // Select a random scenario (stable for this render, in real app could be dynamic)
    const dailyDiagnosis = diagnosisScenarios[0];

    const handleProductClick = (product) => {
        if (onNavigate) onNavigate('analysis', product.id);
    };

    const renderTriageList = () => {
        const items = triageData[activeTab] || [];
        return (
            <div className="space-y-3 mt-4">
                {items.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">Bu kategoride ürün yok.</div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleProductClick(item)}
                            className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                        >
                            <img src={item.img} alt={item.title} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                            <div className="ml-4 flex-1">
                                <h4 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{item.title}</h4>
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
                                style={{ background: `conic-gradient(#10b981 ${avgHealthScore}%, #e5e7eb 0)` }}>
                                <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                                    <span className="text-3xl font-bold text-gray-800">{avgHealthScore}</span>
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
                                    <AlertTriangle className="w-3.5 h-3.5" /> {triageData.critical.length} {t('dashboard.tab_critical')}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-medium bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full border border-yellow-100">
                                    <Clock className="w-3.5 h-3.5" /> {triageData.warning.length} {t('dashboard.tab_warning')}
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
