export type Locale = 'no' | 'en';

export const translations = {
  no: {
    systemPrompt: 'Du er en hjelpsom assistent.',
    // …other server‐only prompts if you like
  },
  en: {
    systemPrompt: 'You are a helpful assistant.',
  }
} as const;