import { Pool } from "pg";
import { fromRow, type Backend, type Lead, type LeadType, type Row } from "./store-types";

const g = globalThis as unknown as { __mlPg?: Pool; __mlPgReady?: Promise<void> };

function pool() {
  if (!g.__mlPg) {
    const url = process.env.DATABASE_URL!;
    const local = /localhost|127\.0\.0\.1/.test(url);
    g.__mlPg = new Pool({
      connectionString: url,
      max: 5,
      ssl: local || /sslmode=disable/.test(url) ? undefined : { rejectUnauthorized: false },
    });
  }
  return g.__mlPg;
}

async function ready() {
  g.__mlPgReady ??= pool()
    .query(
      `CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY, type TEXT NOT NULL, created_at TEXT NOT NULL,
        name TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new',
        note TEXT NOT NULL DEFAULT '', slot_date TEXT, slot_time TEXT, channel TEXT, go_live TEXT,
        budget TEXT, kitchen TEXT, score INTEGER, missing TEXT, source TEXT, utm TEXT
      );
      CREATE UNIQUE INDEX IF NOT EXISTS uniq_slot ON leads (slot_date, slot_time)
        WHERE type = 'booking' AND status <> 'cancelled';
      CREATE INDEX IF NOT EXISTS idx_created ON leads (created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_phone ON leads (phone);
      CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT NOT NULL);
      CREATE INDEX IF NOT EXISTS idx_type ON leads (type, created_at DESC);`,
    )
    .then(() => undefined)
    .catch((e) => {
      g.__mlPgReady = undefined;
      throw e;
    });
  await g.__mlPgReady;
}

async function q<T = Row>(text: string, params: unknown[] = []) {
  await ready();
  return (await pool().query(text, params)).rows as T[];
}

const COLS = "id,type,created_at,name,phone,status,note,slot_date,slot_time,channel,go_live,budget,kitchen,score,missing,source,utm";

function values(l: Lead) {
  return [
    l.id, l.type, l.createdAt, l.name, l.phone, l.status, l.note,
    l.slot?.date ?? null, l.slot?.time ?? null, l.channel ?? null, l.goLive ?? null, l.budget ?? null,
    l.kitchen ?? null, l.score ?? null, l.missing ? JSON.stringify(l.missing) : null, l.source ?? null,
    l.utm ? JSON.stringify(l.utm) : null,
  ];
}
const INSERT = `INSERT INTO leads (${COLS}) VALUES (${Array.from({ length: 17 }, (_, i) => `$${i + 1}`).join(",")})`;

export const postgres: Backend = {
  async bookedKeysFrom(fromDate) {
    const rows = await q<{ k: string }>(
      `SELECT slot_date || '|' || slot_time AS k FROM leads
       WHERE type = 'booking' AND status <> 'cancelled' AND slot_date >= $1`,
      [fromDate],
    );
    return new Set(rows.map((r) => r.k));
  },

  async tryBook(lead) {
    try {
      await q(INSERT, values(lead));
      return true;
    } catch (e) {
      if ((e as { code?: string }).code === "23505") return false; // unique violation: slot taken
      throw e;
    }
  },

  async addLead(lead) {
    await q(INSERT, values(lead));
  },

  async listLeads(opts) {
    const where: string[] = [];
    const args: unknown[] = [];
    if (opts.type) {
      args.push(opts.type);
      where.push(`type = $${args.length}`);
    }
    if (opts.status) {
      args.push(opts.status);
      where.push(`status = $${args.length}`);
    }
    if (opts.q) {
      args.push(`%${opts.q}%`);
      const n = args.length;
      where.push(`(name ILIKE $${n} OR phone ILIKE $${n} OR kitchen ILIKE $${n} OR note ILIKE $${n})`);
    }
    const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const total = Number((await q<{ c: string }>(`SELECT COUNT(*) c FROM leads ${w}`, args))[0].c);
    const rows = await q(
      `SELECT * FROM leads ${w} ORDER BY created_at DESC LIMIT $${args.length + 1} OFFSET $${args.length + 2}`,
      [...args, opts.limit, opts.offset],
    );
    return { rows: rows.map(fromRow), total };
  },

  async upcomingBookings(fromDate) {
    const rows = await q(
      `SELECT * FROM leads WHERE type = 'booking' AND status <> 'cancelled' AND slot_date >= $1
       ORDER BY slot_date, slot_time LIMIT 100`,
      [fromDate],
    );
    return rows.map(fromRow);
  },

  async updateLead(id, patch) {
    const cur = (await q<{ status: string; note: string }>("SELECT status, note FROM leads WHERE id = $1", [id]))[0];
    if (!cur) return;
    await q("UPDATE leads SET status = $1, note = $2 WHERE id = $3", [patch.status ?? cur.status, patch.note ?? cur.note, id]);
  },

  async batch(after, size) {
    const rows = await q("SELECT * FROM leads ORDER BY created_at DESC, id LIMIT $1 OFFSET $2", [size, after]);
    return rows.map(fromRow);
  },

  async counts() {
    const rows = await q<{ type: string; c: string }>("SELECT type, COUNT(*) c FROM leads GROUP BY type");
    return Object.fromEntries(rows.map((r) => [r.type, Number(r.c)])) as Partial<Record<LeadType, number>>;
  },

  async getSetting(key) {
    const r = await q<{ v: string }>("SELECT v FROM settings WHERE k = $1", [key]);
    return r[0]?.v ?? null;
  },

  async setSetting(key, value) {
    await q("INSERT INTO settings (k, v) VALUES ($1, $2) ON CONFLICT (k) DO UPDATE SET v = EXCLUDED.v", [key, value]);
  },
};
