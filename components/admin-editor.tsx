"use client";

import { FormEvent, useEffect, useState } from "react";
import type { SiteContent } from "@/lib/site-content";

type Props = {
  initialContent: SiteContent;
};

export function AdminEditor({ initialContent }: Props) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setMessage("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) {
        setStatus("error");
        setMessage(data.message ?? "更新失敗");
        return;
      }
      setStatus("success");
      setMessage(data.message ?? "更新成功");
    } catch {
      setStatus("error");
      setMessage("更新失敗");
    }
  };

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">首頁內容</h2>
        <div className="mt-4 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm text-slate-700">主標題</span>
            <input
              value={content.home.headline}
              onChange={(event) =>
                setContent((prev) => ({
                  ...prev,
                  home: { ...prev.home, headline: event.target.value },
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm text-slate-700">主描述</span>
            <textarea
              rows={3}
              value={content.home.description}
              onChange={(event) =>
                setContent((prev) => ({
                  ...prev,
                  home: { ...prev.home, description: event.target.value },
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm text-slate-700">三個重點（每行一個）</span>
            <textarea
              rows={4}
              value={content.home.highlights.join("\n")}
              onChange={(event) =>
                setContent((prev) => ({
                  ...prev,
                  home: {
                    ...prev.home,
                    highlights: event.target.value
                      .split("\n")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  },
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">下載清單</h2>
        <p className="mt-2 text-sm text-slate-600">
          每列 1 個檔案，格式：標題 | 描述 | 路徑（例如 /downloads/xxx.pdf）
        </p>
        <textarea
          rows={8}
          value={content.downloads.map((item) => `${item.title} | ${item.description} | ${item.filePath}`).join("\n")}
          onChange={(event) =>
            setContent((prev) => ({
              ...prev,
              downloads: event.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                  const [title, description, filePath] = line.split("|").map((part) => part.trim());
                  return { title: title ?? "", description: description ?? "", filePath: filePath ?? "" };
                })
                .filter((item) => item.title && item.description && item.filePath),
            }))
          }
          className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
        >
          {status === "saving" ? "儲存中..." : "儲存內容"}
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800"
        >
          登出
        </button>
      </div>

      {message ? (
        <p className={status === "success" ? "text-sm text-emerald-700" : "text-sm text-rose-700"}>{message}</p>
      ) : null}
    </form>
  );
}
