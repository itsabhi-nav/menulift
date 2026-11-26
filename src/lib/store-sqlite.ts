import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { fromRow, toParams, type Backend, type Lead, type LeadStatus, type LeadType, type Row } from "./store-types";

const g = globalThis as unknown as { __mlDb?: Database.Database };

function db() {
  if (g.__mlDb) return g.__mlDb;
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const d = new Database(path.join(dir, "menulift.db"));
  d.pragma("journal_mode = WAL");
  d.pragma("synchronous = NORMAL");
  d.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      created_at TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      note TEXT NOT NULL DEFAULT '',
      slot_date TEXT,
      slot_time TEXT,
      channel TEXT,
      go_live TEXT,
      budget TEXT,
      kitchen TEXT,
      score INTEGER,
      missing TEXT,
      source TEXT,
      utm TEXT
    );
    CREATE UNIQUE INDEX IF NOT EXISTS uniq_slot ON leads (slot_date, slot_time)
      WHERE type = 'booking' AND status <> 'cancelled';
    CREATE INDEX IF NOT EXISTS idx_created ON leads (created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_phone ON leads (phone);
    CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS idx_type ON leads (type, created_at DESC);
  `);
  g.__mlDb = d;
  return d;
}

const INSERT = `INSERT INTO leads
  (id,type,created_at,name,phone,status,note,slot_date,slot_time,channel,go_live,budget,kitchen,score,missing,source,utm)
  VALUES (@id,@type,@created_at,@name,@phone,@status,@note,@slot_date,@slot_time,@channel,@go_live,@budget,@kitchen,@score,@missing,@source,@utm)`;


export const sqlite: Backend = {
  async bookedKeysFrom(fromDate) {
    const rows = db()
      .prepare(
        `SELECT slot_date || '|' || slot_time AS k FROM leads
         WHERE type = 'booking' AND status <> 'cancelled' AND slot_date >= ?`,
      )
      .all(fromDate) as { k: string }[];
    return new Set(rows.map((r) => r.k));
  },

  async tryBook(lead: Lead) {
    try {
      db().prepare(INSERT).run(toParams(lead));
      return true;
    } catch (e) {
      if ((e as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE") return false;
      throw e;
    }
  },

  async addLead(lead: Lead) {
    db().prepare(INSERT).run(toParams(lead));
  },

  async listLeads(opts) {
    const where: string[] = [];
    const args: unknown[] = [];
    if (opts.type) {
      where.push("type = ?");
      args.push(opts.type);
    }
    if (opts.status) {
      where.push("status = ?");
      args.push(opts.status);
    }
    if (opts.q) {
      where.push("(name LIKE ? OR phone LIKE ? OR kitchen LIKE ? OR note LIKE ?)");
      const like = `%${opts.q}%`;
      args.push(like, like, like, like);
    }
    const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const total = (db().prepare(`SELECT COUNT(*) c FROM leads ${w}`).get(...args) as { c: number }).c;
    const rows = db()
      .prepare(`SELECT * FROM leads ${w} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .all(...args, opts.limit, opts.offset) as Row[];
    return { rows: rows.map(fromRow), total };
  },

  async upcomingBookings(fromDate) {
    const rows = db()
      .prepare(
        `SELECT * FROM leads WHERE type = 'booking' AND status <> 'cancelled' AND slot_date >= ?
         ORDER BY slot_date, slot_time LIMIT 100`,
      )
      .all(fromDate) as Row[];
    return rows.map(fromRow);
  },

  async updateLead(id: string, patch: { status?: LeadStatus; note?: string }) {
    const cur = db().prepare("SELECT status, note FROM leads WHERE id = ?").get(id) as { status: string; note: string } | undefined;
    if (!cur) return;
    db()
      .prepare("UPDATE leads SET status = ?, note = ? WHERE id = ?")
      .run(patch.status ?? cur.status, patch.note ?? cur.note, id);
  },

  async batch(after, size) {
    const rows = db().prepare("SELECT * FROM leads ORDER BY created_at DESC, id LIMIT ? OFFSET ?").all(size, after) as Row[];
    return rows.map(fromRow);
  },

  async counts() {
    const rows = db().prepare("SELECT type, COUNT(*) c FROM leads GROUP BY type").all() as { type: string; c: number }[];
    return Object.fromEntries(rows.map((r) => [r.type, r.c])) as Partial<Record<LeadType, number>>;
  },

  async getSetting(key) {
    const r = db().prepare("SELECT v FROM settings WHERE k = ?").get(key) as { v: string } | undefined;
    return r?.v ?? null;
  },

  async setSetting(key, value) {
    db().prepare("INSERT INTO settings (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").run(key, value);
  },
};
