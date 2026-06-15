import { useCallback, useEffect, useRef, useState } from 'react'
import { ESPLoader, Transport, type IEspLoaderTerminal } from 'esptool-js'
import type { ChipFamily, FlashManifest } from '../types/project'

interface FlasherPanelProps {
  manifest: FlashManifest
  getFileData: (path: string) => Promise<ArrayBuffer>
}

type PanelStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'flashing'
  | 'erasing'
  | 'disconnecting'

const CHIP_NAME_TO_FAMILY: Record<string, ChipFamily> = {
  ESP32: 'ESP32',
  'ESP32-S2': 'ESP32-S2',
  'ESP32-S3': 'ESP32-S3',
  'ESP32-C3': 'ESP32-C3',
  ESP8266: 'ESP8266',
}

function formatOffset(offset: number): string {
  return `0x${offset.toString(16).toUpperCase().padStart(8, '0')}`
}

function FlasherPanel({ manifest, getFileData }: FlasherPanelProps) {
  const [status, setStatus] = useState<PanelStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [detectedChip, setDetectedChip] = useState<ChipFamily | null>(null)
  const [chipDescription, setChipDescription] = useState('')
  const [flashProgress, setFlashProgress] = useState(0)
  const [log, setLog] = useState<string[]>([])

  const transportRef = useRef<Transport | null>(null)
  const esploaderRef = useRef<ESPLoader | null>(null)
  const logEndRef = useRef<HTMLDivElement>(null)

  const supportsSerial =
    typeof navigator !== 'undefined' && 'serial' in navigator

  const appendLog = useCallback((...lines: string[]) => {
    setLog((prev) => [...prev, ...lines])
  }, [])

  const terminal: IEspLoaderTerminal = {
    clean: () => setLog([]),
    writeLine: (data) => appendLog(data),
    write: (data) =>
      setLog((prev) => {
        if (prev.length === 0) return [data]
        const copy = [...prev]
        copy[copy.length - 1] += data
        return copy
      }),
  }

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [log])

  const handleConnect = useCallback(async () => {
    setError(null)
    setStatus('connecting')
    appendLog('Requesting serial port…')

    let port: SerialPort
    try {
      port = await navigator.serial.requestPort()
    } catch {
      appendLog('Port selection cancelled.')
      setStatus('idle')
      return
    }

    try {
      const transport = new Transport(port, false)
      transportRef.current = transport

      const esploader = new ESPLoader({
        transport,
        baudrate: 921600,
        terminal,
        debugLogging: false,
        enableTracing: false,
      })
      esploaderRef.current = esploader

      appendLog('Connecting to device…')
      await esploader.detectChip()

      const chipName: string = (esploader.chip as typeof esploader.chip & { CHIP_NAME: string }).CHIP_NAME
      const desc = await esploader.chip.getChipDescription(esploader)

      setChipDescription(desc)
      const family = CHIP_NAME_TO_FAMILY[chipName]
      if (family) {
        setDetectedChip(family)
        appendLog(`Detected: ${desc} (${family})`)
      } else {
        setDetectedChip(null)
        appendLog(`Detected: ${desc} (chip name "${chipName}" — not in known ESP families)`)
      }

      appendLog('Uploading stub…')
      await esploader.runStub()

      appendLog('Switching to high baud rate…')
      await esploader.changeBaud()

      appendLog('Device ready.')
      setStatus('connected')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      appendLog(`Connection error: ${msg}`)
      setError(msg)
      setStatus('idle')
      transportRef.current = null
      esploaderRef.current = null
    }
  }, [appendLog, terminal])

  const handleDisconnect = useCallback(async () => {
    const esploader = esploaderRef.current
    const transport = transportRef.current

    if (esploader) {
      try {
        await esploader.after('hard_reset')
      } catch {
        // ignore reset errors during disconnect
      }
    }

    if (transport) {
      try {
        await transport.disconnect()
      } catch {
        // ignore disconnect errors
      }
    }

    transportRef.current = null
    esploaderRef.current = null
    setDetectedChip(null)
    setChipDescription('')
    setFlashProgress(0)
    setStatus('idle')
    appendLog('Disconnected.')
  }, [appendLog])

  const findMatchingBuild = useCallback(() => {
    if (!detectedChip) return null

    const match = manifest.builds.find(
      (b) => b.chipFamily === detectedChip,
    )
    if (match) return match

    appendLog(
      `Warning: No build in manifest matches detected chip ${detectedChip}. Using first build.`,
    )
    return manifest.builds[0] ?? null
  }, [detectedChip, manifest.builds, appendLog])

  const handleFlash = useCallback(async () => {
    const esploader = esploaderRef.current
    if (!esploader) {
      setError('Not connected')
      return
    }

    const build = findMatchingBuild()
    if (!build) {
      const msg = 'No builds available in manifest'
      appendLog(msg)
      setError(msg)
      return
    }

    setError(null)
    setStatus('flashing')
    setFlashProgress(0)

    try {
      const parts = build.parts
      const fileData = await Promise.all(
        parts.map((p) => getFileData(p.path)),
      )

      const totalBytes = fileData.reduce((s, d) => s + d.byteLength, 0)
      let bytesDone = 0

      appendLog(`Flashing ${parts.length} part(s)…`)

      await esploader.writeFlash({
        fileArray: fileData.map((data, i) => ({
          data: new Uint8Array(data),
          address: parts[i].offset,
        })),
        flashMode: 'dio',
        flashFreq: '40m',
        flashSize: 'detect',
        eraseAll: false,
        compress: true,
        reportProgress: (_fileIndex, written, total) => {
          const fileFraction = total > 0 ? written / total : 0
          const overall =
            totalBytes > 0
              ? Math.min(
                  100,
                  Math.round(
                    ((bytesDone + fileFraction * fileData[_fileIndex].byteLength) /
                      totalBytes) *
                      100,
                  ),
                )
              : 0
          setFlashProgress(overall)
        },
      })

      for (const data of fileData) {
        bytesDone += data.byteLength
      }
      setFlashProgress(100)
      appendLog('Flash complete!')

      await esploader.after('hard_reset')
      appendLog('Device reset.')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      appendLog(`Flash error: ${msg}`)
      setError(msg)
    } finally {
      setStatus('connected')
    }
  }, [appendLog, findMatchingBuild, getFileData])

  const handleErase = useCallback(async () => {
    const esploader = esploaderRef.current
    if (!esploader) {
      setError('Not connected')
      return
    }

    setError(null)
    setStatus('erasing')
    appendLog('Erasing flash (this may take a while)…')

    try {
      await esploader.eraseFlash()
      appendLog('Erase complete.')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      appendLog(`Erase error: ${msg}`)
      setError(msg)
    } finally {
      setStatus('connected')
    }
  }, [appendLog])

  if (!supportsSerial) {
    return (
      <section className="flasher-panel">
        <div className="flasher-error">
          <strong>Web Serial not supported</strong>
          <p>
            Chrome or Edge on desktop is required. Web Serial is not available
            on Firefox, Safari, or iOS browsers.
          </p>
        </div>
      </section>
    )
  }

  const chipMismatch =
    detectedChip &&
    manifest.builds.length > 0 &&
    !manifest.builds.some((b) => b.chipFamily === detectedChip)

  return (
    <section className="flasher-panel">
      {/* -------- Device controls -------- */}
      <div className="flasher-controls">
        {status === 'idle' ? (
          <button
            type="button"
            className="flasher-btn"
            onClick={handleConnect}
          >
            Connect Device
          </button>
        ) : status === 'connecting' ? (
          <button type="button" className="flasher-btn" disabled>
            Connecting…
          </button>
        ) : (
          <>
            <button
              type="button"
              className="flasher-btn"
              onClick={handleFlash}
              disabled={status === 'flashing' || !detectedChip}
            >
              {status === 'flashing' ? 'Flashing…' : 'Flash'}
            </button>
            <button
              type="button"
              className="flasher-btn flasher-btn-secondary"
              onClick={handleErase}
              disabled={status === 'erasing'}
            >
              {status === 'erasing' ? 'Erasing…' : 'Erase Flash'}
            </button>
            <button
              type="button"
              className="flasher-btn flasher-btn-secondary"
              onClick={handleDisconnect}
              disabled={status === 'disconnecting'}
            >
              Disconnect
            </button>
          </>
        )}
      </div>

      {/* -------- Chip info & warnings -------- */}
      {detectedChip && (
        <div className="flasher-chip-info">
          Detected: <strong>{chipDescription}</strong> ({detectedChip})
        </div>
      )}
      {chipMismatch && (
        <div className="flasher-warning">
          Warning: detected chip ({detectedChip}) does not match any build in
          the manifest. Flashing may fail.
        </div>
      )}

      {/* -------- Progress bar -------- */}
      {status === 'flashing' && (
        <div className="flasher-progress-bar">
          <div
            className="flasher-progress-fill"
            style={{ width: `${flashProgress}%` }}
          />
          <span className="flasher-progress-text">{flashProgress}%</span>
        </div>
      )}

      {/* -------- Error -------- */}
      {error && (
        <div className="flasher-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* -------- Parts table -------- */}
      <div className="flasher-parts">
        <strong>Manifest builds:</strong>
        <ul>
          {manifest.builds.map((build, i) => (
            <li key={i}>
              {build.chipFamily} —{' '}
              {build.parts
                .map((p) => `${p.path} @ ${formatOffset(p.offset)}`)
                .join(', ')}
            </li>
          ))}
        </ul>
      </div>

      {/* -------- Live log -------- */}
      <div className="flasher-log">
        {log.map((line, i) => (
          <div key={i} className="flasher-log-line">
            {line}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </section>
  )
}

export default FlasherPanel
