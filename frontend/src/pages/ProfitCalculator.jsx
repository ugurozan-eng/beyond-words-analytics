import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, DollarSign, TrendingUp, AlertCircle, Info, Package, HelpCircle } from 'lucide-react';

const ProfitCalculator = () => {
    const { t } = useTranslation();
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
                    {t('profit_calculator.title')}
                </h1>
                <p className="text-gray-500 mt-2">{t('profit_calculator.subtitle')}</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 h-full">
                {/* LEFT PANEL: INPUTS */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-indigo-500" />
                        {t('profit_calculator.sales_details')}
                    </h2>

                    {/* Product Type Selector */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                        <button
                            onClick={() => setProductType('physical')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${productType === 'physical' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            📦 {t('profit_calculator.physical_product')}
                        </button>
                        <button
                            onClick={() => setProductType('digital')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${productType === 'digital' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            📂 {t('profit_calculator.digital_product')}
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Sale Price */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('profit_calculator.sale_price')}</label>
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
                                            <span className="text-xs font-bold text-gray-500 uppercase">{t('profit_calculator.shipping_charge_label')}</span>
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
                                            <span className="text-xs font-bold text-indigo-600">{t('profit_calculator.free_shipping')}</span>
                                        </label>
                                    </div>

                                    {/* Inline Info Box */}
                                    {showTooltip && (
                                        <div className="mb-3 bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-start animate-fade-in">
                                            <Info className="w-4 h-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                                            <p className="text-xs text-indigo-800 leading-relaxed">
                                                <strong>{t('common.attention')}</strong> {t('profit_calculator.shipping_warning')}
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
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('profit_calculator.discount_rate')}</label>
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
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center">
                                        <Package className="w-6 h-6 mr-2 text-indigo-600" />
                                        {t('profit_calculator.costs')}
                                    </h2>
                                    <div className="group relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowCostTooltip(!showCostTooltip)}
                                            className={`p-1 rounded-full transition-colors ${showCostTooltip ? 'bg-orange-100 text-orange-600' : 'text-orange-500 hover:text-orange-600 hover:bg-orange-50'}`}
                                        >
                                            <AlertCircle className="w-5 h-5" />
                                        </button>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                            {t('profit_calculator.costs_tooltip')}
                                        </div>
                                    </div>
                                </div>

                                {/* Cost Info Box */}
                                {showCostTooltip && (
                                    <div className="mb-4 bg-orange-50 border border-orange-100 rounded-lg p-3 flex items-start animate-fade-in">
                                        <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
                                        <p className="text-xs text-orange-800 leading-relaxed">
                                            {t('profit_calculator.costs_tooltip')}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Product Cost */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('profit_calculator.product_cost')}</label>
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
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('profit_calculator.shipping_cost_you')}</label>
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
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('profit_calculator.offsite_ads')}</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: 'none', label: t('profit_calculator.offsite_ads_none') },
                                    { value: '15', label: t('profit_calculator.offsite_ads_15') },
                                    { value: '12', label: t('profit_calculator.offsite_ads_12') }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setOffsiteAds(option.value)}
                                        className={`px-2 py-3 rounded-xl text-xs font-bold border-2 transition-all ${offsiteAds === option.value ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-300 text-gray-600'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: RESULTS */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* BIG STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
                            <p className="text-emerald-100 text-sm font-bold uppercase tracking-wider mb-1">{t('profit_calculator.net_profit')}</p>
                            <h3 className="text-4xl font-black">${results.netProfit.toFixed(2)}</h3>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{t('profit_calculator.profit_margin')}</p>
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
                        <h3 className="text-lg font-bold text-gray-800 mb-6">{t('profit_calculator.summary_title')}</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-600 font-medium">{t('profit_calculator.total_revenue')}</span>
                                <span className="font-bold text-gray-900">${results.revenue.toFixed(2)}</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm text-red-400">
                                    <span>{t('profit_calculator.listing_fee')}</span>
                                    <span>-${results.listingFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-red-400">
                                    <span>{t('profit_calculator.transaction_fee')}</span>
                                    <span>-${results.transactionFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-red-400">
                                    <span>{t('profit_calculator.processing_fee')}</span>
                                    <span>-${results.processingFee.toFixed(2)}</span>
                                </div>
                                {results.offsiteAdsFee > 0 && (
                                    <div className="flex justify-between items-center text-sm text-red-400">
                                        <span>{t('profit_calculator.offsite_ads_fee')} (%{offsiteAds})</span>
                                        <span>-${results.offsiteAdsFee.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center py-2 border-t border-gray-100 text-red-600 font-bold">
                                <span>{t('profit_calculator.total_fees')}</span>
                                <span>-${results.totalFees.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 text-orange-600 font-bold">
                                <span>{t('profit_calculator.total_costs')}</span>
                                <span>-${results.totalCosts.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-8 bg-indigo-50 rounded-xl p-4 flex items-start">
                            <Info className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-indigo-700 leading-relaxed">
                                {t('profit_calculator.disclaimer')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfitCalculator;
