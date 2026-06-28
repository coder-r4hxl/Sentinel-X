import { create } from 'zustand';

interface VoiceState {
  muted: boolean;
  speaking: boolean;
  speakingText: string;
  toggleMute: () => void;
  stopSpeaking: () => void;
  speak: (text: string) => void;
}

export const useVoiceStore = create<VoiceState>((set, get) => ({
  muted: false,
  speaking: false,
  speakingText: '',
  toggleMute: () => set((state) => ({ muted: !state.muted })),
  stopSpeaking: () => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    set({ speaking: false, speakingText: '' });
  },
  speak: (text) => {
    if (typeof window === 'undefined' || get().muted) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    set({ speaking: true, speakingText: text });
    utterance.onend = () => set({ speaking: false, speakingText: '' });
    window.speechSynthesis.speak(utterance);
  },
}));
