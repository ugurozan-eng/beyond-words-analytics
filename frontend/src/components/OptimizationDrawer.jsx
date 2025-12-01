import React from 'react';
import { X } from 'lucide-react';

const OptimizationDrawer = ({ isOpen, onClose, product, onApply }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto animate-slide-in-right">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Optimization</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {product && (
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <h3 className="font-bold text-gray-900">{product.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">Current LQS: {product.lqs}</p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-bold text-sm text-gray-700">Identified Issues</h4>
                            {product.issues && product.issues.length > 0 ? (
                                <ul className="list-disc list-inside text-sm text-red-600">
                                    {product.issues.map((issue, idx) => (
                                        <li key={idx}>{issue}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-green-600">No critical issues found.</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={onApply}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                            >
                                Apply AI Optimization
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OptimizationDrawer;
