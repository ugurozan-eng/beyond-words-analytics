import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCcw, Zap, PlusCircle, X, CheckCircle, AlertCircle, Trash2, Copy, Search, Download, TrendingUp, DollarSign, Package, Edit2, Save, Sparkles, Clock, Info, Gift, Calendar, BarChart2, PieChart as PieIcon, History, RotateCw, LayoutDashboard, MousePointer, Filter, ArrowUpDown, HelpCircle, Tag, Flame, CalendarDays, Target, Wind, Palette, Lightbulb, Upload, Link as LinkIcon, ShieldAlert, CheckSquare, Square, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_BASE_URL = "http://localhost:8000/api/v1";

const copyToClipboard = async (text) => { try { await navigator.clipboard.writeText(text); return true; } catch (err) { console.error('Hata:', err); return false; } };
const formatDate = (dateString) => { if (!dateString) return "Henüz yok"; const date = new Date(dateString); return date.toLocaleString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }); };

// --- YENİ NEURO-PRICING KART BİLEŞENİ ---
const PricingCard = ({ min, max, optimal, reason, currency = "$" }) => {
  const range = max - min;
  // Eğer optimal değer yoksa ortalamayı al
  const targetPrice = optimal || ((min + max) / 2);
  const position = range > 0 ? ((targetPrice - min) / range) * 100 : 50;
  
  return (
    <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden mb-6">
      <div className="absolute top-0 right-0 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-bl-xl">
        NEURO-PRICING
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Sol Taraf: Büyük Fiyat */}
        <div className="text-center md:text-left min-w-[140px]">
          <div className="text-sm text-gray-500 font-medium mb-1">Önerilen Fiyat</div>
          <div className="text-4xl font-extrabold text-indigo-600 tracking-tight">
            {currency}{targetPrice.toFixed(2)}
          </div>
          <div className="text-xs text-indigo-400 mt-1 font-medium">
            Güven Aralığı: {currency}{min} - {currency}{max}
          </div>
        </div>

        {/* Orta: Görsel Bar */}
        <div className="flex-1 w-full">
          <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono">
            <span>Min ({currency}{min})</span>
            <span>Max ({currency}{max})</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full relative w-full">
            <div 
              className="absolute h-4 w-4 bg-indigo-500 rounded-full border-2 border-white shadow-sm transform -translate-x-1/2 transition-all duration-500"
              style={{ left: `${Math.min(Math.max(position, 0), 100)}%` }}
            ></div>
            <div 
              className="h-full bg-indigo-100 rounded-l-full" 
              style={{ width: `${Math.min(Math.max(position, 0), 100)}%` }}
            ></div>
          </div>
          <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="font-semibold text-indigo-600">🤖 Strateji: </span>
            {reason || "Analiz ediliyor..."}
          </div>
        </div>
      </div>
    </div>
  );
};
// ----------------------------------------

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4 transition-transform hover:scale-105">
        <div className={`p-3 rounded-full ${color}`}><Icon className="w-6 h-6 text-white" /></div>
        <div><p className="text-sm text-gray-500 font-medium">{title}</p><p className="text-2xl font-bold text-gray-800">{value}</p></div>
    </div>
);

const AttributeBadge = ({ label, value, colorClass }) => { if (!value) return null; return (<div className="flex flex-col bg-gray-50 p-2 rounded-md border border-gray-100"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</span><span className={`text-sm font-medium ${colorClass}`}>{value}</span></div>); };

const SeasonalityChart = ({ dataString }) => {
    let data = [];
    try {
        const parsed = JSON.parse(dataString || "[]");
        if(parsed.length === 12) {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            data = parsed.map((val, i) => ({ name: months[i], value: val }));
        }
    } catch {}

    if (data.length === 0) return <div className="text-xs text-gray-400 italic">Grafik verisi yok</div>;

    return (
        <div className="h-32 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <Tooltip cursor={{fill: '#f0f9ff'}} contentStyle={{fontSize: '12px'}} />
                    <Bar dataKey="value" fill="#60a5fa" radius={[2, 2, 0, 0]} />
                    <XAxis dataKey="name" hide />
                </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-[9px] text-gray-400 mt-1 px-1">
                <span>Jan</span><span>Jun</span><span>Dec</span>
            </div>
        </div>
    );
};

const AnalysisCharts = ({ listings }) => {
    const [rightChartType, setRightChartType] = useState('price');
    if (listings.length === 0) return null;

    const lqsData = [
        { name: 'Mükemmel (8+)', value: listings.filter(i => i.is_analyzed && i.lqs_score >= 8).length, color: '#10B981' },
        { name: 'İyi (5-8)', value: listings.filter(i => i.is_analyzed && i.lqs_score >= 5 && i.lqs_score < 8).length, color: '#F59E0B' },
        { name: 'Geliştirilmeli (<5)', value: listings.filter(i => i.is_analyzed && i.lqs_score < 5).length, color: '#EF4444' }
    ].filter(i => i.value > 0);

    let rightChartData = [];
    if (rightChartType === 'price') {
        rightChartData = listings.map(i => ({ name: i.title.substring(0, 10) + "...", value: i.price })).slice(0, 10);
    } else {
        const counts = {};
        listings.forEach(item => {
            if (item.suggested_materials) {
                item.suggested_materials.split(',').forEach(m => {
                    const key = m.trim();
                    if(key) counts[key] = (counts[key] || 0) + 1;
                });
            }
        });
        rightChartData = Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 mb-16 animate-fade-in">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><PieIcon className="w-5 h-5 mr-2 text-indigo-500"/> LQS Performans</h3>
                <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={lqsData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label>{lqsData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-gray-800 flex items-center"><BarChart2 className="w-5 h-5 mr-2 text-indigo-500"/> {rightChartType === 'price' ? 'Fiyat Analizi' : 'Materyal Dağılımı'}</h3><div className="flex bg-gray-100 p-1 rounded-lg"><button onClick={() => setRightChartType('price')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${rightChartType === 'price' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Fiyat</button><button onClick={() => setRightChartType('materials')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${rightChartType === 'materials' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Materyal</button></div></div>
                <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={rightChartData} layout={rightChartType === 'materials' ? 'vertical' : 'horizontal'}><CartesianGrid strokeDasharray="3 3" vertical={false} />{rightChartType === 'materials' ? (<><XAxis type="number" allowDecimals={false} /><YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} /></>) : (<><XAxis dataKey="name" tick={{fontSize: 10}} interval={0} /><YAxis /></>)}<Tooltip cursor={{fill: '#f3f4f6'}} /><Bar dataKey="value" fill="#6366f1" radius={[4, 4, 4, 4]} barSize={30} name={rightChartType === 'price' ? 'Fiyat ($)' : 'Adet'} /></BarChart></ResponsiveContainer></div>
            </div>
        </div>
    );
};

const HistoryList = ({ listingId, triggerRefresh }) => {
    const [history, setHistory] = useState([]);
    useEffect(() => {
        if (!listingId) return;
        const fetchHistory = async () => { try { const res = await fetch(`${API_BASE_URL}/listings/${listingId}/history`); if (res.ok) setHistory(await res.json()); } catch (err) { console.error(err); } };
        fetchHistory();
    }, [listingId, triggerRefresh]);
    if (history.length === 0) return null;
    return (
        <div className="mt-6 pt-6 border-t border-gray-200"><h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center"><History className="w-4 h-4 mr-1" /> Geçmiş Analizler</h4><div className="space-y-2 max-h-40 overflow-y-auto pr-2">{history.map((item) => (<div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md border border-gray-100 text-xs"><span className="text-gray-500">{formatDate(item.created_at)}</span><span className={`font-bold ${item.lqs_score >= 8 ? 'text-green-600' : 'text-yellow-600'}`}>LQS: {item.lqs_score}</span></div>))}</div></div>
    );
};

const WelcomePanel = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 flex flex-col items-center justify-center h-full min-h-[600px] text-center animate-fade-in sticky top-6">
        <div className="bg-indigo-50 p-4 rounded-full mb-6"><LayoutDashboard className="w-16 h-16 text-indigo-600" /></div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Analiz Asistanı v2.5</h2>
        <p className="text-gray-500 max-w-sm mb-10 text-lg">Gelişmiş sezonluk grafikler, yaratıcı kelime fırtınası ve pastel arayüz.</p>
        <div className="w-full max-w-md space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-default"><div className="bg-white p-3 rounded-lg shadow-sm mr-4"><PlusCircle className="w-6 h-6 text-blue-500" /></div><div className="text-left"><p className="text-base font-bold text-gray-800">1. Ürün Ekle</p><p className="text-sm text-gray-500">Görseli yükleyin, AI analiz etsin.</p></div></div>
            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-purple-50 hover:border-purple-200 transition-all cursor-default"><div className="bg-white p-3 rounded-lg shadow-sm mr-4"><MousePointer className="w-6 h-6 text-purple-500" /></div><div className="text-left"><p className="text-base font-bold text-gray-800">2. İncele</p><p className="text-sm text-gray-500">Listeden ürüne tıklayın, otomatik analiz başlasın.</p></div></div>
            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-yellow-50 hover:border-yellow-200 transition-all cursor-default"><div className="bg-white p-3 rounded-lg shadow-sm mr-4"><Zap className="w-6 h-6 text-yellow-500" /></div><div className="text-left"><p className="text-base font-bold text-gray-800">3. Optimize Et</p><p className="text-sm text-gray-500">Önerileri tek tıkla uygulayın.</p></div></div>
        </div>
    </div>
);

const TagManager = ({ result, isEditing, editData, setEditData, onCopy }) => {
    const [activeTab, setActiveTab] = useState("focus");

    const getTags = (key) => {
        if (isEditing) return editData[key] || "";
        return result[key] ? result[key].split(',').filter(t=>t) : [];
    };

    const handleTagChange = (e, key) => {
        setEditData({...editData, [key]: e.target.value});
    };

    const renderTags = (key, colorBase, colorText, colorBorder, label) => {
        const tags = getTags(key);
        if (isEditing) {
            return <textarea className="w-full mt-2 p-2 border rounded-md bg-white text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" rows="3" value={tags} onChange={(e) => handleTagChange(e, key)} placeholder={`${label} etiketlerini virgülle ayırın...`} />;
        }
        return (
            <div className="flex flex-wrap gap-2 mt-2 animate-fade-in">
                {tags.length > 0 ? tags.map((tag, i) => (
                    <span key={i} className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${colorBase} ${colorText} ${colorBorder} hover:scale-105 transition-transform cursor-default`}>
                        <Tag className="w-3 h-3 mr-1"/> {tag.trim()}
                    </span>
                )) : <span className="text-gray-400 text-xs italic">Etiket yok</span>}
            </div>
        );
    };

    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative group hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
                 <span className="text-sm font-bold text-indigo-900 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-indigo-600"/> Keyword Storm 2026
                 </span>
            </div>

            <div className="flex space-x-2 mb-4">
                <button onClick={() => setActiveTab("focus")} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border ${activeTab === "focus" ? "bg-indigo-100 border-indigo-300 text-indigo-800 shadow-md" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}>
                    <div className="flex items-center justify-center"><Target className="w-3 h-3 mr-1"/> Odak</div>
                </button>
                <button onClick={() => setActiveTab("long")} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border ${activeTab === "long" ? "bg-emerald-100 border-emerald-300 text-emerald-800 shadow-md" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}>
                    <div className="flex items-center justify-center"><Wind className="w-3 h-3 mr-1"/> Niş</div>
                </button>
                <button onClick={() => setActiveTab("aes")} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border ${activeTab === "aes" ? "bg-purple-100 border-purple-300 text-purple-800 shadow-md" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}>
                    <div className="flex items-center justify-center"><Palette className="w-3 h-3 mr-1"/> Estetik</div>
                </button>
            </div>

            <div className="min-h-[100px]">
                {activeTab === "focus" && renderTags("tags_focus", "bg-indigo-50", "text-indigo-700", "border-indigo-100", "Ana Odak")}
                {activeTab === "long" && renderTags("tags_long_tail", "bg-emerald-50", "text-emerald-700", "border-emerald-100", "Niş/Uzun")}
                {activeTab === "aes" && renderTags("tags_aesthetic", "bg-purple-50", "text-purple-700", "border-purple-100", "Estetik")}
            </div>

             <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center mb-2"><Lightbulb className="w-3 h-3 mr-1 text-yellow-500"/> Yaratıcı Fikirler (Açıklama İçin)</span>
                {isEditing ? (
                     <textarea className="w-full p-2 border rounded-md bg-yellow-50 text-gray-800 text-xs focus:ring-1 focus:ring-yellow-400 outline-none" rows="2" value={editData.tags_creative} onChange={(e) => setEditData({...editData, tags_creative: e.target.value})} />
                ) : (
                    <p className="text-xs text-gray-600 italic bg-yellow-50 p-2 rounded border border-yellow-100">
                        {getTags("tags_creative").join(", ") || "Fikir yok"}
                    </p>
                )}
            </div>
        </div>
    );
};

const AnalysisPanel = ({ analysisResult, listingId, currentPrice, onCopy, onUpdate, onAnalyzeClick, isAnalyzing, listingType }) => {
    const [isEditing, setIsEditing] = useState(false);
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

    if (!analysisResult) {
        if (isAnalyzing) return (<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 flex flex-col items-center justify-center h-full min-h-[600px] text-center sticky top-6"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-6"></div><h3 className="text-xl font-bold text-gray-800 mb-2">2026 Analizi Yapılıyor...</h3><p className="text-gray-500 max-w-xs">Semantik Vektör Taraması ve Kelime Fırtınası başlatıldı.</p></div>);
        return (<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 flex flex-col items-center justify-center h-full min-h-[600px] text-center sticky top-6"><div className="bg-indigo-50 p-4 rounded-full mb-6"><Sparkles className="w-12 h-12 text-indigo-600" /></div><h3 className="text-xl font-bold text-gray-800 mb-2">Analiz Bekleniyor</h3><p className="text-gray-500 max-w-xs mb-8">Bu ürün henüz analiz edilmedi.</p><button onClick={() => onAnalyzeClick(false)} className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"><Zap className="w-5 h-5 mr-2" />Analizi Başlat</button></div>);
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
        <div className={`mt-0 p-6 rounded-xl shadow-lg border transition-all ${isCompetitor ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-100' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h3 className={`text-xl font-bold flex items-center ${isCompetitor ? 'text-orange-800' : 'text-indigo-700'}`}>
                    {isCompetitor ? <><ShieldAlert className="w-6 h-6 mr-2"/> Rakip Analiz Raporu</> : <><Zap className="w-6 h-6 mr-2"/> Analiz Sonuçları (2026)</>}
                </h3>
                <div className="flex items-center space-x-2">
                    {analysisResult.last_analyzed_at && (<span className="text-xs text-gray-500 hidden md:flex items-center bg-white/50 px-3 py-1.5 rounded-full border"><Clock className="w-3 h-3 mr-1.5" /> {formatDate(analysisResult.last_analyzed_at)}</span>)}
                    <button onClick={() => onAnalyzeClick(false)} disabled={isAnalyzing} className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${isAnalyzing ? 'bg-gray-100 text-gray-400 cursor-wait' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}><RotateCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />Tekrar</button>
                    <button onClick={isEditing ? handleSave : () => setIsEditing(true)} className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isEditing ? "bg-green-600 text-white hover:bg-green-700 shadow-md" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}`}>{isEditing ? <><Save className="w-4 h-4 mr-2"/> Kaydet</> : <><Edit2 className="w-4 h-4 mr-2"/> Düzenle</>}</button>
                </div>
            </div>
            
            <div className="space-y-6">
                {/* RAKİP STRATEJİ NOTU */}
                {isCompetitor && analysisResult.competitor_analysis && (
                    <div className="bg-white p-4 rounded-xl border-l-4 border-orange-500 shadow-sm">
                        <h4 className="text-sm font-bold text-orange-800 flex items-center mb-2"><Target className="w-4 h-4 mr-2"/> Rakip Stratejisi & Zayıf Yönler</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{analysisResult.competitor_analysis}</p>
                    </div>
                )}

                {/* --- NEURO PRICING KART (Eski basit kutu yerine) --- */}
                {avgP > 0 && (
                    <PricingCard 
                        min={minP}
                        max={maxP}
                        optimal={analysisResult.predicted_price_optimal || avgP}
                        reason={analysisResult.price_reason}
                    />
                )}
                {/* ---------------------------------------------------- */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                             <h4 className="text-sm font-bold text-orange-800 flex items-center"><Sparkles className={`w-4 h-4 mr-2 ${trendColor}`} /> Trend Radarı (2026)</h4>
                             <span className={`text-xl font-bold ${trendColor}`}>{trendScore}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 min-h-[40px]">{analysisResult.trend_reason || "Trend verisi yok"}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${trendScore * 10}%` }}></div>
                        </div>
                        <p className="text-right text-[10px] font-bold text-orange-600 mt-1">{trendText}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                        <h4 className="text-sm font-bold text-blue-800 flex items-center mb-2"><Calendar className="w-4 h-4 mr-2 text-blue-600" /> Sezonluk Satış Potansiyeli</h4>
                        <SeasonalityChart dataString={analysisResult.monthly_popularity} />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {isEditing ? (<><input type="text" className="p-2 text-sm border rounded bg-white text-gray-900" value={editData.suggested_materials} onChange={e=>setEditData({...editData, suggested_materials:e.target.value})} placeholder="Materyaller" /><input type="text" className="p-2 text-sm border rounded bg-white text-gray-900" value={editData.suggested_styles} onChange={e=>setEditData({...editData, suggested_styles:e.target.value})} placeholder="Stiller" /><input type="text" className="p-2 text-sm border rounded bg-white text-gray-900" value={editData.suggested_colors} onChange={e=>setEditData({...editData, suggested_colors:e.target.value})} placeholder="Renkler" /></>) : (<><AttributeBadge label="Materyal" value={analysisResult.suggested_materials} colorClass="text-amber-700" /><AttributeBadge label="Stil" value={analysisResult.suggested_styles} colorClass="text-purple-700" /><AttributeBadge label="Renkler" value={analysisResult.suggested_colors} colorClass="text-pink-700" /></>)}
                </div>
                
                <TagManager result={analysisResult} isEditing={isEditing} editData={editData} setEditData={setEditData} onCopy={(txt) => handleCopyClick(txt, "Etiketler")} />
                
                 <div className="bg-white p-4 rounded-xl border border-gray-200 relative group hover:border-indigo-300 transition-colors shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="w-full">
                            {/* --- LABEL DÜZELTİLDİ --- */}
                            <span className="text-xs font-bold text-gray-400 uppercase mb-2 block flex items-center"><Target className="w-3 h-3 mr-1 text-red-500"/> {isCompetitor ? "Rakibin Kullandığı En İyi Etiketler" : "Yapay Zeka'nın Seçtiği En İyi 13"}</span>
                            <div className="flex flex-wrap gap-2 pr-10">
                                {displayTags.length > 0 ? displayTags.map((tag, i) => <span key={i} className="bg-gray-50 border border-gray-200 text-gray-800 text-xs px-3 py-1.5 rounded-full shadow-sm font-bold flex items-center"><Tag className="w-3 h-3 mr-1 opacity-50"/>{tag}</span>) : <span className="text-gray-400 text-sm italic">Henüz seçilmedi</span>}
                            </div>
                        </div>
                        {!isEditing && <button onClick={() => handleCopyClick(displayTags.join(", "), "En İyi 13")} className="text-gray-400 hover:text-indigo-600 p-2 absolute right-2 top-2"><Copy className="w-5 h-5" /></button>}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 relative group hover:border-indigo-300 transition-colors shadow-sm"><div className="flex justify-between items-start"><div className="w-full"><span className="text-xs font-bold text-gray-400 uppercase mb-1 block">Önerilen Başlık</span>{isEditing ? (<textarea className="w-full mt-1 p-2 border rounded-md bg-white text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none" rows="2" value={editData.suggested_title} onChange={(e) => setEditData({...editData, suggested_title: e.target.value})} />) : (<p className="text-gray-800 font-bold text-lg leading-tight pr-10">{analysisResult.suggested_title || "Başlık yok"}</p>)}</div>{!isEditing && <button onClick={() => handleCopyClick(analysisResult.suggested_title, "Başlık")} className="text-gray-400 hover:text-indigo-600 p-2 absolute right-2 top-2"><Copy className="w-5 h-5" /></button>}</div></div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 relative group hover:border-indigo-300 transition-colors shadow-sm"><div className="flex justify-between items-start"><div className="w-full"><span className="text-xs font-bold text-gray-400 uppercase mb-1 block">Önerilen Açıklama</span>{isEditing ? (<textarea className="w-full mt-1 p-2 border rounded-md bg-white text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" rows="4" value={editData.suggested_description} onChange={(e) => setEditData({...editData, suggested_description: e.target.value})} />) : (<p className="text-sm text-gray-600 leading-relaxed pr-10">{analysisResult.suggested_description || "Açıklama yok"}</p>)}</div>{!isEditing && <button onClick={() => handleCopyClick(analysisResult.suggested_description, "Açıklama")} className="text-gray-400 hover:text-indigo-600 p-2 absolute right-2 top-2"><Copy className="w-5 h-5" /></button>}</div></div>

                <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-gray-800">{isCompetitor ? "Rakip Tehdit Skoru" : "LQS (Liste Kalite Skoru)"}</span>
                        <span className={`text-3xl font-extrabold ${analysisResult.lqs_score >= 8 ? 'text-green-600' : analysisResult.lqs_score >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>{analysisResult.lqs_score}</span>
                    </div>
                    {analysisResult.lqs_reason && (<div className="flex items-start text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100"><Info className="w-5 h-5 mr-2 mt-0.5 text-yellow-600 flex-shrink-0" /><span>{analysisResult.lqs_reason}</span></div>)}
                </div>
                <HistoryList listingId={listingId} triggerRefresh={analysisResult.last_analyzed_at} />
            </div>
        </div>
    );
};

const NewProductModal = ({ isOpen, onClose, onAddProduct }) => { 
    const [title, setTitle] = useState(''); 
    const [price, setPrice] = useState(''); 
    const [inputType, setInputType] = useState('upload');
    const [listingType, setListingType] = useState('mine'); 
    const [imageUrl, setImageUrl] = useState(''); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 
    
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => { 
        e.preventDefault(); 
        setIsLoading(true); 
        try { 
            let finalUrl = imageUrl;

            if (inputType === 'upload' && selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                
                const uploadRes = await fetch(`${API_BASE_URL}/listings/upload`, {
                    method: 'POST',
                    body: formData
                });
                
                if (!uploadRes.ok) throw new Error('Resim yüklenemedi');
                const uploadData = await uploadRes.json();
                finalUrl = uploadData.url;
            }

            if (!finalUrl) throw new Error("Lütfen bir resim seçin veya URL girin");

            const response = await fetch(`${API_BASE_URL}/listings/`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ 
                    title, 
                    price: parseFloat(price), 
                    image_url: finalUrl,
                    listing_type: listingType 
                }) 
            }); 
            if (!response.ok) throw new Error('Kayıt Hatası'); 
            
            onAddProduct(await response.json()); 
            onClose(); 
            setTitle(''); setPrice(''); setImageUrl(''); setSelectedFile(null); setListingType('mine');
        } catch (error) { 
            alert('Hata: ' + error.message); 
        } finally { 
            setIsLoading(false); 
        } 
    }; 
    
    if (!isOpen) return null; 
    
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Yeni Ürün Ekle</h2>
                    <button onClick={onClose}><X className="w-6 h-6 text-gray-400 hover:text-red-500" /></button>
                </div>
                
                {/* ÜRÜN TİPİ SEÇİMİ */}
                <div className="flex space-x-2 mb-4 bg-gray-100 p-1 rounded-lg">
                    <button type="button" onClick={() => setListingType('mine')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${listingType === 'mine' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <div className="flex items-center justify-center">Benim Ürünüm</div>
                    </button>
                    <button type="button" onClick={() => setListingType('competitor')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${listingType === 'competitor' ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-200' : 'text-gray-500 hover:text-gray-700'}`}>
                        <div className="flex items-center justify-center"><ShieldAlert className="w-4 h-4 mr-2"/> Rakip Analizi</div>
                    </button>
                </div>

                <div className="flex space-x-2 mb-4">
                    <button type="button" onClick={() => setInputType('upload')} className={`flex-1 py-2 text-sm font-bold rounded-lg border ${inputType === 'upload' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        <div className="flex items-center justify-center"><Upload className="w-4 h-4 mr-2"/> Dosya Yükle</div>
                    </button>
                    <button type="button" onClick={() => setInputType('url')} className={`flex-1 py-2 text-sm font-bold rounded-lg border ${inputType === 'url' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        <div className="flex items-center justify-center"><LinkIcon className="w-4 h-4 mr-2"/> Link Gir</div>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Ürün Başlığı" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500" required />
                    <input type="number" placeholder="Fiyat" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-2 rounded bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500" required />
                    
                    {inputType === 'upload' ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer relative">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required={!selectedFile} />
                            {selectedFile ? (
                                <p className="text-sm text-green-600 font-bold flex items-center justify-center"><CheckCircle className="w-4 h-4 mr-2"/> {selectedFile.name}</p>
                            ) : (
                                <div className="text-gray-500">
                                    <Upload className="w-8 h-8 mx-auto mb-2 opacity-50"/>
                                    <p className="text-sm font-medium">Resmi buraya sürükleyin</p>
                                    <p className="text-xs">veya tıklayıp seçin</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <input type="url" placeholder="Resim URL (https://...)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full border p-2 rounded bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500" required />
                    )}

                    <button type="submit" disabled={isLoading} className={`w-full text-white p-3 rounded-lg font-bold flex items-center justify-center ${listingType === 'competitor' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-indigo-600 hover:bg-indigo-700'} disabled:bg-gray-400`}>
                        {isLoading ? <RefreshCcw className="w-5 h-5 animate-spin mr-2"/> : (listingType === 'competitor' ? <ShieldAlert className="w-5 h-5 mr-2"/> : <PlusCircle className="w-5 h-5 mr-2"/>)}
                        {isLoading ? 'Yükleniyor...' : (listingType === 'competitor' ? 'Ajanı Gönder' : 'Ürünü Ekle')}
                    </button>
                </form>
            </div>
        </div>
    ); 
};

function App() {
    const [listings, setListings] = useState([]); const [searchTerm, setSearchTerm] = useState(""); const [isLoading, setIsLoading] = useState(false); const [selectedListing, setSelectedListing] = useState(null); const [isAnalyzing, setIsAnalyzing] = useState(false); const [analysisResult, setAnalysisResult] = useState(null); const [isModalOpen, setIsModalOpen] = useState(false); const [statusMessage, setStatusMessage] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all"); const [sortOption, setSortOption] = useState("date-desc");
    const [selectedIds, setSelectedIds] = useState([]);
    
    const analysisIdRef = useRef(null);

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
            // ARTIK SADECE ANALİZ DURUMUNA BAKIYOR, SAHİPLİĞE DEĞİL
            result = result.filter(item => item.is_analyzed);
        } else if (filterStatus === "pending") {
            result = result.filter(item => !item.is_analyzed);
        }
        // "all" durumunda hiçbir filtre yok, hepsi gelir.

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

    const handleExportCSV = () => { if (!listings.length) return; const csvContent = ["ID,Type,Title,Price,Analyzed,LQS,LQS Reason,LastAnalyzed,Tags,SuggestedTitle,SuggestedDesc,Materials,Styles,Colors,Occasions,Recipients,PredictedPriceMin,PredictedPriceMax,PriceReason,FAQs,TrendScore,TrendReason,BestSellingMonths,CompetitorAnalysis", ...listings.map(i => `${i.id},${i.listing_type},"${i.title.replace(/"/g, '""')}",${i.price},${i.is_analyzed},${i.lqs_score},"${(i.lqs_reason||"").replace(/"/g, '""')}",${i.last_analyzed_at},"${i.tags.join(",")}", "${(i.suggested_title || "").replace(/"/g, '""')}", "${(i.suggested_description || "").replace(/"/g, '""')}", "${(i.suggested_materials || "")}", "${(i.suggested_styles || "")}", "${(i.suggested_colors || "")}", "${(i.suggested_occasions || "")}", "${(i.suggested_recipients || "")}",${i.predicted_price_min},${i.predicted_price_max},"${(i.price_reason||"").replace(/"/g,'""')}","${(i.suggested_faqs||"").replace(/"/g,'""')}",${i.trend_score},"${(i.trend_reason||"").replace(/"/g,'""')}","${(i.best_selling_months||"").replace(/"/g,'""')}","${(i.competitor_analysis||"").replace(/"/g,'""')}"`)].join("\n"); const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })); link.download = "etsy_export.csv"; link.click(); };
    const handleDelete = async (e, id) => { e.stopPropagation(); if (!confirm("Silinsin mi?")) return; await fetch(`${API_BASE_URL}/listings/${id}`, { method: 'DELETE' }); setListings(p => p.filter(i => i.id !== id)); if (selectedListing?.id === id) { setSelectedListing(null); setAnalysisResult(null); } };
    
    const handleSelectListing = (listing) => {
        setSelectedListing(listing);
        setAnalysisResult(null);
        if (!listing.is_analyzed && !isAnalyzing) {
            handleAnalyze(listing);
        }
    };

    // --- TOPLU İŞLEM FONKSİYONLARI ---
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
        setStatusMessage({type:'success', text:'Toplu analiz tamamlandı!'});
        setTimeout(()=>setStatusMessage(null), 4000);
        setSelectedIds([]); 
    };
    
    // --- GÜNCELLENMİŞ 48 SAAT & FOTOĞRAF KONTROLÜ FONKSİYONU ---
    const handleAnalyze = useCallback(async (listingToAnalyze = null, force = false) => { 
        const targetListing = listingToAnalyze || selectedListing; 
        if (!targetListing) return; 
        
        setIsAnalyzing(true); 
        try { 
            // 1. Backend'e isteği gönder (Resim değişti mi kontrolünü backend yapacak)
            const res = await fetch(`${API_BASE_URL}/analyze/`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ 
                    id: targetListing.id, 
                    image_url: targetListing.image_url, // Güncel resim URL'si
                    product_title: targetListing.title,
                    force_refresh: force
                }) 
            }); 
            
            if(!res.ok) throw new Error("AI Hatası"); 
            const result = await res.json(); 
            setAnalysisResult(result); 

            // 2. TARİH KONTROLÜ (Yeşil Mesaj vs Normal Mesaj)
            // Eğer dönen "last_analyzed_at" eskiden kalmaysa, backend cache kullanmış demektir.
            let isCachedData = false;
            if (result.last_analyzed_at) {
                const analyzedTime = new Date(result.last_analyzed_at).getTime();
                const now = Date.now();
                // Eğer analiz tarihi şu andan 1 dakika (60000ms) bile eskiyse, Backend CACHE kullanmış demektir.
                isCachedData = (now - analyzedTime) > 60000; 
            }

            if (isCachedData) {
                // Resim değişmemiş VE 48 saat dolmamış -> YEŞİL MESAJ
                setStatusMessage({type:'success', text:'✅ Analiziniz güncel (Son 48 saat içinde yapıldı)'});
            } else {
                // Resim değişmiş VEYA 48 saat dolmuş -> Yeni Analiz -> NORMAL MESAJ
                setStatusMessage({type:'success', text:'🚀 Analiz başarıyla tamamlandı!'});
            }

            // 3. Listeyi Güncelle
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
            if(selectedListing && selectedListing.id === targetListing.id) {
                setSelectedListing(updatedItem);
            }
            
            setTimeout(() => setStatusMessage(null), 4000);

        } catch { 
            setStatusMessage({type:'error', text:'Analiz Hatası'}); 
        } finally { 
            setIsAnalyzing(false); 
        } 
    }, [selectedListing]);

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
        predicted_price_optimal: selectedListing.predicted_price_optimal // Eklendi
    } : null);

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans w-full max-w-none">
            <header className="flex justify-between items-center mb-8 border-b pb-4"><div><h1 className="text-3xl font-extrabold text-indigo-800 flex items-center"><span className="text-4xl mr-2">🪆</span> Beyond Words <span className="text-indigo-500 ml-1">Analytics</span></h1></div>{statusMessage && <div className={`fixed top-8 right-8 z-50 px-6 py-3 rounded-lg shadow-xl text-white ${statusMessage.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>{statusMessage.text}</div>}</header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"><StatCard title="Toplam Ürün" value={listings.length} icon={Package} color="bg-blue-500" /><StatCard title="Toplam Değer" value={`$${listings.reduce((a, b) => a + b.price, 0).toFixed(2)}`} icon={DollarSign} color="bg-green-500" /><StatCard title="Ort. LQS" value={listings.filter(i=>i.is_analyzed).length > 0 ? (listings.filter(i=>i.is_analyzed).reduce((a,b)=>a+b.lqs_score,0)/listings.filter(i=>i.is_analyzed).length).toFixed(1) : "0.0"} icon={TrendingUp} color="bg-purple-500" /></div>
            
            <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="relative flex-1"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div><input type="text" placeholder="Ara..." className="pl-10 pr-4 py-2 border rounded-lg w-full bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                            <div className="flex space-x-2">
                                {selectedIds.length > 0 && (
                                    <button onClick={handleBulkAnalyze} className="px-3 py-2 bg-orange-500 text-white rounded-lg flex items-center hover:bg-orange-600 shadow text-sm font-bold animate-pulse">
                                        <Zap className="w-4 h-4 mr-1" /> {selectedIds.length} Analiz Et
                                    </button>
                                )}
                                <button onClick={handleExportCSV} className="px-3 py-2 border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg flex items-center text-sm font-bold"><Download className="w-4 h-4 mr-1" /> Excel</button>
                                <button onClick={() => setIsModalOpen(true)} className="px-3 py-2 bg-indigo-600 text-white rounded-lg flex items-center hover:bg-indigo-700 shadow text-sm font-bold"><PlusCircle className="w-4 h-4 mr-1" /> Yeni Ürün Ekle</button>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative flex-1"><Filter className="w-4 h-4 absolute left-3 top-3 text-gray-500" /><select className="pl-9 pr-8 py-2 border rounded-lg bg-white text-sm font-medium text-gray-700 w-full cursor-pointer appearance-none hover:bg-gray-50" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="all">Tüm Liste (Hepsi)</option><option value="mine">Sadece Benimkiler</option><option value="competitor">Rakip Analizi</option><option value="optimized">Optimize Edilenler</option><option value="pending">Bekleyenler</option></select></div>
                            <div className="relative flex-1"><ArrowUpDown className="w-4 h-4 absolute left-3 top-3 text-gray-500" /><select className="pl-9 pr-8 py-2 border rounded-lg bg-white text-sm font-medium text-gray-700 w-full cursor-pointer appearance-none hover:bg-gray-50" value={sortOption} onChange={(e) => setSortOption(e.target.value)}><option value="date-desc">En Yeni Eklenen</option><option value="lqs-desc">LQS Puanı (Yüksek-Düşük)</option><option value="price-desc">Fiyat (Pahalı-Ucuz)</option></select></div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-2">
                         {/* HEPSİNİ SEÇ KUTUCUĞU */}
                        <div className="flex items-center cursor-pointer text-gray-500 hover:text-indigo-700 select-none" onClick={handleSelectAll}>
                            {selectedIds.length > 0 && selectedIds.length === filteredListings.length ? <CheckSquare className="w-5 h-5 mr-2"/> : <Square className="w-5 h-5 mr-2"/>}
                            <span className="text-xs font-bold uppercase tracking-wider">Listelenen Ürünler ({filteredListings.length})</span>
                        </div>
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">{filteredListings.length} Adet</span>
                    </div>

                    <div className="space-y-3">
                        {filteredListings.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300"><Search className="w-12 h-12 mx-auto text-gray-300 mb-3" /><p className="text-gray-500">Kriterlere uygun ürün bulunamadı.</p><button onClick={() => {setSearchTerm(""); setFilterStatus("all");}} className="mt-3 text-indigo-600 hover:underline text-sm font-medium">Filtreleri Temizle</button></div>
                        ) : (
                            filteredListings.map((listing) => {
                                const isCompetitorItem = listing.listing_type === 'competitor';
                                const borderClass = isCompetitorItem 
                                    ? "ring-4 ring-orange-500 bg-orange-50" 
                                    : (selectedListing?.id === listing.id ? "ring-2 ring-indigo-500 bg-indigo-50" : "border border-gray-200 bg-white");

                                return (
                                    <div key={listing.id} onClick={() => handleSelectListing(listing)} className={`group p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all ${borderClass}`}>
                                        <div className="flex items-start justify-between">
                                            {/* CHECKBOX VE RESİM */}
                                            <div className="flex items-center">
                                                <div onClick={(e) => toggleSelect(e, listing.id)} className="mr-3 text-gray-400 hover:text-indigo-600 cursor-pointer">
                                                    {selectedIds.includes(listing.id) ? <CheckSquare className="w-5 h-5 text-indigo-600"/> : <Square className="w-5 h-5"/>}
                                                </div>
                                                <img src={listing.image_url} alt={listing.title} className="w-16 h-16 object-cover rounded-lg border flex-shrink-0" />
                                            </div>
                                            
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center mb-1">
                                                    {isCompetitorItem && <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded mr-2 flex items-center shadow-sm animate-pulse"><ShieldAlert className="w-3 h-3 mr-1"/>RAKİP</span>}
                                                    <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm group-hover:text-indigo-700 transition-colors">{listing.title}</h3>
                                                </div>
                                                <div className="flex items-center mt-1 text-xs text-gray-500"><span className="font-bold mr-3 text-gray-900">${listing.price.toFixed(2)}</span>{listing.is_analyzed ? <span className="text-green-600 flex items-center bg-green-50 px-2 py-0.5 rounded border border-green-100"><CheckCircle className="w-3 h-3 mr-1" /> Optimize</span> : <span className="text-yellow-600 flex items-center bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100"><AlertCircle className="w-3 h-3 mr-1" /> Bekliyor</span>}</div>
                                            </div>
                                            <div className="ml-2 flex flex-col items-end justify-between min-h-[64px]"><button onClick={(e) => handleDelete(e, listing.id)} className="p-1.5 text-gray-300 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>{listing.is_analyzed && <span className="text-lg font-bold text-green-600">{listing.lqs_score}</span>}</div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="lg:col-span-5"><div className="sticky top-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200 min-h-[400px] transition-all">{selectedListing ? (<><div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100"><img src={selectedListing.image_url} className="w-24 h-24 object-cover rounded-lg shadow-sm" /><div><h3 className="text-lg font-bold text-gray-900">{selectedListing.title}</h3><p className="text-2xl font-bold text-indigo-600">${selectedListing.price}</p></div></div><AnalysisPanel analysisResult={activeResult} listingId={selectedListing.id} currentPrice={selectedListing.price} onCopy={(msg) => { setStatusMessage({type:'success', text:msg}); setTimeout(()=>setStatusMessage(null), 2000); }} onUpdate={handleUpdateListing} onAnalyzeClick={(force) => handleAnalyze(null, force)} isAnalyzing={isAnalyzing} listingType={selectedListing.listing_type} /></>) : (<WelcomePanel />)}</div></div>
            </main>
            
            <AnalysisCharts listings={listings} />
            <NewProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddProduct={(p) => setListings(prev => [...prev, p])} />
        </div>
    );
}

export default App;