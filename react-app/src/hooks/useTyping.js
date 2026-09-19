import { useEffect, useState } from 'react';

/**
 * Cycling typing effect for the hero role text.
 * type -> pause -> delete -> next phrase -> repeat
 */
export default function useTyping(phrases) {
  const [text, setText] = useState(phrases[0] || '');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(phrases[0] || '');
      return;
    }

    let cancelled = false;
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    (async () => {
      const phrase = phrases[index % phrases.length];

      // Type
      for (let i = 0; i <= phrase.length; i++) {
        if (cancelled) return;
        setText(phrase.slice(0, i));
        await sleep(55);
      }

      // Pause
      await sleep(2000);

      // Delete
      for (let i = phrase.length - 1; i >= 0; i--) {
        if (cancelled) return;
        setText(phrase.slice(0, i));
        await sleep(35);
      }

      if (cancelled) return;
      setIndex((prev) => (prev + 1) % phrases.length);
    })();

    return () => {
      cancelled = true;
    };
  }, [index, phrases]);

  return text;
}