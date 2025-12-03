import React, { useState, useEffect } from 'react';
import { X, Wand2, Image as ImageIcon, Sparkles, Check, RefreshCw, Layers, AlertCircle, Settings, Aperture, Box } from 'lucide-react';

const VisualStudioModal = ({ isOpen, onClose, product }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    // Prompt & Settings State
    const [prompt, setPrompt] = useState("");
    const [lighting, setLighting] = useState("Studio Lighting");
    const [background, setBackground] = useState("Neutral / Clean");

    // Initialize clean prompt (No Turkish text)
    useEffect(() => {
        if (product) {
            // CLEAN PROMPT FORMULA: Title + Base Quality Keywords
            const basePrompt = `Professional product photography of ${product.title}, center composition, high detailed texture, 8k resolution, photorealistic, cinematic lighting.`;
            setPrompt(basePrompt);
        }
    }, [product]);

    // Update prompt when settings change (Optional smart feature)
    useEffect(() => {
        if (product && prompt) {
            // Simple logic to append style if not present (simplified for UX)
            // In a real app, we might regenerate the whole string.
            // For now, we keep the user's edits but ensure base logic is sound.
        }
    }, [lighting, background]);

    if (!isOpen || !product) return null;

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate AI Generation Lag
        setTimeout(() => {
            setGeneratedImages([
                `https://source.unsplash.com/random/500x500?sig=${product.id + 201}&minimal`,
                `https://source.unsplash.com/random/500x500?sig=${product.id + 202}&studio`,
                `https://source.unsplash.com/random/500x500?sig=${product.id + 203}&light`,
                `https://source.unsplash.com/random/500x500?sig=${product.id + 204}&art`,
            ]);
            setIsGenerating(false);
        }, 2500);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Dark Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Main Modal Window */}
            <div className="relative bg-white w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
                            <Wand2 size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">AI Görsel Stüdyosu</h2>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>Hedef: LQS Puanını Yükseltmek</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-indigo-600 font-bold">Mevcut Puan: {product.visual_score}/35</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                {/* 3-COLUMN WORKSTATION */}
                <div className="flex-1 grid grid-cols-12 divide-x divide-gray-100 overflow-hidden">

                    {/* COL 1: DIAGNOSIS (Left) - Span 3 */}
                    <div className="col-span-3 p-6 bg-slate-50/50 flex flex-col gap-6 overflow-y-auto">

                        {/* Current Image Card */}
                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <ImageIcon size={14} /> Mevcut Görsel
                            </h3>
                            <div className="relative rounded-xl overflow-hidden border-2 border-red-200 shadow-sm group">
                                <img src={product.img} alt="Current" className="w-full aspect-square object-cover" />
                                <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded border border-red-200">ESKİ</div>
                            </div>
                        </div>

                        {/* The Diagnosis */}
                        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                            <div className="text-xs font-bold text-red-600 mb-2 flex items-center gap-2">
                                <AlertCircle size={14} /> Tespit Edilen Sorun
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                "{product.visual_analysis?.issue || "Görsel çok karanlık ve ürün net seçilmiyor."}"
                            </p>
                        </div>

                        {/* The Goal */}
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm mt-auto">
                            <div className="text-xs font-bold text-indigo-700 mb-2 flex items-center gap-2">
                                <Check size={14} /> Hedeflenen Standart
                            </div>
                            <p className="text-[10px] text-indigo-900 leading-relaxed">
                                Etsy algoritması için aydınlık, net odaklı ve yaşam alanı (lifestyle) hissi veren bir görsel üretilecek.
                            </p>
                        </div>
                    </div>

                    {/* COL 2: CONTROLS (Center) - Span 5 */}
                    <div className="col-span-5 p-8 flex flex-col gap-6 bg-white relative">

                        {/* Prompt Editor */}
                        <div className="flex-1">
                            <div className="flex justify-between items-end mb-3">
                                <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <Sparkles size={16} className="text-purple-500" /> AI Prompt Editörü
                                </label>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">ENGLISH ONLY</span>
                            </div>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full h-48 p-4 text-sm font-medium text-slate-700 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none resize-none transition-all leading-relaxed"
                                placeholder="Professional product photography..."
                            />
                            <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                                <Settings size={12} /> AI, ürün başlığına göre bu promptu otomatik oluşturdu.
                            </p>
                        </div>

                        {/* Fine Tuning Dropdowns */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Işıklandırma</label>
                                <div className="relative">
                                    <select
                                        value={lighting}
                                        onChange={(e) => setLighting(e.target.value)}
                                        className="w-full p-3 text-sm font-bold text-slate-700 border-2 border-gray-100 rounded-xl bg-gray-50 hover:bg-white appearance-none cursor-pointer focus:border-indigo-500 focus:outline-none transition-colors"
                                    >
                                        <option>Studio Lighting</option>
                                        <option>Natural Sunlight</option>
                                        <option>Cinematic / Moody</option>
                                        <option>Softbox</option>
                                    </select>
                                    <Aperture size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Arka Plan (Background)</label>
                                <div className="relative">
                                    <select
                                        value={background}
                                        onChange={(e) => setBackground(e.target.value)}
                                        className="w-full p-3 text-sm font-bold text-slate-700 border-2 border-gray-100 rounded-xl bg-gray-50 hover:bg-white appearance-none cursor-pointer focus:border-indigo-500 focus:outline-none transition-colors"
                                    >
                                        <option>Neutral / Clean</option>
                                        <option>Lifestyle / Home</option>
                                        <option>Marble Texture</option>
                                        <option>Solid Color</option>
                                    </select>
                                    <Box size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* THE BIG BUTTON */}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-200 transition-all transform active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw size={24} className="animate-spin" /> Sihir İşleniyor...
                                </>
                            ) : (
                                <>
                                    <Wand2 size={24} /> 4 Yeni Varyasyon Üret
                                </>
                            )}
                        </button>
                    </div>

                    {/* COL 3: RESULTS (Right) - Span 4 */}
                    <div className="col-span-4 p-6 bg-slate-50 flex flex-col border-l border-gray-100">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Layers size={14} /> Sonuçlar (Varyasyonlar)
                        </h3>

                        {generatedImages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-gray-200 rounded-2xl">
                                <div className="p-4 bg-slate-100 rounded-full mb-3"><ImageIcon size={32} /></div>
                                <span className="text-sm font-medium">Henüz görsel üretilmedi</span>
                                <span className="text-xs text-slate-400 mt-1">Promptu düzenleyip butona basın.</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 mb-4 overflow-y-auto max-h-[500px] pr-2">
                                {generatedImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-4 transition-all group ${selectedImage === img ? 'border-indigo-600 ring-4 ring-indigo-100' : 'border-transparent hover:border-indigo-200'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="Gen" />
                                        {selectedImage === img && (
                                            <div className="absolute inset-0 bg-indigo-900/20 flex items-center justify-center">
                                                <div className="bg-indigo-600 text-white p-2 rounded-full shadow-lg transform scale-110">
                                                    <Check size={20} strokeWidth={3} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-auto pt-4 border-t border-gray-200">
                            <button
                                disabled={!selectedImage}
                                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2"
                            >
                                <Check size={18} /> Seçileni Etsy'ye Gönder
                            </button>
                            <p className="text-[10px] text-center text-slate-400 mt-3">
                                Seçilen görsel otomatik olarak Etsy taslağına eklenecektir.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VisualStudioModal;
