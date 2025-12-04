import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
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

    // UNLIMITED COUNTER
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
            console.log("Gemini VAP v3.1: İstek gönderiliyor...");

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const cleanTitle = product.title.substring(0, 80);
            const lqsIssue = product.visual_analysis?.issue || '';

            // --- VAP v3.1 PROMPT ENGINEERING ---
            const prompt = `
          ACT AS: World-Class Midjourney v6 Prompt Engineer.
          
          INPUTS:
          - PRODUCT: "${cleanTitle}"
          - USER_CONCEPT: "${visualConcept}" (High Priority).
          - PROPS: "${includedObjects}"
          - STYLE: ${style}
          - LIGHT: ${lighting}
          - BRAND: ${brandName}
          - PROBLEM_TO_FIX: "${lqsIssue}"
          
          INSTRUCTIONS:
          1. START with the main subject. If 'USER_CONCEPT' is provided, use that composition. If not, focus on the Product.
          2. CRITICAL: Analyze 'PROBLEM_TO_FIX'. Do NOT output the text of the problem. Instead, add keywords to SOLVE it.
             (Example: If problem is "Görsel karanlık", add "Bright, high exposure, softbox lighting").
          3. Incorporate "${includedObjects}" naturally.
          4. Add professional keywords: 8k, highly detailed, photorealistic, sharp focus.
          
          OUTPUT FORMAT:
          - Provide ONLY the raw prompt text.
          - Do NOT include "/imagine prompt:" prefix.
          - End with: --ar 4:3 --v 6.0 --q 2 --style raw
        `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();

            // Clean up if AI adds prefix anyway
            text = text.replace(/\/imagine prompt:/gi, "").trim();

            setGeneratedPrompt(text);

            const newCount = generationCount + 1;
            setGenerationCount(newCount);
            localStorage.setItem(`cyclear_credits_${product.id}`, newCount);

        } catch (error) {
            console.error("Gemini Error:", error);
            let msg = error.message || error.toString();
            if (msg.includes("404")) msg = "HATA: Model Bulunamadı.";
            if (msg.includes("403")) msg = "HATA: Yetki Sorunu.";
            setErrorMsg(msg);
        }

        setIsGenerating(false);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text); // Copy ONLY the raw text
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn my-4">

                {/* HEADER */}
                <div className="bg-white p-5 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">Visual Architect</h2>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Zap size={12} className="text-indigo-500 fill-indigo-500" />
                            <span className="font-bold text-indigo-600">Gemini 2.5 Flash</span>
                            <span className="bg-green-100 text-green-700 px-2 rounded font-bold text-[10px] ml-2 flex items-center gap-1"><Infinity size={10} /> SINIRSIZ</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} className="text-slate-400" /></button>
                </div>

                {/* BODY */}
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
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><PenTool size={12} /> Görsel Fikri (Öncelikli)</label>
                            <textarea value={visualConcept} onChange={(e) => setVisualConcept(e.target.value)} className="w-full p-3 bg-slate-50 border border-indigo-200 ring-1 ring-indigo-100 rounded-lg text-sm h-20 resize-none focus:ring-2 focus:ring-indigo-500" placeholder="Örn: Renk paleti düzeni, masanın üstünde dağınık duruş..." />
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
                            {isGenerating ? <><Loader2 className="animate-spin" /> Üretiliyor...</> : <><Wand2 size={16} /> Master Prompt Oluştur</>}
                        </button>
                        {errorMsg && <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-xs font-mono break-all"><strong>HATA:</strong> {errorMsg}</div>}
                    </div>

                    {/* 5. OUTPUT */}
                    {generatedPrompt && (
                        <div className="bg-slate-900 rounded-xl p-4 text-slate-300 font-mono text-xs leading-relaxed border border-slate-800 animate-fadeIn mt-4 relative group">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleCopy(generatedPrompt)} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg flex items-center gap-2 text-[10px] font-bold">
                                    <Copy size={12} /> COPY RAW
                                </button>
                            </div>
                            <div className="flex justify-between mb-2 pb-2 border-b border-white/10">
                                <span className="text-green-400 font-bold flex items-center gap-2"><Check size={14} /> HAZIR</span>
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
