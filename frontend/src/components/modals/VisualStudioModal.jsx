import React, { useState, useEffect } from 'react';
import { X, Wand2, Image as ImageIcon, Sparkles, Check, RefreshCw, Layers, AlertCircle } from 'lucide-react';

const VisualStudioModal = ({ isOpen, onClose, product }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [prompt, setPrompt] = useState("");

    // Initialize prompt from product data
    useEffect(() => {
        if (product?.visual_analysis?.advice_text) {
            setPrompt(`Professional product photography of ${product.title}, ${product.visual_analysis.advice_text}, 8k resolution, photorealistic.`);
        } else if (product) {
            setPrompt(`Professional product photography of ${product.title}, white background, studio lighting.`);
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate AI Delay
        setTimeout(() => {
            // Use listing_id or fallback to a random number if id is missing
            const seedBase = product.listing_id || product.id || Math.floor(Math.random() * 1000);
            setGeneratedImages([
                `https://source.unsplash.com/random/400x400?sig=${seedBase + 101}&product`,
                `https://source.unsplash.com/random/400x400?sig=${seedBase + 102}&product`,
                `https://source.unsplash.com/random/400x400?sig=${seedBase + 103}&product`,
                `https://source.unsplash.com/random/400x400?sig=${seedBase + 104}&product`,
            ]);
            setIsGenerating(false);
        }, 2500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dimmed Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Main Modal Window */}
            <div className="relative bg-white w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Wand2 size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">AI Görsel Stüdyosu</h2>
                            <p className="text-xs text-slate-500">Görsel LQS Puanı: <span className="font-bold text-indigo-600">{product.visual_score}/35</span></p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-slate-400">
                        <X size={24} />
                    </button>
                </div>

                {/* Content Grid */}
                <div className="flex-1 grid grid-cols-12 divide-x divide-gray-100 overflow-hidden">

                    {/* COL 1: CURRENT STATE (3 Cols) */}
                    <div className="col-span-3 p-6 bg-gray-50 flex flex-col gap-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <ImageIcon size={14} /> Mevcut Durum
                        </h3>
                        <div className="relative rounded-xl overflow-hidden border-2 border-red-100 shadow-sm group">
                            <img src={product.img} alt="Current" className="w-full aspect-square object-cover" />
                            <div className="absolute inset-0 bg-red-900/10 group-hover:bg-transparent transition-colors"></div>
                            <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded">ESKİ</div>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-red-100 shadow-sm">
                            <div className="text-[10px] font-bold text-red-500 mb-1 flex items-center gap-1"><AlertCircle size={12} /> Tespit Edilen Sorun</div>
                            <p className="text-xs text-slate-600 leading-snug">
                                {product.visual_analysis?.issue || "Görsel analizi bekleniyor."}
                            </p>
                        </div>
                    </div>

                    {/* COL 2: CONTROLS (5 Cols) */}
                    <div className="col-span-5 p-6 flex flex-col gap-6">
                        <div>
                            <label className="text-xs font-bold text-slate-700 uppercase mb-2 block flex items-center gap-2">
                                <Sparkles size={14} className="text-purple-500" /> AI Prompt
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full h-32 p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-gray-50 focus:bg-white transition-all text-slate-700"
                                placeholder="Describe the image you want..."
                            />
                            <p className="text-[10px] text-slate-400 mt-2 text-right">Önerilen Prompt (Düzenlenebilir)</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Işıklandırma</label>
                                <select className="w-full p-2 text-sm border border-gray-200 rounded-lg bg-white">
                                    <option>Studio Lighting (Soft)</option>
                                    <option>Natural Sunlight</option>
                                    <option>Moody / Dark</option>
                                    <option>Neon / Cyberpunk</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Arka Plan</label>
                                <select className="w-full p-2 text-sm border border-gray-200 rounded-lg bg-white">
                                    <option>Pure White</option>
                                    <option>Lifestyle (Living Room)</option>
                                    <option>Marble Texture</option>
                                    <option>Solid Color</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isGenerating ? (
                                    <>
                                        <RefreshCw size={20} className="animate-spin" /> Görseller Üretiliyor...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={20} /> 4 Varyasyon Üret
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* COL 3: RESULTS (4 Cols) */}
                    <div className="col-span-4 p-6 bg-gray-50 flex flex-col">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Layers size={14} /> Sonuçlar
                        </h3>

                        {generatedImages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-gray-200 rounded-xl">
                                <ImageIcon size={40} className="mb-2" />
                                <span className="text-xs">Henüz görsel üretilmedi</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {generatedImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === img ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="Gen" />
                                        {selectedImage === img && (
                                            <div className="absolute top-1 right-1 bg-indigo-500 text-white p-1 rounded-full shadow-sm">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {generatedImages.length > 0 && (
                            <div className="mt-auto">
                                <button
                                    disabled={!selectedImage}
                                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors"
                                >
                                    Seçileni Kaydet & Uygula
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VisualStudioModal;
