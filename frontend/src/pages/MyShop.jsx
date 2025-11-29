import React from 'react';
import { useTranslation } from 'react-i18next';
import { Package, TrendingUp, DollarSign, Zap, Filter, ArrowUpDown, CheckSquare, Square, CheckCircle, AlertCircle, Trash2, ShieldAlert, PlusCircle, Download } from 'lucide-react';
import ShopLinkImport from '../components/Import/ShopLinkImport';
import ProductGrid from '../components/dashboard/ProductGrid';
import HealthCheckWidget from '../components/dashboard/HealthCheckWidget';
import MiniStatCard from '../components/dashboard/MiniStatCard';
import PricingCard from '../components/analysis/PricingCard';

const MyShop = ({
    listings,
    analyzedProducts,
    onImportComplete,
    onOptimize,
    userPlan,
    dailyUsage,
    // Inventory Props
    filterStatus,
    setFilterStatus,
    sortOption,
    setSortOption,
    selectedIds,
    handleSelectAll,
    handleBulkAnalyze,
    handleExportCSV,
    handleSelectListing,
    toggleSelect,
    handleDeleteClick,
    filteredListings,
    setInitialModalType,
    setIsModalOpen
}) => {
    const { t } = useTranslation();
    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t('my_shop.title')}</h1>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                    {t('my_shop.product_count', { count: listings.length })}
                </span>
            </div>

            {/* SHOP IMPORT SECTION */}
            <ShopLinkImport onImportComplete={onImportComplete} />

            {/* KPI STRIP */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MiniStatCard title={t('mini_stats.total_products')} value={listings.length} icon={Package} color="bg-blue-500" />
                <MiniStatCard title={t('mini_stats.total_value')} value={`$${listings.reduce((a, b) => a + b.price, 0).toFixed(2)}`} icon={DollarSign} color="bg-emerald-500" />
                <MiniStatCard title={t('mini_stats.avg_lqs')} value={listings.filter(i => i.is_analyzed).length > 0 ? (listings.filter(i => i.is_analyzed).reduce((a, b) => a + b.lqs_score, 0) / listings.filter(i => i.is_analyzed).length).toFixed(1) : "0.0"} icon={TrendingUp} color="bg-violet-500" />
                <MiniStatCard title={t('mini_stats.analyzed')} value={listings.filter(i => i.is_analyzed).length} icon={Zap} color="bg-orange-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
                {/* PRODUCT GRID (Col-span-8) */}
                <div className="lg:col-span-8">
                    <ProductGrid products={analyzedProducts.length > 0 ? analyzedProducts : listings} />
                </div>

                {/* HEALTH CHECK & NEURO PRICING (Col-span-4) */}
                <div className="lg:col-span-4 space-y-6">
                    <HealthCheckWidget
                        listings={listings}
                        onOptimize={onOptimize}
                    />

                    {/* NEURO PRICING WIDGET */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-700 flex items-center"><Zap className="w-4 h-4 mr-2 text-gray-400" /> {t('my_shop.deal_of_the_day')}</h3>
                            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">Neuro-Pricing</span>
                        </div>
                        {listings.find(l => l.is_analyzed) ? (
                            <div className="flex-1 flex flex-col justify-center">
                                <PricingCard
                                    min={listings.find(l => l.is_analyzed).predicted_price_min}
                                    max={listings.find(l => l.is_analyzed).predicted_price_max}
                                    optimal={listings.find(l => l.is_analyzed).predicted_price_optimal}
                                    reason={listings.find(l => l.is_analyzed).price_reason}
                                />
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-center text-gray-400 text-sm py-8">
                                <p>{t('my_shop.no_analyzed_products')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PRODUCT INVENTORY LIST */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px] relative z-20">
                <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-700 flex items-center"><Package className="w-4 h-4 mr-2 text-gray-400" /> {t('my_shop.product_inventory')}</h3>
                        <div className="flex space-x-2">
                            {selectedIds.length > 0 && (
                                <button onClick={handleBulkAnalyze} className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg flex items-center hover:shadow-lg shadow-sm text-xs font-bold animate-pulse transition-all">
                                    <TrendingUp className="w-3 h-3 mr-1" /> {t('my_shop.analyze_selected', { count: selectedIds.length })}
                                </button>
                            )}
                            <button onClick={() => { setInitialModalType('mine'); setIsModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center">
                                <PlusCircle className="w-3 h-3 mr-1" /> {t('my_shop.add_new')}
                            </button>
                            <button onClick={handleExportCSV} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"><Download className="w-4 h-4" /></button>
                        </div>
                    </div>

                    {/* FILTERS & SORTING */}
                    <div className="flex gap-3">
                        <div className="flex items-center cursor-pointer text-gray-500 hover:text-indigo-700 select-none transition-colors group px-2" onClick={handleSelectAll}>
                            {selectedIds.length > 0 && selectedIds.length === filteredListings.length ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 group-hover:text-indigo-400" />}
                        </div>
                        <div className="relative flex-1">
                            <Filter className="w-3 h-3 absolute left-3 top-3 text-gray-400" />
                            <select className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-xs font-bold text-gray-600 w-full outline-none focus:ring-2 focus:ring-indigo-100" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="all">{t('my_shop.filter_all')}</option>
                                <option value="mine">{t('my_shop.filter_mine')}</option>
                                <option value="competitor">{t('my_shop.filter_competitors')}</option>
                                <option value="optimized">{t('my_shop.filter_optimized')}</option>
                                <option value="pending">{t('my_shop.filter_pending')}</option>
                            </select>
                        </div>
                        <div className="relative flex-1">
                            <ArrowUpDown className="w-3 h-3 absolute left-3 top-3 text-gray-400" />
                            <select className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-xs font-bold text-gray-600 w-full outline-none focus:ring-2 focus:ring-indigo-100" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                                <option value="date-desc">{t('my_shop.sort_newest')}</option>
                                <option value="lqs-desc">{t('my_shop.sort_lqs_high')}</option>
                                <option value="price-desc">{t('my_shop.sort_price_high')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filteredListings.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">{t('my_shop.no_products_found')}</div>
                    ) : (
                        filteredListings.map((listing) => {
                            const isCompetitorItem = listing.listing_type === 'competitor';
                            return (
                                <div key={listing.id} onClick={() => handleSelectListing(listing)} className={`flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border group ${isCompetitorItem ? 'border-orange-100 bg-orange-50/30' : 'border-transparent hover:border-gray-100'}`}>
                                    <div className="flex items-center space-x-4 flex-1">
                                        <div onClick={(e) => toggleSelect(e, listing.id)} className="text-gray-300 hover:text-indigo-600 cursor-pointer transition-colors">
                                            {selectedIds.includes(listing.id) ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5" />}
                                        </div>
                                        <div className="relative">
                                            <img src={listing.image_url} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                            {isCompetitorItem && <div className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full shadow-md"><ShieldAlert className="w-2 h-2" /></div>}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-gray-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">{listing.title}</h4>
                                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                                <span className="font-medium mr-2 bg-gray-100 px-1.5 py-0.5 rounded">${listing.price}</span>
                                                <div onClick={(e) => onOptimize(e, listing)} className={`flex items-center px-1.5 py-0.5 rounded cursor-pointer transition-all hover:scale-105 ${listing.is_analyzed ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>
                                                    {listing.is_analyzed ? <><CheckCircle className="w-3 h-3 mr-1" /> {t('my_shop.status_optimized')}</> : <><AlertCircle className="w-3 h-3 mr-1" /> {t('my_shop.status_pending')}</>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 pl-4">
                                        {listing.is_analyzed && <span className={`text-lg font-black ${listing.lqs_score >= 8 ? 'text-emerald-500' : listing.lqs_score >= 5 ? 'text-amber-500' : 'text-red-500'}`}>{listing.lqs_score}</span>}
                                        <button onClick={(e) => handleDeleteClick(e, listing.id)} className="p-2 text-gray-300 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyShop;
