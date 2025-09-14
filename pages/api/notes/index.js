// pages/api/notes/index.js
import { createClient } from "@supabase/supabase-js";
import setCors from "../../../lib/cors";

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });

  const supabaseAccessToken = auth.split(" ")[1]; // ✅ real Supabase token

  // Supabase client with user session
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`, // ✅ let RLS work
        },
      },
    }
  );

  try {
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, body, created_at, updated_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return res.json(data);
    }

    if (req.method === "POST") {
      const { title, body } = req.body || {};
      if (!title || !body) {
        return res.status(400).json({ error: "Title and body are required" });
      }

      const { data, error } = await supabase
        .from("notes")
        .insert([{ title, body }])
        .select("id, title, body, created_at, updated_at")
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("[NOTES API ERROR]", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
