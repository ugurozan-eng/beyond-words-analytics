import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, CheckCircle, RefreshCcw, ShieldAlert, PlusCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const NewProductModal = ({ isOpen, onClose, onAddProduct }) => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [inputType, setInputType] = useState('upload');
    const [listingType, setListingType] = useState('mine');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let finalUrl = imageUrl;

            if (inputType === 'upload' && selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);

                const uploadRes = await fetch(`${API_BASE_URL}/listings/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!uploadRes.ok) throw new Error('Resim yüklenemedi');
                const uploadData = await uploadRes.json();
                finalUrl = uploadData.url;
            }

            if (!finalUrl) throw new Error("Lütfen bir resim seçin veya URL girin");

            const response = await fetch(`${API_BASE_URL}/listings/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    price: parseFloat(price),
                    image_url: finalUrl,
                    listing_type: listingType
                })
            });
            if (!response.ok) throw new Error('Kayıt Hatası');

            onAddProduct(await response.json());
            onClose();
            setTitle(''); setPrice(''); setImageUrl(''); setSelectedFile(null); setListingType('mine');
        } catch (error) {
            alert('Hata: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    console.log("NewProductModal rendered, isOpen:", isOpen);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[60] p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Yeni Ürün Ekle</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400 hover:text-red-500" /></button>
                </div>

                {/* ÜRÜN TİPİ SEÇİMİ */}
                <div className="flex space-x-3 mb-6 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    <button type="button" onClick={() => setListingType('mine')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${listingType === 'mine' ? 'bg-white text-indigo-700 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>
                        <div className="flex items-center justify-center">Benim Ürünüm</div>
                    </button>
                    <button type="button" onClick={() => setListingType('competitor')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${listingType === 'competitor' ? 'bg-white text-orange-600 shadow-md border-orange-100' : 'text-gray-500 hover:text-gray-700'}`}>
                        <div className="flex items-center justify-center"><ShieldAlert className="w-4 h-4 mr-2" /> Rakip Analizi</div>
                    </button>
                </div>

                <div className="flex space-x-3 mb-6">
                    <button type="button" onClick={() => setInputType('upload')} className={`flex-1 py-3 text-sm font-bold rounded-xl border-2 transition-all ${inputType === 'upload' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}>
                        <div className="flex items-center justify-center"><Upload className="w-4 h-4 mr-2" /> Dosya Yükle</div>
                    </button>
                    <button type="button" onClick={() => setInputType('url')} className={`flex-1 py-3 text-sm font-bold rounded-xl border-2 transition-all ${inputType === 'url' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}>
                        <div className="flex items-center justify-center"><LinkIcon className="w-4 h-4 mr-2" /> Link Gir</div>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Ürün Başlığı</label>
                        <input type="text" placeholder="Örn: El Yapımı Seramik Kupa" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-medium" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Fiyat ($)</label>
                        <input type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-medium" required />
                    </div>

                    {inputType === 'upload' ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer relative group">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required={!selectedFile} />
                            {selectedFile ? (
                                <p className="text-sm text-green-600 font-bold flex items-center justify-center bg-green-50 py-2 px-4 rounded-lg"><CheckCircle className="w-4 h-4 mr-2" /> {selectedFile.name}</p>
                            ) : (
                                <div className="text-gray-500 group-hover:text-indigo-600 transition-colors">
                                    <Upload className="w-10 h-10 mx-auto mb-3 opacity-50 group-hover:scale-110 transition-transform" />
                                    <p className="text-sm font-bold">Resmi buraya sürükleyin</p>
                                    <p className="text-xs mt-1">veya tıklayıp seçin</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Görsel URL</label>
                            <input type="url" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" required />
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} className={`w-full text-white p-4 rounded-xl font-bold text-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${listingType === 'competitor' ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gradient-to-r from-indigo-600 to-violet-600'} disabled:opacity-70 disabled:cursor-not-allowed`}>
                        {isLoading ? <RefreshCcw className="w-6 h-6 animate-spin mr-2" /> : (listingType === 'competitor' ? <ShieldAlert className="w-6 h-6 mr-2" /> : <PlusCircle className="w-6 h-6 mr-2" />)}
                        {isLoading ? 'Yükleniyor...' : (listingType === 'competitor' ? 'Ajanı Gönder' : 'Ürünü Ekle')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewProductModal;
