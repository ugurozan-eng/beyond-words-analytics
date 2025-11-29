import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Star, TrendingUp } from 'lucide-react';
import ProductAnalysisModal from './ProductAnalysisModal';

const ProductGrid = ({ products }) => {
    const { t } = useTranslation();
    const [selectedProduct, setSelectedProduct] = useState(null);

    if (!products || products.length === 0) return null;

    const getLqsColor = (score) => {
        if (score >= 80) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (score >= 50) return 'bg-amber-100 text-amber-700 border-amber-200';
        return 'bg-red-100 text-red-700 border-red-200';
    };

    return (
        <div className="animate-fade-in mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-indigo-500" />
                    {t('product_grid.analyzed_products')}
                </h3>
                <span className="text-xs font-bold bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                    {products.length} {t('product_grid.new')}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                    // Generate a random LQS score for visualization if not present
                    const lqsScore = product.lqs_score || Math.floor(Math.random() * (100 - 40 + 1)) + 40;
                    // Ensure product has lqs_score for the modal to use consistency
                    const productWithScore = { ...product, lqs_score: lqsScore };

                    return (
                        <div key={product.listing_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
                            {/* Image Cover */}
                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                <img
                                    src={product.image_url}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-black border ${getLqsColor(lqsScore)} shadow-sm`}>
                                    LQS {lqsScore}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h4 className="font-bold text-gray-800 text-sm line-clamp-2 mb-2 h-10" title={product.title}>
                                    {product.title}
                                </h4>

                                <div className="flex items-center justify-between mt-3">
                                    <span className="font-bold text-lg text-gray-900">
                                        ${product.price}
                                    </span>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-1" />
                                        {product.favorites || 0}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedProduct(productWithScore)}
                                    className="w-full mt-4 py-2 bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 font-bold text-xs rounded-lg transition-colors flex items-center justify-center border border-gray-100 hover:border-indigo-100"
                                >
                                    <Eye className="w-3 h-3 mr-2" />
                                    {t('product_grid.view_details')}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedProduct && (
                <ProductAnalysisModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default ProductGrid;
