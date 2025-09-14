// pages/api/tenants/[slug]/upgrade.js
const pool = require('../../../../lib/db');
const { verify } = require('../../../../lib/jwt');
const setCors = require('../../../../lib/cors');

function getAuth(req, res) {
  const auth = req.headers.authorization;
  if (!auth) { res.status(401).json({ error: 'Unauthorized' }); return null; }
  const token = auth.split(' ')[1];
  try { return verify(token); } catch (e) { res.status(401).json({ error: 'Invalid token' }); return null; }
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  const user = getAuth(req, res); if (!user) return;

  const { slug } = req.query;
  try {
    const t = await pool.query('SELECT id FROM tenants WHERE slug=$1', [slug]);
    if (t.rows.length === 0) return res.status(404).json({ error: 'Tenant not found' });
    const tenantId = t.rows[0].id;
    if (user.tenantId !== tenantId) return res.status(403).json({ error: 'Forbidden' });
    if (user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });

    await pool.query('UPDATE tenants SET plan=$1 WHERE id=$2', ['pro', tenantId]);
    return res.json({ upgraded: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
