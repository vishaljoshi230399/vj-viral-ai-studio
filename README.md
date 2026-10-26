# VJ Viral AI Studio

A free-first, mobile-friendly content planning dashboard that can be hosted on GitHub Pages.

## What this starter version does
- Create 5 or 10 short-video concepts from a topic using local templates.
- Generate editable hooks, scripts, captions, and hashtags.
- Keep a local approval queue; approval does **not** publish to a social network.
- Record views, likes, shares, and follower gains manually.
- Export and import a JSON backup.
- Open public trend research sites from the dashboard.

## Important limitations
This is a static frontend. It does not automatically scrape Instagram/Facebook, generate finished video files, call an AI model, or publish posts. Those features need a lawful data source, video-processing runtime, and official authorized platform integrations. Do not claim a post was published just because it was approved in this app.

## Deploy from Android using GitHub's website
1. Sign in at https://github.com in Chrome.
2. Create a **new public repository** named `vj-viral-ai-studio`.
3. On the new repository page, use **Add file → Upload files**.
4. Upload `index.html`, `styles.css`, `app.js`, and `README.md` from this folder. Also upload `.github/workflows/pages.yml` if you want automatic deployment using GitHub Actions.
5. Commit the files to the `main` branch.
6. Open **Settings → Pages**. Under Build and deployment, select **GitHub Actions** if the workflow is uploaded.
7. Open the **Actions** tab. If prompted, enable workflows. Wait for **Deploy static site to GitHub Pages** to finish successfully.
8. Open **Settings → Pages** to find your published site URL. It will usually be `https://YOUR-USERNAME.github.io/vj-viral-ai-studio/`.
9. Open the URL on your Android phone. Add a topic and generate concepts.

If you prefer not to use a workflow, in **Settings → Pages** select **Deploy from a branch**, choose `main` and `/(root)`, and save. The site can take a few minutes to appear.

## Data and security
- Drafts and metrics are saved in browser `localStorage` on the device/browser where you use the app.
- They are not automatically synchronized across devices. Export a JSON backup regularly.
- A browser reset, private/incognito session, or clearing site data may erase your workspace.
- The repository and published site are public. Never put secrets, social passwords, API tokens, private customer information, or `.env` files in this repository.
- For future API integrations, use a trusted backend and official OAuth flows. Keep secrets on the server, never in client-side JavaScript.
- A GitHub Actions secret is not exposed merely by being stored as a secret, but workflows that use secrets must be reviewed carefully.

## Free upgrade path
1. Trend data: start with public trend research and manual topic entry. If later using an API, review its current quota and terms first.
2. Video editing: use an open-source editor or local FFmpeg workflow. Browser-only hosting is not a reliable video-rendering server.
3. Publishing: integrate official YouTube and Meta publishing APIs only after reviewing eligibility, permissions, and developer requirements. Keep a human approval step.
4. Analytics: first enter results manually; later connect official analytics APIs where permitted.

## License
MIT — you may adapt this starter project for your own use.
