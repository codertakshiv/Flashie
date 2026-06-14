# Contributing to Flashie

Thank you for considering contributing to Flashie!

## How to Contribute

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature-name`.
3. Make your changes.
4. Run the build: `npm run build`.
5. Ensure zero TypeScript errors and the export completes successfully.
6. Submit a pull request.

## Adding a New Project

1. Create a manifest JSON file in `public/projects/<project-id>/manifest.json`.
2. Add your firmware binaries in the same directory.
3. Add a project entry to `src/data/projects.json`.
4. Verify the project appears at `/projects/<project-id>`.

## Code Style

- TypeScript strict mode is enabled.
- Components are in `src/components/`, pages in `src/app/`.
- Reuse existing components and utilities.
- No comments in code unless absolutely necessary.
- Follow existing patterns for accessibility (aria labels, focus rings, semantic HTML).

## Development

```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm run lint    # Run linter
```
