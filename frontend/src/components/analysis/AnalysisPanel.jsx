import React, { useState, useEffect } from 'react';
import { Zap, Clock, RotateCw, Save, Edit2, ShieldAlert, Target, Sparkles, Calendar, Tag, Copy, Info, TrendingUp, LayoutDashboard, BarChart3 } from 'lucide-react';
import PricingCard from './PricingCard';
import TagManager from './TagManager';
import SeasonalityChart from './SeasonalityChart';
import TrafficSourceChart from './TrafficSourceChart';
import HistoryList from './HistoryList';
import AttributeBadge from '../common/AttributeBadge';

const copyToClipboard = async (text) => { try { await navigator.clipboard.writeText(text); return true; } catch (err) { console.error('Hata:', err); return false; } };
const formatDate = (dateString) => { if (!dateString) return "Henüz yok"; const date = new Date(dateString); return date.toLocaleString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }); };

const AnalysisPanel = ({ analysisResult, listingId, currentPrice, onCopy, onUpdate, onAnalyzeClick, isAnalyzing, listingType, onShowReport }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [editData, setEditData] = useState({ suggested_title: "", suggested_description: "", suggested_materials: "", suggested_styles: "", suggested_colors: "", suggested_occasions: "", suggested_recipients: "", suggested_faqs: "", tags_focus: "", tags_long_tail: "", tags_aesthetic: "", tags_creative: "" });

    useEffect(() => {
        if (analysisResult) {
            setEditData({
                suggested_title: analysisResult.suggested_title || "",
                suggested_description: analysisResult.suggested_description || "",
                suggested_materials: analysisResult.suggested_materials || "",
                suggested_styles: analysisResult.suggested_styles || "",
                suggested_colors: analysisResult.suggested_colors || "",
                suggested_occasions: analysisResult.suggested_occasions || "",
                suggested_recipients: analysisResult.suggested_recipients || "",
                suggested_faqs: analysisResult.suggested_faqs || "",
                tags_focus: analysisResult.tags_focus || "",
                tags_long_tail: analysisResult.tags_long_tail || "",
                tags_aesthetic: analysisResult.tags_aesthetic || "",
                tags_creative: analysisResult.tags_creative || ""
            });
        }
    }, [analysisResult]);

    if (!analysisResult || (analysisResult.lqs_score === 0 && !isAnalyzing)) {
        if (isAnalyzing) return (<div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-10 flex flex-col items-center justify-center h-full min-h-[600px] text-center sticky top-6"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-8"></div><h3 className="text-2xl font-bold text-gray-900 mb-3">2026 Analizi Yapılıyor...</h3><p className="text-gray-500 max-w-xs text-lg">Semantik Vektör Taraması ve Kelime Fırtınası başlatıldı.</p></div>);

        // Check if it's an error result
        if (analysisResult && analysisResult.suggested_title === "Error") {
            return (<div className="bg-red-50/80 backdrop-blur-md rounded-3xl shadow-xl border border-red-100 p-10 flex flex-col items-center justify-center h-full min-h-[600px] text-center sticky top-6"><div className="bg-red-100 p-6 rounded-full mb-8"><ShieldAlert className="w-16 h-16 text-red-600" /></div><h3 className="text-2xl font-bold text-red-900 mb-3">Analiz Hatası</h3><p className="text-red-700 max-w-md mb-10 text-lg">{analysisResult.suggested_description}</p><button onClick={() => onAnalyzeClick(true)} className="flex items-center px-10 py-4 bg-red-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-red-700 hover:shadow-2xl transition-all transform hover:-translate-y-1"><RotateCw className="w-6 h-6 mr-2" />Tekrar Dene</button></div>);
        }

        return (<div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-10 flex flex-col items-center justify-center h-full min-h-[600px] text-center sticky top-6"><div className="bg-indigo-50 p-6 rounded-full mb-8"><Sparkles className="w-16 h-16 text-indigo-600" /></div><h3 className="text-2xl font-bold text-gray-900 mb-3">Analiz Bekleniyor</h3><p className="text-gray-500 max-w-xs mb-10 text-lg">Bu ürün henüz analiz edilmedi veya verisi eksik.</p><button onClick={() => onAnalyzeClick(true)} className="flex items-center px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-indigo-700 hover:shadow-2xl transition-all transform hover:-translate-y-1"><Zap className="w-6 h-6 mr-2" />Analizi Başlat</button></div>);
    }

    const handleSave = async () => {
        const bestTags = analysisResult.suggested_tags || [];
        await onUpdate(listingId, {
            suggested_title: editData.suggested_title,
            suggested_description: editData.suggested_description,
            tags: bestTags,
            suggested_materials: editData.suggested_materials,
            suggested_styles: editData.suggested_styles,
            suggested_colors: editData.suggested_colors,
            suggested_occasions: editData.suggested_occasions,
            suggested_recipients: editData.suggested_recipients,
            suggested_faqs: editData.suggested_faqs,
            tags_focus: editData.tags_focus,
            tags_long_tail: editData.tags_long_tail,
            tags_aesthetic: editData.tags_aesthetic,
            tags_creative: editData.tags_creative
        });
        setIsEditing(false);
    };

    const handleCopyClick = async (text, label) => { const success = await copyToClipboard(text); if (success && onCopy) onCopy(`${label} kopyalandı!`); };

    const minP = analysisResult.predicted_price_min || 0;
    const maxP = analysisResult.predicted_price_max || 0;
    const avgP = (minP + maxP) / 2;

    // RAKİP MODU
    const isCompetitor = listingType === "competitor";
    const trendScore = analysisResult.trend_score || 0;
    const trendColor = trendScore >= 8 ? "text-red-500" : trendScore >= 5 ? "text-orange-500" : "text-gray-400";
    const trendText = trendScore >= 8 ? "Çok Popüler" : trendScore >= 5 ? "Yükselişte" : "Niş / Düşük";
    const displayTags = Array.isArray(analysisResult.suggested_tags) ? analysisResult.suggested_tags : [];

    return (
        <div className={`mt-0 p-8 rounded-3xl shadow-xl border transition-all ${isCompetitor ? 'bg-orange-50/50 border-orange-200 ring-4 ring-orange-50' : 'bg-white/90 backdrop-blur-md border-white/50'}`}>
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                <h3 className={`text-2xl font-black flex items-center tracking-tight ${isCompetitor ? 'text-orange-800' : 'text-indigo-900'}`}>
                    {isCompetitor ? <><ShieldAlert className="w-8 h-8 mr-3" /> Rakip Analiz Raporu</> : <><Zap className="w-8 h-8 mr-3 text-indigo-600" /> Analiz Sonuçları (2026)</>}
                </h3>
                <div className="flex items-center space-x-3">
                    {analysisResult.last_analyzed_at && (<span className="text-xs text-gray-500 hidden md:flex items-center bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 font-medium"><Clock className="w-3 h-3 mr-1.5" /> {formatDate(analysisResult.last_analyzed_at)}</span>)}
                    <button onClick={() => onAnalyzeClick(false)} disabled={isAnalyzing} className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${isAnalyzing ? 'bg-gray-100 text-gray-400 cursor-wait' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm'}`}><RotateCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />Tekrar</button>
                    <button onClick={isEditing ? handleSave : () => setIsEditing(true)} className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isEditing ? "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-green-200" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"}`}>{isEditing ? <><Save className="w-4 h-4 mr-2" /> Kaydet</> : <><Edit2 className="w-4 h-4 mr-2" /> Düzenle</>}</button>
                </div>
            </div>

            {/* TAB NAVIGATION */}
            {/* TAB NAVIGATION */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mb-8 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 flex items-center justify-center py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'overview' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 shadow-md border border-indigo-200 scale-[1.02]' : 'bg-indigo-50 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600 border border-transparent'}`}
                >
                    <LayoutDashboard className={`w-4 h-4 mr-2 ${activeTab === 'overview' ? 'text-indigo-700' : 'text-indigo-400'}`} />
                    Genel Bakış & Fiyat
                </button>
                <button
                    onClick={() => setActiveTab('seo')}
                    className={`flex-1 flex items-center justify-center py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'seo' ? 'bg-gradient-to-r from-fuchsia-100 to-pink-100 text-pink-800 shadow-md border border-pink-200 scale-[1.02]' : 'bg-pink-50 text-pink-400 hover:bg-pink-100 hover:text-pink-600 border border-transparent'}`}
                >
                    <Tag className={`w-4 h-4 mr-2 ${activeTab === 'seo' ? 'text-pink-700' : 'text-pink-400'}`} />
                    SEO & Etiketler
                </button>
                <button
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 flex items-center justify-center py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'details' ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-orange-800 shadow-md border border-orange-200 scale-[1.02]' : 'bg-orange-50 text-orange-400 hover:bg-orange-100 hover:text-orange-600 border border-transparent'}`}
                >
                    <BarChart3 className={`w-4 h-4 mr-2 ${activeTab === 'details' ? 'text-orange-700' : 'text-orange-400'}`} />
                    Detaylar & Trafik
                </button>
            </div>

            <div className="space-y-8 min-h-[400px]">
                {/* TAB 1: GENEL BAKIŞ & FİYAT */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* --- NEURO PRICING KART --- */}
                        {avgP > 0 && (
                            <PricingCard
                                min={minP}
                                max={maxP}
                                optimal={analysisResult.predicted_price_optimal || avgP}
                                reason={analysisResult.price_reason}
                            />
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold text-orange-800 flex items-center uppercase tracking-wider"><Sparkles className={`w-4 h-4 mr-2 ${trendColor}`} /> Trend Radarı (2026)</h4>
                                    <span className={`text-2xl font-black ${trendColor}`}>{trendScore}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4 min-h-[40px] leading-relaxed">{analysisResult.trend_reason || "Trend verisi yok"}</p>
                                <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                                    <div className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full shadow-sm" style={{ width: `${trendScore * 10}%` }}></div>
                                </div>
                                <p className="text-right text-xs font-bold text-orange-600">{trendText}</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="text-sm font-bold text-blue-800 flex items-center mb-2 uppercase tracking-wider"><Calendar className="w-4 h-4 mr-2 text-blue-600" /> Sezonluk Satış Potansiyeli</h4>
                                <SeasonalityChart dataString={analysisResult.monthly_popularity} />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-bold text-gray-800 text-lg">{isCompetitor ? "Rakip Tehdit Skoru" : "LQS (Liste Kalite Skoru)"}</span>
                                <span className={`text-4xl font-black ${analysisResult.lqs_score >= 8 ? 'text-green-600' : analysisResult.lqs_score >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>{analysisResult.lqs_score}</span>
                            </div>
                            {analysisResult.lqs_reason && (<div className="flex items-start text-sm text-gray-700 bg-yellow-50 p-4 rounded-xl border border-yellow-100/50 leading-relaxed"><Info className="w-5 h-5 mr-3 mt-0.5 text-yellow-600 flex-shrink-0" /><span>{analysisResult.lqs_reason}</span></div>)}
                        </div>

                        <div className="mt-4 pt-4 flex justify-center">
                            <button
                                onClick={() => onShowReport(listingId, analysisResult.suggested_title)}
                                className="flex items-center px-8 py-3.5 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors font-bold text-sm shadow-sm hover:shadow-md"
                            >
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Gelişim Raporunu İncele
                            </button>
                        </div>
                    </div>
                )}

                {/* TAB 2: SEO & ETİKETLER */}
                {activeTab === 'seo' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 relative group hover:border-indigo-300 transition-all shadow-sm"><div className="flex justify-between items-start"><div className="w-full"><span className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wider">Önerilen Başlık</span>{isEditing ? (<textarea className="w-full mt-1 p-3 border rounded-xl bg-white text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm" rows="2" value={editData.suggested_title} onChange={(e) => setEditData({ ...editData, suggested_title: e.target.value })} />) : (<p className="text-gray-900 font-bold text-xl leading-tight pr-10">{analysisResult.suggested_title || "Başlık yok"}</p>)}</div>{!isEditing && <button onClick={() => handleCopyClick(analysisResult.suggested_title, "Başlık")} className="text-gray-400 hover:text-indigo-600 p-2 absolute right-2 top-2 hover:bg-indigo-50 rounded-lg transition-colors"><Copy className="w-5 h-5" /></button>}</div></div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200 relative group hover:border-indigo-300 transition-all shadow-sm"><div className="flex justify-between items-start"><div className="w-full"><span className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wider">Önerilen Açıklama</span>{isEditing ? (<textarea className="w-full mt-1 p-3 border rounded-xl bg-white text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm" rows="4" value={editData.suggested_description} onChange={(e) => setEditData({ ...editData, suggested_description: e.target.value })} />) : (<p className="text-sm text-gray-600 leading-relaxed pr-10 whitespace-pre-line">{analysisResult.suggested_description || "Açıklama yok"}</p>)}</div>{!isEditing && <button onClick={() => handleCopyClick(analysisResult.suggested_description, "Açıklama")} className="text-gray-400 hover:text-indigo-600 p-2 absolute right-2 top-2 hover:bg-indigo-50 rounded-lg transition-colors"><Copy className="w-5 h-5" /></button>}</div></div>

                        <TagManager result={analysisResult} isEditing={isEditing} editData={editData} setEditData={setEditData} onCopy={(txt) => handleCopyClick(txt, "Etiketler")} />

                        <div className="bg-white p-6 rounded-2xl border border-gray-200 relative group hover:border-indigo-300 transition-all shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="w-full">
                                    <span className="text-xs font-bold text-gray-400 uppercase mb-3 block flex items-center tracking-wider"><Target className="w-3 h-3 mr-1.5 text-red-500" /> {isCompetitor ? "Rakibin Kullandığı En İyi Etiketler" : "Yapay Zeka'nın Seçtiği En İyi 13"}</span>
                                    <div className="flex flex-wrap gap-2 pr-10">
                                        {displayTags.length > 0 ? displayTags.map((tag, i) => (
                                            <span key={i} className="group/tag bg-gray-50 border border-gray-200 text-gray-800 text-xs px-3 py-1.5 rounded-full shadow-sm font-bold flex items-center hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-default">
                                                <Tag className="w-3 h-3 mr-1.5 opacity-50" />
                                                {tag}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleCopyClick(tag, tag); }}
                                                    className="ml-2 p-0.5 rounded-full hover:bg-indigo-200 text-gray-400 hover:text-indigo-700 opacity-0 group-hover/tag:opacity-100 transition-opacity"
                                                    title="Kopyala"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                            </span>
                                        )) : <span className="text-gray-400 text-sm italic">Henüz seçilmedi</span>}
                                    </div>
                                </div>
                                {!isEditing && <button onClick={() => handleCopyClick(displayTags.join(", "), "En İyi 13")} className="text-gray-400 hover:text-indigo-600 p-2 absolute right-2 top-2 hover:bg-indigo-50 rounded-lg transition-colors"><Copy className="w-5 h-5" /></button>}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: RAKİP & DETAYLAR */}
                {activeTab === 'details' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* TRAFİK KAYNAKLARI GRAFİĞİ */}
                        {analysisResult.traffic_data && (
                            <TrafficSourceChart data={analysisResult.traffic_data} />
                        )}

                        {!analysisResult.traffic_data && (
                            <div className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-200 border-dashed">
                                <p className="text-gray-400">Trafik verisi bulunamadı.</p>
                            </div>
                        )}

                        {/* RAKİP STRATEJİ NOTU */}
                        {isCompetitor && analysisResult.competitor_analysis && (
                            <div className="bg-white p-6 rounded-2xl border-l-8 border-orange-500 shadow-sm">
                                <h4 className="text-base font-bold text-orange-800 flex items-center mb-3"><Target className="w-5 h-5 mr-2" /> Rakip Stratejisi & Zayıf Yönler</h4>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{analysisResult.competitor_analysis}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-4">
                            {isEditing ? (<><input type="text" className="p-3 text-sm border rounded-xl bg-white text-gray-900 shadow-sm" value={editData.suggested_materials} onChange={e => setEditData({ ...editData, suggested_materials: e.target.value })} placeholder="Materyaller" /><input type="text" className="p-3 text-sm border rounded-xl bg-white text-gray-900 shadow-sm" value={editData.suggested_styles} onChange={e => setEditData({ ...editData, suggested_styles: e.target.value })} placeholder="Stiller" /><input type="text" className="p-3 text-sm border rounded-xl bg-white text-gray-900 shadow-sm" value={editData.suggested_colors} onChange={e => setEditData({ ...editData, suggested_colors: e.target.value })} placeholder="Renkler" /></>) : (<><AttributeBadge label="Materyal" value={analysisResult.suggested_materials} colorClass="text-amber-700" /><AttributeBadge label="Stil" value={analysisResult.suggested_styles} colorClass="text-purple-700" /><AttributeBadge label="Renkler" value={analysisResult.suggested_colors} colorClass="text-pink-700" /></>)}
                        </div>

                        {/* GEÇMİŞ ANALİZLER */}
                        <HistoryList listingId={listingId} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalysisPanel;
