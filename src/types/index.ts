export interface PromptHistoryItem {
  id: number;
  userIdea: string;
  targetPlatform: string;
  generatedPrompt: string;
  timestamp: string;
  isFavorite: boolean;
  multiPrompts?: { platformId: string; prompt: string }[];
}

export interface WorkflowStep {
  id: number;
  userIdea: string;
  targetPlatform: string;
  images: File[];
  status: 'pending' | 'running' | 'completed' | 'error';
  output: string | null;
  error: string | null;
}

export interface Platform {
  id: string;
  name: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
}