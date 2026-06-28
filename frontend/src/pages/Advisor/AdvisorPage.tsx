import { motion } from 'framer-motion';
import { Mic, MicOff, RotateCcw, Send, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAssessmentStore } from '@/store/assessmentStore';
import { useChatStore } from '@/store/chatStore';
import { getAdvisorReply, getAdvisorSummary } from '@/services/advisorService';
import { useVoiceStore } from '@/store/voiceStore';

const quickPrompts = ['Is my browser secure?', 'Why is my score low?', 'How can I improve privacy?', 'Explain fingerprinting.'];

export default function AdvisorPage() {
  const navigate = useNavigate();
  const { report } = useAssessmentStore();
  const { messages, draft, setDraft, submitQuestion, clearConversation } = useChatStore();
  const { speaking, speakingText, muted, toggleMute, stopSpeaking, speak } = useVoiceStore();
  const [input, setInput] = useState('');

  const summary = useMemo(() => getAdvisorSummary(), [report]);

  const handleSubmit = (value?: string) => {
    const question = (value ?? input).trim();
    if (!question) return;
    setInput('');
    setDraft(question);
    submitQuestion(question);
    const reply = getAdvisorReply(question);
    if (!muted) {
      speak(reply.text);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.9fr_1.35fr_0.85fr]">
        <motion.aside initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="rounded-[1.75rem] border border-white/10 bg-[#0B1118]/85 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">AEGIS</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Conversation history</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={clearConversation}>
              <RotateCcw size={16} />
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {messages.slice(-5).map((message) => (
              <div key={message.id} className={`rounded-[1rem] border p-3 text-sm ${message.role === 'assistant' ? 'border-[#00B8FF]/20 bg-[#00B8FF]/10 text-slate-200' : 'border-white/10 bg-[#05070A]/70 text-slate-300'}`}>
                <p className="font-medium text-white">{message.role === 'assistant' ? 'AEGIS' : 'You'}</p>
                <p className="mt-2 leading-7">{message.content}</p>
              </div>
            ))}
          </div>
        </motion.aside>

        <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(0,184,255,0.14),_transparent_45%),linear-gradient(135deg,_rgba(11,17,24,0.96),_rgba(4,7,10,0.96))] p-5 shadow-[0_25px_90px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/10 px-3 py-1 text-sm text-[#8bdbff]">
                <Sparkles size={14} />
                AEGIS AI Security Advisor
              </div>
              <h1 className="mt-3 text-2xl font-semibold text-white">Security analysis and guidance</h1>
            </div>
            <Button variant="secondary" size="sm" onClick={() => (muted ? toggleMute() : toggleMute())}>
              {muted ? <MicOff size={16} /> : <Mic size={16} />}
              {muted ? 'Voice off' : 'Voice on'}
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`rounded-[1.2rem] border px-4 py-3 ${message.role === 'assistant' ? 'border-[#00B8FF]/20 bg-[#00B8FF]/10 text-slate-100' : 'border-white/10 bg-[#05070A]/70 text-slate-200'}`}>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{message.role === 'assistant' ? 'AEGIS' : 'You'}</p>
                <p className="mt-3 leading-8">{message.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-[#05070A]/70 p-4">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button key={prompt} type="button" onClick={() => handleSubmit(prompt)} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition hover:border-[#00B8FF]/30 hover:text-white">
                  {prompt}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about your browser posture, findings, or privacy controls" className="flex-1 border-white/10 bg-white/[0.04] text-slate-100" onKeyDown={(event) => event.key === 'Enter' && handleSubmit()} />
              <Button onClick={() => handleSubmit()}>
                <Send size={16} />
                Send
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <Button variant="secondary" size="sm" onClick={() => stopSpeaking()}>
                <MicOff size={16} />
                Stop speaking
              </Button>
              {speaking ? <span>Speaking: {speakingText}</span> : <span>Voice ready</span>}
            </div>
          </div>
        </motion.main>

        <motion.aside initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-[#0B1118]/85 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Live assessment summary</p>
            <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-[#05070A]/70 p-4">
              <p className="text-sm text-slate-400">Security score</p>
              <p className="mt-2 text-4xl font-semibold text-white">{summary.score}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.24em] text-[#14F195]">{summary.risk}</p>
            </div>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1rem] border border-white/10 bg-[#05070A]/70 p-3">
                <p className="text-sm text-slate-400">Current recommendations</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {summary.recommendations.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#00B8FF]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1rem] border border-white/10 bg-[#05070A]/70 p-3">
                <p className="text-sm text-slate-400">Recent findings</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {summary.findings.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#14F195]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-[#0B1118]/85 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Quick actions</p>
            <div className="mt-4 space-y-2">
              {['Improve Privacy', 'Improve Security', 'Explain Findings', 'View Report', 'Run Assessment Again'].map((action) => (
                <button key={action} type="button" onClick={() => { if (action === 'View Report') navigate('/report'); else if (action === 'Run Assessment Again') navigate('/assessment'); else handleSubmit(action); }} className="flex w-full items-center justify-between rounded-[1rem] border border-white/10 bg-[#05070A]/70 px-3 py-3 text-left text-sm text-slate-200 transition hover:border-[#00B8FF]/30 hover:text-white">
                  <span>{action}</span>
                  <span className="text-slate-400">→</span>
                </button>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
