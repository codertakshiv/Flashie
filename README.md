# Flashie

A browser-based firmware flashing platform. Flash firmware to ESP32, ESP8266, STM32, and Arduino boards directly from Chrome or Microsoft Edge — no desktop software required.

Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui. Designed for GitHub Pages static hosting.

## Features

- **Browser-based flashing** using Web Serial API and ESP Web Tools
- **Multi-board support** — ESP32, ESP8266, STM32, Arduino, and custom boards
- **Project management** interface for adding and editing firmware projects
- **Search and filters** — find projects by name, board, or tag
- **Changelog** for each project showing version history
- **Dark theme** — lightweight, responsive, optimized for low-end devices
- **Static export** — deployable to GitHub Pages or any static host

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The development server runs at `http://localhost:3000`.

## Project Structure

```
flashie/
├── public/
│   └── projects/              # Firmware project manifests and binaries
│       ├── esp-mqtt-controller/
│       │   ├── manifest.json
│       │   └── firmware/
│       │       ├── bootloader.bin
│       │       ├── partitions.bin
│       │       └── firmware.bin
│       └── ...
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── manage/page.tsx    # Project management interface
│   │   ├── docs/page.tsx      # Documentation
│   │   ├── troubleshoot/page.tsx
│   │   ├── verify/page.tsx    # Deployment verification checklist
│   │   └── projects/[slug]/   # Dynamic project detail pages
│   ├── components/            # Reusable UI components
│   │   ├── ProjectCard.tsx
│   │   ├── FlashButton.tsx    # ESP Web Tools integration
│   │   ├── ProjectList.tsx    # Search + filter + grid
│   │   └── ...
│   ├── data/
│   │   └── projects.json      # Project registry
│   ├── lib/
│   │   ├── projects.ts        # Data fetching utilities
│   │   └── utils.ts           # cn() helper
│   └── types/
│       └── index.ts           # TypeScript interfaces
├── next.config.ts             # Static export configuration
└── package.json
```

## Adding a New Firmware Project

### 1. Create the folder structure

```
public/projects/your-project/
├── manifest.json
└── firmware/
    ├── bootloader.bin
    ├── partitions.bin
    └── firmware.bin
```

### 2. Create manifest.json

```json
{
  "name": "Your Project",
  "version": "1.0.0",
  "new_install_prompt_erase": true,
  "builds": [
    {
      "chipFamily": "ESP32",
      "parts": [
        { "path": "firmware/bootloader.bin", "offset": "0x1000" },
        { "path": "firmware/partitions.bin", "offset": "0x8000" },
        { "path": "firmware/firmware.bin", "offset": "0x10000" }
      ]
    }
  ]
}
```

Firmware paths are **relative** to the manifest file. Offsets must be strings with double quotes.

### 3. Register in projects.json

Add an entry to `src/data/projects.json`:

```json
{
  "id": "your-project",
  "name": "Your Project",
  "description": "Description of your firmware.",
  "version": "1.0.0",
  "lastUpdated": "2026-06-01",
  "boards": ["ESP32"],
  "tags": ["ESP32", "IoT"],
  "manifestPath": "/projects/your-project/manifest.json",
  "githubUrl": "https://github.com/your/repo",
  "changelog": [
    {
      "version": "1.0.0",
      "date": "2026-06-01",
      "changes": ["Initial release"]
    }
  ]
}
```

### 4. Rebuild

```bash
npm run build
```

## Deployment

Flashie is pre-configured for GitHub Pages static export via `.github/workflows/deploy.yml`. Push to the `main` branch and GitHub Actions will build and deploy automatically.

### Manual deployment

```bash
npm run build
# Output is in the out/ directory
# Deploy out/ to any static host
```

If deploying to a sub-path (e.g. `https://user.github.io/flashie/`), update `basePath` in `next.config.ts`.

### Verification

After deploying, run through the [Verification Checklist](/verify) to confirm everything works.

## Browser Support

| Browser | Status |
|---------|--------|
| Google Chrome 89+ | Fully supported |
| Microsoft Edge 89+ | Fully supported |
| Mozilla Firefox | Not supported (no Web Serial API) |
| Safari | Not supported (no Web Serial API) |
| Mobile browsers | Not supported |

## Technology Stack

- **Framework**: Next.js (static export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Flashing**: ESP Web Tools (Web Serial API)
- **Deployment**: GitHub Pages (via GitHub Actions)

## License

MIT
