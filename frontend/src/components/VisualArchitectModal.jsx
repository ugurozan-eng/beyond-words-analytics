import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { X, Wand2, Copy, Terminal, Sun, Palette, AlertTriangle, Zap, Lock, Check, Info, PenTool, Box, Type, Loader2 } from 'lucide-react';

// --- HARDCODED API KEY (FOR IMMEDIATE FIX) ---
const API_KEY = "AIzaSyD0xMbfkcCe7gLhq4-uEtBchqA2Eyo_ZNE";
const genAI = new GoogleGenerativeAI(API_KEY);

const VisualArchitectModal = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    // --- STATE ---
    const [style, setStyle] = useState('minimalist');
    const [lighting, setLighting] = useState('studio');

    // Advanced Inputs
    const [visualConcept, setVisualConcept] = useState('');
    const [includedObjects, setIncludedObjects] = useState('');
    const [brandName, setBrandName] = useState('Beyond Words Studio');
    const [signatureText, setSignatureText] = useState('© 2025 Beyond Words');

    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    // Credit Logic
    const MAX_ATTEMPTS = 3;
    const [generationCount, setGenerationCount] = useState(0);

    useEffect(() => {
        const storageKey = `cyclear_credits_${product.id}`;
        const savedCount = localStorage.getItem(storageKey);
        setGenerationCount(savedCount ? parseInt(savedCount, 10) : 0);
        setGeneratedPrompt('');
        setErrorMsg('');
    }, [product.id]);

    const remainingCredits = Math.max(0, MAX_ATTEMPTS - generationCount);

    // --- GEMINI GENERATION ---
    const generateWithGemini = async () => {
        try {
            setErrorMsg('');
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const cleanTitle = product.title.substring(0, 80);
            const issue = product.visual_analysis?.issue || "General improvement needed";

            const prompt = `
          ACT AS: Expert Midjourney Prompt Engineer.
          PRODUCT: "${cleanTitle}"
          ISSUE TO FIX: "${issue}"
          
          USER SETTINGS:
          - Style: ${style}
          - Lighting: ${lighting}
          - Brand: ${brandName}
          - Concept: ${visualConcept || "Professional product showcase"}
          - Props: ${includedObjects || "Minimal props"}
          - Watermark Request: ${signatureText ? `Text: '${signatureText}'` : "None"}

          TASK: Write ONE optimized "/imagine" prompt.
          REQUIREMENTS: Include technical tags (--ar 4:3 --v 6.0 --q 2). High quality, 8k.
          OUTPUT: Just the prompt string.
        `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();

        } catch (error) {
            console.error("Gemini Error:", error);
            setErrorMsg("Bağlantı Hatası: Lütfen tekrar deneyin.");
            return null;
        }
    };

    const handleGenerate = async () => {
        if (generationCount >= MAX_ATTEMPTS) return;

        setIsGenerating(true);

        const aiPrompt = await generateWithGemini();

        if (aiPrompt) {
            setGeneratedPrompt(aiPrompt);
            const newCount = generationCount + 1;
            setGenerationCount(newCount);
            localStorage.setItem(`cyclear_credits_${product.id}`, newCount);
        }

        setIsGenerating(false);
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
            {/* SINGLE COLUMN CONTAINER (MAX-WIDTH-2XL) */}
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-8 flex flex-col overflow-hidden animate-fadeIn relative">

                {/* HEADER */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Visual Architect</h2>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Zap size={12} className="text-green-500 fill-green-500" />
                            <span className="text-green-600 font-bold">Gemini 1.5 Bağlı</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
                </div>

                {/* SCROLLABLE CONTENT AREA */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">

                    {/* 1. DIAGNOSIS CARD */}
                    <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                        <img src={product.img} className="w-16 h-16 rounded-lg object-cover border border-red-200" />
                        <div>
                            <div className="flex items-center gap-2 mb-1 text-red-700 font-bold text-xs uppercase tracking-wider">
                                <AlertTriangle size={14} /> Teşhis
                            </div>
                            <p className="text-sm text-red-900 font-medium leading-snug">"{product.visual_analysis?.issue || 'Analiz bekleniyor.'}"</p>
                        </div>
                    </div>

                    {/* 2. INPUTS (VERTICAL STACK) */}
                    <div className="space-y-4">
                        {/* Brand Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">Marka Adı</label>
                                <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">İmza / Telif</label>
                                <input type="text" value={signatureText} onChange={(e) => setSignatureText(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>

                        {/* Concept */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block flex items-center gap-2"><PenTool size={12} /> Görsel Fikri</label>
                            <textarea value={visualConcept} onChange={(e) => setVisualConcept(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 h-20 resize-none focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Örn: Minimalist yatak odası, sabah ışığı..." />
                        </div>

                        {/* Objects */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block flex items-center gap-2"><Box size={12} /> Objeler</label>
                            <input type="text" value={includedObjects} onChange={(e) => setIncludedObjects(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Örn: Vazo, kitap, mum..." />
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* 3. SETTINGS (GRID) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-2 block flex items-center gap-2"><Palette size={14} /> Stil</label>
                            <div className="space-y-2">
                                {['Minimalist', 'Bohemian', 'Luxury', 'Vintage'].map(s => (
                                    <button key={s} onClick={() => setStyle(s.toLowerCase())} className={`w-full text-left px-3 py-2 rounded border text-xs font-bold transition-all ${style === s.toLowerCase() ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{s}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-2 block flex items-center gap-2"><Sun size={14} /> Işık</label>
                            <div className="space-y-2">
                                {['Studio', 'Natural', 'Warm', 'Dark'].map(l => (
                                    <button key={l} onClick={() => setLighting(l.toLowerCase())} className={`w-full text-left px-3 py-2 rounded border text-xs font-bold transition-all ${lighting === l.toLowerCase() ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{l}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 4. ACTION BUTTON */}
                    <div className="pt-2 sticky bottom-0 bg-white pb-2">
                        <div className="flex justify-between text-xs mb-2 px-1">
                            <span className="font-bold text-slate-400">KALAN HAK</span>
                            <span className={`${remainingCredits === 0 ? 'text-red-500' : 'text-indigo-600'} font-bold`}>{remainingCredits} / {MAX_ATTEMPTS}</span>
                        </div>
                        <button onClick={handleGenerate} disabled={isGenerating || remainingCredits === 0} className={`w-full py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all ${remainingCredits === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300 transform hover:scale-[1.01]'}`}>
                            {isGenerating ? <><Loader2 className="animate-spin" /> Gemini Düşünüyor...</> : remainingCredits === 0 ? <><Lock size={18} /> Limit Doldu</> : <><Wand2 size={18} /> Master Prompt Oluştur</>}
                        </button>
                        {errorMsg && <p className="text-red-500 text-xs text-center mt-2 font-bold bg-red-50 p-2 rounded">{errorMsg}</p>}
                    </div>

                    {/* 5. OUTPUT TERMINAL (APPEARS AFTER GENERATION) */}
                    {generatedPrompt && (
                        <div className="bg-slate-900 rounded-xl p-6 text-slate-300 font-mono text-sm relative animate-fadeIn border border-slate-800 shadow-xl">
                            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                                <span className="text-xs font-bold text-green-400 flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> SUCCESS</span>
                                <div className="flex gap-2">
                                    {['Midjourney', 'DALL-E'].map((p, i) => (
                                        <button key={i} onClick={() => handleCopy(generatedPrompt, i)} className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white transition-colors">{copiedIndex === i ? "Kopyalandı!" : p}</button>
                                    ))}
                                </div>
                            </div>
                            <p className="leading-relaxed whitespace-pre-wrap select-all text-slate-200">{generatedPrompt}</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
export default VisualArchitectModal;
