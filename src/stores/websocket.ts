import { atom } from 'nanostores';

export interface Device {
  id: string;
  name: string;
  type: string;
  state: string;
}

export const wsStatus = atom<'connected' | 'disconnected'>('disconnected');
export const devices = atom<Device[]>([]);
export const wsError = atom<string | null>(null);

let ws: WebSocket | null = null;
let reconnectTimeout: number;
const RECONNECT_DELAY = 5000;
const WS_URL = 'ws://localhost:6672/ws';

export function connectWebSocket() {
  if (ws) {
    ws.close();
  }

  clearTimeout(reconnectTimeout);

  try {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      wsStatus.set('connected');
      wsError.set(null);
    };

    ws.onclose = () => {
      wsStatus.set('disconnected');
      reconnectTimeout = setTimeout(connectWebSocket, RECONNECT_DELAY);
    };

    ws.onerror = (error) => {
      wsError.set('WebSocket connection error');
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data.devices)) {
          devices.set(data.devices);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  } catch (error) {
    console.error('Error connecting to WebSocket:', error);
    wsError.set('Failed to connect to WebSocket');
    wsStatus.set('disconnected');
    reconnectTimeout = setTimeout(connectWebSocket, RECONNECT_DELAY);
  }
}

export function sendCommand(deviceId: string, command: string) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.error('WebSocket is not connected');
    return;
  }

  try {
    ws.send(JSON.stringify({ deviceId, command }));
  } catch (error) {
    console.error('Error sending command:', error);
  }
}