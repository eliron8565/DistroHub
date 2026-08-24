# DistroHub

**Discover your next operating system.**

DistroHub is an open and alternative operating-system discovery platform. Linux is the largest catalog, but the project also covers Gaming OS, BSD, Mobile, Retro, Media/HTPC and experimental operating systems — with no Windows catalog.

## Current architecture

- Vanilla HTML/CSS/JavaScript — no heavy frontend framework or build step.
- Unified OS discovery catalog with search, filters, favorites, history, comparison and recommendations.
- Dedicated cyberpunk-inspired Gaming OS experience.
- Official website/download/documentation links wherever catalog data provides them.
- Real logo assets are preferred over emoji placeholders; generic icons are used only as fallbacks.
- Responsive desktop, tablet and mobile layouts.

## Supabase Auth

The frontend is prepared for Supabase Auth using the project URL configured in `js/supabase.js`.

Add the **Supabase Publishable Key** to `js/config.js`:

```js
window.DISTROHUB_SUPABASE_PUBLISHABLE_KEY = 'YOUR_PUBLISHABLE_KEY';
```

Never place a `service_role` key, secret key, database password, or other server credential in the frontend. Supabase RLS must remain the authority for per-user data access.

The client integration supports email/password sign-up, sign-in, sign-out, favorites and history synchronization through the existing `profiles`, `user_favorites`, and `user_history` tables when their column names match the fields used by `js/supabase.js`.

## Data

- `data/distros.json` — existing Linux catalog.
- `data/extra-distros.json` — additional Linux catalog.
- `data/gaming-os.json` — dedicated gaming systems and gaming capabilities.
- `data/operating-systems.json` — BSD, Mobile, Alternative OS and Media/HTPC catalog.

## Security notes

- User data operations include `user_id` from the authenticated Supabase session; RLS must enforce that `auth.uid()` matches the row owner.
- No SQL is constructed in the browser.
- External links use `noopener noreferrer` for new tabs.
- User-provided text rendered into the UI is escaped before insertion.
- The project is intentionally static-host friendly. HTTP response security headers such as HSTS and a server-level CSP should be configured by the hosting platform when available.

## Project goal

DistroHub aims to become a high-quality operating-system discovery platform for people who want open, free, technical, privacy-friendly, gaming-friendly and alternative computing environments.
