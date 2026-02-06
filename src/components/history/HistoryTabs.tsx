import React, { useState } from 'react';
import { PromptHistoryItem as HistoryItem } from '../../types';
import { useTranslations } from '../../contexts/LanguageContext';
import { downloadTextFile } from '../../utils/fileUtils';
import PromptHistoryItem from './PromptHistoryItem';
import { Clock, Star, History } from 'lucide-react';

interface HistoryTabsProps {
  history: HistoryItem[];
  toggleFavorite: (id: number) => void;
  deleteItem: (id: number) => void;
  onRestore: (item: HistoryItem) => void;
  setNotification: (message: string) => void;
}

const HistoryTabs: React.FC<HistoryTabsProps> = ({
  history,
  toggleFavorite,
  deleteItem,
  onRestore,
  setNotification
}) => {
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState('history');

  const downloadItem = (item: HistoryItem) => {
    const filename = `prompt-${item.targetPlatform}-${item.id}.txt`;
    downloadTextFile(item.generatedPrompt, filename);
  };

  const restoreItem = (item: HistoryItem) => {
    onRestore(item);
    setNotification(t('inputsRestored'));
    setTimeout(() => setNotification(''), 3000);
  };

  const favorites = history.filter(item => item.isFavorite).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const sortedHistory = [...history].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const itemsToShow = activeTab === 'history' ? sortedHistory : favorites;
  const noItemsMessage = activeTab === 'history' ? t('noHistory') : t('noFavorites');

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="p-2 bg-primary-500/10 rounded-xl text-primary-400">
          <History size={20} />
        </div>
        <h2 className="text-xl font-bold text-surface-50">
          {t('historyTitle')}
        </h2>
      </div>

      <div className="w-full glass-card p-1 md:p-1 border-surface-800/50 overflow-hidden">
        <div className="flex p-1 bg-surface-950/40 rounded-2xl mb-4 border border-surface-800/50">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'history'
              ? 'bg-surface-800 text-primary-400 shadow-sm'
              : 'text-surface-500 hover:text-surface-300'
              }`}
          >
            <Clock size={14} />
            {t('historyTab')} ({history.length})
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === 'favorites'
              ? 'bg-surface-800 text-primary-400 shadow-sm'
              : 'text-surface-500 hover:text-surface-300'
              }`}
          >
            <Star size={14} className={favorites.length > 0 ? 'fill-primary-400' : ''} />
            {t('favoritesTab')} ({favorites.length})
          </button>
        </div>

        <div className="max-h-[500px] overflow-y-auto p-2 md:p-4 space-y-4 custom-scrollbar">
          {itemsToShow.length > 0 ? (
            itemsToShow.map(item => (
              <PromptHistoryItem
                key={item.id}
                item={item}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteItem}
                onDownload={downloadItem}
                onRestore={restoreItem}
              />
            ))
          ) : (
            <div className="text-center py-16 animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-surface-900 rounded-full flex items-center justify-center mx-auto mb-4 text-surface-700">
                <History size={32} />
              </div>
              <p className="text-surface-500 font-medium">{noItemsMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryTabs;