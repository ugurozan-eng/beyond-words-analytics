import React, { useState, useEffect } from 'react';
import { X, Save, Lock, Key, ShoppingBag, BarChart3, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const InfoTooltip = ({ text }) => (
    <div className="group relative inline-block ml-2">
        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-indigo-500 cursor-help transition-colors" />
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] pointer-events-none text-center leading-relaxed">
            {text}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-1 border-4 border-transparent border-b-gray-900"></div>
        </div>
    </div>
);

const SettingsModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('etsy');
    const [settings, setSettings] = useState({
        etsy_keystring: '',
        etsy_shared_secret: '',
        etsy_shop_id: '',
        ga4_property_id: '',
        ga4_measurement_id: '',
        ga4_client_secret: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error'

    useEffect(() => {
        if (isOpen) {
            fetchSettings();
            setSaveStatus(null);
        }
    }, [isOpen]);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/settings`);
            if (response.ok) {
                const data = await response.json();
                setSettings({
                    etsy_keystring: data.etsy_keystring || '',
                    etsy_shared_secret: data.etsy_shared_secret || '',
                    etsy_shop_id: data.etsy_shop_id || '',
                    ga4_property_id: data.ga4_property_id || '',
                    ga4_measurement_id: data.ga4_measurement_id || '',
                    ga4_client_secret: data.ga4_client_secret || ''
                });
            }
        } catch (error) {
            console.error("Ayarlar yüklenirken hata:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        setSaveStatus(null);
        try {
            const response = await fetch(`${API_BASE_URL}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                setSaveStatus('success');
                setTimeout(() => {
                    setSaveStatus(null);
                    onClose();
                }, 1500);
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            console.error("Kaydetme hatası:", error);
            setSaveStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-2xl font-black text-gray-900 flex items-center">
                        <span className="bg-indigo-100 p-2 rounded-xl mr-3 text-indigo-600">
                            {activeTab === 'etsy' ? <ShoppingBag className="w-6 h-6" /> : <BarChart3 className="w-6 h-6" />}
                        </span>
                        Ayarlar
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('etsy')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center transition-colors ${activeTab === 'etsy' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        <ShoppingBag className="w-4 h-4 mr-2" /> Etsy API
                    </button>
                    <button
                        onClick={() => setActiveTab('ga4')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center transition-colors ${activeTab === 'ga4' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        <BarChart3 className="w-4 h-4 mr-2" /> Google Analytics
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1">
                    {isLoading && !saveStatus ? (
                        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>
                    ) : (
                        <div className="space-y-6">
                            {activeTab === 'etsy' && (
                                <div className="space-y-5 animate-fade-in">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                            <Key className="w-4 h-4 mr-2 text-indigo-500" />
                                            Etsy Keystring (API Key)
                                            <InfoTooltip text="Etsy Developer Portal > Apps menüsünden 'Keystring' değerini kopyalayın." />
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.etsy_keystring}
                                            onChange={(e) => setSettings({ ...settings, etsy_keystring: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
                                            placeholder="Etsy API Key giriniz..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                            <Lock className="w-4 h-4 mr-2 text-indigo-500" />
                                            Etsy Shared Secret
                                            <InfoTooltip text="Etsy Developer Portal > Apps menüsünden 'Shared Secret' değerini kopyalayın." />
                                        </label>
                                        <input
                                            type="password"
                                            value={settings.etsy_shared_secret}
                                            onChange={(e) => setSettings({ ...settings, etsy_shared_secret: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
                                            placeholder="Shared Secret giriniz..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                            <ShoppingBag className="w-4 h-4 mr-2 text-indigo-500" />
                                            Etsy Shop ID
                                            <InfoTooltip text="Etsy mağaza sayfanızı açın. Adres çubuğunda veya kaynak kodunda 'shop_id' aratın." />
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.etsy_shop_id}
                                            onChange={(e) => setSettings({ ...settings, etsy_shop_id: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
                                            placeholder="Shop ID giriniz..."
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ga4' && (
                                <div className="space-y-5 animate-fade-in">
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm mb-4">
                                        Google Analytics 4 entegrasyonu için aşağıdaki bilgileri giriniz. Bu bilgiler raporlama ekranında trafik verilerini çekmek için kullanılacaktır.
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                            Property ID
                                            <InfoTooltip text="Google Analytics > Yönetici > Mülk Ayarları > Mülk Kimliği (Sağ üstte yazar)." />
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.ga4_property_id}
                                            onChange={(e) => setSettings({ ...settings, ga4_property_id: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
                                            placeholder="Örn: 123456789"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                            Measurement ID
                                            <InfoTooltip text="Google Analytics > Yönetici > Veri Akışları > Akış Detayları > Ölçüm Kimliği (G- ile başlar)." />
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.ga4_measurement_id}
                                            onChange={(e) => setSettings({ ...settings, ga4_measurement_id: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
                                            placeholder="Örn: G-XXXXXXXXXX"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                            Client Secret
                                            <InfoTooltip text="Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client IDs." />
                                        </label>
                                        <input
                                            type="password"
                                            value={settings.ga4_client_secret}
                                            onChange={(e) => setSettings({ ...settings, ga4_client_secret: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
                                            placeholder="Google Cloud Client Secret"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    {saveStatus === 'success' && (
                        <span className="text-emerald-600 font-bold flex items-center animate-fade-in"><CheckCircle className="w-5 h-5 mr-2" /> Kaydedildi!</span>
                    )}
                    {saveStatus === 'error' && (
                        <span className="text-red-600 font-bold flex items-center animate-fade-in"><AlertCircle className="w-5 h-5 mr-2" /> Hata oluştu!</span>
                    )}
                    {!saveStatus && <span></span>}

                    <div className="flex space-x-3">
                        <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors">İptal</button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Kaydediliyor...' : <><Save className="w-5 h-5 mr-2" /> Kaydet</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
