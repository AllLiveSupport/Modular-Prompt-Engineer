import React from 'react';
import { Star, Trash2, RefreshCw, Download, Layers } from 'lucide-react';
import { PromptHistoryItem as HistoryItem } from '../../types';
import { platforms } from '../../constants/platforms';
import { useTranslations } from '../../contexts/LanguageContext';

interface PromptHistoryItemProps {
  item: HistoryItem;
  onRestore: (item: HistoryItem) => void;
  onToggleFavorite: (id: number) => void;
  onDelete: (id: number) => void;
  onDownload: (item: HistoryItem) => void;
}

const PromptHistoryItem: React.FC<PromptHistoryItemProps> = ({
  item,
  onRestore,
  onToggleFavorite,
  onDelete,
  onDownload
}) => {
  const { t } = useTranslations();
  const platform = platforms.find(p => p.id === item.targetPlatform);
  const date = new Date(item.timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="group bg-surface-900/40 hover:bg-surface-800/40 border border-surface-800/50 hover:border-primary-500/30 p-4 rounded-2xl transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-surface-800 rounded-xl text-surface-400 group-hover:text-primary-400 transition-colors">
            <Layers size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-surface-100 truncate">
              {item.userIdea || t('ideaPlaceholder')}
            </p>
            <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest mt-0.5">
              {platform?.name || item.targetPlatform}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onToggleFavorite(item.id)}
            className={`p-2 rounded-lg transition-colors ${item.isFavorite ? 'text-primary-400 bg-primary-500/10' : 'text-surface-500 hover:text-primary-400 hover:bg-surface-800'
              }`}
          >
            <Star size={14} className={item.isFavorite ? 'fill-current' : ''} />
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-surface-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="relative mb-3">
        <p className="text-xs text-surface-400 bg-surface-950/50 p-3 rounded-xl font-mono whitespace-pre-wrap break-words max-h-24 overflow-y-auto border border-surface-800/50 leading-relaxed">
          {item.generatedPrompt}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-[10px] text-surface-600 font-medium uppercase tracking-wider">{date}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRestore(item)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-surface-400 hover:text-surface-100 bg-surface-800 hover:bg-surface-700 px-3 py-1.5 rounded-lg transition-all"
          >
            <RefreshCw size={12} />
            <span>{t('restoreInputs')}</span>
          </button>

          <button
            onClick={() => onDownload(item)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-primary-600 hover:bg-primary-500 px-3 py-1.5 rounded-lg transition-all shadow-lg shadow-primary-500/10"
          >
            <Download size={12} />
            <span>{t('downloadPrompt')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptHistoryItem;