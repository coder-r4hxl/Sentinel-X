import { create } from 'zustand';
import { getAdvisorReply, type AdvisorMessage } from '@/services/advisorService';

interface ChatState {
  messages: AdvisorMessage[];
  draft: string;
  isLoading: boolean;
  setDraft: (value: string) => void;
  clearConversation: () => void;
  submitQuestion: (question: string) => void;
  setLoading: (value: boolean) => void;
}

const initialMessage: AdvisorMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'I am AEGIS, your rule-based security advisor. I will analyze the current assessment data and respond with direct, evidence-based guidance.',
  createdAt: new Date().toISOString(),
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [initialMessage],
  draft: '',
  isLoading: false,
  setDraft: (value) => set({ draft: value }),
  clearConversation: () => set({ messages: [initialMessage], draft: '', isLoading: false }),
  setLoading: (value) => set({ isLoading: value }),
  submitQuestion: (question) => {
    if (!question.trim()) return;

    const userMessage: AdvisorMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: question.trim(),
      createdAt: new Date().toISOString(),
    };

    const reply = getAdvisorReply(question);
    const assistantMessage: AdvisorMessage = {
      id: `${Date.now()}-assistant`,
      role: 'assistant',
      content: reply.text,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage, assistantMessage],
      draft: '',
      isLoading: false,
    }));
  },
}));
