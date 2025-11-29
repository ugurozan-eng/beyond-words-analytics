import React, { useEffect, useState } from 'react';
import { X, Check, Crown, Zap, Shield, BarChart3, Search } from 'lucide-react';

const SubscriptionModal = ({ isOpen, onClose, onUpgrade }) => {
    // Hook kuralı: useEffect her zaman çalışmalı, return'den önce gelmeli.
    useEffect(() => {
        const handleLemonSqueezy = (event) => {
            let data = event.data;

            // Veri string gelirse parse etmeye çalış, obje ise direkt kullan
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    // Parse edilemeyen stringler (örn: webpack mesajları) yoksayılır
                }
            }

            // Olay ismini yakala
            const eventName = data && (data.event || data);

            // DEBUG İÇİN KONSOLA BAS
            if (eventName && typeof eventName === 'string' && eventName.includes('LemonSqueezy')) {
                console.log("🍋 LS Sinyali:", eventName);
            }

            // BAŞARI SİNYALİ KONTROLÜ
            if (eventName === 'LemonSqueezy.Payment.Success' || eventName === 'Payment.Success') {
                console.log("✅ Ödeme Bitti! Pencere kapatılıyor...");

                // 1. Pencereyi Kapat
                if (window.LemonSqueezy && window.LemonSqueezy.Url) {
                    window.LemonSqueezy.Url.Close();
                }

                // 2. Sayfayı Yenile
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            }
        };

        window.addEventListener('message', handleLemonSqueezy);
        return () => window.removeEventListener('message', handleLemonSqueezy);
    }, []);

    if (!isOpen) return null;

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
                    <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
                        Etsy mağazanızı büyütmek için ihtiyacınız olan tüm profesyonel araçlara erişin.
                    </p>

                    {/* ORTA KISIM: PLANLAR */}
                    <div className="flex justify-center mb-8">
                        <div className="border-2 border-indigo-600 rounded-3xl p-8 flex flex-col relative bg-white shadow-xl max-w-md w-full">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                En Popüler
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-indigo-600 mb-2 flex items-center justify-center">
                                    <Crown className="w-5 h-5 mr-2 fill-current" /> Professional
                                </h3>
                                <div className="text-4xl font-black text-gray-900">$29 <span className="text-lg text-gray-400 font-medium">/ ay</span></div>
                            </div>

                            <button
                                onClick={onUpgrade}
                                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                            >
                                Pro'ya Geç 🚀
                            </button>
                        </div>
                    </div>

                    <p className="text-gray-400 text-xs text-center max-w-2xl mx-auto leading-relaxed">
                        Abone olarak Alıcı Hizmet Şartları şartlarımızı kabul etmiş olursun. Abonelikler, iptal edilene kadar otomatik olarak yenilenir.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModal;
