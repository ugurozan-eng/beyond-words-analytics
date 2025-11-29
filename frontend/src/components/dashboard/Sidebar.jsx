import React from 'react';
import { LayoutDashboard, Search, ShieldAlert, Settings, LogOut, Crown, Wand2, Calculator, BarChart2, Eye, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeView, onNavigate, onLogout, onUpgrade }) => {
    const { isPro } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'my-shop', label: 'Mağazam', icon: Store },
        { id: 'create-listing', label: 'AI Ürün Sihirbazı', icon: Wand2 },
        { id: 'competitor', label: 'Rakip Takibi', icon: ShieldAlert },
        { id: 'tag-spy', label: 'Tag Spy', icon: Eye },
        { id: 'keyword-explorer', label: 'Keyword Explorer', icon: Search },
        { id: 'profit-calculator', label: 'Kâr Hesaplayıcı', icon: Calculator },
        { id: 'analysis', label: 'Analizler', icon: BarChart2 },
        { id: 'settings', label: 'Ayarlar', icon: Settings },
    ];

    return (
        <div className="h-screen w-full bg-indigo-900 text-white flex flex-col shadow-2xl">
            {/* LOGO */}
            <div className="p-6 border-b border-indigo-800/50">
                <h1 className="text-2xl font-black flex items-center tracking-tight">
                    <span className="text-3xl mr-2">🪆</span>
                    Cyclear
                </h1>
            </div>

            {/* MENU */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all font-bold text-sm ${activeView === item.id
                            ? 'bg-white/10 text-white shadow-lg border border-white/10'
                            : 'text-indigo-300 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 mr-3 ${activeView === item.id ? 'text-indigo-400' : 'opacity-70'}`} />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* BOTTOM ACTIONS */}
            <div className="p-4 border-t border-indigo-800/50 space-y-4">
                {!isPro && (
                    <div className="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-2xl p-4 border border-indigo-700/50">
                        <div className="flex items-center mb-2">
                            <Crown className="w-5 h-5 text-amber-400 mr-2" />
                            <span className="font-bold text-sm">Pro'ya Geçin</span>
                        </div>
                        <p className="text-xs text-indigo-300 mb-3 leading-relaxed">Sınırsız analiz ve rakip takibi için yükseltin.</p>
                        <button
                            onClick={onUpgrade}
                            className="w-full py-2 bg-white text-indigo-900 rounded-lg text-xs font-black hover:bg-indigo-50 transition-colors"
                        >
                            UPGRADE
                        </button>
                    </div>
                )}

                <button
                    onClick={onLogout}
                    className="w-full flex items-center px-4 py-3 text-indigo-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm font-bold"
                >
                    <LogOut className="w-5 h-5 mr-3 opacity-70" />
                    Çıkış Yap
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
