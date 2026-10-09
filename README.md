# recipes

Personal recipe website built with Vue 3, Vite and TypeScript, hosted on GitHub Pages.

## Adding a recipe

Add a markdown file to `content/recipes/` (see the `recipe-format` skill in `.github/skills/`) and push to `main`. Sections made of `- [ ]` items become checkable tabs (Ingredients, Instructions); other sections such as Notes show below the tabs. Checked items are saved per browser in `localStorage`.

## Development

```
npm install
npm run dev      # local dev server
npm test         # parser unit tests
npm run build    # type-check + production build into dist/
```

## Deployment

In the GitHub repo settings, set **Pages > Source** to **GitHub Actions**. Pushes to `main` deploy automatically. The base path is `/recipes/` (the repo name); change it in `vite.config.ts` or set `VITE_BASE` if the repo name differs.

## Layout

- `content/recipes/` recipe markdown
- `src/content/` markdown parsing and loading (the only code that knows the file format)
- `src/composables/` search, recipe lookup, checklist persistence
- `src/components/`, `src/views/` UI
- `src/styles/tokens.css` theme variables
