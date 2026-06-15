export type ChipFamily = "ESP32" | "ESP32-S2" | "ESP32-S3" | "ESP32-C3" | "ESP8266"

export type BoardCategory = "ARDUINO" | "ESP" | "STM32"

export interface ManifestPart {
  path: string
  offset: number
}

export interface ManifestBuild {
  chipFamily: ChipFamily
  parts: ManifestPart[]
}

export interface FlashManifest {
  name: string
  version: string
  new_install_prompt_erase?: boolean
  builds: ManifestBuild[]
}

export interface ProjectFile {
  name: string
  sizeBytes: number
  data?: ArrayBuffer
  sha?: string
  downloadUrl?: string
}

export interface Project {
  id: string
  name: string
  description?: string
  category?: BoardCategory
  manifest: FlashManifest
  files: ProjectFile[]
  source: "github" | "local"
  createdAt: string
}
