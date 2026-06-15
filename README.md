# web-flasher

A browser-based ESP firmware flasher using the Web Serial API. Upload firmware binaries, manage flash projects, and flash ESP32-family and ESP8266 chips — all from Chrome or Edge on desktop.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is written to `dist/`.

## Deploy to Cloudflare Pages

1. Connect your repository to Cloudflare Pages.
2. Set **Build command** to `npm run build`.
3. Set **Output directory** to `dist`.
4. (Optional) Set environment variable `NODE_VERSION` to `22` or later.

## Notes

- **Web Serial** is required for flashing. Only Chrome and Edge on desktop support it. Firefox, Safari, and iOS browsers will not work.
- **GitHub Personal Access Token** — when using GitHub-backed storage, create a PAT with `repo` scope (or a fine-grained token with `Contents: Read and write` permission on the target repository). Generate one at [github.com/settings/tokens](https://github.com/settings/tokens).
- **Supported chips:** ESP32, ESP32-S2, ESP32-S3, ESP32-C3, ESP8266.
- **STM32 support** is planned for a future release.
