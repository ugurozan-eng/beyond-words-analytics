import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Download, TrendingUp, DollarSign, Package, PlusCircle, Filter, ArrowUpDown, CheckSquare, Square, ShieldAlert, CheckCircle, AlertCircle, Trash2, Settings, Crown } from 'lucide-react';
import StatCard from './components/dashboard/StatCard';
import AnalysisCharts from './components/dashboard/AnalysisCharts';
import WelcomePanel from './components/dashboard/WelcomePanel';
import AnalysisPanel from './components/analysis/AnalysisPanel';
import NewProductModal from './components/modals/NewProductModal';
import ReportModal from './components/modals/ReportModal';
import SettingsModal from './components/modals/SettingsModal';
import OptimizationModal from './components/modals/OptimizationModal';
import LoginPage from './components/LoginPage';

import DashboardTrafficPanel from './components/dashboard/DashboardTrafficPanel';
import MiniStatCard from './components/dashboard/MiniStatCard';
import SubscriptionModal from './components/modals/SubscriptionModal';
import { API_BASE_URL } from './config';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [listings, setListings] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortOption, setSortOption] = useState("date-desc");
    const [selectedIds, setSelectedIds] = useState([]);
    const [reportModalData, setReportModalData] = useState({ isOpen: false, listingId: null, title: '' });
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [isOptimizationOpen, setIsOptimizationOpen] = useState(false);
    const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

    // Freemium Logic States
    const [userPlan, setUserPlan] = useState('free'); // 'free' or 'pro'
    const [dailyUsage, setDailyUsage] = useState(0);
    const DAILY_LIMIT = 3;

    const fetchListings = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/listings/`);
            if (!response.ok) throw new Error("Hata");
            setListings(await response.json());
        } catch (error) {
            console.log("Liste yenileme hatası (geçici)");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchListings(); }, [fetchListings]);

    // --- FİLTRE MANTIĞI ---
    const getProcessedListings = () => {
        let result = [...listings];
        if (searchTerm) {
            result = result.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
        }

        if (filterStatus === "mine") {
            result = result.filter(item => item.listing_type === "mine");
        } else if (filterStatus === "competitor") {
            result = result.filter(item => item.listing_type === "competitor");
        } else if (filterStatus === "optimized") {
            result = result.filter(item => item.is_analyzed);
        } else if (filterStatus === "pending") {
            result = result.filter(item => !item.is_analyzed);
        }

        result.sort((a, b) => {
            if (sortOption === "price-asc") return a.price - b.price;
            if (sortOption === "price-desc") return b.price - a.price;
            if (sortOption === "lqs-desc") return (b.lqs_score || 0) - (a.lqs_score || 0);
            if (sortOption === "lqs-asc") return (a.lqs_score || 0) - (b.lqs_score || 0);
            return 0;
        });
        if (sortOption === "date-desc") return result.reverse();
        return result;
    };
    const filteredListings = getProcessedListings();

    const handleExportCSV = () => { if (!listings.length) return; const csvContent = ["ID,Type,Title,Price,Analyzed,LQS,LQS Reason,LastAnalyzed,Tags,SuggestedTitle,SuggestedDesc,Materials,Styles,Colors,Occasions,Recipients,PredictedPriceMin,PredictedPriceMax,PriceReason,FAQs,TrendScore,TrendReason,BestSellingMonths,CompetitorAnalysis", ...listings.map(i => `${i.id},${i.listing_type},"${i.title.replace(/"/g, '""')}",${i.price},${i.is_analyzed},${i.lqs_score},"${(i.lqs_reason || "").replace(/"/g, '""')}",${i.last_analyzed_at},"${i.tags.join(",")}", "${(i.suggested_title || "").replace(/"/g, '""')}", "${(i.suggested_description || "").replace(/"/g, '""')}", "${(i.suggested_materials || "")}", "${(i.suggested_styles || "")}", "${(i.suggested_colors || "")}", "${(i.suggested_occasions || "")}", "${(i.suggested_recipients || "")}",${i.predicted_price_min},${i.predicted_price_max},"${(i.price_reason || "").replace(/"/g, '""')}","${(i.suggested_faqs || "").replace(/"/g, '""')}",${i.trend_score},"${(i.trend_reason || "").replace(/"/g, '""')}","${(i.best_selling_months || "").replace(/"/g, '""')}","${(i.competitor_analysis || "").replace(/"/g, '""')}"`)].join("\n"); const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })); link.download = "etsy_export.csv"; link.click(); };

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setDeleteConfirmation(id);
    };

    const handleOptimizeClick = async (e, listing) => {
        e.stopPropagation();
        if (!listing.is_analyzed) {
            await handleAnalyze(listing);
            return;
        }
        setSelectedListing(listing); // Ensure selectedListing is set for OptimizationModal
        setIsOptimizationOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation) return;
        const id = deleteConfirmation;
        try {
            await fetch(`${API_BASE_URL}/listings/${id}`, { method: 'DELETE' });
            setListings(p => p.filter(i => i.id !== id));
            if (selectedListing?.id === id) {
                setSelectedListing(null);
                setAnalysisResult(null);
            }
            setDeleteConfirmation(null);
            // Increment daily usage if successful and user is free
            if (userPlan === 'free') {
                setDailyUsage(prev => prev + 1);
            }
        } catch (error) {
            console.error("Silme hatası:", error);
            alert("Silinirken bir hata oluştu.");
        }
    };

    const handleSelectListing = (listing) => {
        setSelectedListing(listing);
        setAnalysisResult(null);
        if (!listing.is_analyzed && !isAnalyzing) {
            handleAnalyze(listing);
        }
    };

    const toggleSelect = (e, id) => {
        e.stopPropagation();
        if (selectedIds.includes(id)) setSelectedIds(prev => prev.filter(i => i !== id));
        else setSelectedIds(prev => [...prev, id]);
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredListings.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredListings.map(l => l.id));
        }
    };

    const handleBulkAnalyze = async () => {
        if (!confirm(`${selectedIds.length} ürün analiz edilecek. Bu işlem biraz sürebilir. Onaylıyor musunuz?`)) return;

        const targets = listings.filter(l => selectedIds.includes(l.id));

        for (const item of targets) {
            setSelectedListing(item);
            setAnalysisResult(null);
            await handleAnalyze(item, false);
            await new Promise(r => setTimeout(r, 1000));
        }
        setStatusMessage({ type: 'success', text: 'Toplu analiz tamamlandı!' });
        setTimeout(() => setStatusMessage(null), 4000);
        setSelectedIds([]);
    };

    const handleAnalyze = async (listingToAnalyze = null, force = false) => {
        // Freemium Gatekeeper
        if (userPlan === 'free' && dailyUsage >= DAILY_LIMIT && !force) {
            setIsSubscriptionOpen(true);
            setStatusMessage({ type: 'error', text: '⚠️ Günlük analiz limitiniz doldu! Devam etmek için Pro\'ya geçin.' });
            setTimeout(() => setStatusMessage(null), 4000);
            return;
        }

        const targetListing = listingToAnalyze || selectedListing;
        if (!targetListing) return;

        setIsAnalyzing(true);
        setStatusMessage({ type: 'info', text: '🔍 Analiz yapılıyor, lütfen bekleyin...' });
        try {
            const res = await fetch(`${API_BASE_URL}/analyze/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: targetListing.id,
                    image_url: targetListing.image_url,
                    product_title: targetListing.title,
                    force_refresh: force
                })
            });

            if (!res.ok) throw new Error("AI Hatası");
            const result = await res.json();
            setAnalysisResult(result);

            let isCachedData = false;
            if (result.last_analyzed_at) {
                const analyzedTime = new Date(result.last_analyzed_at).getTime();
                const now = Date.now();
                isCachedData = (now - analyzedTime) > 60000;
            }

            if (isCachedData) {
                setStatusMessage({ type: 'success', text: '✅ Analiziniz güncel (Son 48 saat içinde yapıldı)' });
            } else {
                setStatusMessage({ type: 'info', text: '🔵 Analiz başarıyla tamamlandı!' });
                if (userPlan === 'free') {
                    setDailyUsage(prev => prev + 1);
                }
            }

            const updatedItem = {
                ...targetListing,
                is_analyzed: true,
                lqs_score: result.lqs_score,
                lqs_reason: result.lqs_reason,
                last_analyzed_at: result.last_analyzed_at,
                tags: result.suggested_tags,
                suggested_title: result.suggested_title,
                suggested_description: result.suggested_description,
                suggested_materials: result.suggested_materials,
                suggested_styles: result.suggested_styles,
                suggested_colors: result.suggested_colors,
                suggested_occasions: result.suggested_occasions,
                suggested_recipients: result.suggested_recipients,
                suggested_faqs: result.suggested_faqs,
                predicted_price_min: result.predicted_price_min,
                predicted_price_max: result.predicted_price_max,
                price_reason: result.price_reason,
                trend_score: result.trend_score,
                trend_reason: result.trend_reason,
                best_selling_months: result.best_selling_months,
                tags_focus: result.tags_focus,
                tags_long_tail: result.tags_long_tail,
                tags_aesthetic: result.tags_aesthetic,
                tags_creative: result.tags_creative,
                monthly_popularity: result.monthly_popularity,
                competitor_analysis: result.competitor_analysis,
                predicted_price_optimal: result.predicted_price_optimal
            };

            setListings(prev => prev.map(i => i.id === targetListing.id ? updatedItem : i));
            if (selectedListing && selectedListing.id === targetListing.id) {
                setSelectedListing(updatedItem);
            }

            setTimeout(() => setStatusMessage(null), 4000);

        } catch {
            setStatusMessage({ type: 'error', text: 'Analiz Hatası' });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleUpdateListing = async (id, updatedData) => { try { const response = await fetch(`${API_BASE_URL}/listings/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedData) }); if (!response.ok) throw new Error("Hata"); const updatedListing = await response.json(); setListings(prev => prev.map(item => item.id === id ? { ...item, ...updatedListing } : item)); setSelectedListing(prev => prev.id === id ? { ...prev, ...updatedListing } : prev); setAnalysisResult(prev => prev ? ({ ...prev, ...updatedListing }) : null); setStatusMessage({ type: 'success', text: 'Kaydedildi!' }); setTimeout(() => setStatusMessage(null), 2000); } catch { setStatusMessage({ type: 'error', text: 'Hata' }); } };

    const activeResult = analysisResult || (selectedListing?.is_analyzed ? {
        suggested_title: selectedListing.suggested_title,
        suggested_description: selectedListing.suggested_description,
        suggested_tags: selectedListing.tags || [],
        lqs_score: selectedListing.lqs_score,
        lqs_reason: selectedListing.lqs_reason,
        last_analyzed_at: selectedListing.last_analyzed_at,
        suggested_materials: selectedListing.suggested_materials,
        suggested_styles: selectedListing.suggested_styles,
        suggested_colors: selectedListing.suggested_colors,
        suggested_occasions: selectedListing.suggested_occasions,
        suggested_recipients: selectedListing.suggested_recipients,
        suggested_faqs: selectedListing.suggested_faqs,
        predicted_price_min: selectedListing.predicted_price_min,
        predicted_price_max: selectedListing.predicted_price_max,
        price_reason: selectedListing.price_reason,
        trend_score: selectedListing.trend_score,
        trend_reason: selectedListing.trend_reason,
        best_selling_months: selectedListing.best_selling_months,
        tags_focus: selectedListing.tags_focus,
        tags_long_tail: selectedListing.tags_long_tail,
        tags_aesthetic: selectedListing.tags_aesthetic,
        tags_creative: selectedListing.tags_creative,
        monthly_popularity: selectedListing.monthly_popularity,
        competitor_analysis: selectedListing.competitor_analysis,
        predicted_price_optimal: selectedListing.predicted_price_optimal
    } : null);

    const handleLogin = (type) => {
        if (type === 'demo') setIsDemoMode(true);
        else setIsDemoMode(false);
        setIsLoggedIn(true);
    };

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 p-8 font-sans w-full max-w-none text-gray-800">
            {isDemoMode && (
                <div className="bg-indigo-600 text-white text-center py-3 px-6 rounded-xl mb-6 shadow-md font-bold flex items-center justify-center animate-fade-in-down gap-3">
                    <div className="flex items-center">
                        <span className="mr-2 text-xl">🚀</span>
                        <span>Şu an Demo Modundasınız. Veriler simülasyondur. Kendi mağazanızı bağlamak için</span>
                    </div>
                    <button
                        onClick={() => setIsLoggedIn(false)}
                        className="bg-white text-indigo-600 px-4 py-1.5 rounded-lg hover:bg-indigo-50 transition-all shadow-sm hover:shadow-md text-sm font-black transform hover:-translate-y-0.5"
                    >
                        Giriş Yapın
                    </button>
                </div>
            )}
            <header className="flex justify-between items-center mb-10 border-b border-gray-200/50 pb-6">
                <div>
                    <h1 className="text-4xl font-black text-indigo-900 flex items-center tracking-tight">
                        <span className="text-5xl mr-3 filter drop-shadow-sm">🪆</span>
                        Beyond Words
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 ml-2">Analytics</span>
                    </h1>
                </div>
                {statusMessage && <div className={`fixed top-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold animate-fade-in-down ${statusMessage.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>{statusMessage.text}</div>}
            </header>

            <DashboardTrafficPanel
                trafficData={selectedListing?.traffic_data ? (typeof selectedListing.traffic_data === 'object' ? selectedListing.traffic_data : JSON.parse(selectedListing.traffic_data)) : null}
                onOpenReport={() => alert("Detaylı rapor modalı yakında eklenecek.")}
                userPlan={userPlan}
                onUnlockClick={() => setIsSubscriptionOpen(true)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <MiniStatCard title="Toplam Ürün" value={listings.length} icon={Package} color="bg-blue-500" />
                <MiniStatCard title="Toplam Değer" value={`$${listings.reduce((a, b) => a + b.price, 0).toFixed(2)}`} icon={DollarSign} color="bg-emerald-500" />
                <MiniStatCard title="Ort. LQS" value={listings.filter(i => i.is_analyzed).length > 0 ? (listings.filter(i => i.is_analyzed).reduce((a, b) => a + b.lqs_score, 0) / listings.filter(i => i.is_analyzed).length).toFixed(1) : "0.0"} icon={TrendingUp} color="bg-violet-500" />
            </div>

            <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/50 space-y-5">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                                <input type="text" placeholder="Ürünlerde ara..." className="pl-12 pr-4 py-3 border border-gray-200 rounded-2xl w-full bg-gray-50/50 text-gray-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                            <div className="flex space-x-3">
                                {selectedIds.length > 0 && (
                                    <button onClick={handleBulkAnalyze} className="px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl flex items-center hover:shadow-lg hover:from-orange-600 hover:to-red-600 shadow-md text-sm font-bold animate-pulse transition-all">
                                        <TrendingUp className="w-4 h-4 mr-2" /> {selectedIds.length} Analiz Et
                                    </button>
                                )}
                                <button onClick={handleExportCSV} className="px-5 py-3 border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-2xl flex items-center text-sm font-bold transition-colors"><Download className="w-4 h-4 mr-2" /> Excel</button>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setIsSubscriptionOpen(true)}
                                        className="hidden md:flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-bold text-sm hover:bg-amber-200 transition-colors border border-amber-200"
                                    >
                                        <Crown className="w-4 h-4 mr-2 fill-current" />
                                        Upgrade to Pro
                                    </button>
                                    <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                                        <Settings className="w-6 h-6" />
                                    </button>
                                    <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 flex items-center">
                                        <PlusCircle className="w-5 h-5 mr-2" /> Yeni Ürün
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Filter className="w-4 h-4 absolute left-4 top-3.5 text-gray-500" />
                                    <select className="pl-10 pr-8 py-3 border border-gray-200 rounded-2xl bg-white text-sm font-bold text-gray-600 w-full cursor-pointer appearance-none hover:bg-gray-50 transition-colors outline-none focus:ring-2 focus:ring-indigo-100" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                        <option value="all">Tüm Liste (Hepsi)</option>
                                        <option value="mine">Sadece Benimkiler</option>
                                        <option value="competitor">Rakip Analizi</option>
                                        <option value="optimized">Optimize Edilenler</option>
                                        <option value="pending">Bekleyenler</option>
                                    </select>
                                </div>
                                <div className="relative flex-1">
                                    <ArrowUpDown className="w-4 h-4 absolute left-4 top-3.5 text-gray-500" />
                                    <select className="pl-10 pr-8 py-3 border border-gray-200 rounded-2xl bg-white text-sm font-bold text-gray-600 w-full cursor-pointer appearance-none hover:bg-gray-50 transition-colors outline-none focus:ring-2 focus:ring-indigo-100" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                                        <option value="date-desc">En Yeni Eklenen</option>
                                        <option value="lqs-desc">LQS Puanı (Yüksek-Düşük)</option>
                                        <option value="price-desc">Fiyat (Pahalı-Ucuz)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center px-4">
                            <div className="flex items-center cursor-pointer text-gray-500 hover:text-indigo-700 select-none transition-colors group" onClick={handleSelectAll}>
                                {selectedIds.length > 0 && selectedIds.length === filteredListings.length ? <CheckSquare className="w-5 h-5 mr-2 text-indigo-600" /> : <Square className="w-5 h-5 mr-2 group-hover:text-indigo-400" />}
                                <span className="text-xs font-bold uppercase tracking-wider group-hover:text-indigo-600">Listelenen Ürünler ({filteredListings.length})</span>
                            </div>
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">{filteredListings.length} Adet</span>
                        </div>

                        <div className="space-y-4">
                            {filteredListings.length === 0 ? (
                                <div className="text-center py-16 bg-white/50 rounded-3xl border border-dashed border-gray-300"><Search className="w-16 h-16 mx-auto text-gray-300 mb-4" /><p className="text-gray-500 font-medium">Kriterlere uygun ürün bulunamadı.</p><button onClick={() => { setSearchTerm(""); setFilterStatus("all"); }} className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-bold underline">Filtreleri Temizle</button></div>
                            ) : (
                                filteredListings.map((listing) => {
                                    const isCompetitorItem = listing.listing_type === 'competitor';
                                    const borderClass = isCompetitorItem
                                        ? "ring-2 ring-orange-400 bg-orange-50/50"
                                        : (selectedListing?.id === listing.id ? "ring-2 ring-indigo-500 bg-indigo-50/50" : "border border-gray-100 bg-white hover:border-indigo-200");

                                    return (
                                        <div key={listing.id} onClick={() => handleSelectListing(listing)} className={`group p-5 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all ${borderClass}`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center">
                                                    <div onClick={(e) => toggleSelect(e, listing.id)} className="mr-4 text-gray-300 hover:text-indigo-600 cursor-pointer transition-colors">
                                                        {selectedIds.includes(listing.id) ? <CheckSquare className="w-6 h-6 text-indigo-600" /> : <Square className="w-6 h-6" />}
                                                    </div>
                                                    <div className="relative">
                                                        <img src={listing.image_url} alt={listing.title} className="w-20 h-20 object-cover rounded-xl border border-gray-100 shadow-sm flex-shrink-0" />
                                                        {isCompetitorItem && <div className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md"><ShieldAlert className="w-3 h-3" /></div>}
                                                    </div>
                                                </div>

                                                <div className="ml-5 flex-1">
                                                    <div className="flex items-center mb-2">
                                                        {isCompetitorItem && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded mr-2 border border-red-200">RAKİP</span>}
                                                        <h3 className="font-bold text-gray-800 line-clamp-1 text-base group-hover:text-indigo-700 transition-colors">{listing.title}</h3>
                                                    </div>
                                                    <div className="flex items-center mt-2 text-xs text-gray-500 font-medium">
                                                        <span className="font-bold mr-3 text-gray-900 bg-gray-100 px-2 py-1 rounded-lg">${listing.price.toFixed(2)}</span>
                                                        <div onClick={(e) => handleOptimizeClick(e, listing)} className={`flex items-center px-2 py-1 rounded-lg cursor-pointer transition-all hover:scale-105 ${listing.is_analyzed ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>
                                                            {listing.is_analyzed ? <><CheckCircle className="w-3 h-3 mr-1" /> Optimize</> : <><AlertCircle className="w-3 h-3 mr-1" /> Bekliyor</>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="ml-4 flex flex-col items-end justify-between min-h-[80px]">
                                                    <button onClick={(e) => handleDeleteClick(e, listing.id)} className="p-2 text-gray-300 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"><Trash2 className="w-5 h-5" /></button>
                                                    {listing.is_analyzed && <span className={`text-xl font-black ${listing.lqs_score >= 8 ? 'text-emerald-500' : listing.lqs_score >= 5 ? 'text-amber-500' : 'text-red-500'}`}>{listing.lqs_score}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <div className="sticky top-6 transition-all">
                        {selectedListing ? (
                            <>
                                <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50 mb-6 flex items-center space-x-6">
                                    <img src={selectedListing.image_url} className="w-24 h-24 object-cover rounded-2xl shadow-md border border-white" />
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">{selectedListing.title}</h3>
                                        <p className="text-3xl font-black text-indigo-600 mt-1">${selectedListing.price}</p>
                                    </div>
                                </div>
                                <AnalysisPanel
                                    analysisResult={activeResult}
                                    listingId={selectedListing.id}
                                    currentPrice={selectedListing.price}
                                    onCopy={(msg) => { setStatusMessage({ type: 'success', text: msg }); setTimeout(() => setStatusMessage(null), 2000); }}
                                    onUpdate={handleUpdateListing}
                                    onAnalyzeClick={(force) => handleAnalyze(null, force)}
                                    isAnalyzing={isAnalyzing}
                                    listingType={selectedListing.listing_type}
                                    onShowReport={(id, title) => setReportModalData({ isOpen: true, listingId: id, title: title })}
                                />
                            </>
                        ) : (
                            <WelcomePanel />
                        )}
                    </div>
                </div>
            </main>

            <AnalysisCharts listings={listings} />
            <NewProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddProduct={(p) => setListings(prev => [...prev, p])} />
            {reportModalData.isOpen && (
                <ReportModal
                    isOpen={reportModalData.isOpen}
                    onClose={() => setReportModalData({ ...reportModalData, isOpen: false })}
                    listingId={reportModalData.listingId}
                    listingTitle={reportModalData.title}
                    trafficData={selectedListing?.traffic_data || analysisResult?.traffic_data}
                />
            )}

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <OptimizationModal isOpen={isOptimizationOpen} onClose={() => setIsOptimizationOpen(false)} listing={selectedListing} onUpdate={handleUpdateListing} />
            <SubscriptionModal
                isOpen={isSubscriptionOpen}
                onClose={() => setIsSubscriptionOpen(false)}
                onUpgrade={() => {
                    setUserPlan('pro');
                    setIsSubscriptionOpen(false);
                    setStatusMessage({ type: 'success', text: '🎉 Tebrikler! Artık PRO üyesiniz. Tüm özellikler açıldı!' });
                    setTimeout(() => setStatusMessage(null), 5000);
                }}
            />

            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 transform transition-all scale-100 p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Ürünü Sil?</h3>
                        <p className="text-gray-500 mb-6">Bu işlem geri alınamaz. Devam etmek istiyor musunuz?</p>
                        <div className="flex space-x-3 justify-center">
                            <button onClick={() => setDeleteConfirmation(null)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                            <button onClick={confirmDelete} className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-colors">Evet, Sil</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;