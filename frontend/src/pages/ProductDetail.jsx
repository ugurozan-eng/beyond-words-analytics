import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MagicWand, Tag, Eye, Save } from '@phosphor-icons/react';
import { calculateLQS, getHealthStatus } from '../utils/lqsCalculator';

// MOCK DATA (Veritabanı boşsa bunlar çalışacak)
const MOCK_DB = [
    { id: 1, title: "Leather Bag", tags: ["bag", "leather"], images: ["https://placehold.co/400"], desc: "Small bag." },
    { id: 2, title: "Handmade Brown Leather Crossbody Bag for Women Summer Style", tags: ["leather bag", "crossbody", "women bag", "summer fashion", "brown purse"], images: ["https://placehold.co/400", "https://placehold.co/400", "https://placehold.co/400"], desc: "Medium description." },
    { id: 3, title: "Personalized Leather Tote Bag, Large Zipper Tote, Work Bag for Women, Custom Laptop Bag", tags: ["leather bag", "tote bag", "custom bag", "work bag", "gift for her", "zipper tote", "laptop bag", "large bag", "brown leather", "handmade", "women accessories", "summer bag", "beach bag"], images: Array(6).fill("https://placehold.co/400"), desc: "Long description..." }
];

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [product, setProduct] = useState(null);
    const [lqsScore, setLqsScore] = useState(0);

    // Ürünü Bul ve Yükle
    useEffect(() => {
        const found = MOCK_DB.find(p => p.id === parseInt(id));
        if (found) {
            setProduct(found);
            setLqsScore(calculateLQS(found));
        } else {
            // Bulamazsa varsayılan olarak ilkini yükle (Hata vermesin)
            setProduct(MOCK_DB[0]);
            setLqsScore(calculateLQS(MOCK_DB[0]));
        }
    }, [id]);

    // Input değiştikçe LQS Hesapla (Canlı Monitör)
    const handleUpdate = (field, value) => {
        const updated = { ...product, [field]: value };
        setProduct(updated);
        setLqsScore(calculateLQS(updated));
    };

    if (!product) return <div>{t('common.loading')}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* HEADER & LQS BAR */}
            <div className="sticky top-0 z-10 bg-white shadow-md p-4 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-2">
                    <button onClick={() => navigate('/')} className="flex items-center text-gray-500 hover:text-gray-800">
                        <ArrowLeft className="mr-2" /> {t('common.cancel')} (Dashboard)
                    </button>
                    <h2 className="text-xl font-bold">{t('surgery.monitor_title')}</h2>
                    <span className={`text-2xl font-bold ${lqsScore < 50 ? 'text-red-500' : 'text-green-500'}`}>
                        {lqsScore} / 100
                    </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className={`h-4 rounded-full transition-all duration-500 ${lqsScore < 50 ? 'bg-red-500' : lqsScore < 80 ? 'bg-yellow-400' : 'bg-green-500'}`}
                        style={{ width: `${lqsScore}%` }}
                    ></div>
                </div>
            </div>

            {/* SPLIT SCREEN: SOL FORM vs SAĞ AI */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* SOL: HASTA DOSYASI (INPUTS) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={product.title}
                            onChange={(e) => handleUpdate('title', e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                        {/* Canlı Teşhis */}
                        {product.title.length < 80 && (
                            <p className="text-red-500 text-xs mt-1">⚠️ {t('surgery.diagnosis_short')}</p>
                        )}
                        <p className="text-gray-400 text-xs mt-1 text-right">{product.title.length} chars</p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Tags (Comma separated)</label>
                        <textarea
                            rows="3"
                            value={product.tags.join(", ")}
                            onChange={(e) => handleUpdate('tags', e.target.value.split(","))}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                        {product.tags.length < 13 && (
                            <p className="text-yellow-600 text-xs mt-1">⚠️ {t('surgery.diagnosis_tags_missing')} ({product.tags.length}/13)</p>
                        )}
                    </div>
                </div>

                {/* SAĞ: AI TEDAVİ MASASI */}
                <div className="space-y-4">
                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                        <h3 className="font-bold text-purple-900 mb-4 flex items-center">
                            <MagicWand className="mr-2" /> AI Tedavi
                        </h3>

                        <button className="w-full bg-white text-purple-700 border border-purple-200 p-3 rounded-lg mb-3 hover:bg-purple-100 text-left flex items-center">
                            <Eye className="mr-2" /> {t('surgery.fix_title_btn')}
                        </button>

                        <button className="w-full bg-white text-purple-700 border border-purple-200 p-3 rounded-lg mb-3 hover:bg-purple-100 text-left flex items-center">
                            <Tag className="mr-2" /> {t('surgery.fix_tags_btn')}
                        </button>

                        <button className="w-full bg-purple-600 text-white p-3 rounded-lg mt-4 font-bold flex justify-center items-center hover:bg-purple-700">
                            <Save className="mr-2" /> {t('surgery.save_changes')}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetail;
