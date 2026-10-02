# raunakp.com

Personal site of Raunak Pandey. Plain HTML/CSS/JS with no build step, served by GitHub Pages at https://raunakp.com.

- **Edit content:** `content/content.json` (every section on the home page renders from it).
- **New blog post:** add `blog/posts/<slug>.md` with frontmatter (`title`, `description`, `date`, `theme`), then list the file in `writing.onSiteArticles`.
- **Run locally:** `python3 -m http.server 8000`, then open http://localhost:8000. A server is needed because the pages `fetch()` the JSON.
- **Deploy:** push to `main`.
