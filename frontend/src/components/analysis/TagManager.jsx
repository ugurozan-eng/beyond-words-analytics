import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Target, Wind, Palette, Lightbulb, Tag, Copy } from 'lucide-react';

const TagManager = ({ result, isEditing, editData, setEditData, onCopy }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("focus");

    const getTags = (key) => {
        if (isEditing) return editData[key] || "";
        return result[key] ? result[key].split(',').filter(t => t) : [];
    };

    const handleTagChange = (e, key) => {
        setEditData({ ...editData, [key]: e.target.value });
    };

    const renderTags = (key, colorBase, colorText, colorBorder, label) => {
        const tags = getTags(key);
        if (isEditing) {
            return <textarea className="w-full mt-2 p-3 border rounded-xl bg-white text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-shadow" rows="3" value={tags} onChange={(e) => handleTagChange(e, key)} placeholder={`${label} ${t('tags.placeholder')}`} />;
        }
        return (
            <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
                {tags.length > 0 ? tags.map((tag, i) => (
                    <span key={i} className={`group/tag flex items-center px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${colorBase} ${colorText} ${colorBorder} hover:scale-105 transition-transform cursor-default select-all`}>
                        <Tag className="w-3 h-3 mr-1.5 opacity-70" /> {tag.trim()}
                        <button
                            onClick={(e) => { e.stopPropagation(); onCopy(tag.trim()); }}
                            className="ml-2 p-0.5 rounded-full hover:bg-white/50 text-current opacity-0 group-hover/tag:opacity-100 transition-opacity"
                            title="Kopyala"
                        >
                            <Copy className="w-3 h-3" />
                        </button>
                    </span>
                )) : <span className="text-gray-400 text-xs italic p-2">{t('tags.no_tags')}</span>}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 relative group hover:border-indigo-300 transition-all">
            <div className="flex justify-between items-start mb-6">
                <span className="text-sm font-bold text-indigo-900 flex items-center uppercase tracking-wider">
                    <Zap className="w-4 h-4 mr-2 text-indigo-600" /> {t('tags.keyword_storm')}
                </span>
            </div>

            <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                <button onClick={() => setActiveTab("focus")} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "focus" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    <div className="flex items-center justify-center"><Target className="w-3 h-3 mr-1.5" /> {t('tags.focus')}</div>
                </button>
                <button onClick={() => setActiveTab("long")} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "long" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    <div className="flex items-center justify-center"><Wind className="w-3 h-3 mr-1.5" /> {t('tags.niche')}</div>
                </button>
                <button onClick={() => setActiveTab("aes")} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "aes" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    <div className="flex items-center justify-center"><Palette className="w-3 h-3 mr-1.5" /> {t('tags.aesthetic')}</div>
                </button>
            </div>

            <div className="min-h-[120px]">
                {activeTab === "focus" && renderTags("tags_focus", "bg-indigo-50", "text-indigo-700", "border-indigo-100", t('tags.main_focus'))}
                {activeTab === "long" && renderTags("tags_long_tail", "bg-emerald-50", "text-emerald-700", "border-emerald-100", t('tags.niche_long'))}
                {activeTab === "aes" && renderTags("tags_aesthetic", "bg-purple-50", "text-purple-700", "border-purple-100", t('tags.aesthetic'))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center mb-3"><Lightbulb className="w-3 h-3 mr-1.5 text-yellow-500" /> {t('tags.creative_ideas')}</span>
                {isEditing ? (
                    <textarea className="w-full p-3 border rounded-xl bg-yellow-50/50 text-gray-800 text-sm focus:ring-2 focus:ring-yellow-400 outline-none shadow-inner" rows="2" value={editData.tags_creative} onChange={(e) => setEditData({ ...editData, tags_creative: e.target.value })} />
                ) : (
                    <p className="text-sm text-gray-600 italic bg-yellow-50/50 p-4 rounded-xl border border-yellow-100/50 leading-relaxed">
                        {getTags("tags_creative").join(", ") || t('tags.no_ideas')}
                    </p>
                )}
            </div>
        </div>
    );
};

export default TagManager;
