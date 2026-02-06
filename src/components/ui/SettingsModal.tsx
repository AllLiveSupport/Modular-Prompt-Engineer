import { geminiModels } from '../../constants/platforms';
import { Settings, X, Key, Cpu, Globe } from 'lucide-react';
import { useTranslations, languages } from '../../contexts/LanguageContext';

interface SettingsModalProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  model: string;
  setModel: (model: string) => void;
  outputLanguage: string;
  setOutputLanguage: (lang: string) => void;
  closeModal: () => void;
}

const SettingsModal = ({
  apiKey,
  setApiKey,
  model,
  setModel,
  outputLanguage,
  setOutputLanguage,
  closeModal
}: SettingsModalProps) => {
  const { t } = useTranslations();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-surface-950/60 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      />

      <div className="relative w-full max-w-xl glass-morphism rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/10 rounded-xl text-primary-400">
                <Settings size={24} />
              </div>
              <h2 className="text-xl font-bold text-surface-50">{t('settingsTitle')}</h2>
            </div>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-surface-800 rounded-xl text-surface-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8 max-h-[65vh] overflow-y-auto px-1 custom-scrollbar">
            {/* API Key Section */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-surface-300 ml-1">
                Gemini API Key
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-primary-400 transition-colors">
                  <Key size={18} />
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your API key here..."
                  className="input-field pl-12"
                />
              </div>
              <p className="text-xs text-surface-500 ml-1">
                Get your key from{' '}
                <a
                  href="https://aistudio.google.com/app/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            {/* Output Language Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-surface-300 ml-1">
                <Globe size={16} className="text-primary-400" />
                <label className="text-sm font-semibold">
                  Prompt Çıktı Dili
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setOutputLanguage(l.code)}
                    className={`p-4 rounded-2xl border text-sm font-medium transition-all duration-300 text-center ${outputLanguage === l.code
                      ? 'bg-primary-500/15 border-primary-500/50 text-white shadow-lg'
                      : 'bg-surface-900/40 border-surface-800 text-surface-500 hover:border-surface-700'
                      }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-surface-300 ml-1">
                <Cpu size={16} className="text-primary-400" />
                <label className="text-sm font-semibold">
                  {t('modelLabel') || 'Gemini Model Seçimi'}
                </label>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {geminiModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModel(m.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-medium transition-all duration-300 ${model === m.id
                      ? 'bg-primary-500/15 border-primary-500/50 text-white shadow-lg shadow-primary-500/10'
                      : 'bg-surface-900/40 border-surface-800 text-surface-500 hover:border-surface-700 hover:bg-surface-800/40'
                      }`}
                  >
                    <div className="flex flex-col text-left">
                      <span className={model === m.id ? 'text-primary-400' : ''}>{m.name}</span>
                      <span className="text-[10px] opacity-60 font-mono mt-0.5">{m.id}</span>
                    </div>
                    {model === m.id && (
                      <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <button
              onClick={closeModal}
              className="btn-primary w-full shadow-xl shadow-primary-500/20"
            >
              {t('saveButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;