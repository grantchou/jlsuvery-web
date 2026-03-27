import Link from "next/link";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/about", label: "關於我們" },
  { href: "/services", label: "服務項目" },
  { href: "/docs", label: "文件說明" },
  { href: "/downloads", label: "檔案下載" },
  { href: "/faq", label: "常見問題" },
  { href: "/contact", label: "聯絡我們" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Link
          href="/"
          className="rounded-lg px-1 text-lg font-semibold tracking-tight text-slate-900 hover:text-sky-700"
        >
          JLSUVERY
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-transparent px-3 py-1.5 transition hover:border-slate-200 hover:bg-white hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
