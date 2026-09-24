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

  // Настройки Telegram бота:
  // ВНИМАНИЕ: Для максимальной безопасности токен бота НЕ должен храниться в открытом JS коде.
  // Используйте VITE_TELEGRAM_BOT_TOKEN для локальных тестов или бессерверный endpoint (Cloudflare Worker / Google Script).
  telegram: {
    botToken: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TELEGRAM_BOT_TOKEN) || '',
    adminChatId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TELEGRAM_ADMIN_CHAT_ID) || '-1003927235033',
  },

  // URL бессерверного прокси или бэкенда для отправки заявок (Google Script / Cloudflare Worker / server)
  // Заявка безопасно отправляется через Google Apps Script без раскрытия токена в браузере.
  apiEndpoint: 'https://script.google.com/macros/s/AKfycbyB8PPlQd0kPl-8bGYiLv0pM-0wTu3gOrcPHGaZkpnrfUQcAq3n6H1XmQE1DBMTgKSBfg/exec',

  // Открывать ТОЛЬКО внутри Telegram (защита от случайных заходов ботов и людей из браузера)
  requireTelegramApp: true,

  // Юзернейм вашего бота в Telegram (без @)
  botUsername: 'vuonqn_bot',

  // Прямая ссылка на запуск приложения в Telegram Mini App
  telegramAppUrl: 'https://t.me/vuonqn_bot/form',

  // Контакт поддержки
  supportTelegram: '@incubator_support',
};
