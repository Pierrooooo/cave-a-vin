// Fonction serverless Vercel (Node.js runtime, détectée automatiquement dans /api).
// Le mot de passe attendu vient de la variable d'environnement PASSWORD,
// définie dans Vercel (Project Settings → Environment Variables) — jamais commitée dans le repo.
// CommonJS volontairement (pas d'ES modules) : évite tout souci de configuration de runtime.

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method not allowed' });
    return;
  }

  let body = req.body;
  // Filet de sécurité : si le body arrive en texte brut plutôt que déjà parsé.
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const submitted = (body && body.password) || '';
  const expected = process.env.PASSWORD;

  if (!expected) {
    res.status(500).json({ ok: false, error: 'PASSWORD not configured' });
    return;
  }

  res.status(200).json({ ok: submitted === expected });
};
