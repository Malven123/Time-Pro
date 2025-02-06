import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertTimeEntrySchema, insertTagSchema } from "@shared/schema";
import { setupAuth } from "./auth";

export function registerRoutes(app: Express): Server {
  // Set up authentication routes and middleware
  setupAuth(app);

  // Middleware to ensure user is authenticated for protected routes
  const ensureAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) return next();
    res.sendStatus(401);
  };

  app.get("/api/projects", ensureAuth, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.post("/api/projects", ensureAuth, async (req, res) => {
    const parsed = insertProjectSchema.parse({
      ...req.body,
      userId: req.user.id,
    });
    const project = await storage.createProject(parsed);
    res.json(project);
  });

  app.get("/api/time-entries", ensureAuth, async (req, res) => {
    const entries = await storage.getTimeEntries();
    res.json(entries);
  });

  app.post("/api/time-entries", ensureAuth, async (req, res) => {
    const parsed = insertTimeEntrySchema.parse({
      ...req.body,
      userId: req.user.id,
    });
    const entry = await storage.createTimeEntry(parsed);
    res.json(entry);
  });

  app.patch("/api/time-entries/:id", ensureAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const entry = await storage.updateTimeEntry(id, req.body);
    res.json(entry);
  });

  app.delete("/api/time-entries/:id", ensureAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteTimeEntry(id);
    res.status(204).end();
  });

  app.get("/api/tags", ensureAuth, async (req, res) => {
    const tags = await storage.getTags();
    res.json(tags);
  });

  app.post("/api/tags", ensureAuth, async (req, res) => {
    const parsed = insertTagSchema.parse({
      ...req.body,
      userId: req.user.id,
    });
    const tag = await storage.createTag(parsed);
    res.json(tag);
  });

  const httpServer = createServer(app);
  return httpServer;
}