import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  category: text("category").notNull(), // 'book', 'tool', 'course'
  imageUrl: text("image_url").notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export const challengeEntries = pgTable("challenge_entries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  address: text("address").notNull(),
  consentAccepted: boolean("consent_accepted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChallengeEntrySchema = createInsertSchema(challengeEntries).omit({ id: true, createdAt: true });
export type ChallengeEntry = typeof challengeEntries.$inferSelect;
export type InsertChallengeEntry = z.infer<typeof insertChallengeEntrySchema>;

export const copyTradingChallengeEntries = pgTable("copy_trading_challenge_entries", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name"),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  countryCode: text("country_code").notNull(),
  phone: text("phone").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  telegramId: text("telegram_id").notNull(),
  age: integer("age"),
  gender: text("gender").notNull(),
  country: text("country").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  riskAccepted: boolean("risk_accepted").notNull().default(false),
  feeAccepted: boolean("fee_accepted").notNull().default(false),
  termsAccepted: boolean("terms_accepted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCopyTradingEntrySchema = createInsertSchema(copyTradingChallengeEntries).omit({ id: true, createdAt: true });
export type CopyTradingEntry = typeof copyTradingChallengeEntries.$inferSelect;
export type InsertCopyTradingEntry = z.infer<typeof insertCopyTradingEntrySchema>;
