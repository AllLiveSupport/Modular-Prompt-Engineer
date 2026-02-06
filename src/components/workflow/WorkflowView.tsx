import React, { useState } from 'react';
import { PlusCircle, Play, Zap } from 'lucide-react';
import { WorkflowStep as WorkflowStepType, PromptHistoryItem } from '../../types';
import { platforms } from '../../constants/platforms';
import { useTranslations } from '../../contexts/LanguageContext';
import { generateSinglePrompt } from '../../services/geminiApi';
import WorkflowStep from './WorkflowStep';
import LoadingSpinner from '../ui/LoadingSpinner';

interface WorkflowViewProps {
  apiKey: string;
  model: string;
  outputLanguage: string;
  setHistory: (history: PromptHistoryItem[] | ((prev: PromptHistoryItem[]) => PromptHistoryItem[])) => void;
}

const WorkflowView: React.FC<WorkflowViewProps> = ({ apiKey, model, outputLanguage, setHistory }) => {
  const { t } = useTranslations();
  const [steps, setSteps] = useState<WorkflowStepType[]>([
    {
      id: 1,
      userIdea: '',
      targetPlatform: platforms[0].id,
      images: [],
      status: 'pending',
      output: null,
      error: null
    }
  ]);
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);

  const addStep = () => {
    const newStep: WorkflowStepType = {
      id: Date.now(),
      userIdea: '',
      targetPlatform: platforms[0].id,
      images: [],
      status: 'pending',
      output: null,
      error: null
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: number) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const updateStep = (id: number, newValues: Partial<WorkflowStepType>) => {
    setSteps(currentSteps =>
      currentSteps.map(step =>
        step.id === id ? { ...step, ...newValues } : step
      )
    );
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const runWorkflow = async () => {
    setIsWorkflowRunning(true);
    setSteps(currentSteps =>
      currentSteps.map(s => ({ ...s, status: 'pending' as const, output: null, error: null }))
    );

    const completedOutputs: Record<string, string> = {};

    for (let i = 0; i < steps.length; i++) {
      let currentStep = steps[i];
      setSteps(currentSteps =>
        currentSteps.map(s =>
          s.id === currentStep.id ? { ...s, status: 'running' as const } : s
        )
      );

      try {
        let processedIdea = currentStep.userIdea;
        const variableRegex = /\{\{adım(\d+)\.çıktı\}\}/g;
        processedIdea = processedIdea.replace(variableRegex, (_, stepNumber) => {
          const outputKey = `step${stepNumber}`;
          return completedOutputs[outputKey] || '';
        });

        const result = await generateSinglePrompt({
          apiKey,
          userIdea: processedIdea,
          images: currentStep.images,
          targetPlatform: currentStep.targetPlatform,
          model,
          outputLanguage,
          t
        });

        setSteps(currentSteps =>
          currentSteps.map(s =>
            s.id === currentStep.id
              ? { ...s, status: 'completed' as const, output: result }
              : s
          )
        );

        completedOutputs[`step${i + 1}`] = result;

        const newHistoryItem: PromptHistoryItem = {
          id: Date.now(),
          userIdea: currentStep.userIdea,
          targetPlatform: currentStep.targetPlatform,
          generatedPrompt: result,
          timestamp: new Date().toISOString(),
          isFavorite: false,
        };

        setHistory(prev => [newHistoryItem, ...prev].slice(0, 20));
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        setSteps(currentSteps =>
          currentSteps.map(s =>
            s.id === currentStep.id
              ? { ...s, status: 'error' as const, error: errorMessage }
              : s
          )
        );
        setIsWorkflowRunning(false);
        return;
      }
    }

    setIsWorkflowRunning(false);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 bg-primary-500/10 rounded-xl text-primary-400">
          <Zap size={20} />
        </div>
        <h2 className="text-xl font-bold text-surface-50">
          {t('workflowTitle')}
        </h2>
      </div>

      <div className="space-y-6 relative before:absolute before:left-[1.85rem] before:top-8 before:bottom-8 before:w-0.5 before:bg-surface-800/50 before:hidden md:before:block">
        {steps.map((step, index) => (
          <WorkflowStep
            key={step.id}
            step={step}
            index={index}
            onUpdate={updateStep}
            onRemove={removeStep}
            onMove={moveStep}
            isFirst={index === 0}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-surface-800/50">
        <button
          onClick={addStep}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 bg-surface-900 border border-surface-700 hover:border-primary-500/50 hover:bg-surface-800 text-surface-200 font-bold rounded-2xl transition-all duration-300"
        >
          <PlusCircle size={20} className="text-primary-400" />
          {t('addStep')}
        </button>

        <button
          onClick={runWorkflow}
          disabled={isWorkflowRunning || steps.some(s => !s.userIdea.trim())}
          className="w-full sm:flex-1 group relative btn-primary overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-center gap-3">
            {isWorkflowRunning ? (
              <>
                <LoadingSpinner size={22} className="text-white" />
                <span>{t('runningWorkflow')}</span>
              </>
            ) : (
              <>
                <Play size={20} className="group-hover:translate-x-0.5 transition-transform" />
                <span className="uppercase tracking-wider">{t('runWorkflow')}</span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default WorkflowView;