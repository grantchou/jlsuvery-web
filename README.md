# JLSUVERY 第一版網站

此專案為 `www.jlsuvery.tw` 第一版公司網站，提供公司資訊、服務說明、文件頁面與聯絡表單功能。

## 技術棧

- Next.js (App Router)
- Tailwind CSS
- Prisma + PostgreSQL
- Resend 或 SMTP 寄信

## 本機啟動

1. 安裝套件

```bash
npm install
```

2. 設定環境變數

```bash
copy .env.example .env
```

3. 產生 Prisma Client

```bash
npm run prisma:generate
```

4. 建立資料表（需先設定 `DATABASE_URL`）

```bash
npm run prisma:migrate -- --name init_contact_message
```

5. 啟動開發環境

```bash
npm run dev
```

## 聯絡表單流程

- 前端送出到 `POST /api/contact`
- 後端以 zod 驗證欄位
- 先寫入 `ContactMessage` 資料表
- 再送寄信通知（SMTP 優先，若未設定則改用 Resend）
- 內建基本防濫用（honeypot + 頻率限制）

## 主要環境變數

- `DATABASE_URL`: PostgreSQL 連線字串
- `CONTACT_RECEIVER_EMAIL`: 公司收件信箱
- `CONTACT_SENDER_EMAIL`: 寄件來源信箱
- `RESEND_API_KEY`: Resend API 金鑰（使用 Resend 時）
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS`: SMTP 設定（使用 SMTP 時）

## 部署建議（jlsuvery.tw）

1. 將專案部署到 Vercel。
2. 建立雲端 PostgreSQL（Neon 或 Supabase）並填入 `DATABASE_URL`。
3. 在 Vercel 專案設定中填入上述環境變數。
4. 到網域管理後台將 `www.jlsuvery.tw` 綁定到 Vercel 提供的目標。
5. 驗證：首頁可訪問、聯絡表單可送出、資料有落庫、信件可收。
