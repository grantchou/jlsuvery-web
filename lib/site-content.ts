import { db } from "@/lib/db";

export type DownloadItem = {
  title: string;
  description: string;
  filePath: string;
};

export type HomeContent = {
  headline: string;
  description: string;
  highlights: string[];
};

export type AboutCard = {
  title: string;
  body: string;
};

export type AboutContent = {
  heading: string;
  intro: string;
  cards: AboutCard[];
};

export type ServicesContent = {
  heading: string;
  items: string[];
};

export type DocsSection = {
  title: string;
  details: string[];
  link?: { href: string; label: string };
};

export type DocsContent = {
  heading: string;
  sections: DocsSection[];
};

export type FaqItem = {
  q: string;
  a: string;
};

export type FaqContent = {
  heading: string;
  intro: string;
  items: FaqItem[];
};

export type ContactContent = {
  heading: string;
  intro: string;
};

export type SiteContent = {
  home: HomeContent;
  about: AboutContent;
  services: ServicesContent;
  docs: DocsContent;
  faq: FaqContent;
  contact: ContactContent;
  downloads: DownloadItem[];
};

const SITE_CONTENT_KEY = "siteContent";

const defaultContent: SiteContent = {
  home: {
    headline: "企業資訊與聯繫平台第一版",
    description:
      "JLSUVERY 提供企業資料、服務說明與文件架構，讓合作夥伴與客戶可以快速掌握資訊，並透過線上表單進行公司聯繫。",
    highlights: [
      "公司資料與說明集中展示",
      "聯絡需求即時送出與追蹤",
      "保留可持續擴充的網站架構",
    ],
  },
  about: {
    heading: "關於我們",
    intro:
      "JLSUVERY 致力於提供可靠的企業合作服務，將供應資訊、服務說明與聯繫流程整合成清楚且可持續擴充的平台。",
    cards: [
      { title: "透明溝通", body: "以清楚文件與流程說明，降低合作摩擦成本。" },
      { title: "穩定交付", body: "用可追蹤、可維護的系統化方式累積企業資產。" },
      { title: "持續擴充", body: "網站架構支援後續新增後台、會員、更多模組功能。" },
    ],
  },
  services: {
    heading: "服務項目",
    items: ["流程說明文件", "聯繫窗口整合"],
  },
  docs: {
    heading: "文件說明",
    sections: [
      { title: "合作流程", details: ["需求提出", "可行性確認", "交付時程與驗收"] },
      { title: "服務條款", details: ["資料使用範圍", "雙方責任", "變更與終止規範"] },
      {
        title: "常見問題",
        details: ["回覆時效", "窗口資訊", "資料補件方式"],
        link: { href: "/faq", label: "查看常見問題全文" },
      },
      {
        title: "檔案下載",
        details: ["公司簡介", "合作流程摘要", "文件範本下載"],
        link: { href: "/downloads", label: "前往檔案下載頁" },
      },
    ],
  },
  faq: {
    heading: "常見問題",
    intro: "以下為常見詢問整理。若未涵蓋您的情境，請直接聯絡我們。",
    items: [
      {
        q: "如何與 JLSUVERY 聯繫？",
        a: "請至「聯絡我們」頁面填寫表單，留下姓名、電話與需求內容。送出後系統會存檔並寄送通知，我們會依序回覆。",
      },
      {
        q: "多久會收到回覆？",
        a: "工作日內會盡快處理；實際回覆時間依案件複雜度與詢問量而定。若為急件，請在主旨或內容中註明。",
      },
      {
        q: "可以索取公司或合作相關文件嗎？",
        a: "可至「文件說明」瀏覽流程與條款摘要；若需正式文件或補件，請於聯絡表單中說明用途，我們會另行提供。",
      },
      {
        q: "網站之後會增加哪些功能？",
        a: "目前為第一版形象與聯繫平台，後續可擴充檔案下載、後台內容管理等。若有優先需求，歡迎透過表單告知。",
      },
    ],
  },
  contact: {
    heading: "聯絡我們",
    intro: "請留下您的需求資訊，我們會盡快與您聯繫。送出後系統會同時保存資料並發送通知信件。",
  },
  downloads: [
    {
      title: "公司簡介（範例）",
      description: "提供 JLSUVERY 第一版網站用途的公司簡介範本檔案。",
      filePath: "/downloads/company-profile-sample.txt",
    },
  ],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeStringArray(value: unknown, fallback: string[]): string[] {
  const list = Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  return list.length > 0 ? list : fallback;
}

function normalizeAbout(value: unknown): AboutContent {
  if (!isRecord(value)) {
    return defaultContent.about;
  }
  const heading = typeof value.heading === "string" ? value.heading : defaultContent.about.heading;
  const intro = typeof value.intro === "string" ? value.intro : defaultContent.about.intro;
  const cardsRaw = Array.isArray(value.cards) ? value.cards : [];
  const cards = cardsRaw
    .filter((item): item is Record<string, unknown> => isRecord(item))
    .map((item) => ({
      title: typeof item.title === "string" ? item.title : "",
      body: typeof item.body === "string" ? item.body : "",
    }))
    .filter((item) => item.title && item.body);

  return {
    heading,
    intro,
    cards: cards.length > 0 ? cards : defaultContent.about.cards,
  };
}

function normalizeServices(value: unknown): ServicesContent {
  if (!isRecord(value)) {
    return defaultContent.services;
  }
  const heading = typeof value.heading === "string" ? value.heading : defaultContent.services.heading;
  const items = normalizeStringArray(value.items, defaultContent.services.items);
  return { heading, items };
}

function normalizeDocs(value: unknown): DocsContent {
  if (!isRecord(value)) {
    return defaultContent.docs;
  }
  const heading = typeof value.heading === "string" ? value.heading : defaultContent.docs.heading;
  const sectionsRaw = Array.isArray(value.sections) ? value.sections : [];
  const sections = sectionsRaw
    .filter((item): item is Record<string, unknown> => isRecord(item))
    .map((item) => {
      const title = typeof item.title === "string" ? item.title : "";
      const details = normalizeStringArray(item.details, []);
      const link = isRecord(item.link) ? item.link : undefined;
      const href = link && typeof link.href === "string" ? link.href : "";
      const label = link && typeof link.label === "string" ? link.label : "";
      return {
        title,
        details,
        link: href && label ? { href, label } : undefined,
      } satisfies DocsSection;
    })
    .filter((section) => section.title && section.details.length > 0);

  return {
    heading,
    sections: sections.length > 0 ? sections : defaultContent.docs.sections,
  };
}

function normalizeFaq(value: unknown): FaqContent {
  if (!isRecord(value)) {
    return defaultContent.faq;
  }
  const heading = typeof value.heading === "string" ? value.heading : defaultContent.faq.heading;
  const intro = typeof value.intro === "string" ? value.intro : defaultContent.faq.intro;
  const itemsRaw = Array.isArray(value.items) ? value.items : [];
  const items = itemsRaw
    .filter((item): item is Record<string, unknown> => isRecord(item))
    .map((item) => ({
      q: typeof item.q === "string" ? item.q : "",
      a: typeof item.a === "string" ? item.a : "",
    }))
    .filter((item) => item.q && item.a);

  return { heading, intro, items: items.length > 0 ? items : defaultContent.faq.items };
}

function normalizeContact(value: unknown): ContactContent {
  if (!isRecord(value)) {
    return defaultContent.contact;
  }
  const heading = typeof value.heading === "string" ? value.heading : defaultContent.contact.heading;
  const intro = typeof value.intro === "string" ? value.intro : defaultContent.contact.intro;
  return { heading, intro };
}

function normalizeContent(raw: unknown): SiteContent {
  if (!isRecord(raw)) {
    return defaultContent;
  }
  const value = raw as Partial<SiteContent>;
  const home = value.home ?? defaultContent.home;
  const downloads = Array.isArray(value.downloads)
    ? value.downloads.filter(
        (item): item is DownloadItem =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as DownloadItem).title === "string" &&
          typeof (item as DownloadItem).description === "string" &&
          typeof (item as DownloadItem).filePath === "string",
      )
    : defaultContent.downloads;

  const highlights = normalizeStringArray(home.highlights, defaultContent.home.highlights);

  return {
    home: {
      headline: home.headline ?? defaultContent.home.headline,
      description: home.description ?? defaultContent.home.description,
      highlights: highlights.length > 0 ? highlights : defaultContent.home.highlights,
    },
    about: normalizeAbout(value.about),
    services: normalizeServices(value.services),
    docs: normalizeDocs(value.docs),
    faq: normalizeFaq(value.faq),
    contact: normalizeContact(value.contact),
    downloads: downloads.length > 0 ? downloads : defaultContent.downloads,
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: SITE_CONTENT_KEY },
    });
    if (!setting) {
      return defaultContent;
    }
    return normalizeContent(setting.value);
  } catch (error) {
    console.error("讀取網站內容失敗，改用預設內容。", error);
    return defaultContent;
  }
}

export async function updateSiteContent(content: SiteContent): Promise<SiteContent> {
  const normalized = normalizeContent(content);
  await db.siteSetting.upsert({
    where: { key: SITE_CONTENT_KEY },
    update: { value: normalized },
    create: { key: SITE_CONTENT_KEY, value: normalized },
  });
  return normalized;
}
