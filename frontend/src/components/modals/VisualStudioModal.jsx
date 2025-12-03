import React, { useState, useEffect } from 'react';
import { X, Wand2, Image as ImageIcon, Sparkles, Copy, Layers, AlertCircle, Settings, Terminal, Check } from 'lucide-react';

const VisualStudioModal = ({ isOpen, onClose, product }) => {
    const [prompt, setPrompt] = useState("");
    const [lighting, setLighting] = useState("Studio Lighting");
    const [background, setBackground] = useState("Neutral / Clean");
    const [composition, setComposition] = useState("Minimalist");
    const [copiedType, setCopiedType] = useState(null);

    // Initialize base prompt
    useEffect(() => {
        if (product) {
            updatePrompt();
        }
    }, [product, lighting, background, composition]);

    const updatePrompt = () => {
        if (!product) return;
        const base = `Professional product photography of ${product.title}`;
        const details = `lighting: ${lighting}, background: ${background}, composition: ${composition}`;
        const quality = `8k resolution, photorealistic, highly detailed texture, cinematic`;
        setPrompt(`${base}. ${details}. ${quality}.`);
    };

    const handleCopy = (type, suffix = "") => {
        const textToCopy = type === 'midjourney'
            ? `/imagine prompt: ${prompt} ${suffix}`
            : prompt;

        navigator.clipboard.writeText(textToCopy);
        setCopiedType(type);
        setTimeout(() => setCopiedType(null), 2000);
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative bg-white w-full max-w-6xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
                            <Wand2 size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">AI Görsel Mimarı</h2>
                            <p className="text-xs text-slate-500">Maliyet yok, Yüksek Teknoloji Prompt Üretimi</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                {/* 3-COLUMN WORKSTATION */}
                <div className="flex-1 grid grid-cols-12 divide-x divide-gray-100 overflow-hidden">

                    {/* COL 1: DIAGNOSIS (Span 3) */}
                    <div className="col-span-3 p-6 bg-slate-50/50 flex flex-col gap-6 overflow-y-auto">
                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <ImageIcon size={14} /> Mevcut Görsel
                            </h3>
                            <div className="relative rounded-xl overflow-hidden border-2 border-red-200 shadow-sm">
                                <img src={product.img} alt="Current" className="w-full aspect-square object-cover" />
                                <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded border border-red-200">LQS: {product.visual_score}</div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                            <div className="text-xs font-bold text-red-600 mb-2 flex items-center gap-2">
                                <AlertCircle size={14} /> Sorun Analizi
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                "{product.visual_analysis?.issue || "Görselde ışık ve kompozisyon eksikliği var."}"
                            </p>
                        </div>
                    </div>

                    {/* COL 2: ARCHITECT CONTROLS (Span 4) */}
                    <div className="col-span-4 p-8 flex flex-col gap-6 bg-white">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Settings size={14} /> Prompt Ayarları
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-2">Işıklandırma</label>
                                <select value={lighting} onChange={(e) => setLighting(e.target.value)} className="w-full p-3 text-sm border-2 border-gray-100 rounded-xl bg-gray-50 focus:border-indigo-500 outline-none">
                                    <option>Studio Lighting (Soft)</option>
                                    <option>Natural Sunlight (Warm)</option>
                                    <option>Cinematic (Dramatic)</option>
                                    <option>Neon / Cyberpunk</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-2">Arka Plan</label>
                                <select value={background} onChange={(e) => setBackground(e.target.value)} className="w-full p-3 text-sm border-2 border-gray-100 rounded-xl bg-gray-50 focus:border-indigo-500 outline-none">
                                    <option>Neutral / Clean White</option>
                                    <option>Lifestyle / Living Room</option>
                                    <option>Marble Texture</option>
                                    <option>Solid Pastel Color</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-2">Kompozisyon</label>
                                <select value={composition} onChange={(e) => setComposition(e.target.value)} className="w-full p-3 text-sm border-2 border-gray-100 rounded-xl bg-gray-50 focus:border-indigo-500 outline-none">
                                    <option>Minimalist Center</option>
                                    <option>Flat Lay (Top View)</option>
                                    <option>Close-up Detail</option>
                                    <option>Rule of Thirds</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-auto bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                            <p className="text-[10px] text-indigo-800 leading-relaxed">
                                <span className="font-bold">Nasıl Çalışır?</span> Ayarları değiştirdiğinizde yandaki "Master Prompt" otomatik olarak en iyi Etsy standartlarına göre güncellenir.
                            </p>
                        </div>
                    </div>

                    {/* COL 3: MASTER PROMPT TERMINAL (Span 5) */}
                    <div className="col-span-5 p-8 bg-slate-900 flex flex-col gap-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-indigo-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

                        <div>
                            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Terminal size={14} /> Master Prompt Çıktısı
                            </h3>
                            <div className="w-full h-48 p-4 font-mono text-sm text-indigo-50 bg-slate-800/50 border border-slate-700 rounded-xl overflow-y-auto leading-relaxed shadow-inner">
                                {prompt}
                            </div>
                        </div>

                        <div className="space-y-3 mt-auto relative z-10">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Platform Seç ve Kopyala</p>

                            <button
                                onClick={() => handleCopy('midjourney', '--ar 4:3 --v 6.0')}
                                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl flex items-center justify-between group transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-white text-black font-black flex items-center justify-center text-[10px]">MJ</div>
                                    <span className="text-sm font-bold text-white">Midjourney</span>
                                </div>
                                {copiedType === 'midjourney' ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-slate-400 group-hover:text-white" />}
                            </button>

                            <button
                                onClick={() => handleCopy('dalle')}
                                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl flex items-center justify-between group transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black flex items-center justify-center text-[10px]">D</div>
                                    <span className="text-sm font-bold text-white">DALL-E 3 / Bing</span>
                                </div>
                                {copiedType === 'dalle' ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-slate-400 group-hover:text-white" />}
                            </button>

                            <button
                                onClick={() => handleCopy('canva')}
                                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl flex items-center justify-between group transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 text-white font-black flex items-center justify-center text-[10px]">C</div>
                                    <span className="text-sm font-bold text-white">Canva Magic Media</span>
                                </div>
                                {copiedType === 'canva' ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-slate-400 group-hover:text-white" />}
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default VisualStudioModal;
