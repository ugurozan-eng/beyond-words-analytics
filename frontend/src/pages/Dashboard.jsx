import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    TrendingUp, AlertTriangle, Tag, ScanLine,
    ArrowRight, Zap, LayoutGrid, RotateCcw
} from 'lucide-react';
import OptimizationDrawer from '../components/OptimizationDrawer';

// --- HELPER: GENERATE ROBUST MOCK DATA (25 Items) ---
const generateMockInventory = () => {
    const titles = [
        "Minimalist Beige Wall Art", "Boho Wedding Invitation", "Leather Crossbody Bag",
        "Digital Planner 2025", "Pet Portrait Oil Painting", "Abstract Geometric Print",
        "Vintage Brass Candle Holder", "Custom Name Necklace", "Macrame Plant Hanger",
        "Printable Weekly Planner", "Ceramic Flower Vase", "Handmade Soap Set",
        "Linen Table Runner", "Baby Shower Games Bundle", "Gold Plated Hoop Earrings",
        "Rustic Wood Serving Tray", "Watercolor Nursery Decor", "Personalized Leather Wallet",
        "Soy Wax Scented Candle", "Knitted Wool Scarf", "Wedding Welcome Sign",
        "Digital Business Card", "Embroidery Starter Kit", "Copper Kitchen Utensils",
        "Travel Journal Notebook"
    ];

    return titles.map((title, index) => {
        let status = "optimized";
        let lqs = Math.floor(Math.random() * (100 - 50) + 50);
        let issues = [];

        // Intentionally create "Problematic" items to match the user scenario
        if (index % 2 === 0) { // Critical items (LQS < 50)
            status = "critical";
            lqs = Math.floor(Math.random() * 49);
            issues.push("Low Contrast", "Title too short");
        } else if (index % 3 === 0) { // Missing Tags
            status = "warning";
            lqs = Math.floor(Math.random() * (70 - 50) + 50);
            issues.push("Missing Tags");
        } else if (index > 20) { // Unanalyzed
            status = "unanalyzed";
            lqs = 0;
        }

        return {
            id: index + 1,
            title: title,
            img: `https://source.unsplash.com/random/150x150?sig=${index}&product`,
            lqs: lqs,
            visual_score: Math.floor(lqs * 0.4),
            seo_score: Math.floor(lqs * 0.3),
            trend_score: Math.floor(lqs * 0.3),
            status: status,
            issues: issues
        };
    });
};

const MOCK_INVENTORY = generateMockInventory();

const Dashboard = () => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState('all');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // --- DYNAMIC COUNTS ---
    // Calculate real numbers based on the data, not hardcoded strings
    const stats = useMemo(() => {
        return {
            critical: MOCK_INVENTORY.filter(i => i.status === 'critical').length,
            warning: MOCK_INVENTORY.filter(i => i.status === 'warning').length,
            unanalyzed: MOCK_INVENTORY.filter(i => i.status === 'unanalyzed').length
        };
    }, []);

    const handleOptimizeClick = (product) => {
        setSelectedProduct(product);
        setIsDrawerOpen(true);
    };

    const handleApplyOptimization = () => {
        setIsDrawerOpen(false);
    };

    // --- COMPONENTS ---
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

    const ActionCard = ({ title, desc, count, icon: Icon, color, filterType }) => (
        <button
            onClick={() => setFilter(filter === filterType ? 'all' : filterType)} // Toggle capability
            className={`flex items-center justify-between p-4 rounded-xl border transition-all w-full text-left relative overflow-hidden
        ${filter === filterType
                    ? `bg-${color}-50 border-${color}-500 ring-1 ring-${color}-500 shadow-md`
                    : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'}`}
        >
            <div className="flex items-center space-x-3 z-10">
                <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900">{title}</h4>
                    <p className="text-xs text-gray-500">{desc}</p>
                </div>
            </div>
            <div className={`text-2xl font-black text-${color}-600 z-10`}>{count}</div>
        </button>
    );

    const filteredData = filter === 'all'
        ? MOCK_INVENTORY
        : MOCK_INVENTORY.filter(item => item.status === filter);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in relative">

            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">{t('dashboard.title')}</h1>
                    <p className="text-gray-500 mt-1">{t('dashboard.subtitle')}</p>
                </div>
            </div>

            {/* SECTION 1: PULSE BAR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MiniStat label={t('dashboard.stat_products')} value={MOCK_INVENTORY.length} icon={LayoutGrid} color="bg-indigo-100" />
                <MiniStat label={t('dashboard.stat_value')} value="$12,450" icon={Zap} color="bg-emerald-100" />
                <MiniStat label={t('dashboard.stat_lqs')} value="58.2" icon={TrendingUp} color="bg-purple-100" />
            </div>

            {/* SECTION 2: ACTION STREAM */}
            <div>
                <div className="flex items-center justify-between mb-3 ml-1">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('dashboard.section_actions')}</h3>
                    {filter !== 'all' && (
                        <button
                            onClick={() => setFilter('all')}
                            className="text-xs font-bold text-indigo-600 flex items-center hover:underline bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
                        >
                            <RotateCcw size={12} className="mr-1" />
                            Filtreyi Temizle / Tümü
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ActionCard
                        title={t('dashboard.card_critical')}
                        desc={t('dashboard.card_critical_desc')}
                        count={stats.critical}
                        icon={AlertTriangle}
                        color="red"
                        filterType="critical"
                    />
                    <ActionCard
                        title={t('dashboard.card_missing')}
                        desc={t('dashboard.card_missing_desc')}
                        count={stats.warning}
                        icon={Tag}
                        color="amber"
                        filterType="warning"
                    />
                    <ActionCard
                        title={t('dashboard.card_unanalyzed')}
                        desc={t('dashboard.card_unanalyzed_desc')}
                        count={stats.unanalyzed}
                        icon={ScanLine}
                        color="gray"
                        filterType="unanalyzed"
                    />
                </div>
            </div>

            {/* SECTION 3: SMART INVENTORY */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
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

                                {/* Random Placeholder Image */}
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100">
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">IMG</div>
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
                                </div>

                                {/* Action */}
                                <div className="flex-shrink-0">
                                    {item.status === 'unanalyzed' ? (
                                        <button className="flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-all shadow-sm">
                                            <ScanLine size={16} className="mr-2" />
                                            {t('dashboard.btn_analyze')}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleOptimizeClick(item)}
                                            className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                        >
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

            <OptimizationDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                product={selectedProduct}
                onApply={handleApplyOptimization}
            />
        </div>
    );
};

export default Dashboard;
