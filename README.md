# MeetMind Web MVP

Static multilingual landing page for MeetMind AI.

## Stack

- HTML5
- CSS3
- Vanilla JavaScript ES modules
- JSON-based localization
- GitHub Pages compatible

## Structure

- `index.html` — page markup
- `css/styles.css` — all styles for MVP
- `js/` — i18n, visitor ID, UTM capture, analytics stubs
- `locales/` — EN/RU/ES/PT content
- `assets/` — generated product visuals
- `config/` — app and analytics configuration
- `content/` — versioned content metadata

## Local preview

Run a local server from the project root:

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080
```

Do not open `index.html` directly from the filesystem because browser security may block loading JSON files.

## Deployment

This project is ready for GitHub Pages.

## Analytics

`trackEvent()` is already implemented as a stub. Later it can send events to GA4, Microsoft Clarity, n8n/Postgres, or another endpoint without changing page markup.
