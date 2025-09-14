// pages/api/notes/[id].js
import pool from "../../../lib/db";
import { verify } from "../../../lib/jwt";
import setCors from "../../../lib/cors";

function getAuth(req, res) {
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  const token = auth.split(" ")[1];
  try {
    return verify(token); // { userId, tenantId, ... }
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
    return null;
  }
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const user = getAuth(req, res);
  if (!user) return;

  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const r = await pool.query(
        `SELECT id, title, body, created_at, updated_at 
         FROM notes 
         WHERE id=$1 AND tenant_id=$2`,
        [id, user.tenantId]
      );
      if (r.rows.length === 0) {
        return res.status(404).json({ error: "Not found" });
      }
      return res.json(r.rows[0]);
    }

    if (req.method === "PUT") {
      const { title, body } = req.body || {};
      if (!title || !body) {
        return res.status(400).json({ error: "Title and body are required" });
      }

      const upd = await pool.query(
        `UPDATE notes 
         SET title=$1, body=$2, updated_at=now() 
         WHERE id=$3 AND tenant_id=$4 
         RETURNING id, title, body, created_at, updated_at`,
        [title, body, id, user.tenantId]
      );
      if (upd.rows.length === 0) {
        return res.status(404).json({ error: "Not found" });
      }
      return res.json(upd.rows[0]);
    }

    if (req.method === "DELETE") {
      const d = await pool.query(
        "DELETE FROM notes WHERE id=$1 AND tenant_id=$2 RETURNING id",
        [id, user.tenantId]
      );
      if (d.rows.length === 0) {
        return res.status(404).json({ error: "Not found" });
      }
      return res.json({ deleted: true });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("[NOTE API ERROR]", err);
    return res.status(500).json({ error: "Server error" });
  }
}
