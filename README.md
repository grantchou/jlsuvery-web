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
- `ADMIN_PASSWORD`: 後台登入密碼
- `ADMIN_SESSION_SECRET`: 後台登入簽章密鑰（建議 32 字元以上）

## 後台使用方式

- 後台登入頁：`/admin/login`
- 後台管理頁：`/admin`
- 可編輯內容：首頁主標題、首頁描述、首頁三個重點、下載頁清單

## 部署到 Vercel（含 Neon／Supabase 與網域）

以下順序可避免「網站已上線但資料庫沒表」或「表單寫不進 DB」。

### 1. 建立雲端 PostgreSQL，取得 `DATABASE_URL`

**Neon（建議與 Vercel 整合簡單）**

1. 至 [Neon](https://neon.tech) 註冊／登入 → **Create project**。
2. 選區域（可選離台灣較近的 `aws-ap-southeast-1` 等）。
3. 建立完成後在 **Dashboard → Connection details** 複製 **Connection string**（格式為 `postgresql://...@...neon.tech/neondb?sslmode=require`）。
4. 將此字串當作 `DATABASE_URL`（勿公開到 Git）。

**Supabase**

1. 至 [Supabase](https://supabase.com) → **New project**。
2. **Project Settings → Database → Connection string**，選 **URI**，複製連線字串（密碼為建立專案時設定的 database password）。
3. 若使用 **Transaction pooler**（埠 `6543`），請以官方文件為準；一般 **Direct connection**（埠 `5432`）搭配 Prisma 即可先跑通。

### 2. 對正式庫執行 migration（只需做一次或 schema 變更時）

在本機（或 CI）暫時指向**雲端**資料庫，套用現有 migration：

```bash
# Windows PowerShell 範例：僅本次指令使用雲端連線，勿把密碼寫進檔案
$env:DATABASE_URL="postgresql://..."   # 貼上 Neon／Supabase 連線字串
npm run prisma:generate
npx prisma migrate deploy
```

確認無錯誤後，Neon／Supabase 內應已有 `ContactMessage`、`SiteSetting` 等資料表。

### 3. 將專案接到 Vercel 並部署

1. 至 [Vercel](https://vercel.com) 登入 → **Add New… → Project**。
2. **Import** 你的 GitHub 專案（例如 `grantchou/jlsuvery-web`），Framework Preset 選 **Next.js**。
3. **Root Directory** 若為 monorepo 才需改；單一專案維持預設即可。
4. **Environment Variables** 先新增下一節列表中的變數（可先填好再按 Deploy，或部署後在 **Settings → Environment Variables** 補齊再 **Redeploy**）。
5. 點 **Deploy**。建置成功後會得到 `*.vercel.app` 預覽網址。

### 4. 在 Vercel 填入環境變數

在 **Project → Settings → Environment Variables**，建議 **Production**（與若需要的 Preview）皆設定：

| 變數 | 必填 | 說明 |
|------|------|------|
| `DATABASE_URL` | 是 | 步驟 1 的 PostgreSQL 連線字串 |
| `CONTACT_RECEIVER_EMAIL` | 是 | 公司收聯絡表單的信箱 |
| `CONTACT_SENDER_EMAIL` | 建議 | 寄件顯示／來源；未設時程式會對 Resend／SMTP 有 fallback |
| `ADMIN_PASSWORD` | 是（若要後台） | 後台登入密碼 |
| `ADMIN_SESSION_SECRET` | 是（若要後台） | 隨機長字串，建議 32 字元以上 |
| `RESEND_API_KEY` | 擇一 | 使用 [Resend](https://resend.com) 寄信時必填 |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | 擇一 | 使用自有 SMTP 時填寫；與 Resend 擇一即可 |

儲存後務必對最新 deployment **Redeploy**，變數才會生效。

### 5. 網域：將 `www.jlsuvery.tw` 指向 Vercel

1. Vercel：**Project → Settings → Domains** → 新增 `www.jlsuvery.tw`（若也要裸網域 `jlsuvery.tw`，一併新增並依提示設定）。
2. Vercel 會顯示需設定的 **DNS**（常見為 **CNAME** `www` → `cname.vercel-dns.com`，實際以畫面為準）。
3. 到網域註冊商（例如 GoDaddy、Gandi、Cloudflare DNS）新增對應紀錄，等待生效（數分鐘至 48 小時不等）。
4. 若 DNS 託管在 Cloudflare，代理（橘雲）可開；若有 SSL 模式，建議 **Full (strict)** 並確認 Vercel 端憑證已核發完成。

### 6. 驗證清單

| 項目 | 作法 |
|------|------|
| 首頁可存取 | 瀏覽器開 `https://www.jlsuvery.tw`（或 Vercel 預覽網址） |
| 聯絡表單可送出 | **聯絡**頁填寫送出，應顯示成功訊息（若寄信失敗會回 502 與提示，見 `app/api/contact/route.ts`） |
| 資料有落庫 | Neon **Tables**／Supabase **Table Editor** 查看 `ContactMessage` 是否新增一筆；或使用 `npx prisma studio` 連同一 `DATABASE_URL` 查看 |
| 信件可收 | 確認 `CONTACT_RECEIVER_EMAIL` 收到通知信；檢查 Resend／SMTP 後台與垃圾郵件匣 |
| 後台（選用） | 造訪 `/admin/login`，以 `ADMIN_PASSWORD` 登入後編輯內容 |

### 常見問題

- **表單 500／Prisma 連線錯誤**：檢查 Vercel 的 `DATABASE_URL` 是否正確、防火牆是否允許 Vercel 連線（Neon／Supabase 預設通常允許）；SSL 參數勿刪。
- **表單寫入成功但沒信**：檢查 `RESEND_API_KEY` 或 SMTP；Resend 需在控制台驗證寄件網域或使用允許的測試寄件設定。
- **後台登入後馬上被踢出**：正式站應使用 **HTTPS**；若曾用 HTTP 測試，請確認已部署含 Session Cookie 修正之版本。
