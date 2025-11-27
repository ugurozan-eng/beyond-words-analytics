import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';

const AiSupportWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'ai', text: 'Merhaba! Ben Klindar AI Asistanı. 👋\nLQS, Fiyatlandırma veya SEO hakkında aklınıza takılan her şeyi bana sorabilirsiniz.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/chat/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            setMessages(prev => [...prev, { type: 'ai', text: data.response }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { type: 'ai', text: 'Üzgünüm, şu an bağlantı kuramıyorum. Lütfen biraz sonra tekrar deneyin.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* CHAT WINDOW */}
            {isOpen && (
                <div className="mb-4 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* HEADER */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Cyclear AI Support</h3>
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-xs text-indigo-100">Çevrimiçi</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* MESSAGES AREA */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${msg.type === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                                        }`}
                                >
                                    {msg.text.split('\n').map((line, i) => (
                                        <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-2xl rounded-bl-none p-3 border border-gray-100 shadow-sm flex space-x-1 items-center">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* INPUT AREA */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <div className="flex items-center space-x-2 bg-gray-50 rounded-xl border border-gray-200 p-1 pl-3 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Bir soru sorun..."
                                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm py-2 text-gray-700 placeholder-gray-400"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className={`p-2 rounded-lg transition-all ${input.trim() && !isLoading
                                    ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <span className="text-[10px] text-gray-400 flex items-center justify-center">
                                <Sparkles className="w-3 h-3 mr-1 text-indigo-400" />
                                Powered by Gemini 2.5 Flash
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* FLOATING ACTION BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen
                    ? 'bg-gray-800 rotate-90'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:rotate-12'
                    }`}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <MessageSquare className="w-7 h-7 text-white" />
                )}

                {/* TOOLTIP */}
                {!isOpen && (
                    <span className="absolute right-16 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        AI Asistana Sor
                    </span>
                )}
            </button>
        </div>
    );
};

export default AiSupportWidget;
