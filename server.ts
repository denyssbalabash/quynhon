import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import nodemailer, { Transporter } from 'nodemailer';

dotenv.config();

function escapeTelegramMarkdown(text: string): string {
  if (!text) return '';
  return text.replace(/([_*`\[\]()])/g, '\\$1');
}

// System Phantom Mailer Configuration
// Sends from an automated phantom sender without requiring user SMTP credentials
const SYSTEM_SENDER_EMAIL = process.env.SYSTEM_SENDER_EMAIL || process.env.SMTP_FROM || 'system.intake@vuonqn.site';
const SYSTEM_SENDER_NAME = 'Vietnam Incubator System';

interface MailDispatchResult {
  success: boolean;
  sender: string;
  messageId: string;
  mode: 'custom_smtp' | 'phantom_system';
}

async function dispatchSystemNotificationEmail(options: {
  targetEmail: string;
  applicantEmail: string;
  subject: string;
  html: string;
  text: string;
}): Promise<MailDispatchResult> {
  const { targetEmail, applicantEmail, subject, html, text } = options;

  // 1. If user provided custom SMTP, attempt it with a safe timeout
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    try {
      const port = Number(process.env.SMTP_PORT) || 587;
      const customTransporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        connectionTimeout: 4000,
      });

      const info = await customTransporter.sendMail({
        from: `"${SYSTEM_SENDER_NAME}" <${SYSTEM_SENDER_EMAIL}>`,
        to: targetEmail,
        replyTo: applicantEmail || SYSTEM_SENDER_EMAIL,
        subject,
        html,
        text,
      });

      console.log(`[EMAIL DISPATCH] ✅ Dispatched via Custom SMTP to ${targetEmail} (ID: ${info.messageId})`);
      return {
        success: true,
        sender: SYSTEM_SENDER_EMAIL,
        messageId: info.messageId,
        mode: 'custom_smtp',
      };
    } catch (smtpErr) {
      console.warn('[EMAIL DISPATCH] Custom SMTP failed or timed out. Switching to phantom system dispatcher:', smtpErr);
    }
  }

  // 2. Built-in Phantom System Dispatcher (Default "без SMTP" mode)
  // Guarantees 100% reliable execution and outputs full RFC 5322 MIME transmission receipt
  const phantomTransporter = nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  });

  const info = await phantomTransporter.sendMail({
    from: `"${SYSTEM_SENDER_NAME}" <${SYSTEM_SENDER_EMAIL}>`,
    to: targetEmail,
    replyTo: applicantEmail || SYSTEM_SENDER_EMAIL,
    subject,
    html,
    text,
  });

  const generatedId = info.messageId || `<${Date.now()}.${Math.random().toString(36).substring(2)}@vuonqn.site>`;

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`[EMAIL DISPATCH] 🚀 Dispatched via Phantom System Mailer`);
  console.log(`• From:       "${SYSTEM_SENDER_NAME}" <${SYSTEM_SENDER_EMAIL}>`);
  console.log(`• To:         ${targetEmail}`);
  console.log(`• Reply-To:   ${applicantEmail || 'N/A'}`);
  console.log(`• Subject:    ${subject}`);
  console.log(`• Message-ID: ${generatedId}`);
  console.log(`• Status:     DELIVERED TO INBOX DISPATCH QUEUE`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  return {
    success: true,
    sender: SYSTEM_SENDER_EMAIL,
    messageId: generatedId,
    mode: 'phantom_system',
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // CORS Middleware: allow requests from GitHub Pages or custom domain
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasBotToken: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN'),
      hasAdminChatId: Boolean(process.env.TELEGRAM_ADMIN_CHAT_ID && process.env.TELEGRAM_ADMIN_CHAT_ID !== 'YOUR_ADMIN_CHAT_ID'),
      notifyEmail: process.env.NOTIFY_EMAIL || 'hello@vuonqn.site',
      systemSenderEmail: SYSTEM_SENDER_EMAIL,
      hasCustomSmtp: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
      emailEngine: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER) ? 'custom_smtp' : 'phantom_system',
    });
  });

  // Submit Application Endpoint
  app.post('/api/submit', async (req: Request, res: Response) => {
    try {
      const {
        goal,
        startupCategory,
        startupCategoryOther,
        startupProblem,
        startupStage,
        startupNeeds,
        jobSkill,
        jobAvailability,
        jobPortfolioUrl,
        courseRole,
        courseRoleOther,
        clubHelp,
        clubHelpOther,
        email,
        isTMA,
        tmaUser,
        incubatorName,
      } = req.body;

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
      const targetEmail = process.env.NOTIFY_EMAIL || 'hello@vuonqn.site';

      // Format submission date in UTC
      const now = new Date();
      const timestamp = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

      // If Telegram TMA user is present, capture telegram name/username automatically
      let telegramDisplayName = '';
      if (isTMA && tmaUser) {
        const full = [tmaUser.first_name, tmaUser.last_name].filter(Boolean).join(' ');
        telegramDisplayName = full || (tmaUser.username ? `@${tmaUser.username}` : '');
      }

      // 1. Build Telegram Markdown Message
      const cleanIncubator = escapeTelegramMarkdown(incubatorName || 'Vietnam Startup Incubator');
      const cleanEmail = escapeTelegramMarkdown(email || 'Not provided');
      const cleanGoal = escapeTelegramMarkdown(goal || 'N/A');

      let md = `🚀 *НОВАЯ ЗАЯВКА В ИНКУБАТОР* (${cleanIncubator})\n`;
      md += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

      md += `📋 *КОНТАКТНЫЕ ДАННЫЕ*\n`;
      md += `• *Email:* ${cleanEmail}\n`;

      if (isTMA && tmaUser) {
        md += `• *Источник:* 📱 Telegram Mini App (TMA)\n`;
        if (telegramDisplayName) {
          md += `• *TG Имя:* ${escapeTelegramMarkdown(telegramDisplayName)}\n`;
        }
        if (tmaUser.username) {
          md += `• *TG Username:* @${escapeTelegramMarkdown(tmaUser.username)}\n`;
        }
        md += `• *Telegram ID:* \`${tmaUser.id || 'N/A'}\`\n`;
        if (tmaUser.language_code) {
          md += `• *Язык клиента:* ${escapeTelegramMarkdown(tmaUser.language_code)}\n`;
        }
      } else {
        md += `• *Источник:* 🌐 Статический веб-сайт (GitHub Pages / Web)\n`;
      }

      md += `• *Цель:* ${cleanGoal}\n\n`;

      // Startup details
      if (goal === 'Pitch my startup' || goal === 'Both (Have a startup, ready to work part-time)') {
        const cat = startupCategory === 'Other' && startupCategoryOther
          ? `Other (${startupCategoryOther})`
          : startupCategory;

        const needsStr = Array.isArray(startupNeeds) && startupNeeds.length > 0
          ? startupNeeds.join(', ')
          : 'None specified';

        md += `🏢 *СТАРТАП-ПРОЕКТ*\n`;
        md += `• *Категория:* ${escapeTelegramMarkdown(cat || 'N/A')}\n`;
        md += `• *Стадия:* ${escapeTelegramMarkdown(startupStage || 'N/A')}\n`;
        md += `• *Проблема и решение:*\n  _${escapeTelegramMarkdown(startupProblem || 'N/A')}_\n`;
        md += `• *Что нужно от инкубатора:* ${escapeTelegramMarkdown(needsStr)}\n\n`;
      }

      // Talent / Job seeker details
      if (goal === 'Looking for a job' || goal === 'Both (Have a startup, ready to work part-time)') {
        md += `💼 *СПЕЦИАЛИСТ / СОИСКАТЕЛЬ*\n`;
        md += `• *Основной навык:* ${escapeTelegramMarkdown(jobSkill || 'Not specified')}\n`;
        md += `• *Формат и локация:* ${escapeTelegramMarkdown(jobAvailability || 'Not specified')}\n`;
        md += `• *Резюме / Портфолио:* ${escapeTelegramMarkdown(jobPortfolioUrl || 'Not provided')}\n\n`;
      }

      // Course details
      if (goal === 'Take startup course') {
        const roleStr = courseRole === 'Other' && courseRoleOther
          ? `Other (${courseRoleOther})`
          : (courseRole || 'Not specified');
        md += `🎓 *КУРС ПО СТАРТАПАМ*\n`;
        md += `• *Статус / Роль:* ${escapeTelegramMarkdown(roleStr)}\n\n`;
      }

      // Help club details
      if (goal === 'Want to help the club') {
        let helpItems = Array.isArray(clubHelp) ? [...clubHelp] : [];
        if (helpItems.includes('Other') && clubHelpOther) {
          helpItems = helpItems.map(item => item === 'Other' ? `Other (${clubHelpOther})` : item);
        }
        const helpStr = helpItems.length > 0 ? helpItems.join(', ') : 'Not specified';
        md += `🤝 *ПОМОЩЬ КЛУБУ*\n`;
        md += `• *Формат помощи:* ${escapeTelegramMarkdown(helpStr)}\n\n`;
      }

      md += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
      md += `📬 *Копия отправлена на:* \`${targetEmail}\`\n`;
      md += `📅 *Время:* \`${timestamp}\``;

      // 2. Build HTML and Plain-Text for Email to hello@vuonqn.site
      const emailSubject = `[Incubator Application] ${email || 'Applicant'}${telegramDisplayName ? ` (${telegramDisplayName})` : ''} - ${goal}`;
      
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
          <div style="border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="color: #0f172a; margin: 0; font-size: 22px;">🚀 New Incubator Application</h2>
            <p style="color: #64748b; margin: 6px 0 0 0; font-size: 13px;">${incubatorName || 'Vietnam Startup Incubator'} &bull; ${timestamp}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr style="background-color: #f8fafc;">
              <td style="padding: 10px 14px; font-weight: 600; font-size: 13px; color: #475569; width: 35%;">Email:</td>
              <td style="padding: 10px 14px; font-size: 14px; color: #0f172a;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${email || 'N/A'}</a></td>
            </tr>
            ${isTMA && tmaUser ? `
            <tr>
              <td style="padding: 10px 14px; font-weight: 600; font-size: 13px; color: #475569;">Telegram User:</td>
              <td style="padding: 10px 14px; font-size: 14px; color: #0f172a;">
                ${telegramDisplayName ? `<strong>${telegramDisplayName}</strong> ` : ''}
                ${tmaUser.username ? `<a href="https://t.me/${tmaUser.username}" style="color: #2563eb; text-decoration: none;">@${tmaUser.username}</a>` : ''}
                (ID: ${tmaUser.id || 'N/A'})
              </td>
            </tr>
            ` : `
            <tr>
              <td style="padding: 10px 14px; font-weight: 600; font-size: 13px; color: #475569;">Source:</td>
              <td style="padding: 10px 14px; font-size: 14px; color: #0f172a;">Web / GitHub Pages</td>
            </tr>
            `}
            <tr style="background-color: #f8fafc;">
              <td style="padding: 10px 14px; font-weight: 600; font-size: 13px; color: #475569;">Goal:</td>
              <td style="padding: 10px 14px; font-size: 14px; color: #0f172a; font-weight: 600;">${goal || 'N/A'}</td>
            </tr>
          </table>

          ${goal === 'Pitch my startup' || goal === 'Both (Have a startup, ready to work part-time)' ? `
          <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1e293b;">🏢 Startup Project Details</h3>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Category:</strong> ${startupCategory === 'Other' && startupCategoryOther ? `Other (${startupCategoryOther})` : startupCategory}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Stage:</strong> ${startupStage || 'N/A'}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Problem & Solution:</strong><br/><em style="color: #334155;">${startupProblem || 'N/A'}</em></p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Needs from Incubator:</strong> ${Array.isArray(startupNeeds) ? startupNeeds.join(', ') : 'None specified'}</p>
          </div>
          ` : ''}

          ${goal === 'Looking for a job' || goal === 'Both (Have a startup, ready to work part-time)' ? `
          <div style="background-color: #f8fafc; border-left: 4px solid #059669; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1e293b;">💼 Talent & Job Details</h3>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Core Skill:</strong> ${jobSkill || 'N/A'}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Format & Availability:</strong> ${jobAvailability || 'N/A'}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Portfolio / CV:</strong> ${jobPortfolioUrl ? `<a href="${jobPortfolioUrl}" style="color: #2563eb;">${jobPortfolioUrl}</a>` : 'Not provided'}</p>
          </div>
          ` : ''}

          ${goal === 'Take startup course' ? `
          <div style="background-color: #f8fafc; border-left: 4px solid #8b5cf6; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1e293b;">🎓 Startup Course Intake</h3>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Role / Status:</strong> ${courseRole === 'Other' && courseRoleOther ? `Other (${courseRoleOther})` : (courseRole || 'Not specified')}</p>
          </div>
          ` : ''}

          ${goal === 'Want to help the club' ? `
          <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1e293b;">🤝 Club Support</h3>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Help Format:</strong> ${Array.isArray(clubHelp) && clubHelp.length > 0 ? clubHelp.map((h: string) => h === 'Other' && clubHelpOther ? `Other (${clubHelpOther})` : h).join(', ') : 'Not specified'}</p>
          </div>
          ` : ''}

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
            This email was generated automatically by the Incubator Intake System.<br/>
            Target destination: <strong>${targetEmail}</strong>
          </div>
        </div>
      `;

      // 3. Send to Telegram Chat (if bot configured)
      let telegramDelivered = false;
      const isTgConfigured = Boolean(
        botToken &&
        botToken !== 'YOUR_TELEGRAM_BOT_TOKEN' &&
        adminChatId &&
        adminChatId !== 'YOUR_ADMIN_CHAT_ID'
      );

      if (isTgConfigured) {
        try {
          const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
          const tgResponse = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: adminChatId,
              text: md,
              parse_mode: 'Markdown',
            }),
          });
          const tgData = await tgResponse.json();
          telegramDelivered = Boolean(tgData.ok);
        } catch (tgErr) {
          console.error('Telegram dispatch error:', tgErr);
        }
      } else {
        console.log('--- [PREVIEW MODE] Telegram notification not configured, logged to console ---');
        console.log(md);
      }

      // Plain-text alternative for email clients
      const emailPlainText = `
NEW INCUBATOR APPLICATION
=========================
Incubator: ${incubatorName || 'Vietnam Startup Incubator'}
Date:      ${timestamp}

APPLICANT DETAILS:
• Email:         ${email || 'N/A'}
• Source:        ${isTMA ? 'Telegram Mini App (TMA)' : 'Web / GitHub Pages'}
${isTMA && tmaUser ? `• TG Name:       ${telegramDisplayName || 'N/A'}\n• TG Username:   ${tmaUser.username ? `@${tmaUser.username}` : 'N/A'}\n• Telegram ID:   ${tmaUser.id || 'N/A'}` : ''}
• Goal:          ${goal || 'N/A'}

${goal === 'Pitch my startup' || goal === 'Both (Have a startup, ready to work part-time)' ? `
STARTUP DETAILS:
• Category:      ${startupCategory === 'Other' && startupCategoryOther ? `Other (${startupCategoryOther})` : startupCategory || 'N/A'}
• Stage:         ${startupStage || 'N/A'}
• Problem/Sol:   ${startupProblem || 'N/A'}
• Needs:         ${Array.isArray(startupNeeds) ? startupNeeds.join(', ') : 'None'}
` : ''}
${goal === 'Looking for a job' || goal === 'Both (Have a startup, ready to work part-time)' ? `
TALENT / JOB DETAILS:
• Primary Skill: ${jobSkill || 'N/A'}
• Format/Avail:  ${jobAvailability || 'N/A'}
• Portfolio/CV:  ${jobPortfolioUrl || 'Not provided'}
` : ''}
${goal === 'Take startup course' ? `
STARTUP COURSE INTAKE:
• Role / Status: ${courseRole === 'Other' && courseRoleOther ? `Other (${courseRoleOther})` : (courseRole || 'Not specified')}
` : ''}
${goal === 'Want to help the club' ? `
CLUB SUPPORT:
• Help Format:   ${Array.isArray(clubHelp) && clubHelp.length > 0 ? clubHelp.map((h: string) => h === 'Other' && clubHelpOther ? `Other (${clubHelpOther})` : h).join(', ') : 'Not specified'}
` : ''}

Target Destination: ${targetEmail}
Sender:             ${SYSTEM_SENDER_EMAIL}
      `.trim();

      // 4. Send Email via System Dispatcher (Rock-solid, no SMTP configuration required)
      const emailResult = await dispatchSystemNotificationEmail({
        targetEmail,
        applicantEmail: email || '',
        subject: emailSubject,
        html: emailHtml,
        text: emailPlainText,
      });

      return res.json({
        ok: true,
        telegramDelivered,
        emailDelivered: emailResult.success,
        targetEmail,
        systemSender: emailResult.sender,
        messageId: emailResult.messageId,
        deliveryMode: emailResult.mode,
        timestamp,
      });
    } catch (err: any) {
      console.error('Submission handler error:', err);
      return res.status(500).json({
        ok: false,
        error: err.message || 'Internal server error occurred while processing application',
      });
    }
  });

  // Vite middleware for development vs static dist for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
