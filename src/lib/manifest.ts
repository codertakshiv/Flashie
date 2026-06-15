import type { ChipFamily, FlashManifest, ManifestBuild, ManifestPart } from '../types/project'

/**
 * Default flash offsets for single merged firmware binaries (e.g. firmware.bin).
 *
 * These are safe defaults for combined `esptool merge_bin` outputs that include
 * bootloader, partition table, and application in one file. For multi-file
 * setups (separate bootloader.bin, partition-table.bin, firmware.bin), you must
 * supply per-part offsets that match the chip's memory map.
 */
export const DEFAULT_OFFSETS: Record<ChipFamily, number> = {
  'ESP32': 0x10000,
  'ESP32-S2': 0x10000,
  'ESP32-S3': 0x10000,
  'ESP32-C3': 0x10000,
  'ESP8266': 0x0,
}

export function buildManifest(
  name: string,
  version: string,
  chipFamily: ChipFamily,
  parts: { file: File; offset: number }[],
): FlashManifest {
  const manifestParts: ManifestPart[] = parts.map((p) => ({
    path: p.file.name,
    offset: p.offset,
  }))

  const build: ManifestBuild = {
    chipFamily,
    parts: manifestParts,
  }

  return {
    name,
    version,
    builds: [build],
  }
}

export function validateManifest(manifest: FlashManifest): string[] {
  const errors: string[] = []

  if (!manifest.name || manifest.name.trim().length === 0) {
    errors.push('Manifest name must not be empty')
  }

  if (!manifest.builds || manifest.builds.length === 0) {
    errors.push('Manifest must have at least one build')
    return errors
  }

  for (let i = 0; i < manifest.builds.length; i++) {
    const build = manifest.builds[i]

    if (!build.parts || build.parts.length === 0) {
      errors.push(`Build ${i} must have at least one part`)
      continue
    }

    for (let j = 0; j < build.parts.length; j++) {
      const part = build.parts[j]
      if (part.offset < 0) {
        errors.push(
          `Build ${i}, part ${j}: offset (0x${part.offset.toString(16)}) must be non-negative`,
        )
      }
    }
  }

  return errors
}
