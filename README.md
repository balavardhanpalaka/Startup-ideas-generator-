# Startup Idea Generator

A small, static web app that displays a random business idea on demand. Click the "New idea" button (or press Space) to get one. Save favorites to localStorage, view all ideas from ideas.json, add your own idea, copy ideas, and download favorites as JSON.

What's included
- index.html — the UI
- styles.css — styling
- script.js — app logic (fetches ideas.json, handles favorites)
- ideas.json — small collection of starter ideas
- README.md — this file
- package.json — optional helper scripts
- LICENSE — MIT

How to run
- Quick local: open `index.html` directly in your browser.
  - Note: some browsers block fetch() when a file is opened via file:// (ideas.json). If you see "Loading ideas…" persist, run a local server.
- Recommended (static file server):
  - Python 3: `python -m http.server 8000` then open http://localhost:8000
  - Node: `npx http-server` or `npx serve` then open the provided URL
  - Or `npm start` if you installed dependencies from package.json (it uses `serve` via npx).

Features
- Random idea generation
- Save favorites to localStorage
- View and use all ideas
- Add your own idea (input + Enter)
- Download favorites as JSON
- Keyboard: Space => new idea

Customize
- Add or edit ideas in `ideas.json`.
- Style in `styles.css`.
- Extend logic in `script.js` (e.g., sync favorites to a backend).

License
MIT — see LICENSE file.

Enjoy!