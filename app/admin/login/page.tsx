"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data: { message?: string } = await response.json();
      if (!response.ok) {
        setMessage(data.message ?? "登入失敗");
        setLoading(false);
        return;
      }
      window.location.href = "/admin";
    } catch {
      setMessage("登入失敗，請稍後再試");
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">後台登入</h1>
      <p className="mt-2 text-sm text-slate-600">請輸入後台密碼以編輯首頁與下載頁內容。</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block space-y-2">
          <span className="text-sm text-slate-700">後台密碼</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "登入中..." : "登入"}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm text-rose-700">{message}</p> : null}
    </section>
  );
}
