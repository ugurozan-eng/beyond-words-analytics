import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, AlertCircle, Loader2, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = ({ onLogin }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    });

    const { signIn, signUp, signInWithGoogle } = useAuth();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isSignUp) {
                await signUp(formData.email, formData.password, formData.fullName);
                // For Supabase, sign up might require email confirmation or auto-login
                // If auto-login is enabled, onLogin will be triggered by AuthContext state change
                // But we can show a success message if confirmation is needed
                alert("Kayıt başarılı! Lütfen e-postanızı kontrol edin veya giriş yapın.");
                setIsSignUp(false);
            } else {
                await signIn(formData.email, formData.password);
                // onLogin is triggered by AuthContext state change usually, but we can call it here if needed for immediate feedback
                // However, App.jsx listens to user state, so it should auto-redirect.
            }
        } catch (err) {
            setError(err.message || "İşlem sırasında bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } catch (err) {
            setIsLoading(false);
            setError(err.message || "Google girişi başarısız.");
        }
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

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md text-center relative z-10 animate-fade-in-up">
                <div className="mb-6 flex justify-center">
                    <div className="bg-white/20 p-3 rounded-2xl shadow-inner ring-1 ring-white/30">
                        <span className="text-4xl filter drop-shadow-lg">🪆</span>
                    </div>
                </div>

                <h1 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-md">
                    Cyclear
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 text-xl mt-1 font-bold">Analytics</span>
                </h1>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/90 backdrop-blur-md border border-red-400 text-white p-3 rounded-xl mb-4 text-sm text-left animate-shake">
                        <div className="flex items-center font-bold mb-1">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Hata
                        </div>
                        <p className="opacity-90">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    {isSignUp && (
                        <div>
                            <label className="block text-indigo-100 text-xs font-bold mb-1 ml-1">Ad Soyad</label>
                            <div className="relative">
                                <User className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Adınız Soyadınız"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required={isSignUp}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-indigo-100 text-xs font-bold mb-1 ml-1">E-posta Adresi</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                placeholder="ornek@email.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-indigo-100 text-xs font-bold mb-1 ml-1">Şifre</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#F1641E] hover:bg-[#d55618] text-white py-3 rounded-xl font-bold text-base shadow-lg shadow-orange-900/30 transition-all transform hover:-translate-y-1 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Kayıt Ol' : 'Giriş Yap')}
                    </button>
                </form>

                <div className="mt-4 flex justify-between items-center text-xs text-indigo-200">
                    <button onClick={() => setIsSignUp(!isSignUp)} className="hover:text-white underline">
                        {isSignUp ? 'Zaten hesabın var mı? Giriş Yap' : 'Hesabın yok mu? Kayıt Ol'}
                    </button>
                    {!isSignUp && <button className="hover:text-white">Şifremi Unuttum</button>}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center border border-white/20"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4 mr-2" alt="Google" />
                        Google ile Devam Et
                    </button>
                </div>

                <div className="mt-4">
                    <button
                        onClick={() => onLogin('demo')}
                        className="text-indigo-200 hover:text-white text-xs font-bold flex items-center justify-center w-full py-2"
                    >
                        Demo Modunu Başlat <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
