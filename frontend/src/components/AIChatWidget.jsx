import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { aiApi } from '../api/endpoints'
import Button from './Button'
import MarkdownText from './MarkdownText'

const GREETING = {
  role: 'assistant',
  content:
    "Hi! I'm your BudgetMate assistant. Ask me how to use any part of the app, or ask for a spending plan based on your income and expenses this month.",
}

const QUICK_PROMPT = 'Based on my income and spending this month, how should I budget my money?'

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [interactionId, setInteractionId] = useState(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  const send = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || sending) return

    setError('')
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    setSending(true)

    try {
      // Gemini keeps the conversation thread server-side via interactionId,
      // so we only ever send the newest message.
      const res = await aiApi.chat(trimmed, interactionId)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }])
      setInteractionId(res.data.interactionId)
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't reach the assistant. Try again in a moment.")
    } finally {
      setSending(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="BudgetMate assistant chat"
          className="fixed bottom-24 right-4 z-40 flex h-[32rem] max-h-[calc(100vh-7rem)] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between border-b border-slate-100 bg-indigo-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot size={18} aria-hidden="true" />
              <span className="font-semibold">BudgetMate Assistant</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="rounded-full p-1 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={16} />
            </button>
          </div>

          <div ref={scrollRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === 'user'
                      ? 'whitespace-pre-wrap bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {m.role === 'assistant' ? <MarkdownText text={m.content} /> : m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-400 dark:bg-slate-800 dark:text-slate-500">Thinking...</div>
              </div>
            )}
            {error && (
              <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                {error}
              </p>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="px-3 pb-2">
              <button
                onClick={() => send(QUICK_PROMPT)}
                disabled={sending}
                className="flex w-full items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
              >
                <Sparkles size={13} aria-hidden="true" /> Get a spending plan based on my income
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-100 p-3 dark:border-slate-800">
            <label htmlFor="ai-chat-input" className="sr-only">
              Message the assistant
            </label>
            <input
              id="ai-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
            />
            <Button type="submit" size="md" disabled={sending || !input.trim()} aria-label="Send message" className="px-3">
              <Send size={16} aria-hidden="true" />
            </Button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  )
}
