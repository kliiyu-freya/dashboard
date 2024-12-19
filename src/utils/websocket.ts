// WebSocket connection state management
export let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 1000;

export function initializeWebSocket(url: string) {
  connectWebSocket(url);
}

function connectWebSocket(url: string) {
  try {
    ws = new WebSocket(url);
    
    ws.addEventListener('open', handleOpen);
    ws.addEventListener('close', () => handleClose(url));
    ws.addEventListener('error', handleError);
    ws.addEventListener('message', handleMessage);
  } catch (error) {
    console.error('Failed to connect to WebSocket:', error);
    updateConnectionStatus(false);
  }
}

function handleOpen() {
  console.log('Connected to Freya Core');
  reconnectAttempts = 0;
  updateConnectionStatus(true);
  window.dispatchEvent(new CustomEvent('wsConnected'));
}

function handleClose(url: string) {
  console.log('Disconnected from Freya Core');
  updateConnectionStatus(false);
  attemptReconnect(url);
}

function handleError(error: Event) {
  console.error('WebSocket error:', error);
  updateConnectionStatus(false);
}

function handleMessage(event: MessageEvent) {
  try {
    const data = JSON.parse(event.data);

    window.dispatchEvent(new CustomEvent(`freya:${data.type}`, {
      detail: data.data
    }));
  } catch (error) {
    console.error('Error processing message:', error);
  }
}

function attemptReconnect(url: string) {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    const delay = RECONNECT_DELAY * reconnectAttempts;
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
    setTimeout(() => connectWebSocket(url), delay);
  } else {
    console.error('Max reconnection attempts reached');
  }
}

function updateConnectionStatus(connected: boolean) {
  window.dispatchEvent(new CustomEvent(
    connected ? 'wsConnected' : 'wsDisconnected'
  ));
}

// Export a function to send messages
export function sendWebSocketMessage(message: any) {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not connected');
  }
}