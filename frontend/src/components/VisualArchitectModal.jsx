import React, { useState } from 'react';
import { X, Wand2, Copy, Terminal, Sun, Palette, Layout, CheckCircle, AlertTriangle } from 'lucide-react';

const VisualArchitectModal = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    const [style, setStyle] = useState('minimalist');
    const [lighting, setLighting] = useState('studio');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock Logic for Prompt Generation
    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            // Simple logic to construct a prompt
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
                        <div className="absolute inset-0 bg-red-500/10 group-hover:bg-transparent transition-colors"></div>
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

                        <div className="pt-6">
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                            >
                                {isGenerating ? <span className="animate-pulse">Analiz Ediliyor...</span> : <><Wand2 size={20} /> Master Prompt Üret</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* COL 3: OUTPUT TERMINAL (RIGHT) - LIGHT THEME UPDATE */}
                <div className="w-1/3 bg-slate-50 border-l border-slate-200 p-6 flex flex-col relative overflow-hidden">

                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Terminal size={14} className="text-indigo-500" /> Çıktı Terminali
                    </h3>

                    {/* Terminal Box - Dark Code Block Style */}
                    <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 p-5 font-mono text-sm relative group shadow-lg overflow-y-auto custom-scrollbar">
                        {generatedPrompt ? (
                            <div className="animate-fadeIn">
                                <p className="text-emerald-400 mb-2 text-xs opacity-70"># Success: Master Prompt Generated</p>
                                <p className="text-slate-200 leading-relaxed break-words select-all">{generatedPrompt}</p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-60">
                                <Terminal size={32} className="mb-3 text-slate-700" />
                                <p className="text-xs text-center text-slate-500">Analiz bekleniyor...</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Platform Seç ve Kopyala</p>

                        <button
                            onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                            disabled={!generatedPrompt}
                            className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-xs transition-all flex items-center justify-between group shadow-sm"
                        >
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-800 group-hover:bg-indigo-600 transition-colors"></div> Midjourney v6</span>
                            <Copy size={14} className="text-slate-400 group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>

                        <button
                            onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                            disabled={!generatedPrompt}
                            className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-xs transition-all flex items-center justify-between group shadow-sm"
                        >
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 group-hover:bg-blue-400 transition-colors"></div> DALL-E 3 / Bing</span>
                            <Copy size={14} className="text-slate-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>

                        <button
                            onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                            disabled={!generatedPrompt}
                            className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-xs transition-all flex items-center justify-between group shadow-sm"
                        >
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-500 group-hover:bg-teal-400 transition-colors"></div> Canva Magic Media</span>
                            <Copy size={14} className="text-slate-400 group-hover:text-teal-600 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualArchitectModal;
