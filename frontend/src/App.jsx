import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Search, List, Trash2, Settings, Crown } from 'lucide-react';
import NewProductModal from './components/modals/NewProductModal';
import ReportModal from './components/modals/ReportModal';
import SettingsModal from './components/modals/SettingsModal';
import OptimizationModal from './components/modals/OptimizationModal';
import LoginPage from './components/LoginPage';
import DashboardHome from './components/dashboard/DashboardHome';
import SubscriptionModal from './components/modals/SubscriptionModal';
import Sidebar from './components/dashboard/Sidebar';
import CompetitorTracking from './pages/CompetitorTracking';
import AiSupportWidget from './components/AiSupportWidget';
import CreateListing from './pages/CreateListing';
import KeywordExplorer from './pages/KeywordExplorer';
import ProfitCalculator from './pages/ProfitCalculator';
import CompetitorAnalysis from './pages/CompetitorAnalysis';
import MyShop from './pages/MyShop';
import SurgeryRoom from './pages/SurgeryRoom';
import { API_BASE_URL } from './config';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

function AppContent() {
    const { t, i18n } = useTranslation();
    const { user, loading, isPro, signOut } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [listings, setListings] = useState([]);
    const [analyzedProducts, setAnalyzedProducts] = useState([]);
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
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!loading) setIsLoggedIn(!!user);
    }, [user, loading]);

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
            console.log(t('app.list_refresh_error'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchListings(); }, [fetchListings]);

    const handleImportComplete = (newProducts) => {
        setListings(prev => [...newProducts, ...prev]);
        setAnalyzedProducts(newProducts);
        setStatusMessage({ type: 'success', text: t('app.import_success', { count: newProducts.length }) });
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

    const handleUpgrade = () => {
        if (!user) { alert(t('app.login_required')); return; }
        const checkoutUrl = `https://cyclear.lemonsqueezy.com/buy/a2d23b5d-7bf0-4911-8df8-ff7ac3eb0ba5?checkout[custom][user_id]=${user.id}`;
        if (window.LemonSqueezy) window.LemonSqueezy.Url.Open(checkoutUrl);
        else window.location.href = checkoutUrl;
    };

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
        } catch (error) { console.error(t('app.delete_error'), error); alert(t('app.delete_error_alert')); }
    };

    const handleSelectListing = (listing) => {
        setSelectedListing(listing);
        setAnalysisResult(null);
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
        if (!confirm(t('app.bulk_analyze_confirm', { count: selectedIds.length }))) return;
        const targets = listings.filter(l => selectedIds.includes(l.id));
        for (const item of targets) {
            setSelectedListing(item); setAnalysisResult(null);
            await handleAnalyze(item, false);
            await new Promise(r => setTimeout(r, 1000));
        }
        setStatusMessage({ type: 'success', text: t('app.bulk_analyze_complete') });
        setTimeout(() => setStatusMessage(null), 4000);
        setSelectedIds([]);
    };

    const handleAnalyze = async (listingToAnalyze = null, force = false) => {
        if (userPlan === 'free' && dailyUsage >= DAILY_LIMIT && !force) {
            setIsSubscriptionOpen(true);
            setStatusMessage({ type: 'error', text: t('app.daily_limit_reached') });
            setTimeout(() => setStatusMessage(null), 4000);
            return;
        }
        const targetListing = listingToAnalyze || selectedListing;
        if (!targetListing) return;
        setIsAnalyzing(true);
        setStatusMessage({ type: 'info', text: t('app.analyzing_wait') });
        try {
            const res = await fetch(`${API_BASE_URL}/analysis/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: targetListing.id, image_url: targetListing.image_url, product_title: targetListing.title, force_refresh: force })
            });
            if (!res.ok) throw new Error("AI Hatası");
            const result = await res.json();

            if (result.lqs_score === 0 || result.suggested_title === "Error") {
                setAnalysisResult(result);
                setStatusMessage({ type: 'error', text: t('app.analysis_error', { error: result.suggested_description || t('app.data_fetch_error') }) });
                return;
            }

            setAnalysisResult(result);
            let isCachedData = false;
            if (result.last_analyzed_at) {
                const analyzedTime = new Date(result.last_analyzed_at).getTime();
                isCachedData = (Date.now() - analyzedTime) > 60000;
            }
            if (isCachedData) setStatusMessage({ type: 'success', text: t('app.analysis_current') });
            else {
                setStatusMessage({ type: 'success', text: t('app.analysis_success') });
                if (userPlan === 'free') setDailyUsage(prev => prev + 1);
            }
            const updatedItem = { ...targetListing, is_analyzed: true, ...result };
            setListings(prev => prev.map(i => i.id === targetListing.id ? updatedItem : i));
            if (selectedListing && selectedListing.id === targetListing.id) setSelectedListing(updatedItem);
            setTimeout(() => setStatusMessage(null), 4000);
        } catch (error) {
            console.error(t('app.analysis_error_detail'), error);
            setStatusMessage({ type: 'error', text: t('app.analysis_error', { error: error.message || t('app.unknown_error') }) });
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
            setStatusMessage({ type: 'success', text: t('app.saved') });
            setTimeout(() => setStatusMessage(null), 2000);
        } catch { setStatusMessage({ type: 'error', text: t('app.error') }); }
    };

    const handleLogin = (type) => { if (type === 'demo') setIsDemoMode(true); else setIsDemoMode(false); setIsLoggedIn(true); };

    if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

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
                    activeView={location.pathname.substring(1) || 'dashboard'}
                    onNavigate={(view) => {
                        if (view === 'settings') setIsSettingsOpen(true);
                        else if (view === 'dashboard') navigate('/');
                        else navigate(`/${view}`);
                        setIsSidebarOpen(false);
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
                    <div className="flex items-center flex-1">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 mr-4 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <List className="w-6 h-6" />
                        </button>
                        <div className="relative w-full max-w-md hidden md:block">
                            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <input type="text" placeholder={t('common.search_placeholder')} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 lg:space-x-4">
                        <div className="flex items-center space-x-2 mr-2">
                            <button onClick={() => i18n.changeLanguage('tr')} className={`transition-opacity hover:opacity-100 ${i18n.language === 'tr' ? 'opacity-100' : 'opacity-50 grayscale'}`} title="Türkçe">
                                <span className="text-xl">🇹🇷</span>
                            </button>
                            <button onClick={() => i18n.changeLanguage('en')} className={`transition-opacity hover:opacity-100 ${i18n.language === 'en' ? 'opacity-100' : 'opacity-50 grayscale'}`} title="English">
                                <span className="text-xl">🇺🇸</span>
                            </button>
                        </div>
                        <div className="relative" ref={profileRef}>
                            <button className="flex items-center space-x-2 focus:outline-none" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200 cursor-pointer hover:bg-indigo-200 transition-colors">OZ</div>
                                {isPro && <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">PRO</span>}
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fade-in-up origin-top-right">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-bold text-gray-900">Ozan</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                    <div className="py-1">
                                        <button onClick={() => { setIsProfileOpen(false); setIsSettingsOpen(true); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center">
                                            <Settings className="w-4 h-4 mr-2" /> {t('common.profile_settings')}
                                        </button>
                                        <button onClick={() => { setIsProfileOpen(false); setIsSettingsOpen(true); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center">
                                            <Crown className="w-4 h-4 mr-2 text-amber-500" /> {t('common.subscription')}
                                        </button>
                                    </div>
                                    <div className="border-t border-gray-100 py-1">
                                        <button onClick={() => { setIsProfileOpen(false); signOut(); setIsLoggedIn(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center">
                                            <Trash2 className="w-4 h-4 mr-2" /> {t('common.logout')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <Routes>
                        <Route path="/" element={
                            <DashboardHome
                                onNavigate={(view, product) => {
                                    if (product) handleSelectListing(product);
                                    if (view === 'product-detail') navigate(`/product/${product.id}`);
                                    else navigate(`/${view}`);
                                }}
                                userPlan={userPlan}
                                listings={listings}
                            />
                        } />
                        <Route path="/my-shop" element={
                            <MyShop
                                listings={listings}
                                analyzedProducts={analyzedProducts}
                                onImportComplete={handleImportComplete}
                                onOptimize={(e, listing) => handleOptimizeClick(e, listing)}
                                userPlan={userPlan}
                                dailyUsage={dailyUsage}
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
                        } />
                        <Route path="/shop" element={
                            <MyShop
                                listings={listings}
                                analyzedProducts={analyzedProducts}
                                onImportComplete={handleImportComplete}
                                onOptimize={(e, listing) => handleOptimizeClick(e, listing)}
                                userPlan={userPlan}
                                dailyUsage={dailyUsage}
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
                        } />
                        <Route path="/create-listing" element={<CreateListing />} />
                        <Route path="/keyword-explorer" element={<KeywordExplorer />} />
                        <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
                        <Route path="/profit-calculator" element={<ProfitCalculator />} />
                        <Route path="/product/:id" element={
                            <SurgeryRoom />
                        } />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
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
                    setStatusMessage({ type: 'success', text: t('common.changes_applied') });
                    setTimeout(() => setStatusMessage(null), 3000);
                }}
            />
            <SubscriptionModal isOpen={isSubscriptionOpen} onClose={() => setIsSubscriptionOpen(false)} onUpgrade={handleUpgrade} />
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 transform transition-all scale-100 p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">{t('common.delete_product')}</h3>
                        <p className="text-gray-500 mb-6">{t('common.delete_confirm_text')}</p>
                        <div className="flex space-x-3 justify-center">
                            <button onClick={() => setDeleteConfirmation(null)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">{t('common.cancel')}</button>
                            <button onClick={confirmDelete} className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-colors">{t('common.yes_delete')}</button>
                        </div>
                    </div>
                </div>
            )}
            <AiSupportWidget />
        </div>
    );
}

export default App;