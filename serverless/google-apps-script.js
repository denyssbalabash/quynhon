/**
 * Google Apps Script — 100% Бесплатный обработчик без серверов
 * Бонус: автоматически отправляет заявку в Telegram и (по желанию) в Google Таблицу!
 *
 * Инструкция по установке (1 минута):
 * 1. Откройте https://script.google.com и нажмите "Новый проект" (New project)
 * 2. Вставьте весь этот код
 * 3. В строках 15-16 укажите ваш новый BOT_TOKEN и CHAT_ID
 * 4. Нажмите синюю кнопку "Развернуть" (Deploy) -> "Новое развертывание" (New deployment)
 * 5. Тип: "Веб-приложение" (Web app)
 * 6. "Кто имеет доступ" (Who has access): выберите "Все" (Anyone)
 * 7. Нажмите "Развернуть" и скопируйте полученный Web App URL (https://script.google.com/macros/s/.../exec)
 * 8. Вставьте этот URL в src/config.ts в поле apiEndpoint!
 */

const TELEGRAM_BOT_TOKEN = "ВСТАВЬТЕ_ВАШ_НОВЫЙ_ТОКЕН_ОТ_BOTFATHER";
const TELEGRAM_ADMIN_CHAT_ID = "-1003927235033";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    function escapeHtml(text) {
      if (!text) return '';
      return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    const email = escapeHtml(data.email || 'Not provided');
    const goal = escapeHtml(data.goal || 'N/A');
    const incubator = escapeHtml(data.incubatorName || 'Vuon Quy Nhơn');
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    let html = "🚀 <b>НОВАЯ ЗАЯВКА В ИНКУБАТОР</b> (" + incubator + ")\n";
    html += "━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    html += "📋 <b>КОНТАКТНЫЕ ДАННЫЕ</b>\n";
    html += "• <b>Email:</b> " + email + "\n";

    if (data.isTMA && data.tmaUser) {
      html += "• <b>Источник:</b> 📱 Telegram Mini App (TMA)\n";
      const fullName = [data.tmaUser.first_name, data.tmaUser.last_name].filter(Boolean).join(' ');
      if (fullName) html += "• <b>TG Имя:</b> " + escapeHtml(fullName) + "\n";
      if (data.tmaUser.username) html += "• <b>TG Username:</b> @" + escapeHtml(data.tmaUser.username) + "\n";
      html += "• <b>Telegram ID:</b> <code>" + escapeHtml(String(data.tmaUser.id || 'N/A')) + "</code>\n";
    } else {
      html += "• <b>Источник:</b> 🌐 Веб-сайт\n";
    }

    html += "• <b>Цель:</b> " + goal + "\n\n";

    if (data.goal === 'Pitch my startup' || data.goal === 'Both (Have a startup, ready to work part-time)') {
      const cat = data.startupCategory === 'Other' && data.startupCategoryOther ? 'Other (' + data.startupCategoryOther + ')' : data.startupCategory;
      const needsStr = Array.isArray(data.startupNeeds) && data.startupNeeds.length > 0 ? data.startupNeeds.join(', ') : 'None specified';
      html += "🏢 <b>СТАРТАП-ПРОЕКТ</b>\n";
      html += "• <b>Категория:</b> " + escapeHtml(cat || 'Not specified') + "\n";
      html += "• <b>Стадия:</b> " + escapeHtml(data.startupStage || 'Not specified') + "\n";
      if (data.startupProblem) html += "• <b>Проблема/решение:</b>\n  <i>" + escapeHtml(data.startupProblem) + "</i>\n";
      html += "• <b>Потребности:</b> " + escapeHtml(needsStr) + "\n\n";
    }

    if (data.goal === 'Looking for a job' || data.goal === 'Both (Have a startup, ready to work part-time)') {
      html += "💼 <b>СПЕЦИАЛИСТ / СОИСКАТЕЛЬ</b>\n";
      html += "• <b>Основной навык:</b> " + escapeHtml(data.jobSkill || 'Not specified') + "\n";
      html += "• <b>Формат и локация:</b> " + escapeHtml(data.jobAvailability || 'Not specified') + "\n";
      html += "• <b>Резюме / Портфолио:</b> " + escapeHtml(data.jobPortfolioUrl || 'Not provided') + "\n\n";
    }

    if (data.goal === 'Take startup course') {
      const roleStr = data.courseRole === 'Other' && data.courseRoleOther ? 'Other (' + data.courseRoleOther + ')' : (data.courseRole || 'Not specified');
      html += "🎓 <b>КУРС ПО СТАРТАПАМ</b>\n";
      html += "• <b>Статус / Роль:</b> " + escapeHtml(roleStr) + "\n\n";
    }

    if (data.goal === 'Want to help the club') {
      let helpItems = Array.isArray(data.clubHelp) ? data.clubHelp.slice() : [];
      if (helpItems.indexOf('Other') !== -1 && data.clubHelpOther) {
        helpItems = helpItems.map(function(h) { return h === 'Other' ? 'Other (' + data.clubHelpOther + ')' : h; });
      }
      const helpStr = helpItems.length > 0 ? helpItems.join(', ') : 'Not specified';
      html += "🤝 <b>ПОМОЩЬ КЛУБУ</b>\n";
      html += "• <b>Формат помощи:</b> " + escapeHtml(helpStr) + "\n\n";
    }

    html += "━━━━━━━━━━━━━━━━━━━━━━━\n";
    html += "📅 <b>Время:</b> <code>" + timestamp + "</code>";

    // Отправляем в Telegram
    const tgUrl = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
    const payload = {
      chat_id: TELEGRAM_ADMIN_CHAT_ID,
      text: html,
      parse_mode: "HTML"
    };

    UrlFetchApp.fetch(tgUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
