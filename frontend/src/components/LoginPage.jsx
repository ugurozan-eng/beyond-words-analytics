import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLoginClick = async (type) => {
        setError(null);
        setIsLoading(true);

        // Simulate network request
        setTimeout(() => {
            if (type === 'google') {
                // Simulate Error for Google to demonstrate the feature
                setIsLoading(false);
                setError("Google bağlantısı zaman aşımına uğradı. (Simülasyon Hatası)");
            } else {
                // Etsy and Demo work fine
                onLogin(type);
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-900">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop")',
                }}
            >
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center relative z-10 animate-fade-in-up">
                <div className="mb-8 flex justify-center">
                    <div className="bg-white/20 p-4 rounded-2xl shadow-inner ring-1 ring-white/30">
                        <span className="text-5xl filter drop-shadow-lg">🪆</span>
                    </div>
                </div>

                <h1 className="text-4xl font-black text-white mb-3 tracking-tight drop-shadow-md">
                    Cyclear
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 text-2xl mt-1 font-bold">Analytics</span>
                </h1>

                <p className="text-indigo-100 mb-8 text-lg font-medium leading-relaxed drop-shadow-sm">
                    Etsy Mağazanızı Yapay Zeka ile Büyütün
                </p>

                {/* Error Message with Smart Fallback */}
                {error && (
                    <div className="bg-red-500/90 backdrop-blur-md border border-red-400 text-white p-4 rounded-xl mb-6 text-sm text-left animate-shake">
                        <div className="flex items-center font-bold mb-1">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Bağlantı Hatası
                        </div>
                        <p className="opacity-90 mb-3">{error}</p>
                        <button
                            onClick={() => onLogin('demo')}
                            className="bg-white text-red-600 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide hover:bg-red-50 transition-colors w-full"
                        >
                            Demo Modu ile Devam Et →
                        </button>
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={() => handleLoginClick('etsy')}
                        disabled={isLoading}
                        className="w-full bg-[#F1641E] hover:bg-[#d55618] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-900/30 transition-all transform hover:-translate-y-1 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>
                                <ShoppingBag className="w-6 h-6 mr-3 text-white/90 group-hover:scale-110 transition-transform" />
                                Etsy ile Giriş Yap
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => handleLoginClick('google')}
                        disabled={isLoading}
                        className="w-full bg-white text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center border border-gray-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-2" alt="Google" />
                        Google ile Devam Et
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center">
                    <p className="text-indigo-200/80 text-sm mb-3 font-medium">
                        Platformun tüm yeteneklerini üye olmadan keşfetmek için
                    </p>
                    <button
                        onClick={() => onLogin('demo')}
                        className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center group hover:shadow-lg hover:shadow-indigo-500/20 backdrop-blur-sm"
                    >
                        Demo Modunu Başlat
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <p className="mt-8 text-indigo-200/60 text-xs">
                    &copy; 2025 Klindar Analytics. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
