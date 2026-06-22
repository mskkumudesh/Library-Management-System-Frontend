import { useState, useRef, useEffect, FormEvent } from "react";
import api from "../../api/axios";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: ChatMessage = {
  role: "assistant",
  content: "Hi! I'm the ShelfScan assistant 📖 Ask me about a book, author, or topic and I'll search the catalog for you.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post<{ reply: string }>("/chat", {
        message: trimmed,
        // Skip the static welcome message — the backend doesn't need it as context
        history: nextMessages.slice(1, -1),
      });
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-ui">
      {open && (
        <div className="mb-3 w-80 sm:w-96 h-[28rem] bg-white border border-ink/10 rounded-lg shadow-xl flex flex-col overflow-hidden">
          <div className="bg-spine text-parchment px-4 py-3 flex items-center justify-between">
            <span className="font-semibold text-sm">📖 ShelfScan Assistant</span>
            <button onClick={() => setOpen(false)} className="text-parchment/70 hover:text-parchment text-sm">
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-parchment/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === "user" ? "bg-accent text-white" : "bg-white border border-ink/10 text-ink"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-ink/10 rounded-lg px-3 py-2 text-sm text-ink/40">
                  Searching the catalog…
                </div>
              </div>
            )}
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          <form onSubmit={handleSend} className="border-t border-ink/10 p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a book…"
              className="flex-1 rounded border border-ink/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-accent text-white rounded px-3 py-2 text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-spine text-parchment rounded-full w-14 h-14 shadow-lg flex items-center justify-center text-2xl hover:bg-spine/90 transition"
        aria-label="Open chat assistant"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
