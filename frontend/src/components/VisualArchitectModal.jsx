import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { X, Wand2, Copy, Terminal, Sun, Palette, AlertTriangle, Zap, Lock, Check, Info, PenTool, Box, Type, Loader2 } from 'lucide-react';

// API KEY (Make sure .env file has VITE_GEMINI_API_KEY)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const VisualArchitectModal = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    // State
    const [style, setStyle] = useState('minimalist');
    const [lighting, setLighting] = useState('studio');
    const [visualConcept, setVisualConcept] = useState('');
    const [includedObjects, setIncludedObjects] = useState('');
    const [brandName, setBrandName] = useState('Beyond Words Studio');
    const [signatureText, setSignatureText] = useState('© 2025 Beyond Words');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Credits
    const MAX_ATTEMPTS = 3;
    const [generationCount, setGenerationCount] = useState(0);

    useEffect(() => {
        const savedCount = localStorage.getItem(`cyclear_credits_${product.id}`);
        setGenerationCount(savedCount ? parseInt(savedCount, 10) : 0);
        setGeneratedPrompt('');
        setErrorMsg('');
    }, [product.id]);

    const remainingCredits = Math.max(0, MAX_ATTEMPTS - generationCount);

    // GEMINI GENERATION
    const generateWithGemini = async () => {
        try {
            setErrorMsg('');
            if (!API_KEY) throw new Error("API Key Missing! Check .env file.");

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const cleanTitle = product.title.substring(0, 80);

            const prompt = `
          ACT AS: Expert Midjourney Prompt Engineer.
          PRODUCT: ${cleanTitle}.
          CONTEXT: User wants a "${style}" style with "${lighting}" lighting.
          CONCEPT: ${visualConcept || "Professional product showcase"}.
          PROPS: ${includedObjects || "Minimal props"}.
          BRAND: ${brandName}.
          
          TASK: Write ONE optimized "/imagine" prompt.
          REQUIREMENTS: Include technical tags (--ar 4:3 --v 6.0 --q 2). High quality, 8k.
          OUTPUT: Just the prompt string.
        `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();

        } catch (error) {
            console.error("Gemini Error:", error);
            setErrorMsg(error.message || "Connection failed.");
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-8 flex flex-col overflow-hidden animate-fadeIn">

                {/* HEADER */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Visual Architect</h2>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Zap size={12} className="text-amber-500" />
                            <span>Gemini 1.5 Powered</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
                </div>

                {/* BODY (SCROLLABLE) */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">

                    {/* 1. DIAGNOSIS */}
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <img src={product.img} className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Hedef: LQS Puanını Yükselt</h4>
                            <p className="text-sm text-slate-800 font-medium leading-snug">"{product.visual_analysis?.issue || 'Görsel iyileştirme gerekli.'}"</p>
                        </div>
                    </div>

                    {/* 2. INPUTS */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">Marka</label>
                                <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-slate-50" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">İmza</label>
                                <input type="text" value={signatureText} onChange={(e) => setSignatureText(e.target.value)} className="w-full p-2 border rounded-lg text-sm bg-slate-50" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block flex items-center gap-2"><PenTool size={12} /> Görsel Fikri</label>
                            <textarea value={visualConcept} onChange={(e) => setVisualConcept(e.target.value)} className="w-full p-3 border rounded-lg text-sm bg-slate-50 h-20 resize-none" placeholder="Örn: Minimalist yatak odası..." />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block flex items-center gap-2"><Box size={12} /> Objeler</label>
                            <input type="text" value={includedObjects} onChange={(e) => setIncludedObjects(e.target.value)} className="w-full p-3 border rounded-lg text-sm bg-slate-50" placeholder="Örn: Vazo, kitap..." />
                        </div>
                    </div>

                    {/* 3. SETTINGS */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-2 block">Stil</label>
                            <div className="space-y-2">
                                {['Minimalist', 'Bohemian', 'Luxury', 'Vintage'].map(s => (
                                    <button key={s} onClick={() => setStyle(s.toLowerCase())} className={`w-full text-left px-3 py-2 rounded border text-xs font-bold ${style === s.toLowerCase() ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 text-slate-600'}`}>{s}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-2 block">Işık</label>
                            <div className="space-y-2">
                                {['Studio', 'Natural', 'Warm', 'Dark'].map(l => (
                                    <button key={l} onClick={() => setLighting(l.toLowerCase())} className={`w-full text-left px-3 py-2 rounded border text-xs font-bold ${lighting === l.toLowerCase() ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white border-slate-200 text-slate-600'}`}>{l}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 4. GENERATE BUTTON */}
                    <div className="pt-4">
                        <div className="flex justify-between text-xs mb-2">
                            <span className="font-bold text-slate-400">KALAN HAK</span>
                            <span className="font-bold text-indigo-600">{remainingCredits} / {MAX_ATTEMPTS}</span>
                        </div>
                        <button onClick={handleGenerate} disabled={isGenerating || remainingCredits === 0} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            {isGenerating ? <><Loader2 className="animate-spin" /> Üretiliyor...</> : <><Wand2 size={18} /> Master Prompt Oluştur</>}
                        </button>
                        {errorMsg && <p className="text-red-500 text-xs text-center mt-2">{errorMsg}</p>}
                    </div>

                    {/* 5. OUTPUT (Appears Here) */}
                    {generatedPrompt && (
                        <div className="mt-6 bg-slate-900 rounded-xl p-6 text-slate-300 font-mono text-sm relative animate-fadeIn">
                            <div className="absolute top-0 right-0 p-2">
                                <button onClick={() => navigator.clipboard.writeText(generatedPrompt)} className="p-2 hover:bg-white/10 rounded-lg text-white"><Copy size={16} /></button>
                            </div>
                            <h4 className="text-xs font-bold text-indigo-400 mb-2 border-b border-white/10 pb-2">GENERATED PROMPT</h4>
                            <p className="leading-relaxed whitespace-pre-wrap">{generatedPrompt}</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default VisualArchitectModal;
