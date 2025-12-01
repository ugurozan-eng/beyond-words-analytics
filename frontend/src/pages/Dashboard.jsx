import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    TrendingUp, AlertTriangle, Tag, ScanLine,
    ArrowRight, Zap, MoreHorizontal, LayoutGrid
} from 'lucide-react';

// --- MOCK DATA FOR SIMULATION ---
const MOCK_INVENTORY = [
    {
        id: 1,
        title: "Minimalist Beige Wall Art Printable Abstract",
        img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=150&h=150&fit=crop",
        lqs: 45,
        visual_score: 40,
        seo_score: 30,
        trend_score: 65,
        status: "critical",
        issues: ["Low Contrast", "Title too short"]
    },
    {
        id: 2,
        title: "Boho Wedding Invitation Template Editable",
        img: "https://images.unsplash.com/photo-1517456426749-a29881882670?w=150&h=150&fit=crop",
        lqs: 92,
        visual_score: 95,
        seo_score: 90,
        trend_score: 91,
        status: "optimized",
        issues: []
    },
    {
        id: 3,
        title: "Leather Crossbody Bag Handmade Vintage Style",
        img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=150&h=150&fit=crop",
        lqs: 65,
        visual_score: 60,
        seo_score: 80,
        trend_score: 55,
        status: "warning",
        issues: ["Missing Tags"]
    },
    {
        id: 4,
        title: "Digital Planner 2025 Goodnotes Sticker Set",
        img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=150&h=150&fit=crop",
        lqs: 20,
        visual_score: 10,
        seo_score: 40,
        trend_score: 10,
        status: "critical",
        issues: ["Blurry Image", "Spam Title"]
    },
    {
        id: 5,
        title: "Custom Pet Portrait Oil Painting From Photo",
        img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=150&h=150&fit=crop",
        lqs: 0,
        visual_score: 0,
        seo_score: 0,
        trend_score: 0,
        status: "unanalyzed",
        issues: []
    }
];

const Dashboard = () => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState('all'); // all, critical, missing

    // --- 1. PULSE BAR (Mini Stats) ---
    const MiniStat = ({ label, value, icon: Icon, color }) => (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                <h3 className="text-2xl font-black text-gray-900">{value}</h3>
            </div>
        </div>
    );

    // --- 2. ACTION STREAM (Horizontal Filter Cards) ---
    const ActionCard = ({ title, desc, count, icon: Icon, color, filterType }) => (
        <button
            onClick={() => setFilter(filterType)}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all w-full text-left
        ${filter === filterType
                    ? `bg-${color}-50 border-${color}-500 ring-1 ring-${color}-500`
                    : 'bg-white border-gray-100 hover:border-gray-300'}`}
        >
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">{title}</h4>
                    <p className="text-xs text-gray-500">{desc}</p>
                </div>
            </div>
            <div className={`text-xl font-black text-${color}-600`}>{count}</div>
        </button>
    );

    // Filter Logic
    const filteredData = filter === 'all'
        ? MOCK_INVENTORY
        : MOCK_INVENTORY.filter(item => item.status === filter);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">

            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">{t('dashboard.title')}</h1>
                    <p className="text-gray-500 mt-1">{t('dashboard.subtitle')}</p>
                </div>
                <div className="flex space-x-2">
                    {/* Future Global Actions */}
                </div>
            </div>

            {/* SECTION 1: PULSE BAR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MiniStat label={t('dashboard.stat_products')} value="142" icon={LayoutGrid} color="bg-indigo-100" />
                <MiniStat label={t('dashboard.stat_value')} value="$4,850" icon={Zap} color="bg-emerald-100" />
                <MiniStat label={t('dashboard.stat_lqs')} value="68.5" icon={TrendingUp} color="bg-purple-100" />
            </div>

            {/* SECTION 2: ACTION STREAM (Horizontal) */}
            <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">{t('dashboard.section_actions')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ActionCard
                        title={t('dashboard.card_critical')}
                        desc={t('dashboard.card_critical_desc')}
                        count="12"
                        icon={AlertTriangle}
                        color="red"
                        filterType="critical"
                    />
                    <ActionCard
                        title={t('dashboard.card_missing')}
                        desc={t('dashboard.card_missing_desc')}
                        count="5"
                        icon={Tag}
                        color="amber"
                        filterType="warning"
                    />
                    <ActionCard
                        title={t('dashboard.card_unanalyzed')}
                        desc={t('dashboard.card_unanalyzed_desc')}
                        count="8"
                        icon={ScanLine}
                        color="gray"
                        filterType="unanalyzed"
                    />
                </div>
            </div>

            {/* SECTION 3: SMART INVENTORY (Modern List) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 flex items-center">
                        <LayoutGrid size={18} className="mr-2 text-indigo-600" />
                        {t('dashboard.inventory_title')}
                        <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{filteredData.length}</span>
                    </h3>
                </div>

                <div className="divide-y divide-gray-100">
                    {filteredData.map((item) => (
                        <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors group">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">

                                {/* Image */}
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 truncate pr-4">{item.title}</h4>
                                    <div className="flex items-center space-x-2 mt-1">
                                        {item.issues.map((issue, idx) => (
                                            <span key={idx} className="text-[10px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">
                                                {issue}
                                            </span>
                                        ))}
                                        {item.status === 'optimized' && (
                                            <span className="text-[10px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">
                                                Good Job
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* LQS Bar */}
                                <div className="w-full md:w-48">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-bold text-gray-500">LQS</span>
                                        <span className={`font-bold ${item.lqs < 50 ? 'text-red-600' : 'text-green-600'}`}>{item.lqs}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                                        <div style={{ width: `${item.visual_score * 0.35}%` }} className="h-full bg-indigo-500" title="Visual"></div>
                                        <div style={{ width: `${item.seo_score * 0.35}%` }} className="h-full bg-blue-400" title="SEO"></div>
                                        <div style={{ width: `${item.trend_score * 0.3}%` }} className="h-full bg-purple-400" title="Trend"></div>
                                    </div>
                                    <div className="flex justify-between text-[9px] text-gray-400 mt-0.5 px-0.5">
                                        <span>Vis</span>
                                        <span>SEO</span>
                                        <span>Trd</span>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex-shrink-0">
                                    {item.status === 'unanalyzed' ? (
                                        <button className="flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-all shadow-sm">
                                            <ScanLine size={16} className="mr-2" />
                                            {t('dashboard.btn_analyze')}
                                        </button>
                                    ) : (
                                        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                                            <Zap size={16} className="mr-2" />
                                            {t('dashboard.btn_optimize')}
                                        </button>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
