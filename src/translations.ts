/**
 * Internationalization (EN / VI / RU) with strict system-detection rules:
 * - English (en) and Vietnamese (vi) can be toggled manually.
 * - Russian (ru) cannot be selected manually; it is only activated if the user's system/Telegram language is Russian.
 */

export type Language = 'en' | 'vi' | 'ru';

export interface Translations {
  steps: {
    goalTitle: string;
    goalSubtitle: string;
    startupTitle: string;
    startupSubtitle: string;
    jobTitle: string;
    jobSubtitle: string;
    contactTitle: string;
    contactSubtitle: string;
  };
  navigation: {
    next: string;
    back: string;
    submit: string;
    submitting: string;
    stepOf: (current: number, total: number) => string;
    complete: (percent: number) => string;
    validationWarning: string;
  };
  q1: {
    question: string;
    options: {
      pitch: { label: string; desc: string };
      job: { label: string; desc: string };
      both: { label: string; desc: string };
    };
  };
  startup: {
    q2Label: string;
    q2Placeholder: string;
    q2OtherPlaceholder: string;
    categories: Record<string, string>;
    q3Label: string;
    q3Placeholder: string;
    q3Hint: string;
    q4Label: string;
    stages: Record<string, string>;
    q5Label: string;
    q5Placeholder: string;
    q6Label: string;
    q6Hint: string;
    needs: Record<string, string>;
  };
  job: {
    q7Label: string;
    skills: Record<string, string>;
    q8Label: string;
    comp: Record<string, string>;
    q9Label: string;
    avail: Record<string, string>;
    q10Label: string;
    q10Placeholder: string;
  };
  contact: {
    emailLabel: string;
    emailPlaceholder: string;
    emailHint: string;
    dataNotice: string;
    tmaDetectedNotice: string;
  };
  success: {
    title: string;
    subtitle: string;
    deliveredEmail: string;
    deliveredTelegram: string;
    summaryTitle: string;
    resetBtn: string;
    closeBtn: string;
  };
  error: {
    general: string;
    retry: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    steps: {
      goalTitle: 'Your Primary Goal',
      goalSubtitle: 'What brings you to our incubator today?',
      startupTitle: 'Startup Details',
      startupSubtitle: 'Tell us about your venture and mission',
      jobTitle: 'Talent & Skills',
      jobSubtitle: 'Tell us about your expertise and expectations',
      contactTitle: 'Contact Information',
      contactSubtitle: 'Where should we send your confirmation and feedback?',
    },
    navigation: {
      next: 'Continue',
      back: 'Back',
      submit: 'Submit Application',
      submitting: 'Submitting...',
      stepOf: (curr, total) => `Step ${curr} of ${total}`,
      complete: (p) => `${p}% completed`,
      validationWarning: 'Please fill in the required fields to proceed.',
    },
    q1: {
      question: 'Q1: How would you best describe your goal today?',
      options: {
        pitch: {
          label: 'Pitch my startup',
          desc: 'Looking for incubator funding, mentorship, or market expansion in Vietnam.',
        },
        job: {
          label: 'Looking for a job',
          desc: 'Ready to join a funded startup or tech team as a contributor.',
        },
        both: {
          label: 'Both (Startup + Part-time)',
          desc: 'Building my venture while open to freelance or part-time roles.',
        },
      },
    },
    startup: {
      q2Label: 'Q2: What category best describes your startup?',
      q2Placeholder: 'Select startup category...',
      q2OtherPlaceholder: 'Please specify your startup vertical...',
      categories: {
        SaaS: 'SaaS (Software as a Service)',
        'E-commerce': 'E-commerce',
        Fintech: 'Fintech & Web3',
        Marketplace: 'Marketplace & Platform',
        EdTech: 'EdTech',
        Other: 'Other',
      },
      q3Label: 'Q3: In one simple sentence, what problem does your product solve and for whom?',
      q3Placeholder: 'e.g. We help remote tech teams in Southeast Asia automate payroll compliance with zero manual paperwork.',
      q3Hint: 'Keep it concise and crystal-clear',
      q4Label: 'Q4: What is the current stage of your product?',
      stages: {
        Idea: 'Idea',
        'Prototype/MVP': 'Prototype / MVP',
        'Early users': 'Early users',
        Revenue: 'Revenue',
      },
      q5Label: 'Q5: Describe your core technical solution or stack briefly',
      q5Placeholder: 'e.g. Next.js, Node.js, Python AI models, PostgreSQL',
      q6Label: 'Q6: What is the #1 thing you need from our incubator right now?',
      q6Hint: 'Select your top priorities:',
      needs: {
        Funding: 'Funding',
        Mentorship: 'Mentorship',
        'Tech Development': 'Tech Development',
        'Local network in Vietnam': 'Local network in Vietnam',
      },
    },
    job: {
      q7Label: 'Q7: What is your strongest professional skill?',
      skills: {
        Engineering: 'Engineering',
        Marketing: 'Marketing',
        Sales: 'Sales',
        Operations: 'Operations',
        Design: 'Design',
      },
      q8Label: 'Q8: What is your expected monthly compensation in USD?',
      comp: {
        'Under $200': 'Under $200',
        '$200 - $500': '$200 - $500',
        '$500+': '$500+',
      },
      q9Label: 'Q9: Where are you located and what is your availability?',
      avail: {
        'Vietnam Full-time': 'Vietnam Full-time',
        'Vietnam Part-time': 'Vietnam Part-time',
        'Remote Full-time': 'Remote Full-time',
        'Remote Part-time': 'Remote Part-time',
      },
      q10Label: 'Q10: Link to your CV, LinkedIn, or Portfolio (Optional)',
      q10Placeholder: 'https://linkedin.com/in/username or portfolio link',
    },
    contact: {
      emailLabel: 'Email address',
      emailPlaceholder: 'name@example.com',
      emailHint: 'We will send details to this address and hello@vuonqn.site',
      dataNotice: 'Your application is strictly confidential and sent directly to the incubator leadership.',
      tmaDetectedNotice: 'Your Telegram account is automatically linked to this submission.',
    },
    success: {
      title: 'Application Received!',
      subtitle: 'Our incubation team has received your submission and will get in touch shortly.',
      deliveredEmail: 'Copy dispatched to hello@vuonqn.site',
      deliveredTelegram: 'Telegram notification delivered to incubator team',
      summaryTitle: 'Application Summary:',
      resetBtn: 'Submit Another Application',
      closeBtn: 'Close Window',
    },
    error: {
      general: 'Unable to deliver your application. Please check your connection or try again.',
      retry: 'Retry Submission',
    },
  },

  vi: {
    steps: {
      goalTitle: 'Mục Tiêu Của Bạn',
      goalSubtitle: 'Điều gì đưa bạn đến với vườn ươm khởi nghiệp của chúng tôi?',
      startupTitle: 'Thông Tin Dự Án Khởi Nghiệp',
      startupSubtitle: 'Hãy chia sẻ về sản phẩm, sứ mệnh và kế hoạch của bạn',
      jobTitle: 'Kinh Nghiệm & Chuyên Môn',
      jobSubtitle: 'Chia sẻ về kỹ năng và kỳ vọng công việc của bạn',
      contactTitle: 'Thông Tin Liên Hệ',
      contactSubtitle: 'Vườn ươm có thể gửi phản hồi cho bạn qua địa chỉ nào?',
    },
    navigation: {
      next: 'Tiếp tục',
      back: 'Quay lại',
      submit: 'Gửi hồ sơ',
      submitting: 'Đang gửi...',
      stepOf: (curr, total) => `Bước ${curr} / ${total}`,
      complete: (p) => `Đã hoàn thành ${p}%`,
      validationWarning: 'Vui lòng điền đầy đủ các thông tin bắt buộc trước khi tiếp tục.',
    },
    q1: {
      question: 'Q1: Đâu là mô tả chính xác nhất mục tiêu của bạn hôm nay?',
      options: {
        pitch: {
          label: 'Thuyết trình dự án khởi nghiệp',
          desc: 'Tìm kiếm vốn đầu tư từ vườn ươm, cố vấn (mentorship) hoặc mở rộng thị trường tại Việt Nam.',
        },
        job: {
          label: 'Tìm việc làm trong startup',
          desc: 'Sẵn sàng gia nhập một đội ngũ công nghệ hoặc startup triển vọng.',
        },
        both: {
          label: 'Cả hai (Có startup & sẵn sàng làm bán thời gian)',
          desc: 'Phát triển dự án riêng đồng thời mở cho cơ hội làm việc part-time.',
        },
      },
    },
    startup: {
      q2Label: 'Q2: Lĩnh vực nào mô tả đúng nhất dự án của bạn?',
      q2Placeholder: 'Chọn danh mục dự án...',
      q2OtherPlaceholder: 'Vui lòng ghi rõ lĩnh vực dự án của bạn...',
      categories: {
        SaaS: 'SaaS (Phần mềm dịch vụ)',
        'E-commerce': 'E-commerce (Thương mại điện tử)',
        Fintech: 'Fintech & Web3 (Công nghệ tài chính)',
        Marketplace: 'Marketplace (Sàn / Nền tảng kết nối)',
        EdTech: 'EdTech (Công nghệ giáo dục)',
        Other: 'Khác',
      },
      q3Label: 'Q3: Trong một câu ngắn gọn: sản phẩm của bạn giải quyết vấn đề gì và cho ai?',
      q3Placeholder: 'Ví dụ: Chúng tôi giúp các đội ngũ công nghệ tại Đông Nam Á tự động hóa tính lương mà không tốn giấy tờ.',
      q3Hint: 'Ngắn gọn, rõ ràng và đúng trọng tâm',
      q4Label: 'Q4: Dự án của bạn hiện đang ở giai đoạn nào?',
      stages: {
        Idea: 'Ý tưởng',
        'Prototype/MVP': 'Bản mẫu thử nghiệm (MVP / Prototype)',
        'Early users': 'Đã có người dùng đầu tiên',
        Revenue: 'Đã có doanh thu',
      },
      q5Label: 'Q5: Mô tả ngắn gọn giải pháp kỹ thuật cốt lõi hoặc công nghệ sử dụng',
      q5Placeholder: 'Ví dụ: Next.js, Node.js, Python AI models, PostgreSQL',
      q6Label: 'Q6: Điều quan trọng số 1 bạn cần từ vườn ươm lúc này là gì?',
      q6Hint: 'Chọn các nhu cầu ưu tiên hàng đầu của bạn:',
      needs: {
        Funding: 'Vốn đầu tư (Funding)',
        Mentorship: 'Cố vấn & Đào tạo (Mentorship)',
        'Tech Development': 'Hỗ trợ phát triển công nghệ (Tech Development)',
        'Local network in Vietnam': 'Mạng lưới kết nối tại Việt Nam (Local network)',
      },
    },
    job: {
      q7Label: 'Q7: Kỹ năng chuyên môn mạnh nhất của bạn là gì?',
      skills: {
        Engineering: 'Lập trình / Kỹ thuật (Engineering)',
        Marketing: 'Marketing / Tăng trưởng',
        Sales: 'Kinh doanh / Bán hàng (Sales)',
        Operations: 'Vận hành & Quản lý (Operations)',
        Design: 'Thiết kế (UI/UX Design)',
      },
      q8Label: 'Q8: Mức thu nhập mong muốn mỗi tháng (USD)?',
      comp: {
        'Under $200': 'Dưới $200',
        '$200 - $500': '$200 - $500',
        '$500+': 'Trên $500',
      },
      q9Label: 'Q9: Địa điểm và thời gian làm việc bạn có thể cam kết?',
      avail: {
        'Vietnam Full-time': 'Tại Việt Nam (Toàn thời gian)',
        'Vietnam Part-time': 'Tại Việt Nam (Bán thời gian)',
        'Remote Full-time': 'Từ xa (Toàn thời gian)',
        'Remote Part-time': 'Từ xa (Bán thời gian)',
      },
      q10Label: 'Q10: Đường dẫn CV, LinkedIn hoặc Portfolio (Không bắt buộc)',
      q10Placeholder: 'https://linkedin.com/in/username hoặc link portfolio',
    },
    contact: {
      emailLabel: 'Địa chỉ Email',
      emailPlaceholder: 'name@example.com',
      emailHint: 'Thông tin xác nhận sẽ được gửi đến email này và hello@vuonqn.site',
      dataNotice: 'Thông tin hồ sơ hoàn toàn bảo mật và được gửi trực tiếp đến ban điều hành vườn ươm.',
      tmaDetectedNotice: 'Tài khoản Telegram của bạn đã được tự động liên kết với hồ sơ này.',
    },
    success: {
      title: 'Đã Gửi Hồ Sơ Thành Công!',
      subtitle: 'Đội ngũ vườn ươm đã nhận được thông tin và sẽ phản hồi sớm nhất có thể.',
      deliveredEmail: 'Bản sao đã gửi đến hello@vuonqn.site',
      deliveredTelegram: 'Đã thông báo cho ban quản trị vườn ươm qua Telegram',
      summaryTitle: 'Tóm tắt thông tin gửi đi:',
      resetBtn: 'Gửi hồ sơ khác',
      closeBtn: 'Đóng cửa sổ',
    },
    error: {
      general: 'Không thể gửi hồ sơ. Vui lòng kiểm tra kết nối mạng và thử lại.',
      retry: 'Thử gửi lại',
    },
  },

  ru: {
    steps: {
      goalTitle: 'Ваша основная цель',
      goalSubtitle: 'С какой задачей вы пришли в наш инкубатор?',
      startupTitle: 'О вашем стартапе',
      startupSubtitle: 'Расскажите о вашей идее, продукте и планах',
      jobTitle: 'Опыт и компетенции',
      jobSubtitle: 'Расскажите о ваших навыках и желаемом формате работы',
      contactTitle: 'Контакты для связи',
      contactSubtitle: 'Куда направить подтверждение и обратную связь?',
    },
    navigation: {
      next: 'Далее',
      back: 'Назад',
      submit: 'Отправить заявку',
      submitting: 'Отправка...',
      stepOf: (curr, total) => `Шаг ${curr} из ${total}`,
      complete: (p) => `${p}% заполнено`,
      validationWarning: 'Пожалуйста, заполните обязательные поля для перехода далее.',
    },
    q1: {
      question: 'Q1: Как бы вы лучше всего описали вашу цель сегодня?',
      options: {
        pitch: {
          label: 'Защитить стартап',
          desc: 'Ищу инвестиции, менторство или помощь с выходом на рынок Вьетнама.',
        },
        job: {
          label: 'Ищу работу в стартапе',
          desc: 'Хочу присоединиться к перспективной команде или проекту.',
        },
        both: {
          label: 'И то, и другое',
          desc: 'Развиваю свой стартап, но готов к частичной занятости (part-time).',
        },
      },
    },
    startup: {
      q2Label: 'Q2: Какая категория лучше всего описывает ваш стартап?',
      q2Placeholder: 'Выберите категорию стартапа...',
      q2OtherPlaceholder: 'Укажите направление стартапа...',
      categories: {
        SaaS: 'SaaS (Software as a Service)',
        'E-commerce': 'E-commerce (Электронная коммерция)',
        Fintech: 'Fintech & Web3 (Финтех)',
        Marketplace: 'Marketplace (Маркетплейс / Платформа)',
        EdTech: 'EdTech (Образовательные технологии)',
        Other: 'Другое',
      },
      q3Label: 'Q3: Одним простым предложением: какую проблему решает ваш продукт и для кого?',
      q3Placeholder: 'Например: Мы помогаем IT-командам в Юго-Восточной Азии автоматически вести налоговую отчетность без бухгалтеров.',
      q3Hint: 'Кратко, понятно и по существу',
      q4Label: 'Q4: На какой стадии сейчас ваш продукт?',
      stages: {
        Idea: 'Идея',
        'Prototype/MVP': 'Прототип / MVP',
        'Early users': 'Первые пользователи',
        Revenue: 'Выручка / Продажи',
      },
      q5Label: 'Q5: Опишите ваше ключевое техническое решение или стек',
      q5Placeholder: 'Например: React, Node.js, Python/AI, PostgreSQL',
      q6Label: 'Q6: Что главное вам нужно от нашего инкубатора прямо сейчас?',
      q6Hint: 'Выберите один или несколько пунктов:',
      needs: {
        Funding: 'Инвестиции (Funding)',
        Mentorship: 'Менторство и трекинг (Mentorship)',
        'Tech Development': 'Техническая разработка (Tech Development)',
        'Local network in Vietnam': 'Связи и нетворкинг во Вьетнаме (Local network)',
      },
    },
    job: {
      q7Label: 'Q7: Ваш самый сильный профессиональный навык?',
      skills: {
        Engineering: 'Разработка (Engineering)',
        Marketing: 'Маркетинг (Marketing)',
        Sales: 'Продажи (Sales)',
        Operations: 'Операции / Управление (Operations)',
        Design: 'Дизайн (Design / UI/UX)',
      },
      q8Label: 'Q8: Ожидаемый ежемесячный доход в USD?',
      comp: {
        'Under $200': 'До $200',
        '$200 - $500': '$200 – $500',
        '$500+': '$500+',
      },
      q9Label: 'Q9: Где вы находитесь и какая у вас доступность?',
      avail: {
        'Vietnam Full-time': 'Вьетнам (Full-time)',
        'Vietnam Part-time': 'Вьетнам (Part-time)',
        'Remote Full-time': 'Удаленно (Full-time)',
        'Remote Part-time': 'Удаленно (Part-time)',
      },
      q10Label: 'Q10: Ссылка на резюме, LinkedIn или портфолио (опционально)',
      q10Placeholder: 'https://linkedin.com/in/username или ссылка на сайт',
    },
    contact: {
      emailLabel: 'Электронная почта (Email)',
      emailPlaceholder: 'name@example.com',
      emailHint: 'Копия заявки будет отправлена на этот адрес и hello@vuonqn.site',
      dataNotice: 'Заявка конфиденциальна и передается напрямую руководству инкубатора.',
      tmaDetectedNotice: 'Ваш Telegram-аккаунт автоматически привязан к заявке.',
    },
    success: {
      title: 'Заявка успешно отправлена!',
      subtitle: 'Команда инкубатора получила ваши данные и свяжется с вами в ближайшее время.',
      deliveredEmail: 'Копия отправлена на hello@vuonqn.site',
      deliveredTelegram: 'Данные доставлены администратору в Telegram',
      summaryTitle: 'Сводка вашей анкеты:',
      resetBtn: 'Заполнить заново',
      closeBtn: 'Закрыть окно',
    },
    error: {
      general: 'Не удалось отправить анкету. Пожалуйста, проверьте соединение или повторите попытку.',
      retry: 'Попробовать снова',
    },
  },
};

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
      if (tgLang.toLowerCase().startsWith('vi')) {
        return true;
      }
    }

    if (typeof navigator !== 'undefined') {
      const navLang = navigator.language || (navigator.languages && navigator.languages[0]) || '';
      if (navLang.toLowerCase().startsWith('vi')) {
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
 * 2. If Vietnamese system detected -> 'vi'
 * 3. Default -> 'en'
 */
export function detectLanguage(): Language {
  if (isSystemRussian()) return 'ru';
  if (isSystemVietnamese()) return 'vi';
  return 'en';
}
