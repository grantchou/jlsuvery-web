export function SiteFooter() {
  const thisYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur">
      <div className="mx-auto grid w-full max-w-6xl gap-3 px-6 py-7 text-sm text-slate-600 md:grid-cols-2 md:px-8">
        <p className="font-medium text-slate-800">JLSUVERY 企業資訊與聯繫平台</p>
        <p className="md:text-right">© {thisYear} jlsuvery.tw. All rights reserved.</p>
      </div>
    </footer>
  );
}
