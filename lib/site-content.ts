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

export type SiteContent = {
  home: HomeContent;
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
  downloads: [
    {
      title: "公司簡介（範例）",
      description: "提供 JLSUVERY 第一版網站用途的公司簡介範本檔案。",
      filePath: "/downloads/company-profile-sample.txt",
    },
  ],
};

function normalizeContent(raw: unknown): SiteContent {
  if (!raw || typeof raw !== "object") {
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

  const highlights = Array.isArray(home.highlights)
    ? home.highlights.filter((item): item is string => typeof item === "string")
    : defaultContent.home.highlights;

  return {
    home: {
      headline: home.headline ?? defaultContent.home.headline,
      description: home.description ?? defaultContent.home.description,
      highlights: highlights.length > 0 ? highlights : defaultContent.home.highlights,
    },
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
