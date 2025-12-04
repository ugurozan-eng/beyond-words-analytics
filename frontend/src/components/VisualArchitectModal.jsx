import React, { useState } from 'react';
import { X, Wand2, Copy, Terminal, Sun, Palette, AlertTriangle, Zap, Lock, Check } from 'lucide-react';

const VisualArchitectModal = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    const [style, setStyle] = useState('minimalist');
    const [lighting, setLighting] = useState('studio');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);

    // --- LIMIT LOGIC ---
    const MAX_ATTEMPTS = 3;
    const [generationCount, setGenerationCount] = useState(0);
    const remainingCredits = MAX_ATTEMPTS - generationCount;

    // Mock Logic for Prompt Generation
    const handleGenerate = () => {
        if (generationCount >= MAX_ATTEMPTS) return;

        setIsGenerating(true);
        setGenerationCount(prev => prev + 1);

        setTimeout(() => {
            const prompt = `/imagine prompt: Professional product photography of ${product.title}, ${style} style, ${lighting} lighting, 8k resolution, photorealistic, cinematic composition, high detail texture --ar 4:3 --v 6.0`;
            setGeneratedPrompt(prompt);
            setIsGenerating(false);
        }, 1500);
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        // FIX 1: New Backdrop -> Indigo Tinted Frosted Glass (Cleaner than black)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/40 backdrop-blur-md p-4 animate-fadeIn transition-all duration-300">

            <div className="w-full max-w-6xl h-[85vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden border border-white/50 ring-1 ring-black/5">

                {/* COL 1: DIAGNOSIS (LEFT) */}
                <div className="w-1/4 bg-white border-r border-slate-100 p-6 flex flex-col">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Adım 1: Teşhis</h3>
                    <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-red-100 mb-4 shadow-sm group">
                        <img src={product.img} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-white/90 text-red-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-red-100">Mevcut Görsel</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <div className="flex items-center gap-2 mb-2 text-red-700 font-bold text-sm">
                            <AlertTriangle size={16} />
                            <span>Tespit Edilen Sorun</span>
                        </div>
                        <p className="text-xs text-red-600/80 leading-relaxed">
                            {product.visual_analysis?.issue || "Görsel düşük çözünürlüklü ve karanlık."}
                        </p>
                    </div>
                </div>

                {/* COL 2: ENGINE ROOM (CENTER) */}
                <div className="flex-1 p-8 flex flex-col relative bg-white">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Visual Architect</h2>
                            <p className="text-slate-500 text-sm">Yapay Zeka Prompt Mimarı v1.0</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={24} className="text-slate-400" /></button>
                    </div>

                    <div className="space-y-8 max-w-lg mx-auto w-full mt-4">
                        {/* Style Selector */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Palette size={16} className="text-indigo-600" /> Estetik Stil Seçimi
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Minimalist', 'Bohemian', 'Luxury', 'Vintage'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStyle(s.toLowerCase())}
                                        className={`p-3 rounded-lg border text-sm font-medium transition-all text-left flex items-center justify-between ${style === s.toLowerCase() ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600 shadow-sm' : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {s}
                                        {style === s.toLowerCase() && <Check size={14} className="text-indigo-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Lighting Selector */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Sun size={16} className="text-amber-500" /> Işıklandırma
                            </label>
                            <div className="flex gap-2">
                                {['Studio', 'Natural', 'Warm', 'Dark'].map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLighting(l.toLowerCase())}
                                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${lighting === l.toLowerCase() ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 space-y-3">
                            <div className="flex justify-between items-center text-xs px-1">
                                <span className="font-bold text-slate-400">GÜNLÜK KREDİ</span>
                                <span className={`${remainingCredits === 0 ? 'text-red-500' : 'text-indigo-600'} font-black bg-slate-50 px-2 py-1 rounded`}>{remainingCredits} / {MAX_ATTEMPTS} Hak</span>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || remainingCredits === 0}
                                className={`w-full py-4 font-bold rounded-xl shadow-xl transform transition-all flex items-center justify-center gap-3 
                        ${remainingCredits === 0
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200'
                                        : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white hover:scale-[1.02] shadow-indigo-200'}`}
                            >
                                {isGenerating ? (
                                    <span className="animate-pulse flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mimari Çiziliyor...</span>
                                ) : remainingCredits === 0 ? (
                                    <><Lock size={20} /> Limit Doldu</>
                                ) : (
                                    <><Wand2 size={20} /> Master Prompt Oluştur</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* COL 3: OUTPUT TERMINAL (RIGHT) - FIX 2: PURE LIGHT MODE */}
                <div className="w-[380px] bg-slate-50 border-l border-slate-200 p-6 flex flex-col relative">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Terminal size={14} /> Çıktı Terminali
                    </h3>

                    {/* Light Theme Terminal Box (White bg, Dark text) */}
                    <div className="flex-1 bg-white rounded-xl border border-slate-200 p-5 font-mono text-sm relative group shadow-sm overflow-y-auto">
                        {generatedPrompt ? (
                            <div className="animate-fadeIn">
                                <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-green-600 text-xs font-bold">Generated Successfully</span>
                                </div>
                                <p className="text-slate-600 leading-relaxed break-words select-all">{generatedPrompt}</p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400/60">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <Terminal size={24} className="text-slate-300" />
                                </div>
                                <p className="text-xs text-center font-medium max-w-[150px]">Sol taraftan ayarları seçin ve butona basın.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Platform Seç ve Kopyala</p>

                        {['Midjourney v6', 'DALL-E 3 / Bing', 'Canva Magic Media'].map((platform, i) => (
                            <button
                                key={i}
                                onClick={() => handleCopy(generatedPrompt, i)}
                                disabled={!generatedPrompt}
                                className={`w-full py-3 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-between border group
                        ${generatedPrompt
                                        ? 'bg-white hover:bg-indigo-50 hover:border-indigo-200 text-slate-600 shadow-sm cursor-pointer'
                                        : 'bg-slate-100 text-slate-400 border-transparent cursor-not-allowed'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-indigo-600' : i === 1 ? 'bg-blue-500' : 'bg-teal-500'} opacity-80`}></div>
                                    {platform}
                                </span>
                                {copiedIndex === i ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualArchitectModal;
