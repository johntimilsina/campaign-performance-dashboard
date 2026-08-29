// Mock outcome-query API. Plain Node, no dependencies.
// Run: node server.js
const http = require('http');

const PORT = 8787;
const CHANNELS = ['search', 'social', 'display', 'video', 'native'];
const CAMPAIGNS = ['brand', 'prospecting', 'retargeting', 'seasonal', 'always-on'];
const AUDIENCES = ['new', 'returning', 'lookalike', 'high-value'];
const DAYS = 180;
const START = Date.UTC(2026, 1, 1);
const DAY_MS = 86400000;

function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ROWS = [];
(function seed() {
  for (let d = 0; d < DAYS; d++) {
    const date = new Date(START + d * DAY_MS).toISOString().slice(0, 10);
    for (const channel of CHANNELS) {
      for (const campaign of CAMPAIGNS) {
        for (const audience of AUDIENCES) {
          const r = rng(hash(date + channel + campaign + audience));
          const impressions = Math.floor(2000 + r() * 40000);
          const ctr = 0.005 + r() * 0.03;
          const clicks = Math.floor(impressions * ctr);
          const cvr = 0.01 + r() * 0.08;
          const conversions = Math.floor(clicks * cvr);
          const cpc = 0.4 + r() * 3.5;
          const spend = +(clicks * cpc).toFixed(2);
          const revenue = +(conversions * (25 + r() * 120)).toFixed(2);
          ROWS.push({ date, channel, campaign, audience, impressions, clicks, conversions, spend, revenue });
        }
      }
    }
  }
})();

function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

function query({ from, to, channel, campaign, audience }) {
  const rows = ROWS.filter(r =>
    (!from || r.date >= from) &&
    (!to || r.date <= to) &&
    (!channel || r.channel === channel) &&
    (!campaign || r.campaign === campaign) &&
    (!audience || r.audience === audience));

  const kpis = rows.reduce((a, r) => {
    a.spend += r.spend; a.impressions += r.impressions;
    a.clicks += r.clicks; a.conversions += r.conversions; a.revenue += r.revenue; return a;
  }, { spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 });
  kpis.spend = +kpis.spend.toFixed(2);
  kpis.revenue = +kpis.revenue.toFixed(2);
  kpis.roas = kpis.spend ? +(kpis.revenue / kpis.spend).toFixed(3) : 0;

  const byDay = {};
  for (const r of rows) {
    const t = (byDay[r.date] ||= { date: r.date, spend: 0, conversions: 0, revenue: 0 });
    t.spend += r.spend; t.conversions += r.conversions; t.revenue += r.revenue;
  }
  const timeseries = Object.values(byDay).sort((a, b) => a.date < b.date ? -1 : 1)
    .map(t => ({ ...t, spend: +t.spend.toFixed(2), revenue: +t.revenue.toFixed(2) }));

  const byChannel = {};
  for (const r of rows) {
    const t = (byChannel[r.channel] ||= { channel: r.channel, spend: 0, conversions: 0, revenue: 0 });
    t.spend += r.spend; t.conversions += r.conversions; t.revenue += r.revenue;
  }
  const breakdown = Object.values(byChannel).sort((a, b) => b.spend - a.spend)
    .map(t => ({ ...t, spend: +t.spend.toFixed(2), revenue: +t.revenue.toFixed(2),
      roas: t.spend ? +(t.revenue / t.spend).toFixed(3) : 0 }));

  return { kpis, timeseries, breakdown, rowCount: rows.length };
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/meta') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      channels: CHANNELS, campaigns: CAMPAIGNS, audiences: AUDIENCES,
      dateRange: { from: ROWS[0].date, to: ROWS[ROWS.length - 1].date }
    }));
  }

  if (url.pathname === '/outcomes') {
    const latency = 300 + Math.floor(Math.random() * 1200);
    setTimeout(() => {
      if (Math.random() < 0.10) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'upstream query failed' }));
      }
      const p = url.searchParams;
      const result = query({
        from: p.get('from'), to: p.get('to'),
        channel: p.get('channel'), campaign: p.get('campaign'), audience: p.get('audience')
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }, latency);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(PORT, () => {
  console.log(`Mock outcome API on http://localhost:${PORT}`);
  console.log(`  GET /meta`);
  console.log(`  GET /outcomes?from=YYYY-MM-DD&to=YYYY-MM-DD&channel=&campaign=&audience=`);
});
