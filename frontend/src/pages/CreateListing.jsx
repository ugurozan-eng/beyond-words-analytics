import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Wand2, Upload, Sparkles, Copy, Check, Image as ImageIcon, Palette, Layout, Monitor, Printer, Frame, Shirt, X, Camera } from 'lucide-react';

const CreateListing = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'prompt'
    const [description, setDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedData, setGeneratedData] = useState(null);
    const [copiedField, setCopiedField] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    // AI Studio State
    const [isPromptGenerating, setIsPromptGenerating] = useState(false);
    const [generatedPrompts, setGeneratedPrompts] = useState(null);

    // Prompt Generation Options (Left Panel)
    const [promptOptions, setPromptOptions] = useState({
        imageType: 'mockup', // mockup, design
        productFormat: 'digital', // digital, print, wall_art, apparel
        platform: 'etsy',
        style: 'boho' // boho, minimalist, professional, rustic, modern
    });

    // Validation
    const isDescriptionValid = description.trim().length >= 20;

    const handleGenerate = async () => {
        if (!isDescriptionValid && !imagePreview) return;

        setIsGenerating(true);
        setGeneratedData(null);
        setGeneratedPrompts(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/generate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: description })
            });

            if (!response.ok) {
                throw new Error(t('create_listing.generation_failed'));
            }

            const data = await response.json();

            // Transform API response to match component state structure
            const transformedData = {
                title: data.seo_title,
                tags: data.tags,
                description: data.description,
                price: {
                    min: data.price_info?.min || 0,
                    max: data.price_info?.max || 0,
                    recommended: data.price_info?.suggested || 0,
                    currency: data.price_info?.currency || '$'
                }
            };

            setGeneratedData(transformedData);

            // Set the image prompts if available
            if (data.image_prompt) {
                const prompts = [];
                if (data.image_prompt.image_prompt_a) prompts.push(data.image_prompt.image_prompt_a);
                if (data.image_prompt.image_prompt_b) prompts.push(data.image_prompt.image_prompt_b);
                setGeneratedPrompts(prompts);
            }

        } catch (error) {
            console.error("Generation error:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGeneratePrompts = () => {
        setIsPromptGenerating(true);
        setTimeout(() => {
            setGeneratedPrompts([
                `High-quality photography of ${description}, soft lighting, 4k, studio shot, highly detailed, professional composition`,
                `Lifestyle mockup of ${description} on a wooden desk, cozy atmosphere, aesthetic, natural sunlight, warm tones, photorealistic`
            ]);
            setIsPromptGenerating(false);
        }, 1500);
    };

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const removeImage = (e) => {
        e.stopPropagation();
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6 p-6 animate-fade-in">
            {/* LEFT PANEL: INPUT */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col h-full overflow-y-auto">
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-gray-800 flex items-center mb-2">
                        <Wand2 className="w-6 h-6 mr-3 text-indigo-600" />
                        {t('create_listing.define_product_idea')}
                    </h2>
                    <p className="text-gray-500">{t('create_listing.ai_description')}</p>
                </div>

                {/* TABS */}
                <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center transition-all ${activeTab === 'upload'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        {t('create_listing.have_image')}
                    </button>
                    <button
                        onClick={() => setActiveTab('prompt')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center transition-all ${activeTab === 'prompt'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Palette className="w-4 h-4 mr-2" />
                        {t('create_listing.create_image_prompt')}
                    </button>
                </div>

                {/* TAB CONTENT */}
                {activeTab === 'upload' ? (
                    /* UPLOAD MODE */
                    <div className="mb-8 animate-fade-in">
                        <label className="block text-sm font-bold text-gray-700 mb-3">{t('create_listing.product_image_optional')}</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                        />

                        {imagePreview ? (
                            <div className="relative rounded-xl overflow-hidden border border-gray-200 group h-64 bg-gray-50 flex items-center justify-center">
                                <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-full shadow-sm backdrop-blur-sm transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                            </div>
                        ) : (
                            <div
                                onClick={triggerFileInput}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-indigo-300 transition-all cursor-pointer group h-64"
                            >
                                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8 text-indigo-500" />
                                </div>
                                <p className="font-bold text-gray-600">{t('create_listing.drag_drop_image')}</p>
                                <p className="text-xs text-gray-400 mt-1">{t('create_listing.click_to_select')}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* PROMPT GENERATION MODE */
                    <div className="mb-8 grid grid-cols-2 gap-4 animate-fade-in">
                        {/* Image Type */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('create_listing.image_type')}</label>
                            <select
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
                                value={promptOptions.imageType}
                                onChange={(e) => setPromptOptions({ ...promptOptions, imageType: e.target.value })}
                            >
                                <option value="mockup">{t('create_listing.listing_image_mockup')}</option>
                                <option value="design">{t('create_listing.product_design')}</option>
                            </select>
                        </div>

                        {/* Product Format */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('create_listing.product_format')}</label>
                            <select
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
                                value={promptOptions.productFormat}
                                onChange={(e) => setPromptOptions({ ...promptOptions, productFormat: e.target.value })}
                            >
                                <option value="digital">{t('create_listing.digital_format')}</option>
                                <option value="print">{t('create_listing.print_format')}</option>
                                <option value="wall_art">{t('create_listing.wall_art_format')}</option>
                                <option value="apparel">{t('create_listing.apparel_format')}</option>
                            </select>
                        </div>

                        {/* Platform */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('create_listing.platform_size')}</label>
                            <select
                                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 cursor-not-allowed outline-none"
                                disabled
                                value={promptOptions.platform}
                            >
                                <option value="etsy">{t('create_listing.etsy_listing_size')}</option>
                            </select>
                        </div>

                        {/* Style */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('create_listing.style')}</label>
                            <select
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
                                value={promptOptions.style}
                                onChange={(e) => setPromptOptions({ ...promptOptions, style: e.target.value })}
                            >
                                <option value="boho">{t('create_listing.style_boho')}</option>
                                <option value="minimalist">{t('create_listing.style_minimalist')}</option>
                                <option value="professional">{t('create_listing.style_professional')}</option>
                                <option value="rustic">{t('create_listing.style_rustic')}</option>
                                <option value="modern">{t('create_listing.style_modern')}</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Description Input */}
                <div className="flex-1 flex flex-col mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-bold text-gray-700">{t('create_listing.product_description')}</label>
                        <span className={`text-xs font-bold ${description.length >= 20 ? 'text-emerald-500' : 'text-gray-400'}`}>
                            {description.length} / 20 min
                        </span>
                    </div>
                    <textarea
                        className={`w-full flex-1 p-4 bg-gray-50 border rounded-xl focus:ring-2 outline-none resize-none transition-all text-gray-700 ${!isDescriptionValid && description.length > 0
                            ? 'border-red-300 focus:ring-red-100'
                            : 'border-gray-200 focus:ring-indigo-100'
                            }`}
                        placeholder={t('create_listing.description_placeholder')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || (!isDescriptionValid && !imagePreview)}
                        className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center transition-all shadow-lg ${isGenerating || (!isDescriptionValid && !imagePreview)
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-indigo-200 hover:scale-[1.02]'
                            }`}
                    >
                        {isGenerating ? (
                            <>
                                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                                {t('create_listing.magic_happening')}
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5 mr-2" />
                                {t('create_listing.start_wizard')}
                            </>
                        )}
                    </button>

                    {!isDescriptionValid && !imagePreview && (
                        <p className="text-center text-xs text-red-500 font-medium animate-pulse">
                            {t('create_listing.validation_error')}
                        </p>
                    )}
                </div>
            </div>

            {/* RIGHT PANEL: OUTPUT */}
            <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 p-8 flex flex-col h-full overflow-y-auto relative">
                {!generatedData ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-50">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <Sparkles className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400">{t('create_listing.results_placeholder_title')}</h3>
                        <p className="text-gray-400 mt-2 max-w-xs">{t('create_listing.results_placeholder_desc')}</p>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in-up pb-8">

                        {/* SEO Title */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 group relative">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{t('create_listing.seo_title')}</h3>
                                <button onClick={() => copyToClipboard(generatedData.title, 'title')} className="text-gray-400 hover:text-indigo-600 transition-colors">
                                    {copiedField === 'title' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="font-bold text-gray-800 leading-relaxed">{generatedData.title}</p>
                        </div>

                        {/* Tags */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{t('create_listing.golden_tags')}</h3>

                            </div>
                            <div className="flex flex-wrap gap-2">
                                {generatedData.tags.map((tag, i) => (
                                    <div key={i} className="group flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-700 rounded-full text-xs font-bold border border-gray-200 hover:border-indigo-200 transition-all cursor-default">
                                        <span>{tag}</span>
                                        <button
                                            onClick={() => copyToClipboard(tag, `tag-${i}`)}
                                            className="text-gray-400 hover:text-indigo-600 transition-colors p-0.5 rounded-full hover:bg-indigo-100"
                                            title={t('common.copy')}
                                        >
                                            {copiedField === `tag-${i}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{t('create_listing.description')}</h3>
                                <button onClick={() => copyToClipboard(generatedData.description, 'desc')} className="text-gray-400 hover:text-indigo-600 transition-colors">
                                    {copiedField === 'desc' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{generatedData.description}</p>
                        </div>

                        {/* Price */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4">{t('create_listing.price_suggestion')}</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-end">
                                    <span className="text-5xl font-black text-gray-900 tracking-tight">${generatedData.price.recommended}</span>
                                    <span className="text-sm font-bold text-gray-400 mb-2 ml-2">{t('create_listing.suggested')}</span>
                                </div>

                                <div className="w-fit">
                                    <span className="text-xs font-bold text-gray-400 uppercase mb-1.5 block">{t('create_listing.market_range')}</span>
                                    <div className="w-auto min-w-[120px] px-4 py-2 border border-gray-300 rounded text-center font-medium bg-white">
                                        <span className="text-lg font-bold text-gray-700 tracking-tight">${generatedData.price.min} - ${generatedData.price.max}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                            <div className="bg-yellow-100 p-1.5 rounded-full mt-0.5">
                                <span className="text-yellow-600 text-xs font-bold">i</span>
                            </div>
                            <p className="text-xs text-yellow-700 leading-relaxed">
                                <span className="font-bold">{t('create_listing.disclaimer_title')}</span> {t('create_listing.disclaimer_text')}
                            </p>
                        </div>

                        {/* RAKİP ANALİZİ KARTLARI */}
                        {/* RAKİP ANALİZİ KARTLARI (ALWAYS VISIBLE) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                📊 {t('create_listing.top_competitors')} <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{t('create_listing.ai_simulation')}</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {((generatedData.competitors && generatedData.competitors.length > 0) ? generatedData.competitors : [
                                    { shop_name: "TrendSetter", title: "Similar Aesthetic Product Example", price: "$12.50", sales_estimate: "High Demand", tags: ["trend", "bestseller"] },
                                    { shop_name: "MarketLeader", title: "Top Ranking Competitor Item", price: "$15.00", sales_estimate: "200+ sales/mo", tags: ["popular", "gift"] },
                                    { shop_name: "NicheFind", title: "Alternative Style Option", price: "$9.99", sales_estimate: "Rising Star", tags: ["unique", "niche"] }
                                ]).map((comp, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-indigo-600 uppercase">{comp.shop_name}</span>
                                            <span className="text-[10px] text-green-700 bg-green-100 px-1.5 py-0.5 rounded">{comp.sales_estimate}</span>
                                        </div>
                                        <h4 className="font-medium text-gray-800 text-sm mb-2 line-clamp-1">{comp.title}</h4>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="font-bold text-gray-900">{comp.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI IMAGE STUDIO CARD */}
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-xl shadow-lg border border-indigo-500/30 text-white relative overflow-hidden">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center">
                                    <Camera className="w-4 h-4 mr-2 text-indigo-300" /> {t('create_listing.ai_image_studio')}
                                </h3>
                                <span className="text-[10px] bg-white/10 text-indigo-100 px-2 py-1 rounded border border-white/20 backdrop-blur-sm">{t('create_listing.beta')}</span>
                            </div>

                            <div className="flex gap-3 mb-6 relative z-10">
                                <select className="flex-1 bg-white/10 border border-white/20 text-white text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent backdrop-blur-sm transition-all hover:bg-white/20">
                                    <option className="text-gray-900">{t('create_listing.etsy_sales_image')}</option>
                                </select>
                                <button
                                    onClick={handleGeneratePrompts}
                                    disabled={isPromptGenerating}
                                    className="bg-white text-indigo-900 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center whitespace-nowrap disabled:opacity-50 shadow-lg shadow-indigo-900/20"
                                >
                                    {isPromptGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                    {isPromptGenerating ? t('create_listing.generating') : t('create_listing.generate_prompt')}
                                </button>
                            </div>

                            {generatedPrompts && (
                                <div className="space-y-4 animate-fade-in relative z-10">
                                    {/* Option A */}
                                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all group backdrop-blur-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-indigo-200">{t('create_listing.option_a')}</span>
                                            <button onClick={() => copyToClipboard(generatedPrompts[0], 'prompt-0')} className="text-indigo-200 hover:text-white transition-colors">
                                                {copiedField === 'prompt-0' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-indigo-50 font-mono leading-relaxed">{generatedPrompts[0]}</p>
                                    </div>

                                    {/* Option B */}
                                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all group backdrop-blur-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-indigo-200">{t('create_listing.option_b')}</span>
                                            <button onClick={() => copyToClipboard(generatedPrompts[1], 'prompt-1')} className="text-indigo-200 hover:text-white transition-colors">
                                                {copiedField === 'prompt-1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-indigo-50 font-mono leading-relaxed">{generatedPrompts[1]}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateListing;
