import React from 'react';
import { TrendingUp, ArrowRight, BarChart3 } from 'lucide-react';

const DashboardTrafficPanel = ({ trafficData, onOpenReport, userPlan = 'free', onUnlockClick, compact = false }) => {
    // Default mock data if trafficData is missing or empty
    const data = trafficData || {
        total_visits: 0,
        insight: "Trafik verisi toplanıyor...",
        sources: []
    };

    const sources = data.sources || [];
    const google = sources.find(s => s.name === "Google Organic")?.value || 0;
    const etsy = sources.find(s => s.name === "Etsy Search")?.value || 0;
    const pinterest = sources.find(s => s.name === "Pinterest/Social")?.value || 0;
    const total = data.total_visits || (google + etsy + pinterest);

    // Calculate percentages for bars
    const getPercent = (val) => total > 0 ? (val / total) * 100 : 0;

    const isLocked = false; // userPlan === 'free';

    return (
        <div className={`relative group ${compact ? '' : 'mb-8'}`}>
            {/* Lock Overlay for Free Users */}
            {isLocked && (
                <div
                    className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center rounded-3xl cursor-pointer hover:bg-white/50 transition-all border-2 border-transparent hover:border-indigo-200"
                >
                    <div className="bg-white p-4 rounded-full shadow-xl mb-3 animate-bounce">
                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-3 rounded-full text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </div>
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Pro Özellik</h3>
                    <p className="text-gray-500 text-sm font-medium mb-4">Trafik kaynaklarını görmek için yükseltin</p>
                    <button
                        onClick={onUnlockClick}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-colors"
                    >
                        Kilidi Aç 🔓
                    </button>
                </div>
            )}

            <div className={`flex flex-col lg:flex-row items-center justify-start gap-10 relative overflow-hidden transition-all ${isLocked ? 'blur-sm opacity-80 select-none' : ''} ${compact ? '' : 'bg-white rounded-3xl p-6 shadow-lg border border-indigo-50'}`}>
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none"></div>

                {/* LEFT: Total Traffic */}
                <div className="flex items-center gap-6 shrink-0">
                    <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-600">
                        <BarChart3 className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Toplam Trafik (30 Gün)</p>
                        <h2 className="text-4xl font-black text-gray-900 mt-1">{total.toLocaleString()}</h2>
                        <div className="flex items-center mt-2 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg w-max">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            %12 Artış (Geçen Aya Göre)
                        </div>
                    </div>
                </div>

                {/* CENTER: Progress Bars */}
                <div className="w-full max-w-md lg:px-8 border-l border-r border-gray-100 border-dashed shrink-0">
                    <div className="space-y-4">
                        {/* Google */}
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-gray-600 flex items-center"><span className="w-2 h-2 rounded-full bg-[#4285F4] mr-2"></span>Google Organic</span>
                                <span className="text-gray-900">{google}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-[#4285F4] h-2 rounded-full transition-all duration-1000" style={{ width: `${getPercent(google)}%` }}></div>
                            </div>
                        </div>

                        {/* Etsy */}
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-gray-600 flex items-center"><span className="w-2 h-2 rounded-full bg-[#F97316] mr-2"></span>Etsy Search</span>
                                <span className="text-gray-900">{etsy}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-[#F97316] h-2 rounded-full transition-all duration-1000" style={{ width: `${getPercent(etsy)}%` }}></div>
                            </div>
                        </div>

                        {/* Pinterest */}
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-gray-600 flex items-center"><span className="w-2 h-2 rounded-full bg-[#E60023] mr-2"></span>Pinterest/Social</span>
                                <span className="text-gray-900">{pinterest}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-[#E60023] h-2 rounded-full transition-all duration-1000" style={{ width: `${getPercent(pinterest)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Insight & Action */}
                <div className="flex flex-col items-start text-left max-w-sm shrink-0">
                    <p className="text-gray-500 text-xs font-bold uppercase mb-2">Yapay Zeka İçgörüsü</p>
                    <p className="text-gray-800 font-medium text-sm mb-4 leading-relaxed">
                        {data.insight || "Verileriniz analiz ediliyor. Google trafiğinde artış gözlemlendi."}
                    </p>
                    <button
                        onClick={onOpenReport}
                        className="flex items-center text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors group"
                    >
                        Detaylı Raporu Aç
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardTrafficPanel;
