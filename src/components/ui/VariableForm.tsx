import React from 'react';
import { useTranslations } from '../../contexts/LanguageContext';
import { Sparkles } from 'lucide-react';

interface VariableFormProps {
    variables: string[];
    values: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

const VariableForm: React.FC<VariableFormProps> = ({ variables, values, onChange }) => {
    const { t } = useTranslations();

    if (variables.length === 0) return null;

    return (
        <div className="space-y-4 p-6 glass-card border-primary-500/20 bg-primary-500/5 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-primary-400" />
                <h3 className="text-sm font-bold text-surface-200 uppercase tracking-widest">
                    {t('variablesFound') || 'Variables Detected'}
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {variables.map((variable) => (
                    <div key={variable} className="space-y-2">
                        <label className="text-xs font-bold text-surface-400 capitalize">
                            {variable.replace(/_/g, ' ')}
                        </label>
                        <input
                            type="text"
                            value={values[variable] || ''}
                            onChange={(e) => onChange(variable, e.target.value)}
                            placeholder={`Enter ${variable}...`}
                            className="w-full bg-surface-950/50 border border-surface-700/50 rounded-xl p-3 text-sm text-surface-100 focus:ring-1 focus:ring-primary-500/50 focus:outline-none transition-all"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VariableForm;
