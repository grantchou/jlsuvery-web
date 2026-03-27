"use client";

import { FormEvent, useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  hp: string;
};

const initialForm: ContactPayload = {
  name: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
  hp: "",
};

export function ContactForm() {
  const [form, setForm] = useState<ContactPayload>(initialForm);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: { message: string } = await response.json();
      if (!response.ok) {
        setStatus("error");
        setFeedback(data.message ?? "送出失敗，請稍後再試。");
        return;
      }
      setStatus("success");
      setForm(initialForm);
      setFeedback(data.message ?? "已收到您的需求，感謝聯繫。");
    } catch {
      setStatus("error");
      setFeedback("系統暫時忙碌，請稍後再試。");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-slate-700">姓名</span>
          <input
            required
            minLength={2}
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-slate-700">聯絡電話</span>
          <input
            type="tel"
            required
            minLength={8}
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
      </div>
      <label className="space-y-2">
        <span className="text-sm text-slate-700">Email</span>
        <input
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm text-slate-700">主旨</span>
        <input
          required
          minLength={2}
          value={form.subject}
          onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm text-slate-700">需求內容</span>
        <textarea
          required
          rows={6}
          minLength={10}
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>
      <label className="hidden">
        公司代號
        <input
          tabIndex={-1}
          autoComplete="off"
          value={form.hp}
          onChange={(event) => setForm((prev) => ({ ...prev, hp: event.target.value }))}
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
      >
        {status === "loading" ? "送出中..." : "送出聯絡需求"}
      </button>
      {feedback ? (
        <p className={status === "success" ? "text-sm text-emerald-700" : "text-sm text-rose-700"}>{feedback}</p>
      ) : null}
    </form>
  );
}
