import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Wifi, WifiOff, Loader2, AlertTriangle } from "lucide-react";

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
    // ... (fetchJson logic remains the same)
    const res = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      ...options,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`${res.status} ${res.statusText} ${text}`.trim());
    }
    try {
      return (await res.json()) as any;
    } catch {
      return null;
    }
  }

  // Single poll cycle (no overlapping calls)
  const pollStateOnce = async () => {
    // ... (pollStateOnce logic remains the same)
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
    // ... (useEffect logic remains the same)
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
    // ... (postCommand logic remains the same)
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
    } catch (err: any)
    {
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
    postCommand("/api/power", { power: on ? "ON" : "OFF" }).catch(() => {});
  };

  const toggleDirection = () => {
    const newDir = state.dir === 1 ? -1 : 1;
    postCommand("/api/direction", { direction: newDir === 1 ? "Forward" : "Reverse" }).catch(() => {});
  };

  // --- Updated handler for shadcn/ui Slider ---
  const handleSpeedChange = (val: number) => {
    // optimistic UI update
    setState((prev) => ({ ...prev, speed: val }));

    // debounce posting speed to ESP
    if (speedTimerRef.current) window.clearTimeout(speedTimerRef.current);
    speedTimerRef.current = window.setTimeout(() => {
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
    // Page container matching Dashboard.tsx's inner wrapper
    <div className="p-6 md:p-8 space-y-6">
      {/* Header matching Dashboard.tsx */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ESP32 Motor Controller
          </h1>
          <p className="text-muted-foreground mt-1">
            Direct control over the ESP32 motor pump
          </p>
        </div>
      </div>

      {/* Controller UI wrapped in a Card */}
      <Card className="p-6 shadow-soft bg-white max-w-2xl">
        {/* Status Row */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <div className="flex items-center gap-2">
            <strong className="text-muted-foreground">Status:</strong>
            {connected ? (
              <span className="flex items-center gap-1.5 text-secondary font-medium">
                <Wifi className="h-4 w-4" /> Connected
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-destructive font-medium">
                <WifiOff className="h-4 w-4" /> Disconnected
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {lastSeen ? `Last seen: ${lastSeen.toLocaleTimeString()}` : "Never seen"}
          </div>
        </div>

        {/* Status Readouts */}
        <div className="p-4 bg-muted rounded-lg space-y-2 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Power:</span>
            <strong className={`font-semibold ${state.power ? "text-secondary" : "text-destructive"}`}>
              {powerLabel}
            </strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Direction:</span>
            <strong className="font-semibold">{dirLabel}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Speed:</span>
            <strong className="font-semibold">{state.speed}%</strong>
          </div>
        </div>

        {/* Button Group */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <Button
            variant="secondary"
            className="bg-green-600 hover:bg-green-700 text-white font-bold"
            onClick={() => handlePower(true)}
            disabled={!connected || loading}
            title="Turn motor ON"
          >
            Power ON
          </Button>
          <Button
            variant="destructive"
            className="font-bold"
            onClick={() => handlePower(false)}
            disabled={!connected || loading}
            title="Turn motor OFF"
          >
            Power OFF
          </Button>
          <Button
            variant="default"
            className="font-bold"
            onClick={toggleDirection}
            disabled={!connected || loading}
            title="Toggle direction"
          >
            {state.dir === 1 ? "Set Reverse" : "Set Forward"}
          </Button>
        </div>

        {/* Speed Slider */}
        <div className="space-y-3 mb-6">
          <label htmlFor="speed" className="font-medium text-muted-foreground">
            Speed: {state.speed}%
          </label>
          <Slider
            id="speed"
            min={0}
            max={100}
            value={[state.speed]}
            onValueChange={(value) => handleSpeedChange(value[0])}
            disabled={!connected || loading}
          />
        </div>

        {/* Footer with Retry and Loading */}
        <div className="flex items-center gap-4 mt-6 pt-4 border-t">
          <Button onClick={handleRetry} variant="outline" disabled={loading}>
            Retry Now
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : connected ? (
              <Wifi className="h-4 w-4 text-secondary" />
            ) : (
              <WifiOff className="h-4 w-4 text-destructive" />
            )}
            <span>
              {loading ? "Updating..." : connected ? "Connected" : "Not connected"}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MotorControl;