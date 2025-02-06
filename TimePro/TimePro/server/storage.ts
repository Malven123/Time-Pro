import { projects, timeEntries, tags, timeEntryTags, users, type Project, type TimeEntry, type Tag, type User } from "@shared/schema";
import type { InsertProject, InsertTimeEntry, InsertTag, InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Projects
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;

  // Time Entries
  getTimeEntries(): Promise<TimeEntry[]>;
  getTimeEntry(id: number): Promise<TimeEntry | undefined>;
  createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry>;
  updateTimeEntry(id: number, entry: Partial<TimeEntry>): Promise<TimeEntry>;
  deleteTimeEntry(id: number): Promise<void>;

  // Tags
  getTags(): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;

  // Session Store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Project Methods
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  // Time Entry Methods
  async getTimeEntries(): Promise<TimeEntry[]> {
    return await db.select().from(timeEntries);
  }

  async getTimeEntry(id: number): Promise<TimeEntry | undefined> {
    const [entry] = await db.select().from(timeEntries).where(eq(timeEntries.id, id));
    return entry;
  }

  async createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry> {
    const [newEntry] = await db.insert(timeEntries).values({
      ...entry,
      description: entry.description || null,
      projectId: entry.projectId || null,
      endTime: entry.endTime || null,
      duration: entry.duration || null,
      isRunning: entry.isRunning || false
    }).returning();
    return newEntry;
  }

  async updateTimeEntry(id: number, entry: Partial<TimeEntry>): Promise<TimeEntry> {
    const [updatedEntry] = await db
      .update(timeEntries)
      .set(entry)
      .where(eq(timeEntries.id, id))
      .returning();

    if (!updatedEntry) {
      throw new Error("Entry not found");
    }

    return updatedEntry;
  }

  async deleteTimeEntry(id: number): Promise<void> {
    await db.delete(timeEntries).where(eq(timeEntries.id, id));
  }

  // Tag Methods
  async getTags(): Promise<Tag[]> {
    return await db.select().from(tags);
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const [newTag] = await db.insert(tags).values(tag).returning();
    return newTag;
  }
}

export const storage = new DatabaseStorage();