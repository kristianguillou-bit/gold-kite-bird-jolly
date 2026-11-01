export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export function speak(text: string, onend?: () => void): boolean {
  if (!canSpeak()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = synth.getVoices().find((item) => item.lang.toLowerCase().startsWith("fr"));
  if (voice) utterance.voice = voice;
  utterance.lang = "fr-FR";
  utterance.rate = 0.82;
  utterance.onend = () => onend?.();
  utterance.onerror = () => onend?.();
  synth.speak(utterance);
  return true;
}
