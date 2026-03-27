import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "請輸入姓名"),
  phone: z.string().trim().min(8, "請輸入聯絡電話"),
  email: z.string().trim().email("Email 格式不正確"),
  subject: z.string().trim().min(2, "請輸入主旨"),
  message: z.string().trim().min(10, "請輸入完整需求內容"),
  hp: z.string().optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
