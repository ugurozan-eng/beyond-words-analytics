import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, AlertCircle, Info } from 'lucide-react';

const ProfitCalculator = () => {
    // Inputs
    const [productType, setProductType] = useState('physical'); // physical, digital
    const [salePrice, setSalePrice] = useState('');
    const [shippingCharge, setShippingCharge] = useState('0');
    const [isFreeShipping, setIsFreeShipping] = useState(false);
    const [discount, setDiscount] = useState('0');
    const [productCost, setProductCost] = useState('0');
    const [shippingCost, setShippingCost] = useState('0');
    const [offsiteAds, setOffsiteAds] = useState('none'); // none, 12, 15
    const [showTooltip, setShowTooltip] = useState(false);
    const [showCostTooltip, setShowCostTooltip] = useState(false);

    // Results
    const [results, setResults] = useState({
        revenue: 0,
        listingFee: 0.20,
        transactionFee: 0,
        processingFee: 0,
        offsiteAdsFee: 0,
        totalFees: 0,
        totalCosts: 0,
        netProfit: 0,
        margin: 0
    });

    useEffect(() => {
        calculateProfit();
    }, [salePrice, shippingCharge, discount, productCost, shippingCost, offsiteAds, productType, isFreeShipping]);

    const calculateProfit = () => {
        const price = parseFloat(salePrice) || 0;
        // If digital or free shipping, shipping charge is 0
        let shipCharge = 0;
        if (productType === 'physical' && !isFreeShipping) {
            shipCharge = parseFloat(shippingCharge) || 0;
        }

        const disc = parseFloat(discount) || 0;
        // For digital products, assume 0 product cost if the section is hidden
        const prodCost = productType === 'digital' ? 0 : (parseFloat(productCost) || 0);
        const shipCost = productType === 'digital' ? 0 : (parseFloat(shippingCost) || 0);

        // Revenue (Price + Shipping) * (1 - Discount)
        const grossRevenue = (price + shipCharge);
        const revenue = grossRevenue * (1 - disc / 100);

        // Fees
        const listingFee = 0.20;
        const transactionFee = revenue * 0.065;
        const processingFee = (revenue * 0.03) + 0.25;

        let adsFee = 0;
        if (offsiteAds === '15') adsFee = revenue * 0.15;
        if (offsiteAds === '12') adsFee = revenue * 0.12;

        const totalFees = listingFee + transactionFee + processingFee + adsFee;
        const totalCosts = prodCost + shipCost;

        const netProfit = revenue - totalFees - totalCosts;
        const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

        setResults({
            revenue,
            listingFee,
            transactionFee,
            processingFee,
            offsiteAdsFee: adsFee,
            totalFees,
            totalCosts,
            netProfit,
            margin
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in h-full flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 flex items-center tracking-tight">
                    <Calculator className="w-8 h-8 mr-3 text-indigo-600" />
                    Kâr Hesaplayıcı
                </h1>
                <p className="text-gray-500 mt-2">Etsy kesintilerini ve net kârınızı kuruşu kuruşuna hesaplayın.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 h-full">
                {/* LEFT PANEL: INPUTS */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-indigo-500" />
                        Satış Detayları
                    </h2>

                    {/* Product Type Selector */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                        <button
                            onClick={() => setProductType('physical')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${productType === 'physical' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            📦 Fiziksel Ürün
                        </button>
                        <button
                            onClick={() => setProductType('digital')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${productType === 'digital' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            📂 Dijital Ürün
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Sale Price */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Satış Fiyatı ($)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-gray-400 font-bold">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-gray-800 transition-all"
                                    placeholder="0.00"
                                    value={salePrice}
                                    onChange={(e) => setSalePrice(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Shipping Charge - Only for Physical */}
                            {productType === 'physical' && (
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        {/* Left Side: Label + Icon */}
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs font-bold text-gray-500 uppercase">KARGO ÜCRETİ (MÜŞTERİDEN)</span>
                                            <button
                                                type="button"
                                                onClick={() => setShowTooltip(!showTooltip)}
                                                className={`p-0.5 rounded-full transition-colors ${showTooltip ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-indigo-500'}`}
                                            >
                                                <Info className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Right Side: Checkbox Group */}
                                        <label className="flex items-center space-x-1 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isFreeShipping}
                                                onChange={(e) => setIsFreeShipping(e.target.checked)}
                                                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="text-xs font-bold text-indigo-600">Ücretsiz Kargo</span>
                                        </label>
                                    </div>

                                    {/* Inline Info Box */}
                                    {showTooltip && (
                                        <div className="mb-3 bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-start animate-fade-in">
                                            <Info className="w-4 h-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                                            <p className="text-xs text-indigo-800 leading-relaxed">
                                                <strong>Dikkat:</strong> Etsy, işlem ücretini (%6.5) sadece ürün fiyatından değil, (Ürün + Kargo) toplamı üzerinden keser. Buraya müşterinin sepette ödediği kargo tutarını girmelisiniz.
                                            </p>
                                        </div>
                                    )}

                                    <div className="relative">
                                        <span className={`absolute left-4 top-3.5 font-bold ${isFreeShipping ? 'text-gray-300' : 'text-gray-400'}`}>$</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            disabled={isFreeShipping}
                                            className={`w-full pl-8 pr-4 py-3 border rounded-xl outline-none font-bold transition-all ${isFreeShipping ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-gray-50 text-gray-800 border-gray-200 focus:ring-2 focus:ring-indigo-100'}`}
                                            value={isFreeShipping ? '0' : shippingCharge}
                                            onChange={(e) => setShippingCharge(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Discount */}
                            <div className={productType === 'digital' ? 'col-span-2' : ''}>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">İndirim Oranı (%)</label>
                                <div className="relative">
                                    <span className="absolute right-4 top-3.5 text-gray-400 font-bold">%</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full pl-4 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-gray-800 transition-all"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Costs Section - Only for Physical */}
                        {productType === 'physical' && (
                            <>
                                <div className="flex flex-row items-center gap-2 mb-4">
                                    <h2 className="text-lg font-bold text-gray-800">Maliyetler</h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowCostTooltip(!showCostTooltip)}
                                        className={`p-1 rounded-full transition-colors ${showCostTooltip ? 'bg-orange-100 text-orange-600' : 'text-orange-500 hover:text-orange-600 hover:bg-orange-50'}`}
                                    >
                                        <AlertCircle className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Cost Info Box */}
                                {showCostTooltip && (
                                    <div className="mb-4 bg-orange-50 border border-orange-100 rounded-lg p-3 flex items-start animate-fade-in">
                                        <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
                                        <p className="text-xs text-orange-800 leading-relaxed">
                                            Buraya ürünün size olan maliyetini ve kargo firmasına ödediğiniz tutarı girmelisiniz. Bu değerler net kâr hesabından düşülecektir.
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Product Cost */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ürün Maliyeti</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400 font-bold">$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-gray-800 transition-all"
                                                value={productCost}
                                                onChange={(e) => setProductCost(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Shipping Cost */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Kargo Maliyeti (Siz)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400 font-bold">$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-gray-800 transition-all"
                                                value={shippingCost}
                                                onChange={(e) => setShippingCost(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Offsite Ads */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Offsite Ads (Reklam)</label>
                            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                                <button
                                    onClick={() => setOffsiteAds('none')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${offsiteAds === 'none' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Kapalı
                                </button>
                                <button
                                    onClick={() => setOffsiteAds('15')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${offsiteAds === '15' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    %15 (Zorunlu)
                                </button>
                                <button
                                    onClick={() => setOffsiteAds('12')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${offsiteAds === '12' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    %12 (10k+)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: RESULTS */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* BIG STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
                            <p className="text-emerald-100 text-sm font-bold uppercase tracking-wider mb-1">Net Kâr</p>
                            <h3 className="text-4xl font-black">${results.netProfit.toFixed(2)}</h3>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Kâr Marjı</p>
                            <div className="flex items-center">
                                <TrendingUp className={`w-6 h-6 mr-2 ${results.margin >= 30 ? 'text-emerald-500' : results.margin > 0 ? 'text-yellow-500' : 'text-red-500'}`} />
                                <h3 className={`text-3xl font-black ${results.margin >= 30 ? 'text-emerald-600' : results.margin > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    %{results.margin.toFixed(1)}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* BREAKDOWN */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Hesap Özeti</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-600 font-medium">Toplam Ciro</span>
                                <span className="font-bold text-gray-900">${results.revenue.toFixed(2)}</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm text-red-400">
                                    <span>Listing Fee</span>
                                    <span>-${results.listingFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-red-400">
                                    <span>Transaction Fee (%6.5)</span>
                                    <span>-${results.transactionFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-red-400">
                                    <span>Processing Fee (%3 + 0.25)</span>
                                    <span>-${results.processingFee.toFixed(2)}</span>
                                </div>
                                {results.offsiteAdsFee > 0 && (
                                    <div className="flex justify-between items-center text-sm text-red-400">
                                        <span>Offsite Ads (%{offsiteAds})</span>
                                        <span>-${results.offsiteAdsFee.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center py-2 border-t border-gray-100 text-red-600 font-bold">
                                <span>Toplam Etsy Kesintisi</span>
                                <span>-${results.totalFees.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 text-orange-600 font-bold">
                                <span>Toplam Maliyetler</span>
                                <span>-${results.totalCosts.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-8 bg-indigo-50 rounded-xl p-4 flex items-start">
                            <Info className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-indigo-700 leading-relaxed">
                                Bu hesaplama tahmini değerlerdir. Etsy'nin vergi (VAT/Sales Tax) uygulamaları ve kur farkları nihai tutarı etkileyebilir.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfitCalculator;
