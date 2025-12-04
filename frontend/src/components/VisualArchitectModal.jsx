import React, { useState, useEffect } from 'react';
import { X, Wand2, Copy, Terminal, Sun, Palette, AlertTriangle, Zap, Lock, Check, RefreshCw, Info, PenTool, Box, Type } from 'lucide-react';

const VisualArchitectModal = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    // --- STATE ---
    const [style, setStyle] = useState('minimalist');
    const [lighting, setLighting] = useState('studio');

    // New Advanced Inputs
    const [visualConcept, setVisualConcept] = useState('');
    const [includedObjects, setIncludedObjects] = useState('');
    const [brandName, setBrandName] = useState('Beyond Words Studio'); // Default based on user context
    const [signatureText, setSignatureText] = useState('© 2025 Beyond Words');

    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);

    // --- CREDIT LOGIC (PER PRODUCT) ---
    const MAX_ATTEMPTS = 3;
    const [generationCount, setGenerationCount] = useState(0);

    useEffect(() => {
        const storageKey = `cyclear_credits_${product.id}`;
        const savedCount = localStorage.getItem(storageKey);
        if (savedCount) {
            setGenerationCount(parseInt(savedCount, 10));
        } else {
            setGenerationCount(0);
        }
        setGeneratedPrompt('');
        // Reset inputs when product changes (optional)
        setVisualConcept('');
        setIncludedObjects('');
    }, [product.id]);

    const remainingCredits = Math.max(0, MAX_ATTEMPTS - generationCount);

    // --- ALGORITHM: VAP v2.0 (The LQS-35 Protocol) ---
    const generatePromptAlgorithm = () => {
        // 1. ANCHOR: Subject Cleaning
        const cleanTitle = product.title
            .replace(/download|printable|pdf|digital|editable|template|instant/gi, "")
            .substring(0, 60).trim();

        // 2. CONTEXT INJECTION (User Inputs)
        // Concept: Sets the scene
        const sceneContext = visualConcept
            ? `, featuring a scene of ${visualConcept}`
            : ', set in a professional commercial environment';

        // Objects: Adds props
        const propsContext = includedObjects
            ? `, styled with props such as ${includedObjects}`
            : '';

        // Brand: Adds vibe
        const brandContext = brandName
            ? `, in the aesthetic style of ${brandName}`
            : '';

        // Signature: Request text (Note: AI struggles with text, but we ask for it)
        const sigContext = signatureText
            ? `, with small watermark text "${signatureText}" in the corner`
            : '';

        // 3. STYLE & LIGHTING MAPS
        const styles = {
            minimalist: "minimalist aesthetic, clean lines, scandinavian style, white space, less is more",
            bohemian: "boho chic style, warm earth tones, organic textures, pampas grass elements, cozy atmosphere",
            luxury: "high-end luxury aesthetic, gold accents, marble textures, premium editorial look, sophisticated",
            vintage: "retro vintage vibes, nostalgic grain, analog film photography style, 90s aesthetic"
        };

        const lights = {
            studio: "softbox studio lighting, even illumination, professional product photography, neutral shadows",
            natural: "golden hour sunlight, soft window light, natural shadows, sun flare overlay",
            warm: "warm ambient lighting, tungsten light temperature, cozy home feel",
            dark: "moody dark lighting, cinematic contrast, rim lighting, low key photography"
        };

        // 4. LQS GUARANTEE INJECTORS (Texture + Simplicity + Tech)
        const lqsInjectors = "highly detailed material texture, 8k resolution, photorealistic, sharp focus, centered composition, decluttered background, award winning photography";
        const parameters = "--ar 4:3 --v 6.0 --style raw --q 2";

        // 5. ASSEMBLY
        return `/imagine prompt: Professional product photography of ${cleanTitle}${sceneContext}${propsContext}${brandContext}, ${styles[style]}, ${lights[lighting]}, ${sigContext}, ${lqsInjectors} ${parameters}`;
    };

    const handleGenerate = () => {
        if (generationCount >= MAX_ATTEMPTS) return;

        setIsGenerating(true);
        const newCount = generationCount + 1;
        setGenerationCount(newCount);
        localStorage.setItem(`cyclear_credits_${product.id}`, newCount);

        setTimeout(() => {
            const finalPrompt = generatePromptAlgorithm();
            setGeneratedPrompt(finalPrompt);
            setIsGenerating(false);
        }, 1500);
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/40 backdrop-blur-md p-4 animate-fadeIn transition-all duration-300">

            <div className="w-full max-w-7xl h-[90vh] bg-white rounded-2xl shadow-2xl flex overflow-hidden border border-white/50 ring-1 ring-black/5">

                {/* COL 1: DIAGNOSIS (LEFT) */}
                <div className="w-[280px] bg-white border-r border-slate-100 p-6 flex flex-col flex-shrink-0 overflow-y-auto">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Adım 1: Teşhis</h3>
                    <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-red-100 mb-4 shadow-sm group">
                        <img src={product.img} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-white/90 text-red-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-red-100">Mevcut Görsel</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-4">
                        <div className="flex items-center gap-2 mb-2 text-red-700 font-bold text-sm">
                            <AlertTriangle size={16} />
                            <span>Tespit Edilen Sorun</span>
                        </div>
                        <p className="text-xs text-red-600/80 leading-relaxed">
                            {product.visual_analysis?.issue || "Görsel düşük çözünürlüklü ve karanlık."}
                        </p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-sm">
                            <Zap size={16} />
                            <span>LQS Hedefi</span>
                        </div>
                        <p className="text-xs text-indigo-800/80 leading-relaxed">
                            Visual Architect, bu sorunu çözmek için <b>LQS 35/35</b> uyumlu "Golden Prompt" üretecektir.
                        </p>
                    </div>
                </div>

                {/* COL 2: ENGINE ROOM (CENTER) - SCROLLABLE */}
                <div className="flex-1 flex flex-col relative bg-white min-w-0">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white z-10">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Visual Architect</h2>
                            <p className="text-slate-500 text-sm">Yapay Zeka Prompt Mimarı v2.0</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={24} className="text-slate-400" /></button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8">

                        {/* INFO BOX */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                            <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
                            <p className="text-xs text-blue-800 leading-relaxed">
                                Aşağıdaki ek bilgi alanları AI'a görsel prompt üretmek için ek bilgi sağlayan alanlardır. Hiçbir şey girmeseniz bile AI ürününüzün Etsy'den aldığı veriler ile yüksek kalite bir Prompt üretecektir.
                            </p>
                        </div>

                        {/* 1. VISUAL CONTEXT INPUTS */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2"><PenTool size={16} className="text-indigo-500" /> Görsel Kurgusu</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Brand */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500">Marka Adı (Opsiyonel)</label>
                                    <input
                                        type="text"
                                        value={brandName}
                                        onChange={(e) => setBrandName(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="Örn: Beyond Words Studio"
                                    />
                                </div>
                                {/* Signature */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500">İmza / Telif Metni (Opsiyonel)</label>
                                    <div className="relative">
                                        <Type size={14} className="absolute left-3 top-3 text-slate-400" />
                                        <input
                                            type="text"
                                            value={signatureText}
                                            onChange={(e) => setSignatureText(e.target.value)}
                                            className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                            placeholder="Örn: © 2025 BW Studio"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Visual Concept */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500">1. Görsel Fikri (Ne Olsun?)</label>
                                <textarea
                                    value={visualConcept}
                                    onChange={(e) => setVisualConcept(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-20"
                                    placeholder="Örn: Minimalist bir yatak odasında, duvara asılı çerçeveli tablo. Sabah ışığı vuruyor."
                                />
                            </div>

                            {/* Objects */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500">2. Objeler (Sahnede Neler Olsun?)</label>
                                <div className="relative">
                                    <Box size={14} className="absolute left-3 top-3 text-slate-400" />
                                    <input
                                        type="text"
                                        value={includedObjects}
                                        onChange={(e) => setIncludedObjects(e.target.value)}
                                        className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="Örn: Vazo, kuru çiçekler, kahve fincanı, kitap (Virgülle ayırın)"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* 2. STYLE & LIGHTING */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Palette size={16} className="text-indigo-600" /> Estetik Stil
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {['Minimalist', 'Bohemian', 'Luxury', 'Vintage'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setStyle(s.toLowerCase())}
                                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left flex items-center justify-between ${style === s.toLowerCase() ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {s}
                                            {style === s.toLowerCase() && <Check size={12} className="text-indigo-600" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Sun size={16} className="text-amber-500" /> Işıklandırma
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {['Studio', 'Natural', 'Warm', 'Dark'].map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => setLighting(l.toLowerCase())}
                                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left flex items-center justify-between ${lighting === l.toLowerCase() ? 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-500' : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {l}
                                            {lighting === l.toLowerCase() && <Check size={12} className="text-amber-600" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Footer Button */}
                    <div className="p-6 border-t border-slate-100 bg-white z-10 mt-auto">
                        <div className="flex justify-between items-center text-xs px-1 mb-2">
                            <span className="font-bold text-slate-400 uppercase tracking-wider">Kalan Hak</span>
                            <span className={`${remainingCredits === 0 ? 'text-red-500' : 'text-indigo-600'} font-black bg-slate-50 px-2 py-1 rounded`}>{remainingCredits} / {MAX_ATTEMPTS}</span>
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
                                <span className="animate-pulse flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mimar Çalışıyor...</span>
                            ) : remainingCredits === 0 ? (
                                <><Lock size={20} /> Limit Doldu</>
                            ) : (
                                <><Wand2 size={20} /> Master Prompt Oluştur</>
                            )}
                        </button>
                    </div>
                </div>

                {/* COL 3: OUTPUT TERMINAL (RIGHT) */}
                <div className="w-[350px] bg-slate-50 border-l border-slate-200 p-6 flex flex-col relative shrink-0">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Terminal size={14} /> Çıktı Terminali
                    </h3>

                    {/* Light Theme Terminal Box */}
                    <div className="flex-1 bg-white rounded-xl border border-slate-200 p-5 font-mono text-sm relative group shadow-sm overflow-y-auto">
                        {generatedPrompt ? (
                            <div className="animate-fadeIn">
                                <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-green-600 text-xs font-bold">VAP v2.0 Generated</span>
                                </div>
                                <p className="text-slate-600 leading-relaxed break-words select-all whitespace-pre-wrap">{generatedPrompt}</p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400/60">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <Terminal size={24} className="text-slate-300" />
                                </div>
                                <p className="text-xs text-center font-medium max-w-[150px]">Soldaki bilgileri doldurun ve butona basın.</p>
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
