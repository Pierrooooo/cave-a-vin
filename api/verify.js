// Fonction serverless Vercel (Node.js runtime, détectée automatiquement dans /api).
// Le mot de passe attendu vient de la variable d'environnement PASSWORD,
// définie dans Vercel (Project Settings → Environment Variables) — jamais commitée dans le repo.

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method not allowed' });
    return;
  }

  const expected = process.env.PASSWORD;
  const submitted = (req.body && req.body.password) || '';

  if (!expected) {
    // Variable d'environnement non configurée côté Vercel.
    res.status(500).json({ ok: false, error: 'PASSWORD not configured' });
    return;
  }

  const ok = submitted === expected;
  res.status(200).json({ ok });
}
