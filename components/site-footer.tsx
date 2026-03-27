export function SiteFooter() {
  const thisYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-600 md:px-8">
        <p>JLSUVERY 企業資訊與聯繫平台</p>
        <p>© {thisYear} jlsuvery.tw. All rights reserved.</p>
      </div>
    </footer>
  );
}
