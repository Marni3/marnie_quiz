export type AIProvider = "gemini" | "openai" | "anthropic" | "openrouter" | "deepseek" | "groq";

export interface ProviderConfig {
  provider: AIProvider;
  apiKey: string;
  defaultModel: string;
  customBaseUrl?: string;
}

export interface ModelOption {
  id: string;
  name: string;
  provider: AIProvider;
  isRecommended?: boolean;
  contextWindow?: string;
}

export type TutorFunctionMode =
  | "chat"
  | "custom_module"
  | "tricky_questions"
  | "formula_sheet"
  | "review_exam";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  functionMode?: TutorFunctionMode;
  contextTag?: string;
  actionPayload?: {
    type: "module_preview" | "exam_remix" | "formula_card";
    data: any;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  provider: AIProvider;
  model: string;
  messages: ChatMessage[];
  attachedContext?: {
    type: "module" | "attempt" | "custom";
    id: string;
    title: string;
    payload?: any;
  };
}

export interface ExamReviewContextPayload {
  attemptId: string;
  examTitle: string;
  subjectTag?: string;
  score: number;
  total: number;
  percentage: number;
  questions: Array<{
    id: string;
    promptText: string;
    selectedChoice: string | null;
    correctChoice: string;
    isCorrect: boolean;
    explanation: string;
  }>;
}

export interface StudyVaultBackup {
  version: 1;
  exportedAt: string;
  configs: {
    activeProvider: AIProvider;
    activeModel: string;
    apiKeys: Partial<Record<AIProvider, string>>;
  };
  sessions: ChatSession[];
  customModules?: any[];
  savedFormulas?: any[];
}
