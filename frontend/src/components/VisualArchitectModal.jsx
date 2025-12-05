import React, { useState, useEffect } from 'react';
import { X, Wand2, Copy, Terminal, Sun, Palette, AlertTriangle, Zap, Lock, Check, PenTool, Box, Loader2, Infinity, Layers } from 'lucide-react';

// API BASE URL (Dynamic)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

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
    const [copiedTool, setCopiedTool] = useState(null);

    const [generationCount, setGenerationCount] = useState(0);

    useEffect(() => {
        const savedCount = localStorage.getItem(`cyclear_credits_${product.id}`);
        setGenerationCount(savedCount ? parseInt(savedCount, 10) : 0);
        setGeneratedPrompt('');
        setErrorMsg('');
    }, [product.id]);

    // --- VAP v4.0 ALGORITHM (BACKEND PROXY) ---
    const handleGenerate = async () => {
        setIsGenerating(true);
        setErrorMsg('');

        try {
            console.log("Visual Architect: Backend isteği gönderiliyor...");

            const payload = {
                product_title: product.title,
                visual_concept: visualConcept,
                included_objects: includedObjects,
                style: style,
                lighting: lighting
            };

            const response = await fetch(`${API_BASE_URL}/visual-architect/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Generation failed');
            }

            setGeneratedPrompt(data.prompt);

            const newCount = generationCount + 1;
            setGenerationCount(newCount);
            localStorage.setItem(`cyclear_credits_${product.id}`, newCount);

        } catch (error) {
            console.error("Visual Architect Error:", error);
            let msg = error.message || error.toString();

            if (msg.includes("403")) msg = "HATA (403): Sunucu Yetki Sorunu (Backend Key).";
            else if (msg.includes("404")) msg = "HATA (404): Model/Endpoint Bulunamadı.";
            else if (msg.includes("Failed to fetch")) msg = "HATA: Sunucuya bağlanılamadı. Backend çalışıyor mu?";

            setErrorMsg(msg);
        }

        setIsGenerating(false);
    };

    const handleCopy = (text, toolName) => {
        navigator.clipboard.writeText(text);
        setCopiedTool(toolName);
        setTimeout(() => setCopiedTool(null), 2000);
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
                            <span className="font-bold text-indigo-600">Gemini 2.5 (Backend Proxy)</span>
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
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><PenTool size={12} /> Görsel Fikri (Dominant)</label>
                            <textarea value={visualConcept} onChange={(e) => setVisualConcept(e.target.value)} className="w-full p-3 bg-slate-50 border border-indigo-200 ring-1 ring-indigo-100 rounded-lg text-sm h-20 resize-none focus:ring-2 focus:ring-indigo-500 placeholder-indigo-300" placeholder="Örn: Masanın üzerinde duran renk paleti, yanında kahve..." />
                            <p className="text-[10px] text-slate-400 pl-1">*Buraya yazdığınız sahne, ürünün kategorisinden (Duvar vb.) baskındır.</p>
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
                            {isGenerating ? <><Loader2 className="animate-spin" /> VAP v4.0 Çalışıyor...</> : <><Wand2 size={16} /> Master Prompt Oluştur</>}
                        </button>
                        {errorMsg && <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-xs font-mono break-all"><strong>HATA:</strong> {errorMsg}</div>}
                    </div>

                    {/* 5. OUTPUT & TOOLS */}
                    {generatedPrompt && (
                        <div className="animate-fadeIn mt-4 space-y-4">
                            {/* Prompt Box */}
                            <div className="bg-slate-900 rounded-xl p-4 text-slate-300 font-mono text-xs leading-relaxed border border-slate-800 relative group">
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleCopy(generatedPrompt, 'raw')} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg flex items-center gap-2 text-[10px] font-bold"><Copy size={12} /> COPY RAW</button>
                                </div>
                                {generatedPrompt}
                            </div>

                            {/* Tools List (Expanded) */}
                            <div className="grid grid-cols-2 gap-2">
                                {['Midjourney v6', 'DALL-E 3', 'Leonardo AI', 'Flux.1', 'Flow', 'Stable Diffusion'].map((tool) => (
                                    <button
                                        key={tool}
                                        onClick={() => handleCopy(generatedPrompt, tool)}
                                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-bold transition-all ${copiedTool === tool ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}
                                    >
                                        <span className="flex items-center gap-2"><Layers size={14} className="opacity-50" /> {tool}</span>
                                        {copiedTool === tool ? <Check size={14} /> : <Copy size={14} className="opacity-0 group-hover:opacity-100" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisualArchitectModal;
