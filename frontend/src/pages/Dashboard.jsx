import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    TrendingUp, AlertTriangle, Hammer, Star,
    LayoutGrid, RotateCcw, CheckCircle, Zap, RefreshCw, Play, Link, ScanLine
} from 'lucide-react';
import OptimizationDrawer from '../components/OptimizationDrawer';

// --- MOCK DATA 6.1: FULL COMPETITOR INTELLIGENCE ---
const generateMockInventory = () => {
    const titles = [
        "Minimalist Beige Wall Art Printable Abstract Line Drawing",
        "Boho Wedding Invitation Template Editable Canva Download",
        "Leather Crossbody Bag Handmade Vintage Style Purse",
        "Digital Planner 2025 Goodnotes Sticker Set iPad",
        "Custom Pet Portrait Oil Painting From Photo Canvas",
        "Abstract Geometric Print Mid Century Modern Decor",
        "Vintage Brass Candle Holder Set of 2 Wedding Decor",
        "Custom Name Necklace Gold Plated Personalized Gift",
        "Macrame Plant Hanger Indoor Hanging Planter Cotton",
        "Printable Weekly Planner Desk Agenda PDF A4 Size",
        "Ceramic Flower Vase Handcrafted Minimalist White",
        "Handmade Soap Set Organic Lavender & Rose Gift Box",
        "Linen Table Runner Natural Rustic Wedding Decor",
        "Baby Shower Games Bundle Printable Sage Green",
        "Gold Plated Hoop Earrings Chunky Lightweight",
        "Rustic Wood Serving Tray with Handles Farmhouse",
        "Watercolor Nursery Decor Animals Set of 3 Prints",
        "Personalized Leather Wallet Mens Groomsmen Gift",
        "Soy Wax Scented Candle Amber Jar Vanilla Bean",
        "Knitted Wool Scarf Chunky Winter Accessories",
        "Wedding Welcome Sign Decal Vinyl Sticker Mirror",
        "Digital Business Card Template Photographer Modern",
        "Embroidery Starter Kit Floral Pattern for Beginners",
        "Copper Kitchen Utensils Set of 5 Cooking Spoons",
        "Travel Journal Notebook Refillable Leather Cover"
    ];

    const fullTagPool = [
        "Boho Decor", "Minimalist Art", "Gift for Her", "Digital Download", "Custom Gift",
        "Handmade", "Vintage Style", "Home Decor", "Wall Art", "Printable",
        "Wedding Gift", "Jewelry", "Personalized", "Abstract", "Modern",
        "Trending 2025", "Etsy Pick", "Best Seller", "Unique Gift", "Craft"
    ];

    return titles.map((title, index) => {
        // 1. Basic Stats
        const price = (Math.random() * 50 + 5).toFixed(2);
        const quantity = Math.floor(Math.random() * 100);

        // 2. LQS Scoring
        let lqs;
        if (index < 5) lqs = Math.floor(Math.random() * 49);
        else if (index < 12) lqs = Math.floor(Math.random() * (74 - 50) + 50);
        else if (index < 20) lqs = Math.floor(Math.random() * (89 - 75) + 75);
        else lqs = Math.floor(Math.random() * (100 - 90) + 90);

        let status;
        if (lqs < 50) status = "urgent";
        else if (lqs < 75) status = "improve";
        else if (lqs < 90) status = "potential";
        else status = "star";

        // 3. User's Current Tags (Simulate incomplete tags)
        const currentTags = fullTagPool.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 6) + 3);
        const missingTags = fullTagPool.filter(t => !currentTags.includes(t)).slice(0, 5);

        // 4. Competitor Data (FULL 13 TAGS)
        const compPrice = (parseFloat(price) * (Math.random() < 0.5 ? 0.8 : 1.2)).toFixed(2);
        const compSales = Math.floor(Math.random() * 5000) + 200;
        // Generate 13 random tags for the competitor
        const competitorTags = [...fullTagPool].sort(() => 0.5 - Math.random()).slice(0, 13);

        return {
            id: index + 1,
            listing_id: 1000 + index,
            title: title,
            img: `https://source.unsplash.com/random/300x300?sig=${index}&product`,

            price: price,
            currency_code: "USD",
            quantity: quantity,

            lqs: lqs,
            visual_score: Math.floor(lqs * 0.4),
            seo_score: Math.floor(lqs * 0.35),
            trend_score: Math.floor(lqs * 0.25),
            status: status,

            tags: currentTags, // User's tags

            // --- WAR ROOM DATA ---
            competitor: {
                title: "Best Seller: " + title + " | High Quality | Free Shipping",
                description_snippet: "This unique item is crafted with care and perfect for any home. We use only the finest materials to ensure longevity and style...",
                price: compPrice,
                sales: compSales,
                age: "14 Ay",
                daily_sales: "5.2",
                img: `https://source.unsplash.com/random/300x300?sig=${index + 500}&bestseller`,
                tags: competitorTags // <--- NOW SENDING 13 TAGS
            },

            seo_analysis: {
                title_issue: "Başlık 'Long Tail' yapısına uymuyor ve çok kısa.",
                suggested_title: title + " | 2025 Trending Gift Idea (SEO Optimized)",
                description_issue: "Açıklama metni ilk 160 karakterde anahtar kelime içermiyor.",
                suggested_description: "Elevate your space with this **" + title + "**... Perfect for modern homes...",
                missing_tags: missingTags,
                missing_tagsCount: 13 - currentTags.length
            },

            visual_analysis: {
                issue: "Görsel karanlık (Low Exposure) ve ürün odaklı değil.",
                advice_text: "Etsy standartlarına göre görseliniz temiz, aydınlık ve ürünün kullanım alanını gösteren (Lifestyle) yapıda olmalıdır. Karmaşık arka planlardan kaçının.",
            },

            external_data: {
                google_impressions: Math.floor(Math.random() * 2000) + 100,
                ctr: (Math.random() * 3 + 0.5).toFixed(1) + "%",
                bounce_rate: (Math.random() * 40 + 30).toFixed(1) + "%",
                market_advice: lqs < 50
                    ? "Google verilerine göre bu ürün aranmıyor. 'Phoenix Protokolü' (Sil-Yükle) önerilir."
                    : "Görüntülenme yüksek ama Tıklama (CTR) düşük. Görseli değiştirin."
            },

            views: Math.floor(Math.random() * 1200),
            visits: Math.floor(Math.random() * 100),
            sales: Math.floor(Math.random() * 10),
            revenue: (Math.floor(Math.random() * 10) * price).toFixed(2),
            issues: lqs < 90 ? ["Optimization Needed"] : [],
            missingTagsCount: 13 - currentTags.length
        };
    });
};

const MOCK_INVENTORY = generateMockInventory();

const Dashboard = () => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState('all');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [isSyncing, setIsSyncing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

    // --- ACTIONS ---
    const handleImport = () => {
        const url = window.prompt("URL:");
        if (url) { setIsImporting(true); setTimeout(() => setIsImporting(false), 1000); }
    };
    const handleSync = () => {
        setIsSyncing(true); setTimeout(() => { setIsSyncing(false); setLastUpdated(new Date().toLocaleTimeString()); }, 1500);
    };
    const handleAnalyzeAll = () => {
        setIsAnalyzing(true); setTimeout(() => setIsAnalyzing(false), 2000);
    };

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
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">

            {/* LEFT CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 transition-all duration-300 ease-in-out">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header & Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">{t('dashboard.title')}</h1>
                            <p className="text-gray-500 mt-1">{t('dashboard.subtitle')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-xs text-gray-400 mr-2 hidden lg:block">
                                {t('dashboard.last_updated')}: <span className="font-mono text-gray-600">{lastUpdated}</span>
                            </div>
                            <button onClick={handleImport} disabled={isImporting} className="flex items-center px-3 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-70"><Link size={18} className={`mr-2 ${isImporting ? 'animate-pulse' : ''}`} /> {isImporting ? t('common.loading') : t('dashboard.btn_import_link')}</button>
                            <button onClick={handleSync} disabled={isSyncing} className="flex items-center px-3 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-70"><RefreshCw size={18} className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} /> {isSyncing ? t('dashboard.syncing') : t('dashboard.btn_sync')}</button>
                            <button onClick={handleAnalyzeAll} disabled={isAnalyzing} className="flex items-center px-4 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg disabled:opacity-70">{isAnalyzing ? <ScanLine size={18} className="mr-2 animate-pulse" /> : <Play size={18} className="mr-2 fill-current" />} {isAnalyzing ? t('dashboard.analyzing') : t('dashboard.btn_analyze_all')}</button>
                        </div>
                    </div>

                    {/* Pulse Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MiniStat label={t('dashboard.stat_products')} value={MOCK_INVENTORY.length} icon={LayoutGrid} color="bg-indigo-100" />
                        <MiniStat label={t('dashboard.stat_value')} value="$12,450" icon={Zap} color="bg-emerald-100" />
                        <MiniStat label={t('dashboard.stat_lqs')} value="58.2" icon={TrendingUp} color="bg-purple-100" />
                    </div>

                    {/* LQS Explainer */}
                    <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl overflow-hidden">
                        <div className="p-4 flex flex-col md:flex-row md:items-start gap-4">
                            <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm mt-0.5 shrink-0"><TrendingUp size={20} /></div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-blue-900 mb-1">{t('dashboard.lqs_explainer_title')}</h4>
                                <p className="text-sm text-blue-700 leading-relaxed">{t('dashboard.lqs_explainer_text')}</p>
                            </div>
                        </div>
                        <div className="bg-blue-100/50 px-4 py-3 flex flex-wrap gap-6 border-t border-blue-200">
                            <div className="flex items-center gap-2"><div className="w-10 h-2.5 rounded-sm bg-indigo-500"></div><span className="text-xs font-bold text-blue-900">{t('dashboard.legend_visual')}</span></div>
                            <div className="flex items-center gap-2"><div className="w-10 h-2.5 rounded-sm bg-blue-400"></div><span className="text-xs font-bold text-blue-900">{t('dashboard.legend_seo')}</span></div>
                            <div className="flex items-center gap-2"><div className="w-10 h-2.5 rounded-sm bg-purple-400"></div><span className="text-xs font-bold text-blue-900">{t('dashboard.legend_trend')}</span></div>
                        </div>
                    </div>

                    {/* Action Stream */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ActionCard title={t('dashboard.card_urgent')} desc={t('dashboard.card_urgent_desc')} count={stats.urgent} icon={AlertTriangle} color="red" filterType="urgent" />
                        <ActionCard title={t('dashboard.card_improve')} desc={t('dashboard.card_improve_desc')} count={stats.improve} icon={Hammer} color="orange" filterType="improve" />
                        <ActionCard title={t('dashboard.card_potential')} desc={t('dashboard.card_potential_desc')} count={stats.potential} icon={Zap} color="blue" filterType="potential" />
                        <ActionCard title={t('dashboard.card_star')} desc={t('dashboard.card_star_desc')} count={stats.star} icon={Star} color="green" filterType="star" />
                    </div>

                    {/* Smart Inventory List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 flex items-center">
                                <LayoutGrid size={18} className="mr-2 text-indigo-600" /> {t('dashboard.inventory_title')}
                                {filter !== 'all' && (<button onClick={() => setFilter('all')} className="ml-4 text-xs font-bold text-indigo-600 flex items-center hover:underline bg-indigo-50 px-2 py-1 rounded-lg"><RotateCcw size={12} className="mr-1" /> Filtreyi Temizle</button>)}
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {filteredData.map((item) => (
                                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors group">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100"><img src={item.img} alt="" className="w-full h-full object-cover" /></div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 truncate pr-4">{item.title}</h4>
                                            <div className="flex items-center space-x-2 mt-1">
                                                {item.status === 'urgent' && <span className="text-[10px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">Acil</span>}
                                                {item.status === 'improve' && <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded border border-orange-100">Geliştirilmeli</span>}
                                                {item.status === 'potential' && <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">Potansiyel</span>}
                                                {item.status === 'star' && <span className="text-[10px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">Mükemmel</span>}

                                                {/* Show Missing Tags Alert in List if applicable */}
                                                {item.missingTagsCount > 0 && <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">{item.missingTagsCount} Eksik Etiket</span>}
                                            </div>
                                        </div>
                                        <div className="w-full md:w-48">
                                            <div className="flex justify-between text-xs mb-1"><span className="font-bold text-gray-500">LQS</span><span className={`font-bold ${item.lqs < 50 ? 'text-red-600' : item.lqs < 75 ? 'text-orange-500' : item.lqs < 90 ? 'text-blue-500' : 'text-green-600'}`}>{item.lqs}</span></div>
                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex"><div style={{ width: `${item.visual_score * 0.4}%` }} className="h-full bg-indigo-500"></div><div style={{ width: `${item.seo_score * 0.4}%` }} className="h-full bg-blue-400"></div><div style={{ width: `${item.trend_score * 0.4}%` }} className="h-full bg-purple-400"></div></div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <button onClick={() => handleOptimizeClick(item)} className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"><Zap size={16} className="mr-2" /> {t('dashboard.btn_optimize')}</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: DRAWER (Fixed Width 550px) */}
            <div className={`transition-all duration-300 ease-in-out border-l border-gray-200 bg-white flex-shrink-0 ${isDrawerOpen ? 'w-[550px] translate-x-0' : 'w-0 translate-x-full overflow-hidden'}`}>
                <OptimizationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} product={selectedProduct} onApply={() => setIsDrawerOpen(false)} />
            </div>
        </div>
    );
};

export default Dashboard;
