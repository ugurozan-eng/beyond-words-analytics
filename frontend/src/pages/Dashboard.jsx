import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    TrendingUp, AlertTriangle, Star, Zap, RefreshCw, XCircle, ArrowRight
} from 'lucide-react';
import OptimizationDrawer from '../components/OptimizationDrawer';

// --- MOCK DATA (RESTORED TAGS) ---
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

    return titles.map((title, index) => {
        const price = (Math.random() * 50 + 5).toFixed(2);
        let lqs = index < 3 ? Math.floor(Math.random() * 49) : Math.floor(Math.random() * (100 - 50) + 50);
        // Status Logic
        let status = lqs < 50 ? "urgent" : lqs < 75 ? "improve" : lqs < 90 ? "potential" : "star";
        let statusLabel = lqs < 50 ? "Acil Müdahale" : lqs < 75 ? "Geliştirilmeli" : lqs < 90 ? "Yüksek Potansiyel" : "Yıldız Ürün";
        let statusColor = lqs < 50 ? "red" : lqs < 75 ? "orange" : lqs < 90 ? "blue" : "green";

        return {
            id: index + 1,
            listing_id: 1000 + index,
            title: title,
            img: `https://source.unsplash.com/random/300x300?sig=${index}&product`,
            price: price,
            lqs: lqs,
            status: status,
            statusLabel: statusLabel, // UI Text
            statusColor: statusColor, // UI Color

            visual_analysis: {
                issue: "Görsel karanlık (Low Exposure) ve ürün odaklı değil.",
            },
            competitor: {
                title: "Best Seller: " + title,
                img: `https://source.unsplash.com/random/300x300?sig=${index + 500}&bestseller`,
                price: (parseFloat(price) * 1.2).toFixed(2),
                sales: 1200,
                lqs_total: 95
            }
        };
    });
};

const MOCK_INVENTORY = generateMockInventory();

const Dashboard = () => {
    const [filter, setFilter] = useState('all');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleOptimizeClick = (product) => {
        setSelectedProduct(product);
        setIsDrawerOpen(true);
    };

    const ActionCard = ({ title, count, color, filterType }) => (
        <button onClick={() => setFilter(filterType)} className={`p-4 rounded-xl border flex flex-col items-start gap-2 transition-all ${filter === filterType ? `bg-${color}-50 border-${color}-500 shadow-md ring-1 ring-${color}-500` : 'bg-white border-slate-200 hover:border-slate-300'}`}>
            <div className="flex justify-between w-full items-center">
                <span className={`font-bold text-${color}-700 text-sm uppercase tracking-wide`}>{title}</span>
                <span className={`font-black text-2xl text-${color}-900`}>{count}</span>
            </div>
            <div className={`h-1 w-full bg-${color}-100 rounded-full overflow-hidden`}>
                <div className={`h-full bg-${color}-500 w-2/3`}></div>
            </div>
        </button>
    );

    const filteredData = filter === 'all' ? MOCK_INVENTORY : MOCK_INVENTORY.filter(item => item.status === filter);

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
            {/* LEFT: DASHBOARD CONTENT */}
            <div className="flex-1 overflow-y-auto p-8 transition-all duration-300 ease-in-out">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header & Reset Filter */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900">Mağaza Yönetimi</h1>
                            <p className="text-slate-500 mt-1">Genel performans özeti ve iyileştirme fırsatları.</p>
                        </div>
                        {filter !== 'all' && (
                            <button onClick={() => setFilter('all')} className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition-colors">
                                <XCircle size={18} /> Filtreyi Temizle ({filteredData.length} Ürün)
                            </button>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-4">
                        <ActionCard title="Acil Müdahale" count={MOCK_INVENTORY.filter(i => i.status === 'urgent').length} color="red" filterType="urgent" />
                        <ActionCard title="Geliştirilmeli" count={MOCK_INVENTORY.filter(i => i.status === 'improve').length} color="orange" filterType="improve" />
                        <ActionCard title="Yüksek Potansiyel" count={MOCK_INVENTORY.filter(i => i.status === 'potential').length} color="blue" filterType="potential" />
                        <ActionCard title="Yıldız Ürünler" count={MOCK_INVENTORY.filter(i => i.status === 'star').length} color="green" filterType="star" />
                    </div>

                    {/* List View */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase">Ürün Listesi ({filteredData.length})</span>
                        </div>
                        {filteredData.map((item) => (
                            <div key={item.id} className="p-4 flex items-center gap-6 hover:bg-slate-50 transition-colors group">
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                    <img src={item.img} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-${item.statusColor}-50 text-${item.statusColor}-700 border-${item.statusColor}-200`}>
                                            {item.statusLabel}
                                        </span>
                                        <span className="text-xs text-slate-400 font-mono">ID: {item.listing_id}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
                                    <div className="flex gap-4 text-xs mt-2 text-slate-500">
                                        <span className="flex items-center gap-1"><Zap size={14} className="text-yellow-500" /> LQS: <b className="text-slate-800">{item.lqs}</b></span>
                                        <span>Fiyat: <b className="text-slate-800">${item.price}</b></span>
                                    </div>
                                </div>

                                <button onClick={() => handleOptimizeClick(item)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 shrink-0">
                                    İyileştir <ArrowRight size={16} />
                                </button>
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
