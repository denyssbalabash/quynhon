/**
 * Cloudflare Worker — Бессерверный безопасный прокси для Telegram бота
 * Бесплатно: 100 000 запросов в день, 0 рублей, не нужен сервер!
 *
 * Инструкция по установке (2 минуты):
 * 1. Зайдите на dash.cloudflare.com -> Workers & Pages -> Create Worker
 * 2. Вставьте весь этот код в редактор.
 * 3. Перейдите в Settings -> Variables -> Добавьте 2 переменные:
 *    - TELEGRAM_BOT_TOKEN (тип Secret/Encrypt): ваш новый токен от @BotFather
 *    - TELEGRAM_ADMIN_CHAT_ID: ваш chat_id (например, -1003927235033)
 * 4. Нажмите Deploy. Вы получите ссылку вида: https://xxxx.workers.dev
 * 5. Вставьте эту ссылку в VITE_API_ENDPOINT или в src/config.ts -> apiEndpoint!
 */

export default {
  async fetch(request, env) {
    // 1. Обработка CORS pre-flight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    try {
      const data = await request.json();
      const botToken = env.TELEGRAM_BOT_TOKEN;
      const adminChatId = env.TELEGRAM_ADMIN_CHAT_ID || '-1003927235033';

      if (!botToken) {
        return new Response(JSON.stringify({ error: 'Worker missing TELEGRAM_BOT_TOKEN secret' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      const escapeHtml = (text) => {
        if (!text) return '';
        return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      };

      const email = escapeHtml(data.email || 'Not provided');
      const goal = escapeHtml(data.goal || 'N/A');
      const incubator = escapeHtml(data.incubatorName || 'Vuon Quy Nhơn');
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

      let html = `🚀 <b>НОВАЯ ЗАЯВКА В ИНКУБАТОР</b> (${incubator})\n`;
      html += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      html += `📋 <b>КОНТАКТНЫЕ ДАННЫЕ</b>\n`;
      html += `• <b>Email:</b> ${email}\n`;

      if (data.isTMA && data.tmaUser) {
        html += `• <b>Источник:</b> 📱 Telegram Mini App (TMA)\n`;
        const fullName = [data.tmaUser.first_name, data.tmaUser.last_name].filter(Boolean).join(' ');
        if (fullName) html += `• <b>TG Имя:</b> ${escapeHtml(fullName)}\n`;
        if (data.tmaUser.username) html += `• <b>TG Username:</b> @${escapeHtml(data.tmaUser.username)}\n`;
        html += `• <b>Telegram ID:</b> <code>${escapeHtml(String(data.tmaUser.id || 'N/A'))}</code>\n`;
      } else {
        html += `• <b>Источник:</b> 🌐 Веб-сайт\n`;
      }

      html += `• <b>Цель:</b> ${goal}\n\n`;

      if (data.goal === 'Pitch my startup' || data.goal === 'Both (Have a startup, ready to work part-time)') {
        const cat = data.startupCategory === 'Other' && data.startupCategoryOther
          ? `Other (${data.startupCategoryOther})`
          : data.startupCategory;
        const needsStr = Array.isArray(data.startupNeeds) && data.startupNeeds.length > 0 ? data.startupNeeds.join(', ') : 'None specified';
        html += `🏢 <b>СТАРТАП-ПРОЕКТ</b>\n`;
        html += `• <b>Категория:</b> ${escapeHtml(cat || 'Not specified')}\n`;
        html += `• <b>Стадия:</b> ${escapeHtml(data.startupStage || 'Not specified')}\n`;
        if (data.startupProblem) html += `• <b>Проблема/решение:</b>\n  <i>${escapeHtml(data.startupProblem)}</i>\n`;
        html += `• <b>Потребности:</b> ${escapeHtml(needsStr)}\n\n`;
      }

      if (data.goal === 'Looking for a job' || data.goal === 'Both (Have a startup, ready to work part-time)') {
        html += `💼 <b>СПЕЦИАЛИСТ / СОИСКАТЕЛЬ</b>\n`;
        html += `• <b>Основной навык:</b> ${escapeHtml(data.jobSkill || 'Not specified')}\n`;
        html += `• <b>Формат и локация:</b> ${escapeHtml(data.jobAvailability || 'Not specified')}\n`;
        html += `• <b>Резюме / Портфолио:</b> ${escapeHtml(data.jobPortfolioUrl || 'Not provided')}\n\n`;
      }

      if (data.goal === 'Take startup course') {
        const roleStr = data.courseRole === 'Other' && data.courseRoleOther ? `Other (${data.courseRoleOther})` : (data.courseRole || 'Not specified');
        html += `🎓 <b>КУРС ПО СТАРТАПАМ</b>\n`;
        html += `• <b>Статус / Роль:</b> ${escapeHtml(roleStr)}\n\n`;
      }

      if (data.goal === 'Want to help the club') {
        let helpItems = Array.isArray(data.clubHelp) ? [...data.clubHelp] : [];
        if (helpItems.includes('Other') && data.clubHelpOther) {
          helpItems = helpItems.map((h) => (h === 'Other' ? `Other (${data.clubHelpOther})` : h));
        }
        const helpStr = helpItems.length > 0 ? helpItems.join(', ') : 'Not specified';
        html += `🤝 <b>ПОМОЩЬ КЛУБУ</b>\n`;
        html += `• <b>Формат помощи:</b> ${escapeHtml(helpStr)}\n\n`;
      }

      html += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
      html += `📅 <b>Время:</b> <code>${timestamp}</code>`;

      // Отправка в Telegram API (с сервера Cloudflare, токен бота скрыт от браузера)
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: adminChatId,
          text: html,
          parse_mode: 'HTML',
        }),
      });

      const tgJson = await tgRes.json().catch(() => ({}));

      if (!tgRes.ok || !tgJson.ok) {
        return new Response(JSON.stringify({ ok: false, error: tgJson.description || 'Telegram API Error' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      return new Response(JSON.stringify({ ok: true, deliveredTelegram: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};
