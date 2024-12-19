export interface SystemStatus {
  cpuUsage: number;
  memoryUsage: {
    used: number;
    total: number;
  };
  uptime: number;
  networkStatus: 'connected' | 'disconnected';
  connectedDevices: number;
}

export interface Device {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'switch';
  status: 'on' | 'off';
  value?: number;
  room: string;
}

export interface Automation {
  id: string;
  name: string;
  schedule: string;
  actions: AutomationAction[];
  enabled: boolean;
}

export interface AutomationAction {
  deviceId: string;
  action: 'turnOn' | 'turnOff' | 'setValue';
  value?: number;
}

export interface WebSocketMessage<T = any> {
  type: string;
  data: T;
}