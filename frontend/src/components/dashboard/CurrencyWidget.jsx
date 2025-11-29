import React from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Euro } from 'lucide-react';

const CurrencyWidget = () => {
    const { t } = useTranslation();

    // Mock data for now
    const rates = {
        USD: 34.50,
        EUR: 36.20
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">{t('currency.usd_try')}</p>
                    <h3 className="text-xl font-black text-gray-800">₺{rates.USD.toFixed(2)}</h3>
                </div>
            </div>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Euro className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">{t('currency.eur_try')}</p>
                    <h3 className="text-xl font-black text-gray-800">₺{rates.EUR.toFixed(2)}</h3>
                </div>
            </div>
        </div>
    );
};

export default CurrencyWidget;
