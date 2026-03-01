import { db } from "./db";
import {
  trackingLinks,
  captures,
  type InsertTrackingLink,
  type InsertCapture,
  type TrackingLink,
  type Capture
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Links
  getTrackingLinks(ip?: string): Promise<TrackingLink[]>;
  getTrackingLinkByToken(token: string): Promise<TrackingLink | undefined>;
  getTrackingLinkById(id: number): Promise<TrackingLink | undefined>;
  createTrackingLink(link: InsertTrackingLink & { token: string, createdByIp?: string }): Promise<TrackingLink>;
  
  // Captures
  getCaptures(linkId: number): Promise<Capture[]>;
  createCapture(capture: InsertCapture): Promise<Capture>;
}

export class DatabaseStorage implements IStorage {
  async getTrackingLinks(ip?: string): Promise<TrackingLink[]> {
    if (ip) {
      return await db.select().from(trackingLinks).where(eq(trackingLinks.createdByIp, ip));
    }
    return await db.select().from(trackingLinks);
  }

  async getTrackingLinkByToken(token: string): Promise<TrackingLink | undefined> {
    const [link] = await db.select().from(trackingLinks).where(eq(trackingLinks.token, token));
    return link;
  }

  async getTrackingLinkById(id: number): Promise<TrackingLink | undefined> {
    const [link] = await db.select().from(trackingLinks).where(eq(trackingLinks.id, id));
    return link;
  }

  async createTrackingLink(link: InsertTrackingLink & { token: string }): Promise<TrackingLink> {
    const [newLink] = await db.insert(trackingLinks).values(link).returning();
    return newLink;
  }

  async getCaptures(linkId: number): Promise<Capture[]> {
    return await db.select().from(captures).where(eq(captures.linkId, linkId));
  }

  async createCapture(capture: InsertCapture): Promise<Capture> {
    const [newCapture] = await db.insert(captures).values(capture).returning();
    return newCapture;
  }
}

export const storage = new DatabaseStorage();
