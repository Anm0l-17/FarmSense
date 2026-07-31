import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Mic, MicOff, Paperclip, Send, Sparkles, User, Volume2, VolumeX } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SeverityBadge } from "@/components/common/severity";
import { askChatbot } from "@/services/api";
import { useFarm } from "@/lib/farm-store";
import { QUICK_PROMPTS, useI18n } from "@/lib/i18n";
import { CROP_EMOJI } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [
      { title: "AI Farm Assistant — AI Farm Companion" },
      {
        name: "description",
        content:
          "Chat with an AI farm assistant that understands your crop diagnosis, weather and market context in English, Kannada or Hindi.",
      },
      { property: "og:title", content: "AI Farm Assistant — AI Farm Companion" },
      {
        property: "og:description",
        content: "Multilingual AI assistant explaining crop, weather and market decisions.",
      },
    ],
  }),
  component: Assistant,
});

function Assistant() {
  const { t, lang } = useI18n();
  const { diagnosis, aiContext } = useFarm();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Voice Input (Speech-to-Text)
  function toggleListening() {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === "hi" ? "hi-IN" : lang === "kn" ? "kn-IN" : "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error("Speech recognition failed to start:", e);
      setIsListening(false);
    }
  }

  // Voice Output (Text-to-Speech)
  function toggleSpeech(id: string, text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "hi" ? "hi-IN" : lang === "kn" ? "kn-IN" : "en-IN";

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  }

  async function send(text: string) {
    const question = text.trim();
    if (!question || thinking) return;
    setInput("");
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    setMessages((m) => [
      ...m,
      { id: `u_${Date.now()}`, role: "user", content: question, created_at: new Date().toISOString() },
    ]);
    setThinking(true);
    try {
      const reply = await askChatbot(question, aiContext, lang);
      setMessages((m) => [...m, reply]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `e_${Date.now()}`,
          role: "assistant",
          content:
            lang === "hi"
              ? "सर्वर से कनेक्ट नहीं हो सका। कृपया पुनः प्रयास करें।"
              : lang === "kn"
                ? "ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
                : "We couldn't connect to the server. Please try again.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setThinking(false);
      inputRef.current?.focus();
    }
  }

  return (
    <AppLayout title={t("assistant.title")} subtitle={t("assistant.sub")}>
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {/* Context header */}
        <section className="surface-card flex flex-wrap items-center gap-3 p-4">
          <span className="text-2xl" aria-hidden>
            {CROP_EMOJI[diagnosis.crop] ?? "🌱"}
          </span>
          <div className="min-w-0">
            <p className="font-semibold">
              {diagnosis.crop} · {diagnosis.disease}
            </p>
            <p className="text-xs text-muted-foreground">
              Using your latest diagnosis · {diagnosis.confidence}% confidence
            </p>
          </div>
          <SeverityBadge level={diagnosis.severity} className="ml-auto" />
        </section>

        {/* Chat window */}
        <section className="surface-card flex min-h-[45vh] flex-col gap-4 p-4">
          <div className="flex gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="size-4" aria-hidden />
            </span>
            <div className="group relative max-w-[85%] rounded-2xl rounded-tl-sm bg-accent px-4 py-3 text-sm text-accent-foreground">
              <p>{t("assistant.welcome")}</p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => toggleSpeech("welcome", t("assistant.welcome"))}
                className="mt-2 h-7 px-2 text-xs gap-1 text-primary hover:bg-primary/10"
              >
                {speakingId === "welcome" ? (
                  <>
                    <VolumeX className="size-3.5 animate-pulse text-destructive" />
                    <span>{t("assistant.stopSpeech")}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="size-3.5" />
                    <span>{t("assistant.readAloud")}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  m.role === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary text-primary-foreground",
                )}
              >
                {m.role === "user" ? (
                  <User className="size-4" aria-hidden />
                ) : (
                  <Bot className="size-4" aria-hidden />
                )}
              </span>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "user"
                    ? "rounded-tr-sm bg-primary text-primary-foreground"
                    : "rounded-tl-sm bg-muted text-foreground",
                )}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
                {m.role === "assistant" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSpeech(m.id, m.content)}
                    className="mt-2 h-7 px-2 text-xs gap-1 text-primary hover:bg-primary/10"
                  >
                    {speakingId === m.id ? (
                      <>
                        <VolumeX className="size-3.5 animate-pulse text-destructive" />
                        <span>{t("assistant.stopSpeech")}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="size-3.5" />
                        <span>{t("assistant.readAloud")}</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}

          {thinking && (
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="size-4" aria-hidden />
              </span>
              <span className="flex items-center gap-1.5 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                <Sparkles className="size-3.5 animate-pulse" aria-hidden />
                {t("assistant.thinking")}
              </span>
            </div>
          )}
          <div ref={endRef} />
        </section>

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS[lang].map((p) => (
            <Button key={p} variant="outline" size="sm" onClick={() => send(p)} disabled={thinking}>
              {p}
            </Button>
          ))}
        </div>

        {/* Input Form with Voice Support */}
        <form
          className={cn(
            "sticky bottom-20 flex items-center gap-2 rounded-2xl border bg-card p-2 shadow-lg md:bottom-4 transition-all",
            isListening ? "border-destructive ring-2 ring-destructive/20" : "border-border",
          )}
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Button type="button" variant="ghost" size="icon" aria-label="Attach image" disabled>
            <Paperclip className="size-4" />
          </Button>

          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? t("assistant.listening") : t("assistant.placeholder")}
            aria-label={t("assistant.placeholder")}
            className="border-0 shadow-none focus-visible:ring-0"
          />

          {/* Voice Input Mic Button */}
          <Button
            type="button"
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={toggleListening}
            title={isListening ? "Stop listening" : "Voice input"}
            className={cn("shrink-0", isListening && "animate-pulse")}
          >
            {isListening ? <MicOff className="size-4" /> : <Mic className="size-4 text-primary" />}
          </Button>

          <Button type="submit" disabled={thinking || !input.trim()}>
            <Send className="size-4" /> <span className="hidden sm:inline">{t("assistant.send")}</span>
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
