import React, { useState } from 'react';
import { Loader2, Trash2, ChevronUp, ChevronDown, Bot, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { WorkflowStep as WorkflowStepType } from '../../types';
import { platforms } from '../../constants/platforms';
import { useTranslations } from '../../contexts/LanguageContext';
import ImageUploader from '../ui/ImageUploader';

interface WorkflowStepProps {
  step: WorkflowStepType;
  index: number;
  onUpdate: (id: number, newValues: Partial<WorkflowStepType>) => void;
  onRemove: (id: number) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({
  step,
  index,
  onUpdate,
  onRemove,
  onMove,
  isFirst,
  isLast
}) => {
  const { t } = useTranslations();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleIdeaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(step.id, { userIdea: e.target.value });
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(step.id, { targetPlatform: e.target.value });
  };

  const handleImagesChange = (newImages: File[]) => {
    onUpdate(step.id, { images: newImages });
  };

  const getStatusConfig = () => {
    switch (step.status) {
      case 'running': return { color: 'border-primary-500 ring-primary-500/20', icon: <Loader2 size={16} className="animate-spin text-primary-400" />, label: t('statusRunning') || 'Running' };
      case 'completed': return { color: 'border-green-500 ring-green-500/20', icon: <CheckCircle2 size={16} className="text-green-400" />, label: t('statusCompleted') };
      case 'error': return { color: 'border-red-500 ring-red-500/20', icon: <AlertCircle size={16} className="text-red-400" />, label: t('statusError') };
      default: return { color: 'border-surface-800 ring-transparent', icon: null, label: null };
    }
  };

  const status = getStatusConfig();

  return (
    <div className={`glass-card p-0 overflow-hidden border-2 transition-all duration-500 ring-4 ${status.color} ${isCollapsed ? 'mb-2' : ''}`}>
      <div className={`flex items-center justify-between p-4 md:px-6 cursor-pointer hover:bg-surface-800/30 transition-colors ${!isCollapsed ? 'border-b border-surface-800/50' : ''}`} onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center text-xs font-black text-primary-400 border border-surface-700">
            {index + 1}
          </div>
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-surface-100 text-sm md:text-base truncate max-w-[120px] md:max-w-xs">
              {step.userIdea || `${t('step')} ${index + 1}`}
            </h3>
            {status.icon && (
              <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-surface-950/50 border border-surface-800">
                {status.icon}
                {status.label && <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400">{status.label}</span>}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5" onClick={e => e.stopPropagation()}>
          <div className="flex items-center bg-surface-800/50 rounded-lg p-0.5">
            <button
              onClick={() => onMove(index, 'up')}
              disabled={isFirst}
              className="p-1 disabled:opacity-20 text-surface-500 hover:text-white transition-colors"
            >
              <ChevronUp size={16} />
            </button>
            <div className="w-[1px] h-4 bg-surface-700/50" />
            <button
              onClick={() => onMove(index, 'down')}
              disabled={isLast}
              className="p-1 disabled:opacity-20 text-surface-500 hover:text-white transition-colors"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          <button
            onClick={() => onRemove(step.id)}
            className="p-2 text-surface-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-surface-500 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-6 md:p-8 space-y-8 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-4">
            <label className="text-sm font-bold text-surface-300 ml-1 flex items-center gap-2">
              <Bot size={16} className="text-accent-400" />
              {t('ideaLabel')}
            </label>
            <textarea
              rows={3}
              value={step.userIdea}
              onChange={handleIdeaChange}
              placeholder={t('ideaPlaceholder')}
              className="input-field min-h-[100px] text-sm"
            />
            <p className="text-[10px] text-surface-500 ml-1 font-medium tracking-wide">
              {t('variableInfo')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-surface-300 ml-1 flex items-center gap-2">
                <Layers size={16} className="text-primary-400" />
                {t('platformLabel')}
              </label>
              <div className="relative">
                <select
                  value={step.targetPlatform}
                  onChange={handlePlatformChange}
                  className="input-field appearance-none pr-12 text-sm"
                  style={{
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="%2394a3b8" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.25em'
                  }}
                >
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id} className="bg-surface-900">{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-0 md:pt-1">
              <ImageUploader images={step.images} onImagesChange={handleImagesChange} />
            </div>
          </div>

          {step.output && (
            <div className="space-y-3 pt-4 border-t border-surface-800/50">
              <label className="text-sm font-bold text-surface-300 ml-1 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-400" />
                {t('stepOutput')}
              </label>
              <pre className="text-xs text-surface-400 bg-surface-950 p-4 rounded-2xl whitespace-pre-wrap break-words border border-surface-800/50 font-mono leading-relaxed">
                <code>{step.output}</code>
              </pre>
            </div>
          )}

          {step.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{step.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowStep;