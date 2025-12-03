import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    TrendingUp, AlertTriangle, Star, LayoutGrid, Zap, RefreshCw, Play, Link
} from 'lucide-react';
import OptimizationDrawer from '../components/OptimizationDrawer';

// --- MOCK DATA ---
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
        "Printable Weekly Planner Desk Agenda PDF A4 Size"
    ];

    const fullTagPool = ["Boho Decor", "Minimalist Art", "Gift for Her", "Digital Download", "Custom Gift", "Handmade", "Vintage Style", "Home Decor", "Wall Art", "Printable", "Wedding Gift", "Jewelry", "Personalized"];

    return titles.map((title, index) => {
        const price = (Math.random() * 50 + 5).toFixed(2);
        let lqs = index < 3 ? Math.floor(Math.random() * 49) : Math.floor(Math.random() * (100 - 50) + 50);
        let status = lqs < 50 ? "urgent" : lqs < 75 ? "improve" : lqs < 90 ? "potential" : "star";

        // Competitor Logic with HIGH SALES for Revenue Calculation
        const compSales = Math.floor(Math.random() * 5000) + 500;
        const compPrice = (parseFloat(price) * 1.2).toFixed(2);

        return {
            id: index + 1,
            listing_id: 1000 + index,
            title: title,
            img: `https://source.unsplash.com/random/300x300?sig=${index}&product`,
            price: price,
            lqs: lqs,
            visual_score: Math.floor(lqs * 0.4),
            seo_score: Math.floor(lqs * 0.35),
            trend_score: Math.floor(lqs * 0.25),
            status: status,
            tags: fullTagPool.slice(0, 5),

            // RICH DATA FOR DRAWER
            competitor: {
                title: "Best Seller: " + title,
                price: compPrice,
                sales: compSales,
                daily_sales: "5.2",
                age: "14 Ay",
                img: `https://source.unsplash.com/random/300x300?sig=${index + 500}&bestseller`,
                description_snippet: "This is a best selling item on Etsy...",
                lqs_total: 95, lqs_visual: 32, lqs_seo: 34, lqs_trend: 29,
                tags: fullTagPool.slice(0, 13)
            },
            seo_analysis: {
                title_issue: "Title is too short.", missing_tagsCount: 4
            },
            visual_analysis: {
                issue: "Görsel karanlık (Low Exposure) ve ürün odaklı değil.",
                advice_text: "Etsy standartlarına göre görseliniz temiz, aydınlık ve ürünün kullanım alanını gösteren (Lifestyle) yapıda olmalıdır."
            },
            external_data: {
                google_impressions: 1200, ctr: "2.1%", bounce_rate: "40%"
            }
        };
    });
};

const MOCK_INVENTORY = generateMockInventory();

const Dashboard = () => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState('all');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleOptimizeClick = (product) => {
        setSelectedProduct(product);
        setIsDrawerOpen(true);
    };

    const ActionCard = ({ title, count, color, filterType }) => (
        <button onClick={() => setFilter(filterType)} className={`p-4 rounded-xl border flex justify-between items-center ${filter === filterType ? `bg-${color}-50 border-${color}-500` : 'bg-white'}`}>
            <span className="font-bold text-gray-700">{title}</span>
            <span className={`font-black text-${color}-600`}>{count}</span>
        </button>
    );

    const filteredData = filter === 'all' ? MOCK_INVENTORY : MOCK_INVENTORY.filter(item => item.status === filter);

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* LEFT: DASHBOARD CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 transition-all duration-300 ease-in-out">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex justify-between items-end">
                        <h1 className="text-3xl font-black text-gray-900">Mağaza Yönetimi</h1>
                        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold">Analiz Et</button>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <ActionCard title="Acil Müdahale" count={MOCK_INVENTORY.filter(i => i.status === 'urgent').length} color="red" filterType="urgent" />
                        <ActionCard title="Geliştirilmeli" count={MOCK_INVENTORY.filter(i => i.status === 'improve').length} color="orange" filterType="improve" />
                        <ActionCard title="Potansiyel" count={MOCK_INVENTORY.filter(i => i.status === 'potential').length} color="blue" filterType="potential" />
                        <ActionCard title="Yıldızlar" count={MOCK_INVENTORY.filter(i => i.status === 'star').length} color="green" filterType="star" />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                        {filteredData.map((item) => (
                            <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                                <img src={item.img} className="w-16 h-16 rounded-lg object-cover" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                                    <div className="flex gap-2 text-xs mt-1">
                                        <span className="text-gray-500">LQS: {item.lqs}</span>
                                        <span className="text-gray-500">Fiyat: ${item.price}</span>
                                    </div>
                                </div>
                                <button onClick={() => handleOptimizeClick(item)} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg text-sm">İyileştir</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: DRAWER (WIDTH FIXED TO 900px) */}
            <div className={`transition-all duration-300 ease-in-out border-l border-gray-200 bg-white flex-shrink-0 z-50 ${isDrawerOpen ? 'w-[900px] translate-x-0 shadow-2xl' : 'w-0 translate-x-full overflow-hidden'}`}>
                <OptimizationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} product={selectedProduct} />
            </div>
        </div>
    );
};
export default Dashboard;
