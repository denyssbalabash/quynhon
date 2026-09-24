/**
 * Formatted and multi-language content configuration.
 * Contains English (default) and Vietnamese translations.
 * All texts, labels, and options can be edited directly here.
 */

export interface FormTextConfig {
  optionalBadge: string;
  steps: {
    goalTitle: string;
    goalSubtitle: string;
    startupTitle: string;
    startupSubtitle: string;
    jobTitle: string;
    jobSubtitle: string;
    courseTitle: string;
    courseSubtitle: string;
    helpTitle: string;
    helpSubtitle: string;
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
      course: { label: string; desc: string };
      help: { label: string; desc: string };
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
    q6Label: string;
    q6Hint: string;
    needs: Record<string, string>;
  };
  job: {
    q7Label: string;
    skills: Record<string, string>;
    q9Label: string;
    avail: Record<string, string>;
    q10Label: string;
    q10Placeholder: string;
  };
  course: {
    roleLabel: string;
    roleHint: string;
    roles: {
      student: string;
      entrepreneur: string;
      other: string;
    };
    otherPlaceholder: string;
  };
  help: {
    helpLabel: string;
    helpHint: string;
    types: {
      investor: string;
      grant: string;
      organizational: string;
      other: string;
    };
    otherPlaceholder: string;
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
  telegramGate: {
    badge: string;
    title: string;
    subtitle: string;
    instructions: string;
    openBtn: string;
    copyBtn: string;
    copied: string;
  };
}

export type SupportedLanguage = 'en' | 'vn';

export const FORM_CONTENT_CONFIG: Record<SupportedLanguage, FormTextConfig> = {
  // =========================================================================
  // ENGLISH (EN) - Default
  // =========================================================================
  en: {
    optionalBadge: 'Optional',
    steps: {
      goalTitle: 'Your Primary Goal',
      goalSubtitle: 'What brings you to our incubator today?',
      startupTitle: 'Startup Details',
      startupSubtitle: 'Tell us a bit about your venture',
      jobTitle: 'Talent & Skills',
      jobSubtitle: 'Tell us about your background',
      courseTitle: 'Startup Course',
      courseSubtitle: 'Learn how to build and launch startups',
      helpTitle: 'Support the Club',
      helpSubtitle: 'How would you like to contribute to our community?',
      contactTitle: 'Contact Information',
      contactSubtitle: 'How can our team reach you?',
    },
    navigation: {
      next: 'Continue',
      back: 'Back',
      submit: 'Submit Application',
      submitting: 'Submitting...',
      stepOf: (curr, total) => `Step ${curr} of ${total}`,
      complete: (p) => `${p}% completed`,
      validationWarning: 'Please complete the required field to continue.',
    },
    q1: {
      question: 'How would you best describe your goal?',
      options: {
        pitch: {
          label: 'Pitch my startup',
          desc: 'Looking for incubator funding, mentorship, or market expansion in Vietnam.',
        },
        job: {
          label: 'Looking for a job',
          desc: 'Ready to join a funded startup or tech team as a contributor.',
        },
        course: {
          label: 'Take startup creation course',
          desc: 'Listen to our practical course on how startups are founded, validated, and built.',
        },
        help: {
          label: 'Want to help the club',
          desc: 'Contribute as an investor, grant provider, organizer, or community partner.',
        },
        both: {
          label: 'Both (Startup + Part-time)',
          desc: 'Building my venture while open to freelance or part-time roles.',
        },
      },
    },
    startup: {
      q2Label: 'Startup Category',
      q2Placeholder: 'Select category...',
      q2OtherPlaceholder: 'Please specify your industry...',
      categories: {
        'Tourism & Hospitality': 'Tourism & Hospitality',
        'Technology & AI': 'Technology & AI',
        'Transport & Logistics': 'Transport & Logistics',
        'Food & Beverage': 'Food & Beverage (F&B / Agri)',
        'Retail & Services': 'Retail & Services',
        Other: 'Other',
      },
      q3Label: 'What problem does your product solve?',
      q3Placeholder: 'e.g. We help travelers book local eco-tours in Vietnam with instant confirmation.',
      q3Hint: 'A simple sentence is plenty',
      q4Label: 'Current Stage',
      stages: {
        Idea: 'Idea',
        'Prototype/MVP': 'Prototype / MVP',
        'Early users': 'Early users',
        Revenue: 'Revenue',
      },
      q6Label: 'What do you need from our incubator?',
      q6Hint: 'Select all that apply:',
      needs: {
        Funding: 'Funding',
        Mentorship: 'Mentorship',
        'Tech Development': 'Tech Support',
        'Local network in Vietnam': 'Local network in Vietnam',
      },
    },
    job: {
      q7Label: 'Your Primary Skill',
      skills: {
        Engineering: 'Engineering / Dev',
        Marketing: 'Marketing & Growth',
        Sales: 'Sales & BD',
        Operations: 'Operations & Management',
        Design: 'UI/UX Design',
      },
      q9Label: 'Work Availability & Location',
      avail: {
        'Vietnam Full-time': 'Vietnam (Full-time)',
        'Vietnam Part-time': 'Vietnam (Part-time)',
        'Remote Full-time': 'Remote (Full-time)',
        'Remote Part-time': 'Remote (Part-time)',
      },
      q10Label: 'Link to CV, LinkedIn or Portfolio',
      q10Placeholder: 'https://linkedin.com/in/... or portfolio URL',
    },
    course: {
      roleLabel: 'Who are you?',
      roleHint: 'Choose the option that best describes you:',
      roles: {
        student: 'I am a student',
        entrepreneur: 'Entrepreneur',
        other: 'Other',
      },
      otherPlaceholder: 'Please tell us more about your background...',
    },
    help: {
      helpLabel: 'How would you like to help the club?',
      helpHint: 'Select all that apply:',
      types: {
        investor: 'Investor',
        grant: 'Grant / Sponsorship',
        organizational: 'Organizational & Operations',
        other: 'Other',
      },
      otherPlaceholder: 'Please describe how you would like to help...',
    },
    contact: {
      emailLabel: 'Contact Email',
      emailPlaceholder: 'name@example.com',
      emailHint: 'We will reach out to this email regarding your application',
      dataNotice: 'Your application is strictly confidential and reviewed directly by incubator management.',
      tmaDetectedNotice: 'Your Telegram account is automatically linked to this submission.',
    },
    success: {
      title: 'Application Received!',
      subtitle: 'Our incubation team has received your submission and will get in touch shortly.',
      deliveredEmail: 'Copy dispatched to incubator management',
      deliveredTelegram: 'Telegram notification delivered to incubator team',
      summaryTitle: 'Application Summary:',
      resetBtn: 'Submit Another Application',
      closeBtn: 'Close Window',
    },
    error: {
      general: 'Unable to deliver your application. Please check your connection or try again.',
      retry: 'Retry Submission',
    },
    telegramGate: {
      badge: 'Telegram Only',
      title: 'Open in Telegram',
      subtitle: 'This incubator intake form is secured and operates exclusively inside Telegram Mini Apps.',
      instructions: 'To prevent automated spam and protect your application, please open this form through our official Telegram bot.',
      openBtn: 'Open in Telegram',
      copyBtn: 'Copy Bot Link',
      copied: 'Link copied!',
    },
  },

  // =========================================================================
  // VIETNAMESE (VN) - Auto-detected for Vietnamese devices
  // =========================================================================
  vn: {
    optionalBadge: 'Không bắt buộc',
    steps: {
      goalTitle: 'Mục Tiêu Của Bạn',
      goalSubtitle: 'Điều gì đưa bạn đến với vườn ươm của chúng tôi?',
      startupTitle: 'Thông Tin Dự Án',
      startupSubtitle: 'Chia sẻ ngắn gọn về dự án của bạn',
      jobTitle: 'Kinh Nghiệm & Kỹ Năng',
      jobSubtitle: 'Chia sẻ về chuyên môn của bạn',
      courseTitle: 'Khoá Học Khởi Nghiệp',
      courseSubtitle: 'Học cách xây dựng và vận hành startup từ đầu',
      helpTitle: 'Đồng Hành Cùng CLB',
      helpSubtitle: 'Bạn muốn đóng góp cho cộng đồng như thế nào?',
      contactTitle: 'Thông Tin Liên Hệ',
      contactSubtitle: 'Vườn ươm có thể liên hệ với bạn qua đâu?',
    },
    navigation: {
      next: 'Tiếp tục',
      back: 'Quay lại',
      submit: 'Gửi hồ sơ',
      submitting: 'Đang gửi...',
      stepOf: (curr, total) => `Bước ${curr} / ${total}`,
      complete: (p) => `Đã hoàn thành ${p}%`,
      validationWarning: 'Vui lòng hoàn thành thông tin bắt buộc để tiếp tục.',
    },
    q1: {
      question: 'Mục tiêu chính của bạn hôm nay là gì?',
      options: {
        pitch: {
          label: 'Giới thiệu dự án khởi nghiệp',
          desc: 'Tìm kiếm vốn đầu tư, cố vấn (mentorship) hoặc mở rộng thị trường tại Việt Nam.',
        },
        job: {
          label: 'Tìm việc làm trong startup',
          desc: 'Sẵn sàng gia nhập đội ngũ khởi nghiệp hoặc công ty công nghệ.',
        },
        course: {
          label: 'Tham gia khoá học tạo startup',
          desc: 'Lắng nghe khoá học thực tế về cách tạo dựng, kiểm chứng và phát triển startup.',
        },
        help: {
          label: 'Muốn hỗ trợ câu lạc bộ',
          desc: 'Đóng góp với vai trò nhà đầu tư, tài trợ grant, ban tổ chức hoặc đối tác.',
        },
        both: {
          label: 'Cả hai (Có dự án & nhận việc part-time)',
          desc: 'Phát triển dự án riêng đồng thời sẵn sàng nhận công việc bán thời gian.',
        },
      },
    },
    startup: {
      q2Label: 'Lĩnh Vực Dự Án',
      q2Placeholder: 'Chọn lĩnh vực...',
      q2OtherPlaceholder: 'Nhập lĩnh vực của bạn...',
      categories: {
        'Tourism & Hospitality': 'Du lịch & Khách sạn (Tourism)',
        'Technology & AI': 'Công nghệ & AI (Tech & AI)',
        'Transport & Logistics': 'Vận tải & Logistics (Transport)',
        'Food & Beverage': 'Ẩm thực & Nông nghiệp (F&B / Agri)',
        'Retail & Services': 'Bán lẻ & Dịch vụ (Retail & Services)',
        Other: 'Khác',
      },
      q3Label: 'Sản phẩm của bạn giải quyết vấn đề gì?',
      q3Placeholder: 'Ví dụ: Chúng tôi giúp khách du lịch đặt tour sinh thái tại Việt Nam nhanh chóng qua ứng dụng.',
      q3Hint: 'Chỉ cần một câu ngắn gọn, súc tích',
      q4Label: 'Giai Đoạn Hiện Tại',
      stages: {
        Idea: 'Ý tưởng',
        'Prototype/MVP': 'Bản mẫu thử nghiệm (MVP)',
        'Early users': 'Đã có người dùng',
        Revenue: 'Đã có doanh thu',
      },
      q6Label: 'Bạn cần hỗ trợ gì từ vườn ươm?',
      q6Hint: 'Có thể chọn nhiều mục:',
      needs: {
        Funding: 'Vốn đầu tư (Funding)',
        Mentorship: 'Cố vấn & Đào tạo (Mentorship)',
        'Tech Development': 'Hỗ trợ công nghệ (Tech)',
        'Local network in Vietnam': 'Kết nối mạng lưới tại Việt Nam',
      },
    },
    job: {
      q7Label: 'Kỹ Năng Nổi Bật Nhất',
      skills: {
        Engineering: 'Lập trình / Kỹ thuật',
        Marketing: 'Marketing & Tăng trưởng',
        Sales: 'Kinh doanh / Bán hàng',
        Operations: 'Vận hành & Quản lý',
        Design: 'Thiết kế (UI/UX)',
      },
      q9Label: 'Hình Thức Làm Việc & Địa Điểm',
      avail: {
        'Vietnam Full-time': 'Tại Việt Nam (Toàn thời gian)',
        'Vietnam Part-time': 'Tại Việt Nam (Bán thời gian)',
        'Remote Full-time': 'Từ xa (Toàn thời gian)',
        'Remote Part-time': 'Từ xa (Bán thời gian)',
      },
      q10Label: 'Đường Dẫn CV, LinkedIn hoặc Portfolio',
      q10Placeholder: 'https://linkedin.com/in/... hoặc link portfolio',
    },
    course: {
      roleLabel: 'Bạn hiện là ai?',
      roleHint: 'Chọn mô tả phù hợp nhất với bạn:',
      roles: {
        student: 'Tôi là sinh viên',
        entrepreneur: 'Doanh nhân / Đã có kinh doanh',
        other: 'Khác',
      },
      otherPlaceholder: 'Vui lòng chia sẻ thêm về ngành học hoặc công việc...',
    },
    help: {
      helpLabel: 'Bạn muốn hỗ trợ câu lạc bộ như thế nào?',
      helpHint: 'Có thể chọn nhiều mục:',
      types: {
        investor: 'Nhà đầu tư (Investor)',
        grant: 'Tài trợ / Quỹ Grant',
        organizational: 'Hỗ trợ tổ chức & vận hành',
        other: 'Khác',
      },
      otherPlaceholder: 'Vui lòng mô tả cách bạn muốn hỗ trợ...',
    },
    contact: {
      emailLabel: 'Email Liên Hệ',
      emailPlaceholder: 'name@example.com',
      emailHint: 'Chúng tôi sẽ gửi phản hồi về hồ sơ của bạn qua email này',
      dataNotice: 'Hồ sơ được bảo mật và gửi trực tiếp đến ban điều hành vườn ươm.',
      tmaDetectedNotice: 'Tài khoản Telegram của bạn đã được tự động liên kết với hồ sơ này.',
    },
    success: {
      title: 'Đã Gửi Hồ Sơ Thành Công!',
      subtitle: 'Đội ngũ vườn ươm đã nhận được thông tin và sẽ liên hệ lại với bạn sớm nhất.',
      deliveredEmail: 'Bản sao đã được chuyển đến ban điều hành',
      deliveredTelegram: 'Đã thông báo cho ban quản trị vườn ươm qua Telegram',
      summaryTitle: 'Tóm tắt thông tin gửi đi:',
      resetBtn: 'Gửi hồ sơ khác',
      closeBtn: 'Đóng cửa sổ',
    },
    error: {
      general: 'Không thể gửi hồ sơ. Vui lòng kiểm tra kết nối mạng và thử lại.',
      retry: 'Thử gửi lại',
    },
    telegramGate: {
      badge: 'Chỉ Dành Cho Telegram',
      title: 'Mở Trong Telegram',
      subtitle: 'Biểu mẫu nộp hồ sơ này được bảo mật và chỉ hoạt động bên trong Telegram Mini App.',
      instructions: 'Để ngăn chặn bot tự động và bảo vệ dữ liệu hồ sơ của bạn, vui lòng mở biểu mẫu này thông qua bot Telegram chính thức.',
      openBtn: 'Mở trong Telegram',
      copyBtn: 'Sao chép liên kết Bot',
      copied: 'Đã sao chép liên kết!',
    },
  },
};
