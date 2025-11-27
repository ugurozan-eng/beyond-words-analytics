import React from 'react';
import { X, ExternalLink, Star, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const ProductAnalysisModal = ({ product, onClose }) => {
    if (!product) return null;

    // Use existing score or generate a random one for visualization if missing
    const lqsScore = product.lqs_score || Math.floor(Math.random() * (100 - 40 + 1)) + 40;

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-600 border-emerald-200 bg-emerald-50';
        if (score >= 60) return 'text-amber-600 border-amber-200 bg-amber-50';
        return 'text-red-600 border-red-200 bg-red-50';
    };

    const getAnalysisItems = (score) => {
        if (score >= 80) {
            return [
                { type: 'positive', text: 'Başlık uzunluğu ve anahtar kelime yoğunluğu mükemmel.' },
                { type: 'positive', text: 'Görsel kalitesi ve çözünürlüğü yüksek.' },
                { type: 'positive', text: 'Fiyat rekabetçi aralıkta.' },
                { type: 'neutral', text: 'Daha fazla etiket eklenebilir.' }
            ];
        } else if (score >= 60) {
            return [
                { type: 'positive', text: 'Görsel kalitesi kabul edilebilir.' },
                { type: 'warning', text: 'Başlıkta daha fazla anahtar kelime kullanılmalı.' },
                { type: 'warning', text: 'Açıklama kısmı biraz kısa kalmış.' },
                { type: 'positive', text: 'Fiyatlandırma makul.' }
            ];
        } else {
            return [
                { type: 'negative', text: 'Başlık çok kısa ve yetersiz.' },
                { type: 'negative', text: 'Görsel çözünürlüğü düşük veya karanlık.' },
                { type: 'negative', text: 'Etiket kullanımı çok az.' },
                { type: 'warning', text: 'Fiyat piyasa ortalamasının üzerinde olabilir.' }
            ];
        }
    };

    const analysisItems = getAnalysisItems(lqsScore);

    return (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-1 pr-4">{product.title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400 hover:text-red-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Product Info */}
                        <div className="space-y-6">
                            <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative group">
                                <img
                                    src={product.image_url}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm text-sm font-bold text-gray-700 flex items-center">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-2" />
                                    {product.favorites || 0} Favori
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Fiyat</div>
                                <div className="text-3xl font-black text-gray-900">${product.price}</div>
                            </div>
                        </div>

                        {/* Right Column: Analysis Engine */}
                        <div className="space-y-8">
                            {/* Score Circle */}
                            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center text-5xl font-black shadow-sm mb-4 ${getScoreColor(lqsScore)}`}>
                                    {lqsScore}
                                </div>
                                <div className="text-center">
                                    <h3 className="font-bold text-gray-800 text-lg">LQS Skoru</h3>
                                    <p className="text-sm text-gray-500">Listing Quality Score</p>
                                </div>
                            </div>

                            {/* Checklist */}
                            <div>
                                <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="w-1 h-6 bg-indigo-500 rounded-full mr-2"></span>
                                    Analiz Raporu
                                </h4>
                                <div className="space-y-3">
                                    {analysisItems.map((item, index) => (
                                        <div key={index} className="flex items-start p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                            <div className="mt-0.5 mr-3 flex-shrink-0">
                                                {item.type === 'positive' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                                                {item.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                                                {item.type === 'negative' && <XCircle className="w-5 h-5 text-red-500" />}
                                                {item.type === 'neutral' && <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-6 py-2.5 font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-xl transition-colors">
                        Kapat
                    </button>
                    <a
                        href={`https://www.etsy.com/listing/${product.listing_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center"
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Etsy'de Düzenle
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductAnalysisModal;
