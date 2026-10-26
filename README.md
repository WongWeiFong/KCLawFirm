# Tan & Rahman – Law Firm Website (React)

Frontend only. Static data, no backend.

## Run
```bash
npm install
npm run dev      # development
npm run build    # production build in /dist
```

## Structure
- `src/data/content.js` – all firm content (practice areas, lawyers, articles, FAQ, contact details)
- `src/pages/` – one component per page
- `src/components/` – Layout (header, footer), Cta, Initials
- `src/index.css` – white and gold theme (colours are CSS variables at the top)

## Deployment note
Uses React Router `BrowserRouter`. On a static host, configure a fallback to `index.html` for unknown paths.
