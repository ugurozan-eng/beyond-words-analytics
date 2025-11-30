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

    // --- MOCK DATA FOR FALLBACK ---
    const mockProducts = [
        {
            id: "demo-red",
            title: "Leather Bag",
            description: "A nice leather bag.",
            tags: ["bag", "leather"],
            images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=200"],
            price: { amount: 50, currency_code: "USD" },
            views: 12,
            favorites: 1,
            is_mock: true,
            lqs_score: 45
        },
        {
            id: "demo-yellow",
            title: "Handmade Brown Leather Crossbody Bag for Women Summer Style",
            description: "Beautiful handmade crossbody bag for women. Perfect for summer.",
            tags: ["leather bag", "crossbody", "women bag", "summer fashion", "brown purse"],
            images: [
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=200",
                "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=200",
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200"
            ],
            price: { amount: 85, currency_code: "USD" },
            views: 145,
            favorites: 23,
            is_mock: true,
            lqs_score: 65
        },
        {
            id: "demo-green",
            title: "Personalized Leather Tote Bag, Large Zipper Tote, Work Bag for Women, Custom Laptop Bag with Pockets, Teacher Gift, Graduation Gift",
            description: "High quality personalized leather tote bag. Great for work and daily use.",
            tags: ["personalized bag", "leather tote", "work bag women", "custom laptop bag", "teacher gift", "graduation gift", "large zipper tote", "leather handbag", "custom tote", "monogram bag", "office bag", "gift for her", "shoulder bag"],
            images: [
                "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=200",
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=200",
                "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=200",
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200",
                "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=200",
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=200"
            ],
            price: { amount: 120, currency_code: "USD" },
            views: 1250,
            favorites: 450,
            is_mock: true,
            lqs_score: 95
        }
    ];

    useEffect(() => {
        if (id) {
            // 1. Try to find in real listings
            let found = listings?.find(l => l.id.toString() === id.toString());

            // 2. If not found, try to find in mock products
            if (!found) {
                found = mockProducts.find(p => p.id === id);
            }

            // 3. If still not found, fallback to the first mock product (Red Patient)
            if (!found) {
                found = mockProducts[0];
            }

            setListing(found);
        }
    }, [listings, id]);

    if (!listing) return <div>Loading...</div>;

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
