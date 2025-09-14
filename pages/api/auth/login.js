import { supabase } from "../../../lib/supabase";
import { sign } from "../../../lib/jwt";
import setCors from "../../../lib/cors";

export default async function handler(req, res) {
  // Enable CORS
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Sign in with Supabase
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      return res.status(401).json({ error: authError.message });
    }

    const { user, session } = authData;
    if (!user || !session) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("tenant_id, role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    if (!profile) {
      return res.status(403).json({ error: "Profile not found" });
    }

    // Create custom JWT
    const customToken = sign({
      userId: user.id,
      tenantId: profile.tenant_id,
      role: profile.role,
    });

    // Send response
    return res.status(200).json({
      token: customToken,
      supabaseAccessToken: session.access_token,
      user: {
        id: user.id,
        email: user.email,
        role: profile.role,
        tenantId: profile.tenant_id,
      },
    });
  } catch (err) {
    console.error("[LOGIN API ERROR]", err);
    return res
      .status(500)
      .json({ error: err.message || "Unexpected server error" });
  }
}
