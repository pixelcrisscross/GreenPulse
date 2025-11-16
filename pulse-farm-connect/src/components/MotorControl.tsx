// src/components/MotorControl.tsx
import React, { useEffect, useRef, useState } from "react";

/**
 * MotorControl.tsx
 * - Safe polling to /api/state (no overlapping requests)
 * - Robust POST helper for commands (POST /api/power, /api/speed, /api/direction)
 * - Debounced speed slider
 * - Automatic backoff on failures, manual "Retry Now"
 *
 * NOTE:
 * - This component expects your Vite dev server to proxy /api -> ESP IP.
 * - If you call the ESP directly (no proxy), change the paths accordingly.
 */

type RawStateFromServer = {
  power?: "ON" | "OFF" | boolean | string;
  direction?: "forward" | "reverse" | string;
  speed?: number;
  // any extra fields from server are allowed
};

interface MotorState {
  power: boolean; // true = ON
  dir: number; // 1 = forward, -1 = reverse
  speed: number; // 0–100
}

const POLL_INTERVAL = 3000;
const MAX_BACKOFF = 30000;
const SPEED_DEBOUNCE_MS = 150;

const toMotorState = (raw: RawStateFromServer, prev?: MotorState): MotorState => {
  const powerVal =
    raw.power === true ||
    (typeof raw.power === "string" && raw.power.toLowerCase() === "on") ||
    raw.power === "ON";

  const dirVal =
    (typeof raw.direction === "string" && raw.direction.toLowerCase() === "reverse")
      ? -1
      : 1;

  const speedVal = typeof raw.speed === "number" ? Math.max(0, Math.min(100, raw.speed)) : (prev?.speed ?? 100);

  return {
    power: powerVal,
    dir: dirVal,
    speed: speedVal,
  };
};

const MotorControl: React.FC = () => {
  // UI state
  const [state, setState] = useState<MotorState>({ power: false, dir: 1, speed: 100 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  // refs for polling/backoff/abort/debounce
  const backoffRef = useRef<number>(0);
  const pollTimerRef = useRef<number | null>(null);
  const speedTimerRef = useRef<number | null>(null);
  const pollAbortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  // Generic fetch wrapper used for both GET/POST; accepts signal optionally
  async function fetchJson(path: string, options: RequestInit = {}) {
    const res = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      ...options,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`${res.status} ${res.statusText} ${text}`.trim());
    }
    // Some endpoints might return empty body; try/catch JSON.parse
    try {
      return (await res.json()) as any;
    } catch {
      return null;
    }
  }

  // Single poll cycle (no overlapping calls)
  const pollStateOnce = async () => {
    // cancel any previous poll
    if (pollAbortRef.current) {
      try {
        pollAbortRef.current.abort();
      } catch {}
    }
    const ctrl = new AbortController();
    pollAbortRef.current = ctrl;

    try {
      const raw = await fetchJson("/api/state", { method: "GET", signal: ctrl.signal });
      if (!mountedRef.current) return;
      if (raw) {
        setState((prev) => ({ ...prev, ...toMotorState(raw, prev) }));
      }
      setConnected(true);
      setLastSeen(new Date());
      setError(null);
      backoffRef.current = 0;
    } catch (err: any) {
      if (err?.name === "AbortError") {
        // aborted - ignore
      } else {
        console.warn("poll error:", err);
        setConnected(false);
        setError("Failed to connect to ESP32");
        backoffRef.current = backoffRef.current ? Math.min(backoffRef.current * 2, MAX_BACKOFF) : 1000;
      }
    } finally {
      if (!mountedRef.current) return;
      const next = backoffRef.current || POLL_INTERVAL;
      if (pollTimerRef.current) window.clearTimeout(pollTimerRef.current);
      pollTimerRef.current = window.setTimeout(pollStateOnce, next);
    }
  };

  // start polling on mount
  useEffect(() => {
    mountedRef.current = true;
    pollStateOnce();

    return () => {
      mountedRef.current = false;
      try {
        pollAbortRef.current?.abort();
      } catch {}
      if (pollTimerRef.current) window.clearTimeout(pollTimerRef.current);
      if (speedTimerRef.current) window.clearTimeout(speedTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // POST helper for commands. Returns parsed response if any.
  const postCommand = async (endpoint: string, body?: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined });
      if (data) {
        setState((prev) => ({ ...prev, ...toMotorState(data, prev) }));
      }
      setConnected(true);
      setLastSeen(new Date());
      return data;
    } catch (err: any) {
      console.error("sendCommand error:", err);
      setConnected(false);
      setError(err?.message ? String(err.message) : "ESP32 not reachable");
      throw err;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // handlers wired to UI
  const handlePower = (on: boolean) => {
    // endpoint: POST /api/power with { power: "ON" | "OFF" }
    postCommand("/api/power", { power: on ? "ON" : "OFF" }).catch(() => {});
  };

  const toggleDirection = () => {
    const newDir = state.dir === 1 ? -1 : 1;
    // endpoint: POST /api/direction { direction: "Forward" | "Reverse" }
    postCommand("/api/direction", { direction: newDir === 1 ? "Forward" : "Reverse" }).catch(() => {});
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    // optimistic UI update
    setState((prev) => ({ ...prev, speed: val }));

    // debounce posting speed to ESP
    if (speedTimerRef.current) window.clearTimeout(speedTimerRef.current);
    speedTimerRef.current = window.setTimeout(() => {
      // endpoint: POST /api/speed { speed: <number> }
      postCommand("/api/speed", { speed: val }).catch(() => {});
    }, SPEED_DEBOUNCE_MS);
  };

  const handleRetry = () => {
    backoffRef.current = 0;
    if (pollTimerRef.current) window.clearTimeout(pollTimerRef.current);
    pollStateOnce();
  };

  // Local UI strings
  const powerLabel = state.power ? "ON" : "OFF";
  const dirLabel = state.dir === 1 ? "Forward" : "Reverse";

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>⚙️ ESP32 Motor Controller</h2>

      <div style={styles.statusRow}>
        <div>
          <strong>Status: </strong>
          {connected ? <span style={styles.online}>Connected</span> : <span style={styles.offline}>⚠️ Disconnected</span>}
        </div>

        <div style={{ marginLeft: "auto", color: "#666", fontSize: 12 }}>
          {lastSeen ? `Last seen: ${lastSeen.toLocaleTimeString()}` : "Never seen"}
        </div>
      </div>

      <div style={styles.statusBox}>
        <p>
          Power: <strong style={{ color: state.power ? "#16a34a" : "#dc2626" }}>{powerLabel}</strong>
        </p>
        <p>
          Direction: <strong>{dirLabel}</strong>
        </p>
        <p>
          Speed: <strong>{state.speed}%</strong>
        </p>
      </div>

      <div style={styles.buttonGroup}>
        <button
          style={{ ...styles.button, background: "#16a34a" }}
          onClick={() => handlePower(true)}
          disabled={!connected || loading}
          title="Turn motor ON"
        >
          Power ON
        </button>

        <button
          style={{ ...styles.button, background: "#dc2626" }}
          onClick={() => handlePower(false)}
          disabled={!connected || loading}
          title="Turn motor OFF"
        >
          Power OFF
        </button>

        <button
          style={{ ...styles.button, background: "#2563eb" }}
          onClick={toggleDirection}
          disabled={!connected || loading}
          title="Toggle direction"
        >
          {state.dir === 1 ? "Reverse" : "Forward"}
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <label htmlFor="speed">Speed:</label>
        <input
          id="speed"
          type="range"
          min={0}
          max={100}
          value={state.speed}
          onChange={handleSpeedChange}
          style={{ width: "100%", marginTop: 8 }}
          disabled={!connected || loading}
        />
      </div>

      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={handleRetry} style={styles.smallBtn}>
          Retry Now
        </button>
        <div style={{ color: "#666", fontSize: 12 }}>{loading ? "Updating..." : connected ? "Connected to ESP32" : "Not connected"}</div>
      </div>

      {error && (
        <p style={{ color: "#dc2626", marginTop: 10 }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "20px",
    textAlign: "center",
    maxWidth: "540px",
    margin: "40px auto",
    background: "#f8fafc",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  },
  heading: { marginBottom: "10px" },
  statusRow: { display: "flex", alignItems: "center", marginBottom: 12 },
  statusBox: { marginBottom: 16, fontSize: 16 },
  buttonGroup: { display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" },
  button: { padding: "10px 18px", fontSize: 16, color: "white", border: "none", borderRadius: 10, cursor: "pointer" },
  smallBtn: { padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", cursor: "pointer", background: "#fff" },
  online: { color: "#065f46", background: "#ecfdf5", padding: "4px 8px", borderRadius: 6 },
  offline: { color: "#991b1b", background: "#fff1f2", padding: "4px 8px", borderRadius: 6 },
};

export default MotorControl;
