import { Copy, Terminal, Sparkles, Scissors, Palette, Wand2, RefreshCw } from 'lucide-react';
import { useTranslations } from '../../contexts/LanguageContext';

interface ResultDisplayProps {
  prompt: string;
  onCopy: () => void;
  onRefine?: (action: 'enhance' | 'shorten' | 'creative' | 'clarify') => void;
  isRefining?: boolean;
}

const ResultDisplay = ({ prompt, onCopy, onRefine, isRefining }: ResultDisplayProps) => {
  const { t } = useTranslations();

  if (!prompt) return null;

  const refineActions = [
    { id: 'enhance', icon: Wand2, label: t('refineEnhance'), color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'shorten', icon: Scissors, label: t('refineShorten'), color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'creative', icon: Palette, label: t('refineCreative'), color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'clarify', icon: Sparkles, label: t('refineClarify'), color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ] as const;

  return (
    <div className="mt-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="p-2 bg-accent-500/10 rounded-xl text-accent-400">
          <Terminal size={20} />
        </div>
        <h2 className="text-xl font-bold text-surface-50">
          {t('generatedPromptTitle')}
        </h2>
      </div>

      <div className="group relative glass-card p-0 overflow-hidden border-surface-700/30">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={onCopy}
            className="p-2.5 bg-surface-800/80 backdrop-blur-md border border-surface-700/50 text-surface-300 hover:text-primary-400 hover:border-primary-500/50 rounded-xl transition-all duration-300 group/btn"
            title={t('copySuccess') || 'Copy to clipboard'}
          >
            <Copy size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>

        <div className="p-6 pt-12 md:p-8 md:pt-12 bg-surface-900/20">
          <pre className="text-surface-200 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed selection:bg-primary-500/30">
            <code>{prompt}</code>
          </pre>
        </div>

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-accent-500 opacity-50" />
      </div>

      {/* Refinement Section */}
      <div className="mt-8 px-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-surface-800/50" />
          <span className="text-xs font-bold text-surface-500 uppercase tracking-widest">{t('refineTitle')}</span>
          <div className="h-px flex-1 bg-surface-800/50" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {refineActions.map((action) => (
            <button
              key={action.id}
              disabled={isRefining}
              onClick={() => onRefine?.(action.id)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl glass-card border-surface-700/30 hover:border-surface-600 transition-all duration-300 group ${isRefining ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
            >
              <action.icon size={16} className={`${action.color} group-hover:scale-110 transition-transform`} />
              <span className="text-xs font-bold text-surface-300 group-hover:text-surface-100 transition-colors">
                {action.label}
              </span>
            </button>
          ))}
        </div>

        {isRefining && (
          <div className="mt-4 flex items-center justify-center gap-2 text-primary-400 animate-pulse">
            <RefreshCw size={14} className="animate-spin" />
            <span className="text-xs font-bold">{t('refining')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;