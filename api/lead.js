const BOT_TOKEN      = process.env.BOT_TOKEN;
const MANAGERS_CHAT  = process.env.MANAGERS_CHAT_ID;
const TG_API         = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const { name, phone, tariff } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ ok: false, error: 'name and phone required' });
    }

    const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', hour12: false });

    const text =
      `📩 <b>НОВАЯ ЗАЯВКА С САЙТА</b>\n\n` +
      `👤 Имя: <b>${name}</b>\n` +
      `📱 Телефон: <b>${phone}</b>\n` +
      `📦 Тариф: <b>${tariff || '—'}</b>\n` +
      `🕐 Время: ${now} (МСК)`;

    const tgRes = await fetch(TG_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: MANAGERS_CHAT, text, parse_mode: 'HTML' }),
    });

    const tgData = await tgRes.json();

    if (tgData.ok) {
      return res.status(200).json({ ok: true });
    } else {
      console.error('Telegram error:', tgData);
      return res.status(502).json({ ok: false, error: tgData.description });
    }
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ ok: false, error: 'Internal error' });
  }
}
