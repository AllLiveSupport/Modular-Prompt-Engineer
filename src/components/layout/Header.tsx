import { Settings, Sparkles } from 'lucide-react';
import { useTranslations } from '../../contexts/LanguageContext';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header = ({ onOpenSettings }: HeaderProps) => {
  const { t } = useTranslations();

  return (
    <header className="w-full flex items-center justify-between mb-8 pb-4 border-b border-surface-800/50 sticky top-0 z-10 bg-surface-950/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2.5 rounded-2xl shadow-lg shadow-primary-500/20">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-surface-400 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-xs text-surface-500 font-medium tracking-wider uppercase">{t('subtitle') || 'AI Prompt Forge'}</p>
        </div>
      </div>

      <button
        onClick={onOpenSettings}
        className="p-3 bg-surface-900/50 border border-surface-800 hover:border-primary-500/50 hover:bg-primary-500/10 rounded-2xl text-surface-400 hover:text-primary-400 transition-all duration-300 group"
        title={t('settings')}
      >
        <Settings size={22} className="group-hover:rotate-90 transition-transform duration-500" />
      </button>
    </header>
  );
};

export default Header;