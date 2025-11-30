import React, { useEffect, useState } from 'react';
import AnalysisPanel from '../components/analysis/AnalysisPanel';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = ({ listings, onUpdate, onAnalyze, isAnalyzing, analysisResult }) => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);

    useEffect(() => {
        if (listings && id) {
            const found = listings.find(l => l.id.toString() === id.toString());
            setListing(found);
        }
    }, [listings, id]);

    if (!listing) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>Ürün bulunamadı veya yükleniyor...</p>
                <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 hover:underline">
                    Dashboard'a Dön
                </button>
            </div>
        );
    }

    // Use passed analysisResult or fallback to listing data if available
    const activeResult = analysisResult || (listing.is_analyzed ? { ...listing, suggested_tags: listing.tags || [] } : null);

    return (
        <div className="h-full flex flex-col animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
                <button onClick={() => navigate('/')} className="flex items-center text-gray-500 hover:text-indigo-600 font-bold transition-colors">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> {t('app.back_to_dashboard')}
                </button>
                <div className="flex items-center space-x-4">
                    <img src={listing.image_url || (listing.images && listing.images[0])} className="w-10 h-10 rounded-lg object-cover border border-gray-200" alt={listing.title} />
                    <div>
                        <h2 className="font-bold text-gray-900 line-clamp-1">{listing.title}</h2>
                        <span className="text-xs text-gray-500">{listing.price ? `${listing.price.amount || listing.price} ${listing.price.currency_code || ''}` : ''}</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <AnalysisPanel
                    analysisResult={activeResult}
                    listingId={listing.id}
                    currentPrice={listing.price}
                    onCopy={(msg) => { /* Handle copy feedback if needed */ }}
                    onUpdate={onUpdate}
                    onAnalyzeClick={onAnalyze}
                    isAnalyzing={isAnalyzing}
                    listingType={listing.listing_type}
                    onShowReport={() => { /* Handle report modal */ }}
                    // Pass initial data for editing
                    initialTitle={listing.title}
                    initialDescription={listing.description}
                    initialTags={listing.tags}
                />
            </div>
        </div>
    );
};

export default ProductDetail;
