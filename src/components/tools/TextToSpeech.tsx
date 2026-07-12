"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Alert, Card } from "@/components/ui";

export function TextToSpeech() {
  const [text, setText] = useState("");
  const [voiceURI, setVoiceURI] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    try {
      setSupported("speechSynthesis" in window);
    } catch {
      setSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!supported) return;
    try {
      const loadVoices = () => {
        const v = window.speechSynthesis.getVoices();
        if (v.length > 0) {
          setVoices(v);
          if (!voiceURI) setVoiceURI(v[0].voiceURI);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    } catch {
    }
  }, [supported]);

  function speak() {
    try {
      if (!text.trim() || !supported) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const selected = voices.find((v) => v.voiceURI === voiceURI);
      if (selected) utterance.voice = selected;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      utteranceRef.current = utterance;
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeaking(false);
    }
  }

  function stop() {
    try {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } catch {
    }
  }

  if (!supported) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card variant="default" className="p-8">
          <Alert variant="error">Text-to-speech is not supported in your browser.</Alert>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card variant="default" className="p-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Text to speak</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder="Enter text to speak..."
              className="w-full resize-none rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            />
          </div>
          {voices.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Voice</label>
              <select
                value={voiceURI}
                onChange={(e) => setVoiceURI(e.target.value)}
                className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
              >
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Rate: {rate.toFixed(1)}</label>
              <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-nuvora-600" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Pitch: {pitch.toFixed(1)}</label>
              <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(Number(e.target.value))} className="w-full accent-nuvora-600" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="primary" onClick={speak} disabled={!text.trim() || speaking}>
              Speak
            </Button>
            <Button variant="secondary" onClick={stop} disabled={!speaking}>
              Stop
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
