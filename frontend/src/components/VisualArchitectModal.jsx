import React, { useState, useEffect } from 'react';
// Force Deployment Trigger: Visual Architect UI Update
import { GoogleGenerativeAI } from "@google/generative-ai";
import { X, Wand2, Copy, Terminal, Sun, Palette, AlertTriangle, Zap, Lock, Check, Info, PenTool, Box, Type, Loader2 } from 'lucide-react';

// --- API CONFIGURATION ---
// DİKKAT: Güvenlik için normalde backend kullanılmalı ama test için client-side yapıyoruz.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
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

    // Credit Logic
    const MAX_ATTEMPTS = 3;
    const [generationCount, setGenerationCount] = useState(0);

    useEffect(() => {
        const storageKey = `cyclear_credits_${product.id}`;
        const savedCount = localStorage.getItem(storageKey);
        setGenerationCount(savedCount ? parseInt(savedCount, 10) : 0);
        setGeneratedPrompt('');
    }, [product.id]);

    const remainingCredits = Math.max(0, MAX_ATTEMPTS - generationCount);

    // --- REAL AI GENERATION (GEMINI 1.5 FLASH) ---
    const generateWithGemini = async () => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // 1. Prepare Data for AI
            const cleanTitle = product.title.substring(0, 80); // Send raw title, AI is smart enough
            const issue = product.visual_analysis?.issue || "General improvement needed";

            // 2. Construct the "Architect" Prompt
            const prompt = `
          ACT AS: World-class Midjourney v6 Prompt Engineer & Photographer.
          GOAL: Create a single, high-end "/imagine" prompt for an Etsy product.
          
          PRODUCT DATA:
          - Title: "${cleanTitle}"
          - Category: Wall Art / Digital Product
          - LQS Issue to Fix: "${issue}" (Ensure the prompt fixes this: e.g. if dark, make it bright)

          USER PREFERENCES:
          - Aesthetic Style: ${style}
          - Lighting: ${lighting}
          - Brand Vibe: ${brandName}
          - Specific Visual Concept: ${visualConcept || "Professional commercial composition"}
          - Objects/Props to Include: ${includedObjects || "Minimalist styling props"}
          - Text Request: ${signatureText ? `Include subtle text watermark '${signatureText}'` : "None"}

          REQUIREMENTS:
          1. Start strictly with "/imagine prompt:".
          2. Use professional photography terminology (8k, highly detailed, sharp focus).
          3. Include "--ar 4:3 --v 6.0 --style raw --q 2" at the end.
          4. NO conversational filler. JUST the prompt string.
          5. Ensure the description guarantees a "High Quality" score (Bright, Clear, Textured).
        `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();

        } catch (error) {
            console.error("Gemini Error:", error);
            return "/imagine prompt: Error connecting to AI Architect. Please try again. (Check API Key)";
        }
    };

    const handleGenerate = async () => {
        if (generationCount >= MAX_ATTEMPTS) return;

        setIsGenerating(true);

        // Call Real AI
        const aiPrompt = await generateWithGemini();

        // Update State & Credits
        setGeneratedPrompt(aiPrompt);
        const newCount = generationCount + 1;
        setGenerationCount(newCount);
        localStorage.setItem(`cyclear_credits_${product.id}`, newCount);

        setIsGenerating(false);
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/40 backdrop-blur-md p-4 animate-fadeIn transition-all duration-300">
            <div className="w-full max-w-7xl h-[90vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden border border-white/50 ring-1 ring-black/5">

                {/* COL 1: LEFT PANEL */}
                <div className="w-[280px] bg-white border-r border-slate-100 p-6 flex flex-col flex-shrink-0 overflow-y-auto">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Adım 1: Teşhis</h3>
                    <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-red-100 mb-4 shadow-sm group">
                        <img src={product.img} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-white/90 text-red-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-red-100">Mevcut Görsel</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-4">
                        <div className="flex items-center gap-2 mb-2 text-red-700 font-bold text-sm"><AlertTriangle size={16} /><span>Sorun</span></div>
                        <p className="text-xs text-red-600/80 leading-relaxed">{product.visual_analysis?.issue}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="flex items-center gap-2 mb-2 text-green-700 font-bold text-sm"><Zap size={16} /><span>AI Motoru</span></div>
                        <p className="text-xs text-green-800/80 leading-relaxed">
                            <b>Gemini 1.5 Flash</b> aktif. Gerçek zamanlı analiz yapılıyor.
                        </p>
                    </div>
                </div>

                {/* COL 2: CENTER PANEL */}
                <div className="flex-1 flex flex-col relative bg-white min-w-0">
                    <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white z-10">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Visual Architect</h2>
                            <p className="text-slate-500 text-sm">Powered by Google Gemini AI</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={24} className="text-slate-400" /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        {/* Inputs ... (Same as previous design, kept concise for this snippet) */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                            <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
                            <p className="text-xs text-blue-800 leading-relaxed">
                                Aşağıdaki alanlar AI'a rehberlik eder. Boş bıraksanız bile Gemini görseli analiz edip en iyi promptu yazar.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2"><PenTool size={16} className="text-indigo-500" /> Görsel Kurgusu</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Marka Adı" />
                                <input type="text" value={signatureText} onChange={(e) => setSignatureText(e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="İmza Metni" />
                            </div>
                            <textarea value={visualConcept} onChange={(e) => setVisualConcept(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-20" placeholder="1. Görsel Fikri (Örn: Minimalist bir ofis masası, sabah ışığı...)" />
                            <input type="text" value={includedObjects} onChange={(e) => setIncludedObjects(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="2. Objeler (Örn: Laptop, kahve, gözlük...)" />
                        </div>

                        <hr className="border-slate-100" />

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Palette size={16} /> Stil</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {['Minimalist', 'Bohemian', 'Luxury', 'Vintage'].map((s) => (
                                        <button key={s} onClick={() => setStyle(s.toLowerCase())} className={`px-3 py-2 rounded-lg border text-xs font-medium text-left flex justify-between ${style === s.toLowerCase() ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>{s}{style === s.toLowerCase() && <Check size={12} />}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Sun size={16} /> Işık</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {['Studio', 'Natural', 'Warm', 'Dark'].map((l) => (
                                        <button key={l} onClick={() => setLighting(l.toLowerCase())} className={`px-3 py-2 rounded-lg border text-xs font-medium text-left flex justify-between ${lighting === l.toLowerCase() ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 text-slate-600'}`}>{l}{lighting === l.toLowerCase() && <Check size={12} />}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-white z-10 mt-auto">
                        <div className="flex justify-between items-center text-xs px-1 mb-2">
                            <span className="font-bold text-slate-400 uppercase tracking-wider">Kalan Hak</span>
                            <span className={`${remainingCredits === 0 ? 'text-red-500' : 'text-indigo-600'} font-black bg-slate-50 px-2 py-1 rounded`}>{remainingCredits} / {MAX_ATTEMPTS}</span>
                        </div>
                        <button onClick={handleGenerate} disabled={isGenerating || remainingCredits === 0} className={`w-full py-4 font-bold rounded-xl shadow-xl transform transition-all flex items-center justify-center gap-3 ${remainingCredits === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white hover:scale-[1.02] shadow-indigo-200'}`}>
                            {isGenerating ? (<span className="animate-pulse flex items-center gap-2"><Loader2 className="animate-spin" size={20} /> Gemini Düşünüyor...</span>) : remainingCredits === 0 ? (<><Lock size={20} /> Limit Doldu</>) : (<><Wand2 size={20} /> Gemini ile Üret</>)}
                        </button>
                    </div>
                </div>

                {/* COL 3: RIGHT PANEL */}
                <div className="w-[350px] bg-slate-50 border-l border-slate-200 p-6 flex flex-col relative shrink-0">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2"><Terminal size={14} /> Çıktı Terminali</h3>
                    <div className="flex-1 bg-white rounded-xl border border-slate-200 p-5 font-mono text-sm relative group shadow-sm overflow-y-auto">
                        {generatedPrompt ? (
                            <div className="animate-fadeIn">
                                <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div><span className="text-green-600 text-xs font-bold">Gemini API Success</span></div>
                                <p className="text-slate-600 leading-relaxed break-words select-all whitespace-pre-wrap">{generatedPrompt}</p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400/60"><Terminal size={24} className="text-slate-300 mb-4" /><p className="text-xs text-center font-medium max-w-[150px]">Gemini 1.5 Flash hazır. Komut bekleniyor.</p></div>
                        )}
                    </div>
                    <div className="mt-6 space-y-3">
                        {['Midjourney v6', 'DALL-E 3', 'Canva Magic'].map((platform, i) => (
                            <button key={i} onClick={() => handleCopy(generatedPrompt, i)} disabled={!generatedPrompt} className={`w-full py-3 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-between border group ${generatedPrompt ? 'bg-white hover:bg-indigo-50 text-slate-600 shadow-sm cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                                <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-indigo-600' : 'bg-blue-500'} opacity-80`}></div>{platform}</span>
                                {copiedIndex === i ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-slate-300 group-hover:text-indigo-500" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default VisualArchitectModal;
