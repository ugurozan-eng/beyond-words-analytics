import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, RotateCw, Save, ShieldAlert, Sparkles, Activity, Stethoscope, Syringe, Pill, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import TagManager from './TagManager';
import { calculateLQS, getHealthStatus } from '../../utils/lqsCalculator';

const copyToClipboard = async (text) => { try { await navigator.clipboard.writeText(text); return true; } catch (err) { console.error('Hata:', err); return false; } };

const AnalysisPanel = ({ analysisResult, listingId, currentPrice, onCopy, onUpdate, onAnalyzeClick, isAnalyzing, listingType, onShowReport }) => {
    const { t } = useTranslation();
    const [editData, setEditData] = useState({
        suggested_title: "",
        suggested_description: "",
        suggested_materials: "",
        suggested_styles: "",
        suggested_colors: "",
        suggested_occasions: "",
        suggested_recipients: "",
        suggested_faqs: "",
        tags_focus: "",
        tags_long_tail: "",
        tags_aesthetic: "",
        tags_creative: ""
    });

    // Live LQS State
    const [liveLQS, setLiveLQS] = useState(0);
    const [diagnoses, setDiagnoses] = useState([]);

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

    // Real-time Diagnosis & LQS Calculation
    useEffect(() => {
        if (!analysisResult) return;

        // Create a mock product object for LQS calculation based on current inputs
        const currentProductState = {
            ...analysisResult,
            title: editData.suggested_title,
            description: editData.suggested_description,
            // TagManager updates might need to be synced here, assuming analysisResult.suggested_tags is updated or we need to track tags in editData too
            // For now using analysisResult.suggested_tags as the source of truth for tags if not in editData
            tags: analysisResult.suggested_tags || []
        };

        const score = calculateLQS(currentProductState);
        setLiveLQS(score);

        // Diagnosis Logic
        const newDiagnoses = [];
        const title = editData.suggested_title || "";

        // 1. Length Check
        if (title.length < 80) {
            newDiagnoses.push({ type: 'critical', msg: t('surgery.diagnosis_short') });
        }

        // 2. Impact Zone Check (First 40 chars)
        // We need to check if "main keywords" are in the first 40 chars.
        // Since we don't know exactly what the main keywords are without AI, 
        // we can check if the first 40 chars contain at least one of the tags.
        const impactZone = title.substring(0, 40).toLowerCase();
        const tags = analysisResult.suggested_tags || [];
        const hasKeywordInImpactZone = tags.some(tag => impactZone.includes(tag.toLowerCase()));

        if (!hasKeywordInImpactZone && tags.length > 0) {
            newDiagnoses.push({ type: 'critical', msg: t('surgery.diagnosis_visibility') });
        }

        // 3. Tag Count Check
        if (tags.length < 13) {
            newDiagnoses.push({ type: 'warning', msg: t('surgery.diagnosis_tags_missing') });
        }

        setDiagnoses(newDiagnoses);

    }, [editData, analysisResult, t]);


    if (!analysisResult || (analysisResult.lqs_score === 0 && !isAnalyzing)) {
        if (isAnalyzing) return (<div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-10 flex flex-col items-center justify-center h-full min-h-[600px] text-center sticky top-6"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-8"></div><h3 className="text-2xl font-bold text-gray-900 mb-3">{t('analysis_panel.analyzing_title')}</h3><p className="text-gray-500 max-w-xs text-lg">{t('analysis_panel.analyzing_desc')}</p></div>);

        // Check if it's an error result
        if (analysisResult && analysisResult.suggested_title === "Error") {
            return (<div className="bg-red-50/80 backdrop-blur-md rounded-3xl shadow-xl border border-red-100 p-10 flex flex-col items-center justify-center h-full min-h-[600px] text-center sticky top-6"><div className="bg-red-100 p-6 rounded-full mb-8"><ShieldAlert className="w-16 h-16 text-red-600" /></div><h3 className="text-2xl font-bold text-red-900 mb-3">{t('analysis_panel.error_title')}</h3><p className="text-red-700 max-w-md mb-10 text-lg">{analysisResult.suggested_description}</p><button onClick={() => onAnalyzeClick(true)} className="flex items-center px-10 py-4 bg-red-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-red-700 hover:shadow-2xl transition-all transform hover:-translate-y-1"><RotateCw className="w-6 h-6 mr-2" />{t('analysis_panel.retry')}</button></div>);
        }

        return (<div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-10 flex flex-col items-center justify-center h-full min-h-[600px] text-center sticky top-6"><div className="bg-indigo-50 p-6 rounded-full mb-8"><Sparkles className="w-16 h-16 text-indigo-600" /></div><h3 className="text-2xl font-bold text-gray-900 mb-3">{t('analysis_panel.waiting_title')}</h3><p className="text-gray-500 max-w-xs mb-10 text-lg">{t('analysis_panel.waiting_desc')}</p><button onClick={() => onAnalyzeClick(true)} className="flex items-center px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-indigo-700 hover:shadow-2xl transition-all transform hover:-translate-y-1"><Zap className="w-6 h-6 mr-2" />{t('analysis_panel.start_analysis')}</button></div>);
    }

    const handleSave = async () => {
        const bestTags = analysisResult.suggested_tags || [];
        await onUpdate(listingId, {
            suggested_title: editData.suggested_title,
            suggested_description: editData.suggested_description,
            tags: bestTags,
            // ... other fields
        });
    };

    const handleCopyClick = async (text, label) => { const success = await copyToClipboard(text); if (success && onCopy) onCopy(`${label} ${t('analysis_panel.copied')}`); };

    // Helper for Magic Title (Mock)
    const handleMagicTitle = () => {
        // In a real app, this would call an AI endpoint. 
        // For now, we'll just prepend a strong keyword if available or generic one.
        const tags = analysisResult.suggested_tags || [];
        const bestTag = tags[0] || "Handmade";
        const currentTitle = editData.suggested_title;
        if (!currentTitle.toLowerCase().includes(bestTag.toLowerCase())) {
            setEditData(prev => ({ ...prev, suggested_title: `${bestTag} - ${currentTitle}` }));
        }
    };

    const handleCompleteTags = () => {
        // Mock: Add generic tags if missing
        // In reality, this would fetch more tags.
        // Since TagManager handles tags via analysisResult, we might need a way to trigger it there.
        // For this demo, we'll assume the user manually adds them or we just show a toast.
        onCopy("AI tags added (Simulation)");
    };

    return (
        <div className="relative min-h-screen bg-gray-50/50 pb-20">
            {/* --- 1. STICKY HEADER: LIVE HEALTH MONITOR --- */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between transition-all">
                <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                        <Activity className="w-6 h-6 text-indigo-600 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">{t('surgery.monitor_title')}</h2>
                        <div className="flex items-center space-x-2 text-xs font-medium text-gray-500">
                            <span>ID: {listingId}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{isAnalyzing ? 'Scanning...' : 'Live'}</span>
                        </div>
                    </div>
                </div>

                {/* LQS PROGRESS BAR */}
                <div className="flex-1 max-w-md mx-8">
                    <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold text-gray-600">LQS (Live)</span>
                        <span className={`text-xs font-black ${liveLQS >= 80 ? 'text-green-600' : liveLQS >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{liveLQS}/100</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ease-out rounded-full ${liveLQS >= 80 ? 'bg-gradient-to-r from-emerald-400 to-green-500' : liveLQS >= 50 ? 'bg-gradient-to-r from-amber-300 to-yellow-500' : 'bg-gradient-to-r from-red-400 to-red-600'}`}
                            style={{ width: `${liveLQS}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button onClick={handleSave} className="flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5">
                        <Save className="w-4 h-4 mr-2" />
                        {t('surgery.save_changes')}
                    </button>
                </div>
            </div>

            {/* --- MAIN CONTENT: SPLIT VIEW --- */}
            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- 2. LEFT PANEL: PATIENT FILE (INPUTS) --- */}
                <div className="lg:col-span-8 space-y-6">

                    {/* TITLE INPUT WITH IMPACT ZONE */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center">
                                {t('analysis_panel.title_label')}
                                <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] rounded-full border border-indigo-100">
                                    {t('surgery.impact_zone_label')}
                                </span>
                            </label>
                            <span className={`text-xs font-bold ${editData.suggested_title.length < 80 ? 'text-red-500' : 'text-green-500'}`}>
                                {editData.suggested_title.length} chars
                            </span>
                        </div>

                        <div className="relative">
                            {/* Visual Guide for Impact Zone (First 40 chars) */}
                            <div className="absolute top-0 left-0 h-1 bg-indigo-500/20 w-[40ch] pointer-events-none rounded-t-md" style={{ maxWidth: '100%' }}></div>

                            <textarea
                                className="w-full p-4 border-2 border-gray-100 rounded-xl bg-gray-50/50 text-gray-900 font-medium text-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none"
                                rows="3"
                                value={editData.suggested_title}
                                onChange={(e) => setEditData({ ...editData, suggested_title: e.target.value })}
                            />
                        </div>

                        {/* DIAGNOSIS NOTES */}
                        {diagnoses.length > 0 && (
                            <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-top-2">
                                {diagnoses.map((d, i) => (
                                    <div key={i} className={`flex items-center text-sm font-medium p-3 rounded-lg ${d.type === 'critical' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                        {d.type === 'critical' ? <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" /> : <Info className="w-4 h-4 mr-2 flex-shrink-0" />}
                                        {d.msg}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* TAGS */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-500"></div>
                        <TagManager result={analysisResult} isEditing={true} editData={editData} setEditData={setEditData} onCopy={(txt) => handleCopyClick(txt, t('analysis_panel.tags_label'))} />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gray-400"></div>
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 block">{t('analysis_panel.desc_label')}</label>
                        <textarea
                            className="w-full p-4 border border-gray-200 rounded-xl bg-white text-gray-700 text-sm focus:ring-4 focus:ring-gray-100 focus:border-gray-400 outline-none transition-all"
                            rows="8"
                            value={editData.suggested_description}
                            onChange={(e) => setEditData({ ...editData, suggested_description: e.target.value })}
                        />
                    </div>

                </div>

                {/* --- 3. RIGHT PANEL: AI TREATMENT TABLE --- */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl p-6 sticky top-24">
                        <div className="flex items-center mb-6">
                            <div className="bg-indigo-50 p-3 rounded-full mr-4">
                                <Stethoscope className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900">{t('dashboard.action_hospital_title')}</h3>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleMagicTitle}
                                className="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-2xl font-bold shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-1"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <div className="relative flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    {t('surgery.fix_title_btn')}
                                </div>
                            </button>

                            <button
                                onClick={handleCompleteTags}
                                className="w-full group bg-white border-2 border-indigo-100 text-indigo-700 p-4 rounded-2xl font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all flex items-center justify-center"
                            >
                                <Pill className="w-5 h-5 mr-2" />
                                {t('surgery.fix_tags_btn')}
                            </button>

                            <div className="pt-6 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => onAnalyzeClick(true)} className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-xs font-bold text-gray-600">
                                        <RotateCw className="w-4 h-4 mb-2 text-gray-400" />
                                        {t('analysis_panel.retry_short')}
                                    </button>
                                    <button onClick={() => handleCopyClick(editData.suggested_title, "Title")} className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-xs font-bold text-gray-600">
                                        <CheckCircle2 className="w-4 h-4 mb-2 text-gray-400" />
                                        Copy Title
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mini Stats or Tips */}
                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 text-white shadow-xl">
                        <h4 className="font-bold text-lg mb-2 flex items-center"><Zap className="w-5 h-5 mr-2 text-yellow-400" /> Pro Tip</h4>
                        <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                            "Impact Zone" is crucial for mobile users. Ensure your main keywords are visible in the first 40 characters to boost CTR.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnalysisPanel;
