import React, { useState, useEffect } from 'react';
import { TrendingUp, X, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_BASE_URL } from '../../config';
import TrafficSourceChart from '../analysis/TrafficSourceChart';

const ReportModal = ({ isOpen, onClose, listingId, productTitle, trafficData }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && listingId) {
            setLoading(true);
            fetch(`${API_BASE_URL}/listings/${listingId}/history`)
                .then(res => res.json())
                .then(data => {
                    const formatted = data.map(h => ({
                        date: new Date(h.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
                        lqs: h.lqs_score,
                    })).reverse();
                    setHistory(formatted);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, listingId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm z-10">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center tracking-tight">
                            <TrendingUp className="w-7 h-7 mr-3 text-emerald-500" /> Gelişim Raporu
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 font-medium">{productTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
                </div>

                <div className="p-8 space-y-8">
                    {loading ? (
                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div></div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">Henüz yeterli geçmiş verisi yok.</div>
                    ) : (
                        <>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
                                <h3 className="text-lg font-bold text-indigo-900 mb-6 flex items-center">
                                    <Sparkles className="w-5 h-5 mr-2 text-indigo-500" /> LQS Kalite Yolculuğu
                                </h3>
                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorLqs" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} dy={10} />
                                            <YAxis domain={[0, 100]} hide />
                                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }} />
                                            <Area type="monotone" dataKey="lqs" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorLqs)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {trafficData && <TrafficSourceChart data={trafficData} />}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center shadow-sm">
                                    <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-2">Başlangıç Skoru</div>
                                    <div className="text-4xl font-black text-emerald-700">{history[0]?.lqs}</div>
                                </div>
                                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-center shadow-sm">
                                    <div className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-2">Mevcut Skor</div>
                                    <div className="text-4xl font-black text-indigo-700">{history[history.length - 1]?.lqs}</div>
                                </div>
                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center shadow-sm">
                                    <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-2">Gelişim</div>
                                    <div className="text-4xl font-black text-blue-700">
                                        {history[history.length - 1]?.lqs - history[0]?.lqs > 0 ? '+' : ''}
                                        {(history[history.length - 1]?.lqs - history[0]?.lqs).toFixed(1)}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
