/**
 * Global Configuration for the Incubator TMA / Intake Form
 * Ready for GitHub Pages deployment (static frontend) pointing to your backend.
 */

export const INCUBATOR_CONFIG = {
  // Название инкубатора / Tên vườn ươm
  name: 'Vuon Quy Nhơn',

  // Путь к логотипу (например, '/logo.svg', '/logo.png' или внешняя ссылка https://...)
  // Если строка пустая '', будет отображаться стильная нативная иконка в стиле Apple
  logoUrl: 'src/file_000000007cb481fa9d1d5da3bfff24d4.png',

  // Короткое описание для шапки
  tagline: 'Intake & Application Form',

  // Целевой email для уведомлений
  notifyEmail: 'hello@vuonqn.site',

  // Настройки Telegram бота (если у вас нет своего бэкенда/сервера и всё крутится на GitHub Pages):
  // Укажите токен бота и chat ID вашего канала/админа прямо здесь или через VITE_ переменные:
  // Если указаны botToken и adminChatId, форма напрямую отправит красивый отчет в Telegram из браузера!
  telegram: {
    botToken: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TELEGRAM_BOT_TOKEN) || '8805681503:AAG0zo-_RoxfqPQ6-LMJscnJDOH8pYSOB4A',
    adminChatId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TELEGRAM_ADMIN_CHAT_ID) || '-1003927235033',
  },

  // URL бэкенда для отправки заявок (если используется сервер).
  // Если telegram.botToken указан, форма отправит данные напрямую в Telegram даже без бэкенда.
  apiEndpoint: '/api/submit',

  // Контакт поддержки
  supportTelegram: '@incubator_support',
};
