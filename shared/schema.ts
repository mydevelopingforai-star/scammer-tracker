import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const trackingLinks = pgTable("tracking_links", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(), 
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const captures = pgTable("captures", {
  id: serial("id").primaryKey(),
  linkId: integer("link_id").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  accuracy: text("accuracy"),
  imageData: text("image_data"), // base64 string
  capturedAt: timestamp("captured_at").defaultNow().notNull(),
});

export const insertTrackingLinkSchema = createInsertSchema(trackingLinks).omit({ id: true, createdAt: true, token: true });
export const insertCaptureSchema = createInsertSchema(captures).omit({ id: true, capturedAt: true });

export type TrackingLink = typeof trackingLinks.$inferSelect;
export type InsertTrackingLink = z.infer<typeof insertTrackingLinkSchema>;

export type Capture = typeof captures.$inferSelect;
export type InsertCapture = z.infer<typeof insertCaptureSchema>;
