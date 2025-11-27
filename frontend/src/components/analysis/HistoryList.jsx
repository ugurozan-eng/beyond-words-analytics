import React, { useEffect, useState } from 'react';
import { Clock, TrendingUp, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const HistoryList = ({ listingId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!listingId) return;
            try {
                const response = await axios.get(`${API_BASE_URL}/listings/${listingId}/history`);
                setHistory(response.data);
            } catch (error) {
                console.error("Geçmiş yüklenirken hata:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [listingId]);

    if (loading) return <div className="text-center py-4 text-gray-400 text-sm">Geçmiş yükleniyor...</div>;
    if (history.length === 0) return <div className="text-center py-4 text-gray-400 text-sm">Henüz geçmiş analiz kaydı yok.</div>;

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-bold text-gray-800 flex items-center mb-4 uppercase tracking-wider">
                <Clock className="w-4 h-4 mr-2 text-gray-500" /> Geçmiş Analizler
            </h4>
            <div className="space-y-3">
                {history.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors group">
                        <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${item.lqs_score >= 8 ? 'bg-green-500' : item.lqs_score >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                            <div>
                                <p className="text-xs font-bold text-gray-700">{formatDate(item.created_at)}</p>
                                <p className="text-[10px] text-gray-500">LQS: {item.lqs_score} • Trend: {item.trend_score}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-gray-900">${item.predicted_price_min} - ${item.predicted_price_max}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryList;
