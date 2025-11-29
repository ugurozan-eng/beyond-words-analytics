import React from 'react';
import { X, Check, Crown, Zap, Shield, BarChart3, Search } from 'lucide-react';

const SubscriptionModal = ({ isOpen, onClose, onUpgrade }) => {
    if (!isOpen) return null;

    React.useEffect(() => {
        // Lemon Squeezy Event Handler (Global Listener)
        const handleLemonSqueezyEvent = (event) => {
            if (event.data && event.data.event === 'Payment.Success') {
                console.log("Ödeme Başarılı! Sayfa yenileniyor...");

                // 1. Overlay'i kapat (Varsa fonksiyonu çağır)
                if (window.LemonSqueezy) window.LemonSqueezy.Url.Close();

                // 2. Sayfayı yenile (Veritabanını tazelemek için)
                window.location.reload();
            }
        };

        // Global window listener ekle (En garanti yöntem)
        window.addEventListener('message', handleLemonSqueezyEvent);

        // Cleanup (Temizlik)
        return () => {
            window.removeEventListener('message', handleLemonSqueezyEvent);
        };
    }, []);

    const handleUpgrade = () => {
        // 1. Get User ID from Local Storage or Auth Context (passed as prop ideally, but for now we use localStorage as fallback or assume parent handles it)
        // Ideally, onUpgrade should be passed from App.jsx where user context is available.
        // Let's assume onUpgrade is passed and handles the redirection.

        // If we want to handle it here directly:
        // const userId = user?.id;
        // window.location.href = `https://store.lemonsqueezy.com/checkout/buy/...?checkout[custom][user_id]=${userId}`;

        onUpgrade();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-500 z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8 md:p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                        İşletmenizi Bir Üst Seviyeye Taşıyın 🚀
                    </h2>
                    <p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto">
                        Etsy mağazanızı büyütmek için ihtiyacınız olan tüm profesyonel araçlara erişin.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        {/* STARTER PLAN */}
                        <div className="border border-gray-200 rounded-3xl p-8 flex flex-col relative bg-gray-50/50 hover:bg-white transition-colors">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Başlangıç</h3>
                                <div className="text-4xl font-black text-gray-900">Ücretsiz</div>
                                <p className="text-gray-500 text-sm mt-2">Yeni başlayanlar için ideal</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1 text-left">
                                <li className="flex items-center text-gray-700">
                                    <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                                    <span>Günde 3 Ürün Analizi</span>
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                                    <span>Temel LQS Skoru</span>
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                                    <span>Standart Etiket Önerileri</span>
                                </li>
                            </ul>

                            <button
                                disabled
                                className="w-full py-4 rounded-xl font-bold bg-gray-200 text-gray-500 cursor-default"
                            >
                                Mevcut Plan
                            </button>
                        </div>

                        {/* PRO PLAN */}
                        <div className="border-2 border-indigo-600 rounded-3xl p-8 flex flex-col relative bg-white shadow-xl transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                En Popüler
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-indigo-600 mb-2 flex items-center justify-center">
                                    <Crown className="w-5 h-5 mr-2 fill-current" /> Professional
                                </h3>
                                <div className="text-4xl font-black text-gray-900">$29 <span className="text-lg text-gray-400 font-medium">/ ay</span></div>
                                <p className="text-gray-500 text-sm mt-2">Büyüyen mağazalar için</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1 text-left">
                                <li className="flex items-center text-gray-900 font-medium">
                                    <div className="bg-indigo-100 p-1 rounded-full mr-3"><Check className="w-3 h-3 text-indigo-600" /></div>
                                    <span>Sınırsız Analiz</span>
                                </li>
                                <li className="flex items-center text-gray-900 font-medium">
                                    <div className="bg-indigo-100 p-1 rounded-full mr-3"><Zap className="w-3 h-3 text-indigo-600" /></div>
                                    <span>Neuro-Pricing Fiyat Motoru</span>
                                </li>
                                <li className="flex items-center text-gray-900 font-medium">
                                    <div className="bg-indigo-100 p-1 rounded-full mr-3"><BarChart3 className="w-3 h-3 text-indigo-600" /></div>
                                    <span>Trafik İstihbaratı (Google/Etsy)</span>
                                </li>
                                <li className="flex items-center text-gray-900 font-medium">
                                    <div className="bg-indigo-100 p-1 rounded-full mr-3"><Shield className="w-3 h-3 text-indigo-600" /></div>
                                    <span>Rakip Ajan Modu</span>
                                </li>
                                <li className="flex items-center text-gray-900 font-medium">
                                    <div className="bg-indigo-100 p-1 rounded-full mr-3"><Search className="w-3 h-3 text-indigo-600" /></div>
                                    <span>7/24 AI Desteği</span>
                                </li>
                            </ul>

                            <button
                                onClick={handleUpgrade}
                                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                            >
                                Pro'ya Geç 🚀
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-gray-400 text-xs text-center max-w-2xl mx-auto leading-relaxed">
                        Abone olarak Alıcı Hizmet Şartları şartlarımızı kabul etmiş olursun. Abonelikler, iptal edilene kadar otomatik olarak yenilenir. Ek ücretleri önlemek için yenileme işleminden en az 24 saat önce dilediğin zaman iptal et. Aboneliğini, abone olduğun platform üzerinden yönet.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModal;
