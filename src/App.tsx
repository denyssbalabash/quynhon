/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Rocket,
  Briefcase,
  Layers,
  GraduationCap,
  HeartHandshake,
  AlertCircle,
  ArrowLeft,
  Send,
  ExternalLink,
  Check,
  CheckCircle2,
  Mail,
  RotateCcw,
  Shield,
  Copy,
} from 'lucide-react';
import { INCUBATOR_CONFIG } from './config';
import incubatorLogoAsset from './file_000000007cb481fa9d1d5da3bfff24d4.png';
import {
  TRANSLATIONS,
  detectLanguage,
  Language,
} from './translations';

// Type definitions
export type GoalOption =
  | 'Pitch my startup'
  | 'Looking for a job'
  | 'Take startup course'
  | 'Want to help the club'
  | 'Both (Have a startup, ready to work part-time)'
  | '';

export type StartupCategory =
  | 'Tourism & Hospitality'
  | 'Technology & AI'
  | 'Transport & Logistics'
  | 'Food & Beverage'
  | 'Retail & Services'
  | 'Other'
  | '';

export type StartupStage =
  | 'Idea'
  | 'Prototype/MVP'
  | 'Early users'
  | 'Revenue'
  | '';

export type IncubatorNeed =
  | 'Funding'
  | 'Mentorship'
  | 'Tech Development'
  | 'Local network in Vietnam';

export type ProfessionalSkill =
  | 'Engineering'
  | 'Marketing'
  | 'Sales'
  | 'Operations'
  | 'Design'
  | '';

export type CourseRole =
  | 'I am a student'
  | 'Entrepreneur'
  | 'Other'
  | '';

export type ClubHelpType =
  | 'Investor'
  | 'Grant'
  | 'Organizational'
  | 'Other';

export type AvailabilityOption =
  | 'Vietnam Full-time'
  | 'Vietnam Part-time'
  | 'Remote Full-time'
  | 'Remote Part-time'
  | '';

export interface FormData {
  goal: GoalOption;
  startupCategory: StartupCategory;
  startupCategoryOther: string;
  startupProblem: string;
  startupStage: StartupStage;
  startupNeeds: IncubatorNeed[];
  jobSkill: ProfessionalSkill;
  jobAvailability: AvailabilityOption;
  jobPortfolioUrl: string;
  courseRole: CourseRole;
  courseRoleOther: string;
  clubHelp: ClubHelpType[];
  clubHelpOther: string;
  email: string;
}

const INITIAL_FORM_DATA: FormData = {
  goal: '',
  startupCategory: '',
  startupCategoryOther: '',
  startupProblem: '',
  startupStage: '',
  startupNeeds: [],
  jobSkill: '',
  jobAvailability: '',
  jobPortfolioUrl: '',
  courseRole: '',
  courseRoleOther: '',
  clubHelp: [],
  clubHelpOther: '',
  email: '',
};

interface TelegramUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export default function App() {
  // Active language: Defaults to detected language (VN if Vietnamese device/system, else EN)
  const [lang, setLang] = useState<Language>(() => detectLanguage());
  const t = TRANSLATIONS[lang];

  // Form states
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showValidationWarning, setShowValidationWarning] = useState<boolean>(false);

  // Telegram WebApp environment detection
  const [isTMA, setIsTMA] = useState<boolean>(false);
  const [tmaUser, setTmaUser] = useState<TelegramUser | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Silent Telegram WebApp initialization
  useEffect(() => {
    const tg = typeof window !== 'undefined' ? (window as unknown as { Telegram?: { WebApp?: any } }).Telegram?.WebApp : null;

    if (tg) {
      try {
        tg.ready();
        tg.expand();
        if (tg.setHeaderColor) tg.setHeaderColor('#F2F2F7');
        if (tg.setBackgroundColor) tg.setBackgroundColor('#F2F2F7');

        const user = tg.initDataUnsafe?.user;
        const hasInitData = Boolean(tg.initData && tg.initData.length > 0);
        const isTelegramPlatform = Boolean(tg.platform && tg.platform !== 'unknown');

        if (user || hasInitData || isTelegramPlatform) {
          setIsTMA(true);
          if (user) setTmaUser(user);
        }
      } catch (err) {
        console.warn('TMA init exception:', err);
      }
    }
  }, []);

  // Allow preview/dev override via query param ?preview=1 or ?dev=1
  const isPreviewMode = typeof window !== 'undefined' && (
    window.location.search.includes('preview=1') ||
    window.location.search.includes('dev=1')
  );

  const isTelegramActive = isTMA || (
    typeof window !== 'undefined' && Boolean(
      (window as any).Telegram?.WebApp?.initData ||
      (window as any).Telegram?.WebApp?.initDataUnsafe?.user ||
      window.location.hash.includes('tgWebAppData') ||
      window.location.search.includes('tgWebAppPlatform')
    )
  );

  const isBlockedOutsideTelegram = INCUBATOR_CONFIG.requireTelegramApp && !isTelegramActive && !isPreviewMode;

  // Sync Telegram WebApp native BackButton
  useEffect(() => {
    const tg = typeof window !== 'undefined' ? (window as unknown as { Telegram?: { WebApp?: any } }).Telegram?.WebApp : null;
    if (tg?.BackButton) {
      if (currentStepIndex > 0 && !isSubmitted) {
        tg.BackButton.show();
        const onBack = () => {
          setCurrentStepIndex((prev) => Math.max(0, prev - 1));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        tg.BackButton.onClick(onBack);
        return () => {
          tg.BackButton.offClick(onBack);
        };
      } else {
        tg.BackButton.hide();
      }
    }
  }, [currentStepIndex, isSubmitted]);

  // Trigger Telegram Haptic Feedback safely
  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' | 'selection' = 'light') => {
    try {
      const tg = (window as unknown as { Telegram?: { WebApp?: any } }).Telegram?.WebApp;
      if (tg?.HapticFeedback) {
        if (style === 'selection') {
          tg.HapticFeedback.selectionChanged();
        } else {
          tg.HapticFeedback.impactOccurred(style);
        }
      }
    } catch {
      // ignore
    }
  };

  // Determine active flow steps dynamically based on Q1
  // If in TMA, the contact step only asks for Email.
  const stepFlow = useMemo(() => {
    const flow: Array<{
      id: 'goal' | 'startup' | 'job' | 'course' | 'help' | 'contact';
      title: string;
      subtitle: string;
    }> = [
      { id: 'goal', title: t.steps.goalTitle, subtitle: t.steps.goalSubtitle },
    ];

    if (formData.goal === 'Pitch my startup') {
      flow.push({ id: 'startup', title: t.steps.startupTitle, subtitle: t.steps.startupSubtitle });
    } else if (formData.goal === 'Looking for a job') {
      flow.push({ id: 'job', title: t.steps.jobTitle, subtitle: t.steps.jobSubtitle });
    } else if (formData.goal === 'Take startup course') {
      flow.push({ id: 'course', title: t.steps.courseTitle, subtitle: t.steps.courseSubtitle });
    } else if (formData.goal === 'Want to help the club') {
      flow.push({ id: 'help', title: t.steps.helpTitle, subtitle: t.steps.helpSubtitle });
    } else if (formData.goal === 'Both (Have a startup, ready to work part-time)') {
      flow.push({ id: 'startup', title: t.steps.startupTitle, subtitle: t.steps.startupSubtitle });
      flow.push({ id: 'job', title: t.steps.jobTitle, subtitle: t.steps.jobSubtitle });
    }

    flow.push({ id: 'contact', title: t.steps.contactTitle, subtitle: t.steps.contactSubtitle });
    return flow;
  }, [formData.goal, t]);

  const currentStep = stepFlow[currentStepIndex] || stepFlow[0];
  const totalSteps = stepFlow.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  // Validate email format
  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  // Validate current step before proceeding (minimum friction for highest conversion)
  const isCurrentStepValid = (): boolean => {
    if (!currentStep) return false;

    // Step 1: Goal selection routes the funnel
    if (currentStep.id === 'goal') {
      return formData.goal !== '';
    }

    // Startup questions are all optional to prevent funnel drop-off
    if (currentStep.id === 'startup') {
      return true;
    }

    // Talent / Job questions are all optional to prevent funnel drop-off
    if (currentStep.id === 'job') {
      return true;
    }

    // Course questions are all optional to prevent funnel drop-off
    if (currentStep.id === 'course') {
      return true;
    }

    // Help the club questions are all optional to prevent funnel drop-off
    if (currentStep.id === 'help') {
      return true;
    }

    // Contact details
    if (currentStep.id === 'contact') {
      // In Telegram Mini App, user is already identified by Telegram account
      if (isTMA && tmaUser?.id) {
        return formData.email.trim() === '' || isEmailValid(formData.email);
      }
      // On web, valid email ensures the incubator team can reach out
      return isEmailValid(formData.email);
    }

    return true;
  };

  const handleNext = () => {
    triggerHaptic('medium');
    if (!isCurrentStepValid()) {
      setShowValidationWarning(true);
      return;
    }
    setShowValidationWarning(false);
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    triggerHaptic('light');
    setShowValidationWarning(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit form: sends to backend or directly to Telegram Bot API if running without backend
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    triggerHaptic('heavy');

    const payload = {
      ...formData,
      incubatorName: INCUBATOR_CONFIG.name,
      isTMA,
      tmaUser: tmaUser ? {
        id: tmaUser.id,
        first_name: tmaUser.first_name,
        last_name: tmaUser.last_name,
        username: tmaUser.username,
        language_code: tmaUser.language_code,
      } : null,
      submittedAt: new Date().toISOString(),
    };

    try {
      // 1. If Telegram Bot Token & Admin Chat ID are set in INCUBATOR_CONFIG.telegram,
      // dispatch directly to Telegram Bot API (perfect for serverless GitHub Pages without backend!)
      const directBotToken = INCUBATOR_CONFIG.telegram?.botToken?.trim();
      const directAdminChatId = INCUBATOR_CONFIG.telegram?.adminChatId?.trim();

      if (directBotToken && directAdminChatId) {
        const escapeHtml = (text: string) => {
          if (!text) return '';
          return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        };

        const cleanIncubator = escapeHtml(INCUBATOR_CONFIG.name);
        const cleanEmail = escapeHtml(formData.email || 'Not provided');
        const cleanGoal = escapeHtml(formData.goal || 'N/A');
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

        let html = `🚀 <b>НОВАЯ ЗАЯВКА В ИНКУБАТОР</b> (${cleanIncubator})\n`;
        html += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        html += `📋 <b>КОНТАКТНЫЕ ДАННЫЕ</b>\n`;
        html += `• <b>Email:</b> ${cleanEmail}\n`;

        if (isTMA && tmaUser) {
          html += `• <b>Источник:</b> 📱 Telegram Mini App (TMA)\n`;
          const fullName = [tmaUser.first_name, tmaUser.last_name].filter(Boolean).join(' ');
          if (fullName) html += `• <b>TG Имя:</b> ${escapeHtml(fullName)}\n`;
          if (tmaUser.username) html += `• <b>TG Username:</b> @${escapeHtml(tmaUser.username)}\n`;
          html += `• <b>Telegram ID:</b> <code>${escapeHtml(String(tmaUser.id || 'N/A'))}</code>\n`;
          if (tmaUser.language_code) html += `• <b>Язык клиента:</b> ${escapeHtml(tmaUser.language_code)}\n`;
        } else {
          html += `• <b>Источник:</b> 🌐 Статический веб-сайт (GitHub Pages / Web)\n`;
        }

        html += `• <b>Цель:</b> ${cleanGoal}\n\n`;

        if (formData.goal === 'Pitch my startup' || formData.goal === 'Both (Have a startup, ready to work part-time)') {
          const cat = formData.startupCategory === 'Other' && formData.startupCategoryOther
            ? `Other (${formData.startupCategoryOther})`
            : formData.startupCategory;

          const needsStr = formData.startupNeeds.length > 0 ? formData.startupNeeds.join(', ') : 'None specified';
          html += `🏢 <b>СТАРТАП-ПРОЕКТ</b>\n`;
          html += `• <b>Категория:</b> ${escapeHtml(cat || 'Not specified')}\n`;
          html += `• <b>Стадия:</b> ${escapeHtml(formData.startupStage || 'Not specified')}\n`;
          if (formData.startupProblem) {
            html += `• <b>Проблема и решение:</b>\n  <i>${escapeHtml(formData.startupProblem)}</i>\n`;
          }
          html += `• <b>Что нужно от инкубатора:</b> ${escapeHtml(needsStr)}\n\n`;
        }

        if (formData.goal === 'Looking for a job' || formData.goal === 'Both (Have a startup, ready to work part-time)') {
          html += `💼 <b>СПЕЦИАЛИСТ / СОИСКАТЕЛЬ</b>\n`;
          html += `• <b>Основной навык:</b> ${escapeHtml(formData.jobSkill || 'Not specified')}\n`;
          html += `• <b>Формат и локация:</b> ${escapeHtml(formData.jobAvailability || 'Not specified')}\n`;
          html += `• <b>Резюме / Портфолио:</b> ${escapeHtml(formData.jobPortfolioUrl || 'Not provided')}\n\n`;
        }

        if (formData.goal === 'Take startup course') {
          const roleStr = formData.courseRole === 'Other' && formData.courseRoleOther
            ? `Other (${formData.courseRoleOther})`
            : (formData.courseRole || 'Not specified');
          html += `🎓 <b>КУРС ПО СТАРТАПАМ</b>\n`;
          html += `• <b>Статус / Роль:</b> ${escapeHtml(roleStr)}\n\n`;
        }

        if (formData.goal === 'Want to help the club') {
          let helpItems: string[] = [...formData.clubHelp];
          if (helpItems.includes('Other') && formData.clubHelpOther) {
            helpItems = helpItems.map((item) => (item === 'Other' ? `Other (${formData.clubHelpOther})` : item));
          }
          const helpStr = helpItems.length > 0 ? helpItems.join(', ') : 'Not specified';
          html += `🤝 <b>ПОМОЩЬ КЛУБУ</b>\n`;
          html += `• <b>Формат помощи:</b> ${escapeHtml(helpStr)}\n\n`;
        }

        html += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
        html += `📅 <b>Время:</b> <code>${timestamp}</code>`;

        const tgRes = await fetch(`https://api.telegram.org/bot${directBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: directAdminChatId,
            text: html,
            parse_mode: 'HTML',
          }),
        });

        const tgJson = await tgRes.json().catch(() => ({}));
        if (!tgRes.ok || !tgJson.ok) {
          throw new Error(tgJson.description || 'Failed to send to Telegram Bot');
        }

        setIsSubmitted(true);
        triggerHaptic('medium');
        return;
      }

      // 2. Dispatch to Google Apps Script or Backend API
      const endpoint = INCUBATOR_CONFIG.apiEndpoint || '/api/submit';
      const isGoogleScript = endpoint.includes('script.google.com');

      if (isGoogleScript) {
        // Google Apps Script requires text/plain and mode: 'no-cors' to avoid browser CORS preflight & redirect blocks
        try {
          await fetch(endpoint, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(payload),
          });
          setIsSubmitted(true);
          triggerHaptic('medium');
          return;
        } catch (gasErr: any) {
          console.warn('Google Apps Script request error:', gasErr);
          throw new Error(t.error.general);
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.ok === false) {
        throw new Error(result.error || t.error.general);
      }

      setIsSubmitted(true);
      triggerHaptic('medium');
    } catch (err: any) {
      setSubmitError(err.message || t.error.general);
      triggerHaptic('heavy');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStartupNeed = (need: IncubatorNeed) => {
    triggerHaptic('selection');
    setFormData((prev) => {
      const exists = prev.startupNeeds.includes(need);
      if (exists) {
        return { ...prev, startupNeeds: prev.startupNeeds.filter((n) => n !== need) };
      } else {
        return { ...prev, startupNeeds: [...prev.startupNeeds, need] };
      }
    });
  };

  const handleReset = () => {
    triggerHaptic('light');
    setFormData(INITIAL_FORM_DATA);
    setCurrentStepIndex(0);
    setIsSubmitted(false);
    setSubmitError(null);
  };

  const handleClose = () => {
    try {
      const tg = (window as unknown as { Telegram?: { WebApp?: any } }).Telegram?.WebApp;
      if (tg?.close) {
        tg.close();
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-slate-900 flex flex-col items-center justify-start pb-24 sm:py-8 antialiased">
      {/* Mobile-First Frame Container */}
      <main className="w-full max-w-lg min-h-screen sm:min-h-0 sm:my-2 flex flex-col bg-white sm:rounded-3xl sm:shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:border sm:border-slate-200/80 overflow-hidden relative">
        
        {/* iOS / Apple Clean Navigation Bar */}
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/90 border-b border-slate-200/60 px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            {currentStepIndex > 0 && !isSubmitted && (
              <button
                id="nav-back-btn"
                onClick={handleBack}
                className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 active:scale-95 transition-transform rounded-full hover:bg-slate-100"
                aria-label={t.navigation.back}
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>
            )}

            {/* Custom Incubator Logo or Native Apple Icon */}
            <div className="flex items-center space-x-2.5 min-w-0">
              {INCUBATOR_CONFIG.logoUrl || incubatorLogoAsset ? (
                <img
                  src={
                    INCUBATOR_CONFIG.logoUrl && !INCUBATOR_CONFIG.logoUrl.includes('file_000000007cb481fa9d1d5da3bfff24d4')
                      ? INCUBATOR_CONFIG.logoUrl
                      : incubatorLogoAsset
                  }
                  alt={INCUBATOR_CONFIG.name}
                  className="w-7 h-7 rounded-xl object-cover shadow-sm shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
                  <Rocket className="w-4 h-4" />
                </div>
              )}
              <div className="truncate">
                <h2 className="font-semibold text-[15px] tracking-tight text-slate-900 leading-none truncate">
                  {INCUBATOR_CONFIG.name}
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-none truncate">
                  {INCUBATOR_CONFIG.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* iOS-style Language Switcher: EN (default) and VN */}
          <div className="flex items-center space-x-1 shrink-0 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60">
            <button
              id="lang-en-btn"
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                setLang('en');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                lang === 'en'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
            <button
              id="lang-vn-btn"
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                setLang('vn');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                lang === 'vn'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              VN
            </button>
          </div>
        </header>

        {/* Apple-style Animated Progress Indicator */}
        {!isSubmitted && !isBlockedOutsideTelegram && (
          <div className="w-full bg-slate-100 h-1 relative overflow-hidden">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
        )}

        {/* Content Container */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {isBlockedOutsideTelegram ? (
              /* =========================================================================
                 TELEGRAM ONLY SECURITY GATE: Block non-Telegram browser traffic
                 ========================================================================= */
              <motion.div
                key="telegram-gate-screen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="py-6 px-2 flex flex-col items-center text-center space-y-6 max-w-sm mx-auto"
              >
                <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm relative">
                  <Shield className="w-10 h-10" />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs shadow-md font-bold">
                    TG
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                    {t.telegramGate.badge}
                  </span>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {t.telegramGate.title}
                  </h1>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {t.telegramGate.subtitle}
                  </p>
                </div>

                <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 leading-relaxed text-left space-y-2">
                  <p>{t.telegramGate.instructions}</p>
                  <p className="text-[11px] text-slate-400">
                    🤖 <b>Telegram Mini App:</b> @{INCUBATOR_CONFIG.botUsername} (t.me/{INCUBATOR_CONFIG.botUsername}/form)
                  </p>
                </div>

                <div className="w-full space-y-2.5 pt-2">
                  <a
                    href={INCUBATOR_CONFIG.telegramAppUrl || `https://t.me/${INCUBATOR_CONFIG.botUsername}/form`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerHaptic('medium')}
                    className="w-full py-4 px-6 rounded-2xl bg-blue-600 text-white font-semibold text-[15px] hover:bg-blue-700 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(37,99,235,0.25)] flex items-center justify-center space-x-2 cursor-pointer no-underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{t.telegramGate.openBtn}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      const link = INCUBATOR_CONFIG.telegramAppUrl || `https://t.me/${INCUBATOR_CONFIG.botUsername}/form`;
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(link);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2500);
                      }
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 font-medium">{t.telegramGate.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>{t.telegramGate.copyBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : !isSubmitted ? (
              <motion.div
                key={currentStep?.id || 'step'}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="space-y-6"
              >
                {/* Step Header */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                    <span className="uppercase tracking-wider text-blue-600 font-semibold">
                      {t.navigation.stepOf(currentStepIndex + 1, totalSteps)}
                    </span>
                    <span>{t.navigation.complete(progressPercent)}</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {currentStep.title}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    {currentStep.subtitle}
                  </p>
                </div>

                {/* Validation Warning */}
                {showValidationWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2.5"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{t.navigation.validationWarning}</span>
                  </motion.div>
                )}

                {/* Submission Error Banner */}
                {submitError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{submitError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="ml-2 font-semibold text-rose-700 underline"
                    >
                      {t.error.retry}
                    </button>
                  </div>
                )}

                {/* =========================================================================
                    STEP 1: Primary Goal (Always shown first)
                    ========================================================================= */}
                {currentStep.id === 'goal' && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-800">
                      {t.q1.question} <span className="text-rose-500">*</span>
                    </label>

                    <div className="space-y-3">
                      {[
                        {
                          value: 'Pitch my startup',
                          label: t.q1.options.pitch.label,
                          desc: t.q1.options.pitch.desc,
                          icon: Rocket,
                        },
                        {
                          value: 'Looking for a job',
                          label: t.q1.options.job.label,
                          desc: t.q1.options.job.desc,
                          icon: Briefcase,
                        },
                        {
                          value: 'Take startup course',
                          label: t.q1.options.course.label,
                          desc: t.q1.options.course.desc,
                          icon: GraduationCap,
                        },
                        {
                          value: 'Want to help the club',
                          label: t.q1.options.help.label,
                          desc: t.q1.options.help.desc,
                          icon: HeartHandshake,
                        },
                        {
                          value: 'Both (Have a startup, ready to work part-time)',
                          label: t.q1.options.both.label,
                          desc: t.q1.options.both.desc,
                          icon: Layers,
                        },
                      ].map((opt) => {
                        const isSelected = formData.goal === opt.value;
                        const IconComponent = opt.icon;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            id={`goal-option-${opt.value.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                            onClick={() => {
                              triggerHaptic('medium');
                              setFormData((prev) => ({ ...prev, goal: opt.value as GoalOption }));
                              setShowValidationWarning(false);
                            }}
                            className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-start space-x-3.5 ${
                              isSelected
                                ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                                : 'bg-[#F9F9FB] hover:bg-slate-100/90 border-slate-200/80'
                            } active:scale-[0.99]`}
                          >
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                isSelected
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-white text-slate-600 border border-slate-200'
                              }`}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`text-[15px] font-semibold ${isSelected ? 'text-blue-950' : 'text-slate-900'}`}>
                                  {opt.label}
                                </span>
                                <div
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                    isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                                  }`}
                                >
                                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                              </div>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    STEP 2: Startup Details (Shown if "Pitch my startup" or "Both")
                    ========================================================================= */}
                {currentStep.id === 'startup' && (
                  <div className="space-y-6">
                    {/* Q2: Startup Category */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-slate-800">
                          {t.startup.q2Label}
                        </label>
                        <span className="text-[11px] font-normal text-slate-400">
                          ({t.optionalBadge})
                        </span>
                      </div>
                      <select
                        id="startup-category-select"
                        value={formData.startupCategory}
                        onChange={(e) => {
                          triggerHaptic('selection');
                          setFormData((prev) => ({
                            ...prev,
                            startupCategory: e.target.value as StartupCategory,
                          }));
                        }}
                        className="w-full px-4 py-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200 text-[16px] text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer shadow-sm"
                      >
                        <option value="">{t.startup.q2Placeholder}</option>
                        {(
                          [
                            'Tourism & Hospitality',
                            'Technology & AI',
                            'Transport & Logistics',
                            'Food & Beverage',
                            'Retail & Services',
                            'Other',
                          ] as StartupCategory[]
                        ).map((cat) => (
                          <option key={cat} value={cat}>
                            {t.startup.categories[cat]}
                          </option>
                        ))}
                      </select>

                      {formData.startupCategory === 'Other' && (
                        <motion.input
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          type="text"
                          id="startup-category-other"
                          value={formData.startupCategoryOther}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, startupCategoryOther: e.target.value }))
                          }
                          placeholder={t.startup.q2OtherPlaceholder}
                          className="w-full mt-2 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-[16px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      )}
                    </div>

                    {/* Q3: One sentence problem & solution */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-slate-800">
                          {t.startup.q3Label}
                        </label>
                        <span className="text-[11px] font-normal text-slate-400">
                          ({t.optionalBadge})
                        </span>
                      </div>
                      <textarea
                        id="startup-problem-textarea"
                        rows={3}
                        value={formData.startupProblem}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, startupProblem: e.target.value }))
                        }
                        placeholder={t.startup.q3Placeholder}
                        className="w-full px-4 py-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200 text-[16px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm resize-none"
                      />
                      <p className="text-[11px] text-slate-400">
                        {t.startup.q3Hint}
                      </p>
                    </div>

                    {/* Q4: Stage of product */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-slate-800">
                          {t.startup.q4Label}
                        </label>
                        <span className="text-[11px] font-normal text-slate-400">
                          ({t.optionalBadge})
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        {(['Idea', 'Prototype/MVP', 'Early users', 'Revenue'] as StartupStage[]).map((stage) => {
                          const isSelected = formData.startupStage === stage;
                          return (
                            <button
                              key={stage}
                              type="button"
                              id={`stage-${stage.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                              onClick={() => {
                                triggerHaptic('selection');
                                setFormData((prev) => ({
                                  ...prev,
                                  startupStage: isSelected ? '' : stage,
                                }));
                              }}
                              className={`p-3.5 rounded-2xl border text-center transition-all ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                                  : 'bg-[#F9F9FB] hover:bg-slate-100 text-slate-800 border-slate-200 font-medium'
                              } active:scale-95 text-sm`}
                            >
                              {t.startup.stages[stage]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Q6: Checkbox: What is needed from incubator */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-slate-800">
                          {t.startup.q6Label}
                        </label>
                        <span className="text-[11px] font-normal text-slate-400">
                          ({t.optionalBadge})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{t.startup.q6Hint}</p>
                      <div className="space-y-2.5">
                        {(
                          [
                            'Funding',
                            'Mentorship',
                            'Tech Development',
                            'Local network in Vietnam',
                          ] as IncubatorNeed[]
                        ).map((need) => {
                          const isChecked = formData.startupNeeds.includes(need);
                          return (
                            <button
                              key={need}
                              type="button"
                              id={`need-checkbox-${need.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                              onClick={() => toggleStartupNeed(need)}
                              className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                                isChecked
                                  ? 'bg-blue-50/70 border-blue-500 text-blue-950 shadow-sm'
                                  : 'bg-[#F9F9FB] hover:bg-slate-100 text-slate-800 border-slate-200'
                              } active:scale-[0.99]`}
                            >
                              <span className="text-sm font-medium">{t.startup.needs[need]}</span>
                              <div
                                className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                                  isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'
                                }`}
                              >
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    STEP 3: Job Seeker Profile (Shown if "Looking for a job" or "Both")
                    ========================================================================= */}
                {currentStep.id === 'job' && (
                  <div className="space-y-6">
                    {/* Q7: Strongest professional skill */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-slate-800">
                          {t.job.q7Label}
                        </label>
                        <span className="text-[11px] font-normal text-slate-400">
                          ({t.optionalBadge})
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        {(['Engineering', 'Marketing', 'Sales', 'Operations', 'Design'] as ProfessionalSkill[]).map(
                          (skill) => {
                            const isSelected = formData.jobSkill === skill;
                            return (
                              <button
                                key={skill}
                                type="button"
                                id={`skill-${skill.toLowerCase()}`}
                                onClick={() => {
                                  triggerHaptic('selection');
                                  setFormData((prev) => ({
                                    ...prev,
                                    jobSkill: isSelected ? '' : skill,
                                  }));
                                }}
                                className={`p-3.5 rounded-2xl border text-center transition-all ${
                                  isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                                    : 'bg-[#F9F9FB] hover:bg-slate-100 text-slate-800 border-slate-200 font-medium'
                                } active:scale-95 text-sm`}
                              >
                                {t.job.skills[skill]}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>

                    {/* Q9: Location & availability */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-slate-800">
                          {t.job.q9Label}
                        </label>
                        <span className="text-[11px] font-normal text-slate-400">
                          ({t.optionalBadge})
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {(
                          [
                            'Vietnam Full-time',
                            'Vietnam Part-time',
                            'Remote Full-time',
                            'Remote Part-time',
                          ] as AvailabilityOption[]
                        ).map((avail) => {
                          const isSelected = formData.jobAvailability === avail;
                          return (
                            <button
                              key={avail}
                              type="button"
                              id={`avail-${avail.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                              onClick={() => {
                                triggerHaptic('selection');
                                setFormData((prev) => ({
                                  ...prev,
                                  jobAvailability: isSelected ? '' : avail,
                                }));
                              }}
                              className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                                isSelected
                                  ? 'bg-blue-50/70 border-blue-500 text-blue-950 font-semibold'
                                  : 'bg-[#F9F9FB] hover:bg-slate-100 text-slate-800 border-slate-200'
                              } active:scale-[0.99] text-sm`}
                            >
                              <span>{t.job.avail[avail]}</span>
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Q10: Link to CV / Portfolio */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-slate-800">
                          {t.job.q10Label}
                        </label>
                        <span className="text-[11px] font-normal text-slate-400">
                          ({t.optionalBadge})
                        </span>
                      </div>
                      <div className="relative">
                        <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          id="job-portfolio-url"
                          value={formData.jobPortfolioUrl}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, jobPortfolioUrl: e.target.value }))
                          }
                          placeholder={t.job.q10Placeholder}
                          className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200 text-[16px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    STEP: Startup Course Intake ("Take startup course")
                    ========================================================================= */}
                {currentStep.id === 'course' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-slate-800">
                          {t.course.roleLabel}
                        </label>
                        <span className="text-[11px] font-normal text-slate-400">
                          ({t.optionalBadge})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{t.course.roleHint}</p>
                      
                      <div className="space-y-2.5">
                        {[
                          { key: 'I am a student', label: t.course.roles.student },
                          { key: 'Entrepreneur', label: t.course.roles.entrepreneur },
                          { key: 'Other', label: t.course.roles.other },
                        ].map((item) => {
                          const isSelected = formData.courseRole === item.key;
                          return (
                            <button
                              key={item.key}
                              type="button"
                              id={`course-role-${item.key.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                              onClick={() => {
                                triggerHaptic('selection');
                                setFormData((prev) => ({
                                  ...prev,
                                  courseRole: isSelected ? '' : (item.key as CourseRole),
                                }));
                              }}
                              className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                                isSelected
                                  ? 'bg-blue-50/70 border-blue-500 text-blue-950 font-semibold ring-1 ring-blue-500/20'
                                  : 'bg-[#F9F9FB] hover:bg-slate-100 text-slate-800 border-slate-200'
                              } active:scale-[0.99] text-sm`}
                            >
                              <span>{item.label}</span>
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {formData.courseRole === 'Other' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-2"
                        >
                          <input
                            type="text"
                            id="course-role-other"
                            value={formData.courseRoleOther}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, courseRoleOther: e.target.value }))
                            }
                            placeholder={t.course.otherPlaceholder}
                            className="w-full px-4 py-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200 text-[16px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    STEP: Want to Help the Club ("Want to help the club")
                    ========================================================================= */}
                {currentStep.id === 'help' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-slate-800">
                          {t.help.helpLabel}
                        </label>
                        <span className="text-[11px] font-normal text-slate-400">
                          ({t.optionalBadge})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{t.help.helpHint}</p>
                      
                      <div className="space-y-2.5">
                        {[
                          { key: 'Investor', label: t.help.types.investor },
                          { key: 'Grant', label: t.help.types.grant },
                          { key: 'Organizational', label: t.help.types.organizational },
                          { key: 'Other', label: t.help.types.other },
                        ].map((item) => {
                          const isSelected = formData.clubHelp.includes(item.key as ClubHelpType);
                          return (
                            <button
                              key={item.key}
                              type="button"
                              id={`help-type-${item.key.toLowerCase()}`}
                              onClick={() => {
                                triggerHaptic('selection');
                                setFormData((prev) => {
                                  const exists = prev.clubHelp.includes(item.key as ClubHelpType);
                                  return {
                                    ...prev,
                                    clubHelp: exists
                                      ? prev.clubHelp.filter((h) => h !== item.key)
                                      : [...prev.clubHelp, item.key as ClubHelpType],
                                  };
                                });
                              }}
                              className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                                isSelected
                                  ? 'bg-blue-50/70 border-blue-500 text-blue-950 font-semibold ring-1 ring-blue-500/20'
                                  : 'bg-[#F9F9FB] hover:bg-slate-100 text-slate-800 border-slate-200'
                              } active:scale-[0.99] text-sm`}
                            >
                              <span>{item.label}</span>
                              <div
                                className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                                  isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {formData.clubHelp.includes('Other') && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pt-2"
                        >
                          <input
                            type="text"
                            id="club-help-other"
                            value={formData.clubHelpOther}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, clubHelpOther: e.target.value }))
                            }
                            placeholder={t.help.otherPlaceholder}
                            className="w-full px-4 py-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200 text-[16px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    STEP 4: Contact Step
                    Only asks for Email (Telegram name/username is auto-captured in TMA).
                    ========================================================================= */}
                {currentStep.id === 'contact' && (
                  <div className="space-y-5">
                    {/* Notice if TMA user detected */}
                    {isTMA && tmaUser && (
                      <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-blue-900 text-xs flex items-center space-x-2.5">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          TG
                        </div>
                        <span className="leading-relaxed">
                          {t.contact.tmaDetectedNotice}
                        </span>
                      </div>
                    )}

                    {/* Email Input */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-semibold text-slate-800">
                          {t.contact.emailLabel}
                        </label>
                        {isTMA && tmaUser ? (
                          <span className="text-[11px] font-normal text-slate-400">
                            ({t.optionalBadge})
                          </span>
                        ) : (
                          <span className="text-rose-500 text-xs font-semibold">*</span>
                        )}
                      </div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          id="contact-email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, email: e.target.value }))
                          }
                          placeholder={t.contact.emailPlaceholder}
                          className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-[#F9F9FB] border border-slate-200 text-[16px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {t.contact.emailHint}
                      </p>
                    </div>

                    <p className="text-[12px] text-slate-400 leading-relaxed text-center pt-2">
                      {t.contact.dataNotice}
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              /* =========================================================================
                 SUCCESS SCREEN: Apple-style confirmation
                 ========================================================================= */
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="py-8 px-2 flex flex-col items-center text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    {t.success.title}
                  </h2>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    {t.success.subtitle}
                  </p>
                </div>

                {/* Delivery Badges */}
                <div className="w-full space-y-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-700">
                    <span className="font-medium">{t.success.deliveredEmail}</span>
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-700">
                    <span className="font-medium">{t.success.deliveredTelegram}</span>
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                </div>

                {/* Summary Card */}
                <div className="w-full text-left p-4 rounded-2xl bg-[#F9F9FB] border border-slate-200 text-xs space-y-2">
                  <div className="font-semibold text-slate-800 pb-1 border-b border-slate-200/80">
                    {t.success.summaryTitle}
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-400">Email:</span>
                    <span className="col-span-2 font-medium text-blue-600 font-mono">{formData.email}</span>
                  </div>
                  {isTMA && tmaUser && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-slate-400">Telegram:</span>
                      <span className="col-span-2 font-medium text-slate-800">
                        {[tmaUser.first_name, tmaUser.last_name].filter(Boolean).join(' ') || (tmaUser.username ? `@${tmaUser.username}` : `ID ${tmaUser.id}`)}
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-400">Goal:</span>
                    <span className="col-span-2 font-medium text-slate-800">{formData.goal}</span>
                  </div>
                </div>

                <div className="w-full space-y-2 pt-2">
                  {isTMA && (
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                    >
                      {t.success.closeBtn}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t.success.resetBtn}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Persistent Action Bar */}
        {!isSubmitted && !isBlockedOutsideTelegram && (
          <footer className="sticky bottom-0 z-20 backdrop-blur-xl bg-white/95 border-t border-slate-200/70 p-4">
            <button
              id="main-action-btn"
              type="button"
              disabled={isSubmitting}
              onClick={handleNext}
              className="w-full py-4 px-6 rounded-2xl bg-blue-600 text-white font-semibold text-[16px] tracking-tight hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 transition-all shadow-[0_4px_16px_rgba(37,99,235,0.25)] flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.navigation.submitting}</span>
                </>
              ) : currentStepIndex === totalSteps - 1 ? (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.navigation.submit}</span>
                </>
              ) : (
                <span>{t.navigation.next}</span>
              )}
            </button>
          </footer>
        )}
      </main>
    </div>
  );
}
