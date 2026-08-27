import fs from 'node:fs/promises';

const token = process.env.GITHUB_TOKEN;
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
};

const queries = [
  'topic:linux-distribution archived:false',
  'topic:linux-distro archived:false',
  '"linux distribution" archived:false',
  '"linux distro" archived:false'
];

const existing = new Set();
for (const file of ['data/distros.json', 'data/extra-distros.json', 'data/linux-expansion.json', 'data/linux-expansion-2.json', 'data/auto-linux.json']) {
  try {
    const raw = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(raw);
    for (const item of Array.isArray(parsed) ? parsed : []) if (item?.name) existing.add(String(item.name).toLowerCase());
  } catch {}
}

const seen = new Map();
for (const q of queries) {
  const url = new URL('https://api.github.com/search/repositories');
  url.searchParams.set('q', q);
  url.searchParams.set('sort', 'updated');
  url.searchParams.set('order', 'desc');
  url.searchParams.set('per_page', '30');
  const r = await fetch(url, { headers });
  if (!r.ok) continue;
  const data = await r.json();
  for (const repo of data.items ?? []) {
    const name = String(repo.name || '').trim();
    const fullName = String(repo.full_name || '');
    const description = String(repo.description || '').trim();
    const hay = `${name} ${description} ${(repo.topics || []).join(' ')}`.toLowerCase();
    const looksLinux = /linux|gnu\/linux|distro|distribution/.test(hay);
    if (!looksLinux || !name || !fullName || repo.archived) continue;
    if (existing.has(name.toLowerCase())) continue;
    const updatedDays = Math.max(0, (Date.now() - new Date(repo.pushed_at || repo.updated_at || Date.now()).getTime()) / 86400000);
    const score = (repo.stargazers_count >= 10 ? 2 : 0) + (repo.has_releases ? 2 : 0) + (repo.homepage ? 2 : 0) + (updatedDays <= 365 ? 2 : 0) + (repo.license ? 1 : 0);
    const item = {
      id: `auto-${repo.id}`,
      name,
      description: description || 'Linux distribution discovered from public project metadata.',
      type: 'Linux',
      category: ['Linux', 'Discovery Candidate'],
      useCases: ['Linux'],
      base: 'Unknown',
      desktop: 'Unknown',
      packageManager: 'Unknown',
      architecture: ['x86_64'],
      difficulty: 'Intermediate',
      license: repo.license?.spdx_id || 'Unknown',
      openSource: Boolean(repo.license?.spdx_id),
      website: repo.homepage || repo.html_url,
      download: repo.html_url,
      docs: repo.html_url,
      sourceRepository: repo.html_url,
      discoveredAt: new Date().toISOString(),
      lastActivity: repo.pushed_at || repo.updated_at,
      discoveryScore: score,
      discoveryNote: 'Automatically discovered. Metadata is not a substitute for manual verification.'
    };
    const old = seen.get(name.toLowerCase());
    if (!old || item.discoveryScore > old.discoveryScore) seen.set(name.toLowerCase(), item);
  }
}

const all = [...seen.values()].sort((a, b) => b.discoveryScore - a.discoveryScore || a.name.localeCompare(b.name));
const approved = all.filter(x => x.discoveryScore >= 5).slice(0, 20);
const candidates = all.filter(x => !approved.includes(x)).slice(0, 50);

await fs.mkdir('data', { recursive: true });
await fs.writeFile('data/auto-linux.json', JSON.stringify(approved, null, 2) + '\n');
await fs.writeFile('data/discovery-candidates.json', JSON.stringify(candidates, null, 2) + '\n');
console.log(`Discovered ${all.length}; auto-added ${approved.length}; candidates ${candidates.length}.`);
