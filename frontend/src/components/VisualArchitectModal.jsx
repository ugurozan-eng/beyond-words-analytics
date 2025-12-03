import React, { useState } from 'react';
import { X, Wand2, Copy, Terminal, Sun, Palette, AlertTriangle, Zap, Lock } from 'lucide-react';

const VisualArchitectModal = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    const [style, setStyle] = useState('minimalist');
    const [lighting, setLighting] = useState('studio');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // --- LIMIT LOGIC ---
    const MAX_ATTEMPTS = 3;
    const [generationCount, setGenerationCount] = useState(0);
    const remainingCredits = MAX_ATTEMPTS - generationCount;

    // Mock Logic for Prompt Generation
    const handleGenerate = () => {
        if (generationCount >= MAX_ATTEMPTS) return;

        setIsGenerating(true);
        // Increment count immediately
        setGenerationCount(prev => prev + 1);

        setTimeout(() => {
            const prompt = `/imagine prompt: Professional product photography of ${product.title}, ${style} style, ${lighting} lighting, 8k resolution, photorealistic, cinematic composition, high detail texture --ar 4:3 --v 6.0`;
            setGeneratedPrompt(prompt);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-6xl h-[80vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden border border-slate-200">

                {/* COL 1: DIAGNOSIS (LEFT) */}
                <div className="w-1/4 bg-slate-50 border-r border-slate-200 p-6 flex flex-col">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Adım 1: Teşhis</h3>
                    <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-red-200 mb-4 shadow-sm group">
                        <img src={product.img} className="w-full h-full object-cover opacity-90" />
                        <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded shadow-sm">Mevcut Görsel</div>
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
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} className="text-slate-400" /></button>
                    </div>

                    <div className="space-y-6 max-w-lg mx-auto w-full">
                        {/* Style Selector */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Palette size={16} className="text-indigo-500" /> Estetik Stil Seçimi
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Minimalist', 'Bohemian', 'Luxury', 'Vintage'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStyle(s.toLowerCase())}
                                        className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${style === s.toLowerCase() ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Lighting Selector */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Sun size={16} className="text-amber-500" /> Işıklandırma
                            </label>
                            <div className="flex gap-3">
                                {['Studio', 'Natural', 'Warm', 'Dark'].map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLighting(l.toLowerCase())}
                                        className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${lighting === l.toLowerCase() ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200'}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 space-y-3">
                            <div className="flex justify-between items-center text-xs px-1">
                                <span className="font-bold text-slate-500">API Kredisi</span>
                                <span className={`${remainingCredits === 0 ? 'text-red-500' : 'text-indigo-600'} font-bold`}>{remainingCredits} / {MAX_ATTEMPTS} Hak Kaldı</span>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || remainingCredits === 0}
                                className={`w-full py-4 font-bold rounded-xl shadow-lg transform transition-all flex items-center justify-center gap-3 
                        ${remainingCredits === 0
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white hover:scale-[1.02] shadow-indigo-200'}`}
                            >
                                {isGenerating ? (
                                    <span className="animate-pulse">Analiz Ediliyor...</span>
                                ) : remainingCredits === 0 ? (
                                    <><Lock size={20} /> Limit Doldu</>
                                ) : (
                                    <><Wand2 size={20} /> Master Prompt Üret</>
                                )}
                            </button>
                            {remainingCredits === 0 && (
                                <p className="text-center text-[10px] text-red-500 font-medium">Günlük ücretsiz limitinize ulaştınız.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* COL 3: OUTPUT TERMINAL (RIGHT) - NEW COLOR: DEEP INDIGO/SLATE */}
                <div className="w-1/3 bg-[#1e1e2e] border-l border-slate-200 p-6 text-slate-300 flex flex-col relative overflow-hidden">
                    {/* Background Texture/Gradient to avoid pitch black */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2d2b42] to-[#1e1e2e] opacity-50"></div>
                    <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col h-full">
                        <h3 className="text-xs font-black text-indigo-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Terminal size={14} /> Çıktı Terminali
                        </h3>

                        {/* Terminal Box - Semi-transparent glass */}
                        <div className="flex-1 bg-black/20 rounded-xl border border-white/10 p-5 font-mono text-sm relative group shadow-inner">
                            {generatedPrompt ? (
                                <div className="animate-fadeIn">
                                    <p className="text-emerald-400 mb-2 text-xs opacity-70"># Success: Master Prompt Generated</p>
                                    <p className="text-slate-200 leading-relaxed break-words select-all">{generatedPrompt}</p>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                                    <Terminal size={32} className="mb-3" />
                                    <p className="text-xs text-center">Analiz bekleniyor...</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 space-y-3">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Platform Seç ve Kopyala</p>

                            {['Midjourney v6', 'DALL-E 3 / Bing', 'Canva Magic Media'].map((platform, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                                    disabled={!generatedPrompt}
                                    className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg font-bold text-xs transition-all flex items-center justify-between group"
                                >
                                    <span className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full transition-colors ${i === 0 ? 'bg-white group-hover:bg-indigo-400' : i === 1 ? 'bg-blue-500 group-hover:bg-blue-400' : 'bg-teal-500 group-hover:bg-teal-400'}`}></div>
                                        {platform}
                                    </span>
                                    <Copy size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualArchitectModal;
