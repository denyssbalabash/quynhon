/**
 * Global Configuration for the Incubator TMA / Intake Form
 * Ready for GitHub Pages deployment (static frontend) pointing to your backend.
 */

export const INCUBATOR_CONFIG = {
  // Название инкубатора / Tên vườn ươm
  name: 'Vietnam Startup Incubator',

  // Путь к логотипу (например, '/logo.svg', '/logo.png' или внешняя ссылка https://...)
  // Если строка пустая '', будет отображаться стильная нативная иконка в стиле Apple
  logoUrl: '',

  // Короткое описание для шапки
  tagline: 'Intake & Application Form',

  // Целевой email для уведомлений
  notifyEmail: 'hello@vuonqn.site',

  // URL бэкенда для отправки заявок.
  // При деплое статики на GitHub Pages замените на адрес вашего бэкенда:
  // например: 'https://my-backend.vuonqn.site/api/submit' или 'https://my-incubator.onrender.com/api/submit'
  // По умолчанию для локальной разработки и встроенного сервера используется относительный путь:
  apiEndpoint: '/api/submit',

  // Контакт поддержки
  supportTelegram: '@incubator_support',
};
