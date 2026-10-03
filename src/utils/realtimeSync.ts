/**
 * MIPS Real-Time Synchronization Engine
 * Dual-Channel: Native BroadcastChannel (Zero-Config Cross-Tab) + WebSocket (Multi-Device LAN/WAN)
 */

export type RealtimeMessage =
  | {
      type: "SESSION_ANNOUNCED";
      sessionId: string;
      sessionCode: string;
      scenarioId: string;
      vesselName: string;
      instructorName: string;
      timestamp: number;
    }
  | {
      type: "CADET_JOINED";
      sessionId: string;
      sessionCode: string;
      cadetName: string;
      cadetId: string;
      timestamp: number;
    }
  | {
      type: "CADET_PROGRESS";
      cadetName: string;
      currentState: string;
      selectedBerth: string | null;
      dossierScore: number;
      isDossierSubmitted: boolean;
      currentSimMinute: number;
      containersHandled: number;
      timestamp: number;
    }
  | {
      type: "INSTRUCTOR_DISPATCH";
      checkpointId: "MOORING_APPROVAL" | "CRANE_START_APPROVAL";
      approved: boolean;
      sender: string;
      note?: string;
      timestamp: number;
    }
  | {
      type: "INSTRUCTOR_ALERT";
      title: string;
      message: string;
      level: "INFO" | "WARNING" | "EMERGENCY";
      timestamp: number;
    };

type Listener = (msg: RealtimeMessage) => void;

class RealtimeSyncManager {
  private broadcastChannel: BroadcastChannel | null = null;
  private ws: WebSocket | null = null;
  private listeners: Set<Listener> = new Set();
  private wsUrl: string | null = null;
  private isConnectingWs = false;

  constructor() {
    if (typeof window !== "undefined") {
      // 1. Initialize native cross-tab BroadcastChannel
      try {
        this.broadcastChannel = new BroadcastChannel("mips_realtime_channel");
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && typeof event.data === "object") {
            this.notifyListeners(event.data as RealtimeMessage);
          }
        };
      } catch (err) {
        console.warn("[MIPS Realtime] BroadcastChannel unavailable:", err);
      }

      // Check localStorage for saved WebSocket URL
      try {
        const savedUrl = localStorage.getItem("mips_ws_url");
        if (savedUrl) {
          this.connectWebSocket(savedUrl);
        }
      } catch {}
    }
  }

  public connectWebSocket(url: string) {
    if (typeof window === "undefined" || this.isConnectingWs) return;
    this.wsUrl = url;
    this.isConnectingWs = true;

    try {
      if (this.ws) {
        this.ws.close();
      }
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.isConnectingWs = false;
        try {
          localStorage.setItem("mips_ws_url", url);
        } catch {}
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners(data as RealtimeMessage);
        } catch (e) {
          console.warn("[MIPS Realtime] Invalid WS message JSON:", e);
        }
      };

      this.ws.onclose = () => {
        this.isConnectingWs = false;
        this.ws = null;
      };

      this.ws.onerror = () => {
        this.isConnectingWs = false;
      };
    } catch (e) {
      this.isConnectingWs = false;
      console.warn("[MIPS Realtime] WS Connection Failed:", e);
    }
  }

  public disconnectWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.wsUrl = null;
    try {
      localStorage.removeItem("mips_ws_url");
    } catch {}
  }

  public isWsConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  public getWsUrl(): string | null {
    return this.wsUrl;
  }

  public broadcast(msg: RealtimeMessage) {
    // 1. Broadcast locally to other tabs
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
      } catch (err) {
        console.warn("[MIPS Realtime] Broadcast post failed:", err);
      }
    }

    // 2. Broadcast to WebSocket server if connected
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(msg));
      } catch (err) {
        console.warn("[MIPS Realtime] WS send failed:", err);
      }
    }

    // 3. Notify current window listeners
    this.notifyListeners(msg);
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(msg: RealtimeMessage) {
    this.listeners.forEach((listener) => {
      try {
        listener(msg);
      } catch (err) {
        console.error("[MIPS Realtime] Listener error:", err);
      }
    });
  }
}

export const realtimeSync = new RealtimeSyncManager();
