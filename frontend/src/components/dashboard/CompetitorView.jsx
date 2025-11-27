import React from 'react';
import { ShieldAlert, PlusCircle, TrendingUp, Search, Trash2, ExternalLink, AlertCircle } from 'lucide-react';

const CompetitorView = ({ listings, onAddCompetitor, onSelectListing, onDelete }) => {
    const competitors = listings.filter(l => l.listing_type === 'competitor');
    const avgPrice = competitors.length > 0
        ? (competitors.reduce((a, b) => a + b.price, 0) / competitors.length).toFixed(2)
        : "0.00";

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 p-3 rounded-xl">
                            <ShieldAlert className="w-6 h-6 text-white" />
                        </div>
                        <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold">Aktif Takip</span>
                    </div>
                    <h3 className="text-4xl font-black mb-1">{competitors.length}</h3>
                    <p className="text-orange-100 text-sm font-medium">Takip edilen rakip ürün</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-emerald-100 p-3 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <h3 className="text-4xl font-black text-gray-800 mb-1">${avgPrice}</h3>
                    <p className="text-gray-500 text-sm font-medium">Ortalama Rakip Fiyatı</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center border-dashed border-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group" onClick={onAddCompetitor}>
                    <div className="bg-indigo-100 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <PlusCircle className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 group-hover:text-indigo-700">Yeni Rakip Ekle</h3>
                    <p className="text-xs text-gray-400 mt-1">URL veya görsel ile takip başlat</p>
                </div>
            </div>

            {/* Competitor List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 flex items-center text-lg">
                        <ShieldAlert className="w-5 h-5 mr-2 text-orange-500" />
                        Rakip Listesi
                    </h3>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input type="text" placeholder="Rakiplerde ara..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-100 outline-none w-64" />
                    </div>
                </div>

                {competitors.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert className="w-10 h-10 text-orange-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Henüz Rakip Eklenmedi</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">Rakiplerinizi ekleyerek fiyatlarını, stratejilerini ve değişimlerini buradan takip edebilirsiniz.</p>
                        <button onClick={onAddCompetitor} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-1 inline-flex items-center">
                            <PlusCircle className="w-5 h-5 mr-2" /> İlk Rakibi Ekle
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {competitors.map((comp) => (
                            <div key={comp.id} onClick={() => onSelectListing(comp)} className="group bg-white rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100/50 transition-all cursor-pointer relative overflow-hidden">
                                <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                                    <img src={comp.image_url} alt={comp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 mr-1.5 animate-pulse"></div>
                                        Takipte
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-gray-800 line-clamp-2 mb-3 h-12 group-hover:text-orange-600 transition-colors">{comp.title}</h4>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-black text-gray-900">${comp.price}</span>
                                        {comp.is_analyzed ? (
                                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-bold flex items-center">
                                                LQS: {comp.lqs_score}
                                            </span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-lg text-xs font-bold flex items-center">
                                                Analiz Bekliyor
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <span className="text-xs text-gray-400 font-medium">{new Date(comp.created_at).toLocaleDateString()}</span>
                                        <div className="flex space-x-2">
                                            <button onClick={(e) => { e.stopPropagation(); onDelete(e, comp.id); }} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompetitorView;
