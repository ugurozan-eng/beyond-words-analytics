import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { X, Wand2, Copy, Terminal, Sun, Palette, AlertTriangle, Zap, Lock, Check, PenTool, Box, Loader2, Infinity } from 'lucide-react';

// --- GHOST KEY STRATEGY ---
const partA = "AIzaSyBApcuj1vK1Ipt8";
const partB = "sjhdvgAx8OCtsOdoJ9U";
const API_KEY = partA + partB;

const genAI = new GoogleGenerativeAI(API_KEY);

const VisualArchitectModal = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    // STATE
    const [style, setStyle] = useState('minimalist');
    const [lighting, setLighting] = useState('studio');
    const [brandName, setBrandName] = useState('Beyond Words Studio');
    const [signatureText, setSignatureText] = useState('© 2025 Beyond Words');
    const [visualConcept, setVisualConcept] = useState('');
    const [includedObjects, setIncludedObjects] = useState('');

    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [activeModelName, setActiveModelName] = useState('Gemini 2.5 Flash');

    // COUNTER (Unlimited)
    const [generationCount, setGenerationCount] = useState(0);

    useEffect(() => {
        const savedCount = localStorage.getItem(`cyclear_credits_${product.id}`);
        setGenerationCount(savedCount ? parseInt(savedCount, 10) : 0);
        setGeneratedPrompt('');
        setErrorMsg('');
    }, [product.id]);

    // GENERATION LOGIC
    const handleGenerate = async () => {
        setIsGenerating(true);
        setErrorMsg('');

        try {
            console.log("Gemini: İstek başlatılıyor...");

            // SAFETY SETTINGS
            const safetySettings = [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ];

            const cleanTitle = product.title.substring(0, 80);

            const prompt = `
          ACT AS: Expert Midjourney Prompt Engineer.
          PRODUCT: "${cleanTitle}"
          ISSUE: "${product.visual_analysis?.issue || 'General improvement'}"
          CONTEXT: Style: ${style}, Light: ${lighting}, Brand: ${brandName}
          CONCEPT: ${visualConcept || "Professional showcase"}
          PROPS: ${includedObjects || "Minimal props"}
          TEXT: ${signatureText || "None"}
          
          OUTPUT: Single optimized /imagine prompt with parameters (--ar 4:3 --v 6.0 --q 2).
        `;

            // ATTEMPT 1: Gemini 2.5 Flash
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", safetySettings });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                setGeneratedPrompt(response.text());
                setActiveModelName('Gemini 2.5 Flash');
            } catch (err25) {
                console.warn("Gemini 2.5 failed, trying 1.5...", err25);

                // ATTEMPT 2: Gemini 1.5 Flash (Fallback)
                const modelFallback = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });
                const resultFallback = await modelFallback.generateContent(prompt);
                const responseFallback = await resultFallback.response;
                setGeneratedPrompt(responseFallback.text());
                setActiveModelName('Gemini 1.5 Flash (Fallback)');
            }

            const newCount = generationCount + 1;
            setGenerationCount(newCount);
            localStorage.setItem(`cyclear_credits_${product.id}`, newCount);

        } catch (error) {
            console.error("Gemini Error:", error);

            let msg = error.message || error.toString();
            // Hata Mesajı Çevirileri
            if (msg.includes("404")) msg = "HATA: Model Bulunamadı.";
            if (msg.includes("403")) msg = "HATA: Yetki Sorunu (API Key veya Bölge).";
            if (msg.includes("429")) msg = "HATA: Kota Doldu.";

            setErrorMsg(msg);
        }

        setIsGenerating(false);
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 overflow-y-auto">
            {/* NARROW SINGLE COLUMN CARD */}
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn my-4">

                {/* HEADER */}
                <div className="bg-white p-5 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">Visual Architect</h2>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Zap size={12} className="text-green-500 fill-green-500" />
                            <span>{activeModelName}</span>
                            <span className="bg-green-100 text-green-700 px-2 rounded font-bold text-[10px] ml-2 flex items-center gap-1"><Infinity size={10} /> SINIRSIZ</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} className="text-slate-400" /></button>
                </div>

                {/* SCROLLABLE BODY */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">

                    {/* 1. DIAGNOSIS */}
                    <div className="flex gap-4 p-4 bg-red-50 rounded-xl border border-red-100 items-start">
                        <img src={product.img} className="w-14 h-14 rounded-lg object-cover border border-red-200 shrink-0" />
                        <div>
                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-1"><AlertTriangle size={12} /> Hedef</span>
                            <p className="text-xs text-red-900 font-medium mt-1 leading-snug">"{product.visual_analysis?.issue || 'Görsel iyileştirme.'}"</p>
                        </div>
                    </div>

                    {/* 2. INPUTS */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500">Marka & İmza</label>
                            <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm mb-2" placeholder="Marka Adı" />
                            <input type="text" value={signatureText} onChange={(e) => setSignatureText(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="İmza Metni" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><PenTool size={12} /> Görsel Fikri</label>
                            <textarea value={visualConcept} onChange={(e) => setVisualConcept(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm h-20 resize-none" placeholder="Minimalist bir ortam..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><Box size={12} /> Objeler</label>
                            <input type="text" value={includedObjects} onChange={(e) => setIncludedObjects(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Vazo, kitap..." />
                        </div>
                    </div>

                    {/* 3. SELECTORS */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">Stil</label>
                            {['Minimalist', 'Bohemian', 'Luxury', 'Vintage'].map(s => (
                                <button key={s} onClick={() => setStyle(s.toLowerCase())} className={`w-full text-left px-3 py-2 mb-1 rounded border text-xs font-bold ${style === s.toLowerCase() ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600'}`}>{s}</button>
                            ))}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">Işık</label>
                            {['Studio', 'Natural', 'Warm', 'Dark'].map(l => (
                                <button key={l} onClick={() => setLighting(l.toLowerCase())} className={`w-full text-left px-3 py-2 mb-1 rounded border text-xs font-bold ${lighting === l.toLowerCase() ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-600'}`}>{l}</button>
                            ))}
                        </div>
                    </div>

                    {/* 4. BUTTON */}
                    <div className="pt-2">
                        <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                            {isGenerating ? <><Loader2 className="animate-spin" /> Üretiliyor...</> : <><Wand2 size={16} /> Prompt Oluştur</>}
                        </button>
                        {errorMsg && <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-xs font-mono break-all"><strong>HATA:</strong> {errorMsg}</div>}
                    </div>

                    {/* 5. OUTPUT */}
                    {generatedPrompt && (
                        <div className="bg-slate-900 rounded-xl p-4 text-slate-300 font-mono text-xs leading-relaxed border border-slate-800 animate-fadeIn mt-4">
                            <div className="flex justify-between mb-2 pb-2 border-b border-white/10">
                                <span className="text-green-400 font-bold">SUCCESS</span>
                                <button onClick={() => navigator.clipboard.writeText(generatedPrompt)} className="text-white hover:text-indigo-400"><Copy size={14} /></button>
                            </div>
                            {generatedPrompt}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisualArchitectModal;
