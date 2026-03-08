import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  lastMessage: text("last_message").notNull(),
  lastMessageTime: text("last_message_time").notNull(),
  isOnline: boolean("is_online").default(false).notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull(),
  sender: text("sender").notNull(), // 'me' or 'contact'
  text: text("text").notNull(),
  time: text("time").notNull(),
  dateGroup: text("date_group").notNull(),
});

export const citations = pgTable("citations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  context: text("context").notNull(),
  source: text("source").notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({ id: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true });
export const insertCitationSchema = createInsertSchema(citations).omit({ id: true });

export type Contact = typeof contacts.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Citation = typeof citations.$inferSelect;
