import React, { useState, useEffect, useCallback } from 'react';
import { Search, Download, TrendingUp, DollarSign, Package, PlusCircle, Filter, ArrowUpDown, CheckSquare, Square, ShieldAlert, CheckCircle, AlertCircle, Trash2, Settings, Crown, LayoutDashboard, BarChart3, Zap, List } from 'lucide-react';
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
import Sidebar from './components/dashboard/Sidebar';
import LQSChart from './components/dashboard/LQSChart';
import PricingCard from './components/analysis/PricingCard';
import CompetitorView from './components/dashboard/CompetitorView';
import AiSupportWidget from './components/AiSupportWidget';
import GlobalMarketPulse from './components/dashboard/GlobalMarketPulse';
import HealthCheckWidget from './components/dashboard/HealthCheckWidget';
import ShopLinkImport from './components/Import/ShopLinkImport';
import ProductGrid from './components/dashboard/ProductGrid';
import CreateListing from './pages/CreateListing';
import KeywordExplorer from './pages/KeywordExplorer';
import ProfitCalculator from './pages/ProfitCalculator';
import TagSpy from './pages/TagSpy';
import MyShop from './pages/MyShop';
import { API_BASE_URL } from './config';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Temporary bypass for testing
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [listings, setListings] = useState([]);
    const [analyzedProducts, setAnalyzedProducts] = useState([]); // State for newly imported products
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
    const [initialModalType, setInitialModalType] = useState('mine');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Navigation State
    const [activeView, setActiveView] = useState('dashboard');

    // Freemium Logic States
    const [userPlan, setUserPlan] = useState('free');
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

    const handleImportComplete = (newProducts) => {
        // Add new products to the beginning of the list
        setListings(prev => [...newProducts, ...prev]);
        setAnalyzedProducts(newProducts); // Update the grid view
        setStatusMessage({ type: 'success', text: `${newProducts.length} ürün başarıyla içe aktarıldı!` });
        setTimeout(() => setStatusMessage(null), 4000);
    };

    const getProcessedListings = () => {
        let result = [...listings];
        if (searchTerm) {
            result = result.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
        }

        if (filterStatus === "mine") result = result.filter(item => item.listing_type === "mine");
        else if (filterStatus === "competitor") result = result.filter(item => item.listing_type === "competitor");
        else if (filterStatus === "optimized") result = result.filter(item => item.is_analyzed);
        else if (filterStatus === "pending") result = result.filter(item => !item.is_analyzed);

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

    const handleDeleteClick = (e, id) => { e.stopPropagation(); setDeleteConfirmation(id); };

    const handleOptimizeClick = async (e, listing) => {
        e.stopPropagation();
        if (!listing.is_analyzed) { await handleAnalyze(listing); return; }
        setSelectedListing(listing); setIsOptimizationOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation) return;
        const id = deleteConfirmation;
        try {
            await fetch(`${API_BASE_URL}/listings/${id}`, { method: 'DELETE' });
            setListings(p => p.filter(i => i.id !== id));
            if (selectedListing?.id === id) { setSelectedListing(null); setAnalysisResult(null); }
            setDeleteConfirmation(null);
            if (userPlan === 'free') setDailyUsage(prev => prev + 1);
        } catch (error) { console.error("Silme hatası:", error); alert("Silinirken bir hata oluştu."); }
    };

    const handleSelectListing = (listing) => {
        setSelectedListing(listing);
        setAnalysisResult(null);
        setActiveView('analysis'); // Switch to analysis view
        if (!listing.is_analyzed && !isAnalyzing) { handleAnalyze(listing); }
    };

    const toggleSelect = (e, id) => {
        e.stopPropagation();
        if (selectedIds.includes(id)) setSelectedIds(prev => prev.filter(i => i !== id));
        else setSelectedIds(prev => [...prev, id]);
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredListings.length) setSelectedIds([]);
        else setSelectedIds(filteredListings.map(l => l.id));
    };

    const handleBulkAnalyze = async () => {
        if (!confirm(`${selectedIds.length} ürün analiz edilecek. Bu işlem biraz sürebilir. Onaylıyor musunuz?`)) return;
        const targets = listings.filter(l => selectedIds.includes(l.id));
        for (const item of targets) {
            setSelectedListing(item); setAnalysisResult(null);
            await handleAnalyze(item, false);
            await new Promise(r => setTimeout(r, 1000));
        }
        setStatusMessage({ type: 'success', text: 'Toplu analiz tamamlandı!' });
        setTimeout(() => setStatusMessage(null), 4000);
        setSelectedIds([]);
    };

    const handleAnalyze = async (listingToAnalyze = null, force = false) => {
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
            const res = await fetch(`${API_BASE_URL}/analysis/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: targetListing.id, image_url: targetListing.image_url, product_title: targetListing.title, force_refresh: force })
            });
            if (!res.ok) throw new Error("AI Hatası");
            const result = await res.json();

            // Check for functional error (backend returned 200 but with error data)
            if (result.lqs_score === 0 || result.suggested_title === "Error") {
                setAnalysisResult(result); // Show error in panel
                setStatusMessage({ type: 'error', text: `Analiz Hatası: ${result.suggested_description || 'Veri alınamadı'}` });
                return; // Stop here, don't overwrite listing data
            }

            setAnalysisResult(result);
            let isCachedData = false;
            if (result.last_analyzed_at) {
                const analyzedTime = new Date(result.last_analyzed_at).getTime();
                isCachedData = (Date.now() - analyzedTime) > 60000;
            }
            if (isCachedData) setStatusMessage({ type: 'success', text: '✅ Analiziniz güncel (Son 48 saat içinde yapıldı)' });
            else {
                setStatusMessage({ type: 'success', text: '🔵 Analiz başarıyla tamamlandı!' });
                if (userPlan === 'free') setDailyUsage(prev => prev + 1);
            }
            const updatedItem = { ...targetListing, is_analyzed: true, ...result };
            setListings(prev => prev.map(i => i.id === targetListing.id ? updatedItem : i));
            if (selectedListing && selectedListing.id === targetListing.id) setSelectedListing(updatedItem);
            setTimeout(() => setStatusMessage(null), 4000);
        } catch (error) {
            console.error("Analiz hatası detay:", error);
            setStatusMessage({ type: 'error', text: `Analiz Hatası: ${error.message || 'Bilinmeyen hata'}` });
        } finally { setIsAnalyzing(false); }
    };

    const handleUpdateListing = async (id, updatedData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/listings/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedData) });
            if (!response.ok) throw new Error("Hata");
            const updatedListing = await response.json();
            setListings(prev => prev.map(item => item.id === id ? { ...item, ...updatedListing } : item));
            setSelectedListing(prev => prev.id === id ? { ...prev, ...updatedListing } : prev);
            setAnalysisResult(prev => prev ? ({ ...prev, ...updatedListing }) : null);
            setStatusMessage({ type: 'success', text: 'Kaydedildi!' });
            setTimeout(() => setStatusMessage(null), 2000);
        } catch { setStatusMessage({ type: 'error', text: 'Hata' }); }
    };

    const activeResult = analysisResult || (selectedListing?.is_analyzed ? { ...selectedListing, suggested_tags: selectedListing.tags || [] } : null);

    const handleLogin = (type) => { if (type === 'demo') setIsDemoMode(true); else setIsDemoMode(false); setIsLoggedIn(true); };

    if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

    // --- RENDER HELPERS ---
    const renderDashboard = () => (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* ROW 1: KPI STRIP (Global Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MiniStatCard title="Pazar Hacmi" value="$4.2M" icon={DollarSign} color="bg-blue-500" />
                <MiniStatCard title="Aktif Satıcı" value="12.5K" icon={Package} color="bg-emerald-500" />
                <MiniStatCard title="Trend Kelimeler" value="850+" icon={TrendingUp} color="bg-violet-500" />
                <MiniStatCard title="Fırsat Skoru" value="8.4" icon={Zap} color="bg-orange-500" />
            </div>

            {/* ROW 2: MARKET TRENDS & COMPETITOR ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* MARKET TRENDS (Col-span-8) */}
                <div className="lg:col-span-8 h-96 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-center text-center">
                    <div className="p-4 bg-indigo-50 rounded-full mb-4">
                        <TrendingUp className="w-12 h-12 text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Market Trendleri Özeti</h3>
                    <p className="text-gray-500 max-w-md">
                        Kategorinizdeki genel satış trendleri ve mevsimsel dalgalanmalar burada görüntülenecek.
                    </p>
                </div>

                {/* COMPETITOR ACTIVITY (Col-span-4) */}
                <div className="lg:col-span-4 h-96 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-center text-center">
                    <div className="p-4 bg-orange-50 rounded-full mb-4">
                        <ShieldAlert className="w-12 h-12 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Rakip Aktivite Akışı</h3>
                    <p className="text-gray-500">
                        Takip ettiğiniz rakiplerin son 24 saatteki fiyat ve listeleme değişiklikleri.
                    </p>
                </div>
            </div>

            {/* ROW 3: TRAFFIC INTELLIGENCE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700 flex items-center"><BarChart3 className="w-4 h-4 mr-2 text-gray-400" /> Trafik İstihbaratı</h3>
                </div>
                <DashboardTrafficPanel
                    trafficData={selectedListing?.traffic_data ? (typeof selectedListing.traffic_data === 'object' ? selectedListing.traffic_data : JSON.parse(selectedListing.traffic_data)) : null}
                    onOpenReport={() => alert("Detaylı rapor modalı yakında eklenecek.")}
                    userPlan={userPlan}
                    onUnlockClick={() => setIsSubscriptionOpen(true)}
                    compact={true}
                />
            </div>
        </div>
    );

    const renderAnalysis = () => (
        <div className="h-full flex flex-col animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
                <button onClick={() => setActiveView('dashboard')} className="flex items-center text-gray-500 hover:text-indigo-600 font-bold transition-colors">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard'a Dön
                </button>
                {selectedListing && (
                    <div className="flex items-center space-x-4">
                        <img src={selectedListing.image_url} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                        <div>
                            <h2 className="font-bold text-gray-900 line-clamp-1">{selectedListing.title}</h2>
                            <span className="text-xs text-gray-500">${selectedListing.price}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-1 overflow-y-auto">
                {selectedListing ? (
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
                ) : (
                    <WelcomePanel />
                )}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* MOBILE SIDEBAR BACKDROP */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-indigo-900 transition-transform duration-300 transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar
                    activeView={activeView}
                    onNavigate={(view) => {
                        if (view === 'settings') setIsSettingsOpen(true);
                        else setActiveView(view);
                        setIsSidebarOpen(false); // Close sidebar on mobile after navigation
                    }}
                    onLogout={() => setIsLoggedIn(false)}
                    userPlan={userPlan}
                    onUpgrade={() => setIsSubscriptionOpen(true)}
                />
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col overflow-hidden relative w-full">
                {/* TOP HEADER */}
                <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-10">

                    {/* LEFT: HAMBURGER & SEARCH */}
                    <div className="flex items-center flex-1">
                        {/* Hamburger Button (Mobile Only) */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 mr-4 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                            <List className="w-6 h-6" />
                        </button>

                        <div className="relative w-full max-w-md hidden md:block">
                            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Genel Arama..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* RIGHT: NOTIFICATIONS & PROFILE */}
                    <div className="flex items-center space-x-2 lg:space-x-4">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors relative">
                            <ShieldAlert className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                            OZ
                        </div>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    {activeView === 'dashboard' && renderDashboard()}
                    {activeView === 'my-shop' && (
                        <MyShop
                            listings={listings}
                            analyzedProducts={analyzedProducts}
                            onImportComplete={handleImportComplete}
                            onOptimize={(e, listing) => handleOptimizeClick(e, listing)}
                            userPlan={userPlan}
                            dailyUsage={dailyUsage}
                            // Inventory Props
                            filterStatus={filterStatus}
                            setFilterStatus={setFilterStatus}
                            sortOption={sortOption}
                            setSortOption={setSortOption}
                            selectedIds={selectedIds}
                            handleSelectAll={handleSelectAll}
                            handleBulkAnalyze={handleBulkAnalyze}
                            handleExportCSV={handleExportCSV}
                            handleSelectListing={handleSelectListing}
                            toggleSelect={toggleSelect}
                            handleDeleteClick={handleDeleteClick}
                            filteredListings={filteredListings}
                            setInitialModalType={setInitialModalType}
                            setIsModalOpen={setIsModalOpen}
                        />
                    )}
                    {activeView === 'create-listing' && <CreateListing />}
                    {activeView === 'keyword-explorer' && <KeywordExplorer />}
                    {activeView === 'tag-spy' && <TagSpy />}
                    {activeView === 'profit-calculator' && <ProfitCalculator />}
                    {activeView === 'analysis' && renderAnalysis()}
                    {activeView === 'competitor' && (
                        <CompetitorView
                            listings={listings}
                            onAddCompetitor={() => { setInitialModalType('competitor'); setIsModalOpen(true); }}
                            onSelectListing={handleSelectListing}
                            onDelete={handleDeleteClick}
                        />
                    )}
                </main>

                {/* NOTIFICATIONS */}
                {statusMessage && <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold animate-fade-in-up ${statusMessage.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>{statusMessage.text}</div>}
            </div>

            {/* MODALS */}
            <NewProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddProduct={(p) => setListings(prev => [...prev, p])} initialType={initialModalType} />
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
            <OptimizationModal
                isOpen={isOptimizationOpen}
                onClose={() => setIsOptimizationOpen(false)}
                originalListing={selectedListing}
                optimizedData={selectedListing}
                onApply={() => {
                    // Refresh or update logic if needed
                    setStatusMessage({ type: 'success', text: 'Değişiklikler uygulandı!' });
                    setTimeout(() => setStatusMessage(null), 3000);
                }}
            />
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
            {/* AI SUPPORT WIDGET */}
            <AiSupportWidget />
        </div>
    );
}

export default App;