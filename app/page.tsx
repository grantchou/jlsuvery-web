export default function Home() {
  return (
    <section className="space-y-10">
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold text-sky-700">www.jlsuvery.tw</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          企業資訊與聯繫平台第一版
        </h1>
        <p className="mt-4 max-w-3xl text-slate-600">
          JLSUVERY 提供企業資料、服務說明與文件架構，讓合作夥伴與客戶可以快速掌握資訊，並透過線上表單進行公司聯繫。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          "公司資料與說明集中展示",
          "聯絡需求即時送出與追蹤",
          "保留可持續擴充的網站架構",
        ].map((item) => (
          <article key={item} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-base font-semibold text-slate-900">{item}</h2>
          </article>
        ))}
      </div>
    </section>
  );
}
