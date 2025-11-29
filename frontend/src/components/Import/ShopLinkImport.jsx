import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Search, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const ShopLinkImport = ({ onImportComplete }) => {
    const { t } = useTranslation();
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const validateUrl = (inputUrl) => {
        return inputUrl.includes('etsy.com/shop/') || inputUrl.includes('etsy.com');
    };

    const handleImport = async () => {
        setError(null);
        setSuccess(null);

        if (!url) {
            setError(t('shop_link_import.enter_link_error'));
            return;
        }

        if (!validateUrl(url)) {
            setError(t('shop_link_import.invalid_link_error'));
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/import/fetch-shop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url }),
            });

            if (!response.ok) {
                throw new Error(t('shop_link_import.fetch_error'));
            }

            const data = await response.json();

            if (data.status === 'success') {
                setSuccess(t('shop_link_import.success_message', { shopName: data.shop_name, count: data.products.length }));
                if (onImportComplete) {
                    onImportComplete(data.products);
                }
                setUrl('');
            } else {
                setError(t('shop_link_import.unexpected_response'));
            }

        } catch (err) {
            setError(err.message || t('common.error_occurred'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center mb-4">
                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                    <Link className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">{t('shop_link_import.title')}</h3>
                    <p className="text-xs text-gray-500">{t('shop_link_import.subtitle')}</p>
                </div>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all"
                        placeholder="https://www.etsy.com/shop/MagazaAdi"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <button
                    onClick={handleImport}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            {t('shop_link_import.searching')}
                        </>
                    ) : (
                        t('shop_link_import.analyze_button')
                    )}
                </button>
            </div>

            {error && (
                <div className="mt-3 flex items-center text-sm text-red-600 bg-red-50 p-2 rounded-lg animate-fade-in">
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-3 flex items-center text-sm text-green-600 bg-green-50 p-2 rounded-lg animate-fade-in">
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    {success}
                </div>
            )}
        </div>
    );
};

export default ShopLinkImport;
