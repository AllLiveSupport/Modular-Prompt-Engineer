import React from 'react';
import { Copy, Terminal, Download } from 'lucide-react';
import { useTranslations } from '../../contexts/LanguageContext';
import { platforms } from '../../constants/platforms';

interface ComparisonDisplayProps {
    results: { platformId: string; prompt: string }[];
    onCopy: (prompt: string) => void;
    onDownload: (platformId: string, prompt: string) => void;
}

const ComparisonDisplay: React.FC<ComparisonDisplayProps> = ({ results, onCopy, onDownload }) => {
    const { t } = useTranslations();

    if (results.length === 0) return null;

    return (
        <div className="mt-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6 px-2">
                <div className="p-2 bg-primary-500/10 rounded-xl text-primary-400">
                    <Terminal size={20} />
                </div>
                <h2 className="text-xl font-bold text-surface-50">
                    {t('comparisonResults') || 'Platform Comparison'}
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {results.map((result) => {
                    const platformName = platforms.find(p => p.id === result.platformId)?.name || result.platformId;

                    return (
                        <div key={result.platformId} className="flex flex-col h-full glass-card p-0 overflow-hidden border-surface-700/30 group">
                            {/* Header */}
                            <div className="p-4 bg-surface-950/40 border-b border-surface-800/50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-primary-400 uppercase tracking-tighter bg-primary-400/10 px-2 py-1 rounded-lg">
                                        {platformName}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => onCopy(result.prompt)}
                                        className="p-2 text-surface-400 hover:text-primary-400 transition-colors"
                                        title={t('copySuccess')}
                                    >
                                        <Copy size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDownload(result.platformId, result.prompt)}
                                        className="p-2 text-surface-400 hover:text-accent-400 transition-colors"
                                        title={t('downloadPrompt')}
                                    >
                                        <Download size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 bg-surface-900/20 max-h-[400px] overflow-y-auto custom-scrollbar">
                                <pre className="text-surface-200 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed selection:bg-primary-500/30">
                                    <code>{result.prompt}</code>
                                </pre>
                            </div>

                            {/* Footer Indicator */}
                            <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ComparisonDisplay;
