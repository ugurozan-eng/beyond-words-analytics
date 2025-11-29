import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Search, Palette, Image, ArrowRight } from 'lucide-react';

const QuickActions = ({ onAction }) => {
    const { t } = useTranslation();

    const actions = [
        { id: 'create_listing', icon: PlusCircle, color: 'bg-blue-50 text-blue-600', label: t('quick_actions.create_listing') },
        { id: 'seo_analysis', icon: Search, color: 'bg-purple-50 text-purple-600', label: t('quick_actions.seo_analysis') },
        { id: 'color_palette', icon: Palette, color: 'bg-pink-50 text-pink-600', label: t('quick_actions.color_palette') },
        { id: 'image_prompt', icon: Image, color: 'bg-emerald-50 text-emerald-600', label: t('quick_actions.image_prompt') }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((action) => (
                <button
                    key={action.id}
                    onClick={() => onAction && onAction(action.id)}
                    className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-200 transition-all group text-center"
                >
                    <div className={`p-3 rounded-full mb-3 ${action.color} group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-gray-700 text-sm group-hover:text-indigo-600 transition-colors">
                        {action.label}
                    </span>
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4 text-gray-300" />
                    </div>
                </button>
            ))}
        </div>
    );
};

export default QuickActions;
