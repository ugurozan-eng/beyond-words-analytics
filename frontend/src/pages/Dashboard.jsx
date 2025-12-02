import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    TrendingUp, AlertTriangle, Hammer, Star,
    LayoutGrid, RotateCcw, Zap, Sparkles
} from 'lucide-react';
import OptimizationDrawer from '../components/OptimizationDrawer';

// --- MOCK DATA 3.0: LQS LADDER ---
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
        // Generate purely random LQS to populate buckets
        // We force some distribution to ensure all buckets have data
        let lqs;
        if (index < 5) lqs = Math.floor(Math.random() * 49); // 0-49 (Urgent)
        else if (index < 12) lqs = Math.floor(Math.random() * (74 - 50) + 50); // 50-74 (Improve)
        else if (index < 20) lqs = Math.floor(Math.random() * (89 - 75) + 75); // 75-89 (Potential)
        else lqs = Math.floor(Math.random() * (100 - 90) + 90); // 90+ (Star)

        // Assign Status based on LQS
        let status;
        if (lqs < 50) status = "urgent";
        else if (lqs < 75) status = "improve";
        else if (lqs < 90) status = "potential";
        else status = "star";

        // Fake Traffic Data
        let views = Math.floor(Math.random() * 1000);
        let visits = Math.floor(views * 0.05);

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
            issues: lqs < 90 ? ["Optimization Needed"] : []
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
            urgent: MOCK_INVENTORY.filter(i => i.status === 'urgent').length,
            improve: MOCK_INVENTORY.filter(i => i.status === 'improve').length,
            potential: MOCK_INVENTORY.filter(i => i.status === 'potential').length,
            star: MOCK_INVENTORY.filter(i => i.status === 'star').length
        };
    }, []);

    const handleOptimizeClick = (product) => {
        setSelectedProduct(product);
        setIsDrawerOpen(true);
    };

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

            {/* PULSE BAR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MiniStat label={t('dashboard.stat_products')} value={MOCK_INVENTORY.length} icon={LayoutGrid} color="bg-indigo-100" />
                <MiniStat label="Envanter Değeri" value="$12,450" icon={Zap} color="bg-emerald-100" />
                <MiniStat label={t('dashboard.stat_lqs')} value="68.5" icon={TrendingUp} color="bg-purple-100" />
            </div>

            {/* LQS LADDER (4 Columns) */}
            <div>
                <div className="flex items-center justify-between mb-3 ml-1">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('dashboard.section_actions')}</h3>
                    {filter !== 'all' && (
                        <button onClick={() => setFilter('all')} className="text-xs font-bold text-indigo-600 flex items-center hover:underline bg-indigo-50 px-2 py-1 rounded-lg">
                            <RotateCcw size={12} className="mr-1" /> Filtreyi Temizle
                        </button>
                    )}
                </div>

                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm mt-0.5">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-blue-900 mb-1">
                                ℹ️ LQS (Listing Quality Score) Nedir?
                            </h4>
                            <p className="text-sm text-blue-700 leading-relaxed">
                                Ürününüzün Etsy başarısını ölçen 100 puanlık kalite skorudur.
                                Puanı artırmak, daha çok görünürlük ve satış demektir.
                            </p>
                        </div>
                    </div>

                    {/* COLOR LEGEND */}
                    <div className="flex gap-4 border-t md:border-t-0 md:border-l border-blue-200 pt-3 md:pt-0 md:pl-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                            <span className="text-xs font-bold text-blue-800">Görsel</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                            <span className="text-xs font-bold text-blue-800">SEO</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                            <span className="text-xs font-bold text-blue-800">Trend</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ActionCard title={t('dashboard.card_urgent')} desc={t('dashboard.card_urgent_desc')} count={stats.urgent} icon={AlertTriangle} color="red" filterType="urgent" />
                    <ActionCard title={t('dashboard.card_improve')} desc={t('dashboard.card_improve_desc')} count={stats.improve} icon={Hammer} color="orange" filterType="improve" />
                    <ActionCard title={t('dashboard.card_potential')} desc={t('dashboard.card_potential_desc')} count={stats.potential} icon={Sparkles} color="blue" filterType="potential" />
                    <ActionCard title={t('dashboard.card_star')} desc={t('dashboard.card_star_desc')} count={stats.star} icon={Star} color="green" filterType="star" />
                </div>
            </div>

            {/* SMART INVENTORY */}
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

                                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100">
                                    <img src={item.img} alt="" className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 truncate pr-4">{item.title}</h4>
                                    <div className="flex items-center space-x-2 mt-1">
                                        {/* Status Badge Logic */}
                                        {item.status === 'urgent' && <span className="text-[10px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">Acil</span>}
                                        {item.status === 'improve' && <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded border border-orange-100">Geliştirilmeli</span>}
                                        {item.status === 'potential' && <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">Potansiyel</span>}
                                        {item.status === 'star' && <span className="text-[10px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">Mükemmel</span>}
                                    </div>
                                </div>

                                <div className="w-full md:w-48">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-bold text-gray-500">LQS</span>
                                        <span className={`font-bold ${item.lqs < 50 ? 'text-red-600' : item.lqs < 75 ? 'text-orange-500' : item.lqs < 90 ? 'text-blue-500' : 'text-green-600'}`}>{item.lqs}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                                        <div style={{ width: `${item.visual_score * 0.4}%` }} className="h-full bg-indigo-500"></div>
                                        <div style={{ width: `${item.seo_score * 0.4}%` }} className="h-full bg-blue-400"></div>
                                        <div style={{ width: `${item.trend_score * 0.4}%` }} className="h-full bg-purple-400"></div>
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() => handleOptimizeClick(item)}
                                        className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                    >
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
