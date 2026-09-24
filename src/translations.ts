/**
 * Internationalization helpers re-exporting config from formContent.ts
 * Strictly supports English ('en' - default) and Vietnamese ('vn').
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
 * Detects if the device, browser, or Telegram system language is Vietnamese
 */
export function isSystemVietnamese(): boolean {
  try {
    // 1. Check Telegram Mini App user language code
    const tg = typeof window !== 'undefined' ? (window as unknown as { Telegram?: { WebApp?: any } }).Telegram?.WebApp : null;
    const tgLang = tg?.initDataUnsafe?.user?.language_code;
    if (tgLang && typeof tgLang === 'string') {
      const lower = tgLang.toLowerCase();
      if (lower.startsWith('vi') || lower.startsWith('vn')) {
        return true;
      }
    }

    // 2. Check browser / device navigator languages
    if (typeof navigator !== 'undefined') {
      const navLang = navigator.language || (navigator.languages && navigator.languages[0]) || '';
      const lower = navLang.toLowerCase();
      if (lower.startsWith('vi') || lower.startsWith('vn')) {
        return true;
      }
      if (navigator.languages && Array.isArray(navigator.languages)) {
        for (const l of navigator.languages) {
          if (l.toLowerCase().startsWith('vi') || l.toLowerCase().startsWith('vn')) {
            return true;
          }
        }
      }
    }
  } catch {
    // ignore
  }
  return false;
}

/**
 * Initial language resolver:
 * - If device/phone is in Vietnamese -> 'vn'
 * - Otherwise default -> 'en'
 */
export function detectLanguage(): Language {
  if (isSystemVietnamese()) {
    return 'vn';
  }
  return 'en';
}
