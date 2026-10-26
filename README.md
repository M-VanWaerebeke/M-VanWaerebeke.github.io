# Martin Van Waerebeke — academic website

Source for [m-vanwaerebeke.github.io](https://m-vanwaerebeke.github.io/), with research, publications, talks, teaching, and contact information.

The site is static HTML, CSS, and JavaScript, hosted with GitHub Pages. Publication and talk lists are loaded from `data/publications.json` and `data/talks.json`.

## Preview locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. Serve the repository root: page assets and JSON use root-relative paths, so opening the HTML files directly will not load the full site.

## Update content

- Edit `data/publications.json` for papers and verified code links. Use `"#"` for an unavailable code release; it is hidden from the rendered page.
- Edit `data/talks.json` for talks.
- Edit `index.html` for the biography and teaching, and `content/` for the individual pages.
- Shared navigation and footer live in `static/components.js`; styles live in `static/`.

The homepage displays the first three publications in the JSON list. Keep them in the desired order and only add a code URL once its repository is available.
