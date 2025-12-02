import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    TrendingUp, AlertTriangle, Tag, ScanLine,
    LayoutGrid, RotateCcw, CheckCircle, Zap
} from 'lucide-react';
import OptimizationDrawer from '../components/OptimizationDrawer';

// --- MOCK DATA 2.0: TRAFFIC INTELLIGENCE ---
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

        // Traffic Simulation
        let views = Math.floor(Math.random() * 500);
        let visits = Math.floor(views * (Math.random() * 0.1)); // standard 1-10% conversion

        // SCENARIO 1: MANNEQUIN (Index 0 & 5) -> High Views, Low Visits
        if (index === 0 || index === 5) {
            status = "critical";
            lqs = 45;
            views = 2500;
            visits = 12; // Very low CTR
            issues.push("Low CTR", "Thumbnail Issue");
        }
        // SCENARIO 2: GHOST (Index 4 & 20) -> Zero Views
        else if (index === 4 || index === 20) {
            status = "unanalyzed"; // or critical
            lqs = 20;
            views = 5;
            visits = 0;
            issues.push("Low Visibility", "SEO Dead");
        }
        // SCENARIO 3: CRITICAL / MISSING TAGS
        else if (index % 3 === 0) {
            status = "warning";
            lqs = 65;
            issues.push("Missing Tags");
        }

        // Strict LQS Grading
        if (lqs >= 80) status = "optimized";
        else if (lqs >= 50 && status !== "warning") status = "warning";
        else if (lqs < 50) status = "critical";

        return {
            id: index + 1,
            title: title,
            img: `https://source.unsplash.com/random/150x150?sig=${index}&product`,
            lqs: lqs,
            visual_score: Math.floor(lqs * 0.4),
            seo_score: Math.floor(lqs * 0.35),
            trend_score: Math.floor(lqs * 0.25),
            views,
            visits,
            status,
            issues
        };
    });
};

const MOCK_INVENTORY = generateMockInventory();

const Dashboard = () => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState('all');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const stats = useMemo(() => {
        return {
            critical: MOCK_INVENTORY.filter(i => i.status === 'critical').length,
            warning: MOCK_INVENTORY.filter(i => i.status === 'warning').length,
            unanalyzed: MOCK_INVENTORY.filter(i => i.status === 'unanalyzed').length,
            optimized: MOCK_INVENTORY.filter(i => i.status === 'optimized').length
        };
    }, []);

    const handleOptimizeClick = (product) => {
        setSelectedProduct(product);
        setIsDrawerOpen(true);
    };

    const ActionCard = ({ title, desc, count, icon: Icon, color, filterType }) => (
        <button
            onClick={() => setFilter(filter === filterType ? 'all' : filterType)}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all w-full text-left relative overflow-hidden group
        ${filter === filterType
                    ? `bg-${color}-50 border-${color}-500 ring-1 ring-${color}-500 shadow-md`
                    : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'}`}
        >
            <div className="flex items-center space-x-3 z-10">
                <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600 group-hover:scale-110 transition-transform`}>
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

    const filteredData = filter === 'all'
        ? MOCK_INVENTORY
        : MOCK_INVENTORY.filter(item => item.status === filter);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in relative">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-black text-gray-900">{t('dashboard.title')}</h1>
                <p className="text-gray-500 mt-1">{t('dashboard.subtitle')}</p>
            </div>

            {/* PULSE BAR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MiniStat label={t('dashboard.stat_products')} value={MOCK_INVENTORY.length} icon={LayoutGrid} color="bg-indigo-100" />
                <MiniStat label={t('dashboard.stat_value')} value="$12,450" icon={Zap} color="bg-emerald-100" />
                <MiniStat label={t('dashboard.stat_lqs')} value="58.2" icon={TrendingUp} color="bg-purple-100" />
            </div>

            {/* ACTION STREAM */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ActionCard title={t('dashboard.card_critical')} desc={t('dashboard.card_critical_desc')} count={stats.critical} icon={AlertTriangle} color="red" filterType="critical" />
                <ActionCard title={t('dashboard.card_missing')} desc={t('dashboard.card_missing_desc')} count={stats.warning} icon={Tag} color="amber" filterType="warning" />
                <ActionCard title={t('dashboard.card_unanalyzed')} desc={t('dashboard.card_unanalyzed_desc')} count={stats.unanalyzed} icon={ScanLine} color="gray" filterType="unanalyzed" />
                <ActionCard title={t('dashboard.card_optimized')} desc={t('dashboard.card_optimized_desc')} count={stats.optimized} icon={CheckCircle} color="green" filterType="optimized" />
            </div>

            {/* SMART INVENTORY */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 flex items-center">
                        <LayoutGrid size={18} className="mr-2 text-indigo-600" />
                        {t('dashboard.inventory_title')}
                        {filter !== 'all' && (
                            <button onClick={() => setFilter('all')} className="ml-4 text-xs font-bold text-indigo-600 flex items-center hover:underline bg-indigo-50 px-2 py-1 rounded-lg">
                                <RotateCcw size={12} className="mr-1" /> Filtreyi Temizle
                            </button>
                        )}
                    </h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {filteredData.map((item) => (
                        <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors group">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100">
                                    <img src={item.img} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 truncate pr-4">{item.title}</h4>
                                    <div className="flex items-center space-x-2 mt-1">
                                        {item.issues.map((issue, idx) => (
                                            <span key={idx} className="text-[10px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">{issue}</span>
                                        ))}
                                        {item.status === 'optimized' && <span className="text-[10px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">Mükemmel</span>}
                                        {item.status === 'warning' && <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100">Geliştirilmeli</span>}
                                    </div>
                                </div>
                                <div className="w-full md:w-48">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-bold text-gray-500">LQS</span>
                                        <span className={`font-bold ${item.lqs < 50 ? 'text-red-600' : item.lqs < 80 ? 'text-amber-600' : 'text-green-600'}`}>{item.lqs}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                                        <div style={{ width: `${item.visual_score * 0.4}%` }} className="h-full bg-indigo-500"></div>
                                        <div style={{ width: `${item.seo_score * 0.4}%` }} className="h-full bg-blue-400"></div>
                                        <div style={{ width: `${item.trend_score * 0.4}%` }} className="h-full bg-purple-400"></div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <button onClick={() => handleOptimizeClick(item)} className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                                        <Zap size={16} className="mr-2" /> {t('dashboard.btn_optimize')}
                                    </button>
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
                onApply={() => setIsDrawerOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
