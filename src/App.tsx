import { useState, useEffect } from 'react';
import { Sparkles, Bot, Zap } from 'lucide-react';

import { LanguageProvider, useTranslations } from './contexts/LanguageContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePromptHistory } from './hooks/usePromptHistory';
import { copyToClipboard } from './utils/fileUtils';
import { extractVariables, injectVariables } from './utils/promptUtils';
import { generateSinglePrompt, refinePrompt } from './services/geminiApi';
import { platforms } from './constants/platforms';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SettingsModal from './components/ui/SettingsModal';
import ImageUploader from './components/ui/ImageUploader';
import VariableForm from './components/ui/VariableForm';
import ComparisonDisplay from './components/ui/ComparisonDisplay';
import ResultDisplay from './components/ui/ResultDisplay';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Notification from './components/ui/Notification';
import HistoryTabs from './components/history/HistoryTabs';
import WorkflowView from './components/workflow/WorkflowView';
import { LayoutGrid, CheckSquare, Square } from 'lucide-react';
import { downloadTextFile } from './utils/fileUtils';

function PromptGenerator() {
  const { t } = useTranslations();
  const [apiKey, setApiKey] = useLocalStorage('gemini-api-key', '');
  const [model, setModel] = useLocalStorage('gemini-model', 'gemini-2.5-flash');
  const [userIdea, setUserIdea] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [targetPlatform, setTargetPlatform] = useState(platforms[0].id);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [activeView, setActiveView] = useState('single');
  const [outputLanguage, setOutputLanguage] = useLocalStorage('prompt-output-lang', 'en');

  const [detectedVariables, setDetectedVariables] = useState<string[]>([]);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([platforms[0].id]);
  const [comparisonResults, setComparisonResults] = useState<{ platformId: string; prompt: string }[]>([]);

  useEffect(() => {
    const vars = extractVariables(userIdea);
    setDetectedVariables(vars);

    // Cleanup old values that are no longer in the text
    setVariableValues(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        if (!vars.includes(key)) delete next[key];
      });
      return next;
    });
  }, [userIdea]);

  const handleVariableChange = (key: string, value: string) => {
    setVariableValues(prev => ({ ...prev, [key]: value }));
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id)
        ? (prev.length > 1 ? prev.filter(p => p !== id) : prev)
        : [...prev, id]
    );
  };

  const { history, setHistory, addToHistory, toggleFavorite, deleteItem } = usePromptHistory();

  const handleCopy = async (text: string = generatedPrompt) => {
    if (!text) return;

    const success = await copyToClipboard(text);
    setNotification({
      message: success ? t('copySuccess') : t('copyError'),
      type: success ? 'success' : 'error'
    });
  };

  const handleDownloadComparison = (platformId: string, prompt: string) => {
    const filename = `prompt-${platformId}-${Date.now()}.txt`;
    downloadTextFile(prompt, filename);
  };

  const handleGenerateSinglePrompt = async () => {
    if (!userIdea.trim() && images.length === 0) {
      showNotification(t('errorIdeaOrImage'), 'info');
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedPrompt('');
    setComparisonResults([]);

    const processedIdea = injectVariables(userIdea, variableValues);

    try {
      if (isComparisonMode && selectedPlatforms.length > 1) {
        // Parallel generation for multiple platforms
        const results = await Promise.all(
          selectedPlatforms.map(async (platformId) => {
            const prompt = await generateSinglePrompt({
              apiKey,
              userIdea: processedIdea,
              images,
              targetPlatform: platformId,
              model,
              outputLanguage,
              t
            });
            return { platformId, prompt };
          })
        );

        setComparisonResults(results);
        setGeneratedPrompt(results[0].prompt); // Use first as primary for copy/history compatibility
        addToHistory({
          userIdea: processedIdea,
          targetPlatform: 'Multiple',
          generatedPrompt: results[0].prompt,
          multiPrompts: results
        });
      } else {
        // Single platform generation
        const result = await generateSinglePrompt({
          apiKey,
          userIdea: processedIdea,
          images,
          targetPlatform: isComparisonMode ? selectedPlatforms[0] : targetPlatform,
          model,
          outputLanguage,
          t
        });

        setGeneratedPrompt(result);
        addToHistory({
          userIdea: processedIdea,
          targetPlatform: isComparisonMode ? selectedPlatforms[0] : targetPlatform,
          generatedPrompt: result
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : t('errorGeneric');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefinePrompt = async (action: 'enhance' | 'shorten' | 'creative' | 'clarify') => {
    if (!generatedPrompt) return;

    setIsRefining(true);
    try {
      const result = await refinePrompt({
        apiKey,
        originalPrompt: generatedPrompt,
        action,
        model,
        outputLanguage,
        t
      });

      setGeneratedPrompt(result);
      addToHistory({
        userIdea: `${t('refineTitle')} (${action}): ${userIdea}`,
        targetPlatform,
        generatedPrompt: result
      });
      showNotification(t('copySuccess'), 'success');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : t('errorGeneric');
      showNotification(errorMessage, 'error');
    } finally {
      setIsRefining(false);
    }
  };

  const handleRestoreInputs = (item: any) => {
    setActiveView('single');
    setUserIdea(item.userIdea);
    setTargetPlatform(item.targetPlatform);
    if (item.multiPrompts) {
      setIsComparisonMode(true);
      setSelectedPlatforms(item.multiPrompts.map((p: any) => p.platformId));
      setComparisonResults(item.multiPrompts);
      setGeneratedPrompt(item.generatedPrompt);
    } else {
      setIsComparisonMode(false);
      setGeneratedPrompt(item.generatedPrompt);
      setComparisonResults([]);
    }
    setImages([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-10 transition-colors duration-500">
      {isSettingsOpen && (
        <SettingsModal
          apiKey={apiKey}
          setApiKey={setApiKey}
          model={model}
          setModel={setModel}
          outputLanguage={outputLanguage}
          setOutputLanguage={setOutputLanguage}
          closeModal={() => setIsSettingsOpen(false)}
        />
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}

      <main className="w-full max-w-4xl flex flex-col items-center">
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />

        <div className="w-full text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <p className="text-lg text-surface-400 max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="w-full glass-card border-primary-500/10 shadow-2xl p-1 md:p-1">
          <div className="flex p-1.5 bg-surface-950/40 backdrop-blur-sm rounded-[1.4rem] mb-6 border border-surface-800/50">
            <button
              onClick={() => setActiveView('single')}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-2xl text-sm font-bold transition-all duration-500 ${activeView === 'single'
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/20'
                : 'text-surface-500 hover:text-surface-200 hover:bg-surface-900/40'
                }`}
            >
              <Bot size={18} className={activeView === 'single' ? 'animate-pulse' : ''} />
              {t('viewSingle')}
            </button>

            <button
              onClick={() => setActiveView('workflow')}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-2xl text-sm font-bold transition-all duration-500 ${activeView === 'workflow'
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/20'
                : 'text-surface-500 hover:text-surface-200 hover:bg-surface-900/40'
                }`}
            >
              <Zap size={18} className={activeView === 'workflow' ? 'animate-pulse' : ''} />
              {t('viewWorkflow')}
            </button>
          </div>

          <div className="p-5 md:p-7 pt-2">
            {activeView === 'single' ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <label htmlFor="user-idea" className="text-lg font-bold text-surface-50 flex items-center gap-2">
                    <Sparkles size={20} className="text-accent-400" />
                    {t('ideaLabel')}
                  </label>
                  <textarea
                    id="user-idea"
                    rows={4}
                    value={userIdea}
                    onChange={(e) => setUserIdea(e.target.value)}
                    placeholder={t('ideaPlaceholder')}
                    className="input-field min-h-[120px] resize-none"
                  />
                </div>

                {detectedVariables.length > 0 && (
                  <VariableForm
                    variables={detectedVariables}
                    values={variableValues}
                    onChange={handleVariableChange}
                  />
                )}

                <div className="pt-2">
                  <ImageUploader images={images} onImagesChange={setImages} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="platform" className="text-lg font-bold text-surface-50 flex items-center gap-2">
                      <Zap size={20} className="text-primary-400" />
                      {t('platformLabel')}
                    </label>
                    <button
                      onClick={() => setIsComparisonMode(!isComparisonMode)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-300 ${isComparisonMode
                        ? 'bg-accent-500/20 border-accent-500/50 text-accent-400'
                        : 'bg-surface-900 border-surface-700 text-surface-400 hover:border-surface-600'
                        }`}
                    >
                      <LayoutGrid size={14} />
                      {t('comparisonResults') || 'Compare'}
                    </button>
                  </div>

                  {isComparisonMode ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      {platforms.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => togglePlatform(p.id)}
                          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 text-left ${selectedPlatforms.includes(p.id)
                            ? 'bg-primary-500/10 border-primary-500/50 text-surface-50'
                            : 'bg-surface-900/40 border-surface-800/50 text-surface-500 hover:border-surface-700'
                            }`}
                        >
                          <div className={`p-1 rounded-md ${selectedPlatforms.includes(p.id) ? 'bg-primary-500 text-white' : 'bg-surface-800'}`}>
                            {selectedPlatforms.includes(p.id) ? <CheckSquare size={14} /> : <Square size={14} />}
                          </div>
                          <span className="text-xs font-bold truncate">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="relative group">
                      <select
                        id="platform"
                        value={targetPlatform}
                        onChange={(e) => setTargetPlatform(e.target.value)}
                        className="input-field appearance-none pr-12 cursor-pointer"
                        style={{
                          backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="%2394a3b8" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1.25rem center',
                          backgroundSize: '1.5em'
                        }}
                      >
                        {platforms.map((p) => (
                          <option key={p.id} value={p.id} className="bg-surface-900 text-surface-100">
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 animate-in shake duration-500">
                    <Zap size={18} className="shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleGenerateSinglePrompt}
                  disabled={isLoading}
                  className="btn-primary w-full group overflow-hidden relative"
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <div className="flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <LoadingSpinner size={22} className="text-white" />
                        <span className="tracking-wide">{t('generatingButton')}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={22} className="group-hover:rotate-12 transition-transform" />
                        <span className="tracking-wide uppercase">{t('generateButton')}</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            ) : (
              <WorkflowView apiKey={apiKey} model={model} outputLanguage={outputLanguage} setHistory={setHistory} />
            )}
          </div>
        </div>

        {activeView === 'single' && (
          isComparisonMode && comparisonResults.length > 0 ? (
            <ComparisonDisplay
              results={comparisonResults}
              onCopy={handleCopy}
              onDownload={handleDownloadComparison}
            />
          ) : (
            <ResultDisplay
              prompt={generatedPrompt}
              onCopy={() => handleCopy()}
              onRefine={handleRefinePrompt}
              isRefining={isRefining}
            />
          )
        )}

        <div className="w-full mt-16 px-2">
          <HistoryTabs
            history={history}
            toggleFavorite={toggleFavorite}
            deleteItem={deleteItem}
            onRestore={handleRestoreInputs}
            setNotification={showNotification}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <PromptGenerator />
    </LanguageProvider>
  );
}