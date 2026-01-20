# Kaitlyn Devitt Portfolio

## Editing the site
### Editors
1. Visit `/admin` on the deployed site.
2. Sign in with GitHub.
3. Edit content (text, links, photos) and save.
4. Wait for Cloudflare Pages to finish deploying.

### One-time setup (developer)
This repo includes an OAuth helper for Sveltia CMS as Cloudflare Pages Functions at `/auth` and `/callback`.

1. In GitHub, create an OAuth App:
   - Homepage URL: your site URL (example: `https://kaitlyn-devitt-portfolio.pages.dev`)
   - Authorization callback URL: your site callback (example: `https://kaitlyn-devitt-portfolio.pages.dev/callback`)
2. In Cloudflare Pages → your project → Settings → Environment variables, add:
   - `GITHUB_CLIENT_ID` = OAuth app client ID
   - `GITHUB_CLIENT_SECRET` = OAuth app client secret
   - Optional: `GITHUB_SCOPES` (default is `repo`; for public repos you can use `public_repo`)
3. In `admin/config.yml`, set `repo`, `branch`, `site_url`, and `base_url` to match your GitHub repo + deployed site URL.
4. Add editors as collaborators on the GitHub repo (they need write access to save changes).
