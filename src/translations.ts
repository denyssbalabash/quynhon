/**
 * Internationalization re-exporting config from formContent.ts
 * You can edit texts directly in /src/formContent.ts
 */

import {
  FORM_CONTENT_CONFIG,
  FormTextConfig,
  SupportedLanguage,
} from './formContent';

export type Language = SupportedLanguage;
export type Translations = FormTextConfig;
export const TRANSLATIONS = FORM_CONTENT_CONFIG;

/**
 * Detects if the system language is Russian (RU, UK, BE, KK)
 */
export function isSystemRussian(): boolean {
  try {
    const tg = typeof window !== 'undefined' ? (window as unknown as { Telegram?: { WebApp?: any } }).Telegram?.WebApp : null;
    const tgLang = tg?.initDataUnsafe?.user?.language_code;
    if (tgLang && typeof tgLang === 'string') {
      const lower = tgLang.toLowerCase();
      if (lower.startsWith('ru') || lower.startsWith('uk') || lower.startsWith('be') || lower.startsWith('kk')) {
        return true;
      }
    }

    if (typeof navigator !== 'undefined') {
      const navLang = navigator.language || (navigator.languages && navigator.languages[0]) || '';
      const lower = navLang.toLowerCase();
      if (lower.startsWith('ru') || lower.startsWith('uk') || lower.startsWith('be') || lower.startsWith('kk')) {
        return true;
      }
    }
  } catch {
    // ignore
  }
  return false;
}

/**
 * Detects if the system language is Vietnamese
 */
export function isSystemVietnamese(): boolean {
  try {
    const tg = typeof window !== 'undefined' ? (window as unknown as { Telegram?: { WebApp?: any } }).Telegram?.WebApp : null;
    const tgLang = tg?.initDataUnsafe?.user?.language_code;
    if (tgLang && typeof tgLang === 'string') {
      const lower = tgLang.toLowerCase();
      if (lower.startsWith('vi') || lower.startsWith('vn')) {
        return true;
      }
    }

    if (typeof navigator !== 'undefined') {
      const navLang = navigator.language || (navigator.languages && navigator.languages[0]) || '';
      const lower = navLang.toLowerCase();
      if (lower.startsWith('vi') || lower.startsWith('vn')) {
        return true;
      }
    }
  } catch {
    // ignore
  }
  return false;
}

/**
 * Initial language resolver:
 * 1. If Russian system detected -> 'ru' (cannot be selected via switcher)
 * 2. If Vietnamese system detected -> 'vn'
 * 3. Default -> 'en'
 */
export function detectLanguage(): Language {
  if (isSystemRussian()) return 'ru';
  if (isSystemVietnamese()) return 'vn';
  return 'en';
}
