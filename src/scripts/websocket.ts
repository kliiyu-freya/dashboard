const socket = new WebSocket('ws://localhost:6672/ws');

const statusElement = document.getElementById('connection-status');

// Connection opened
socket.addEventListener('open', () => {
  console.log('Connected to WebSocket server');
  if (statusElement) {
    statusElement.textContent = 'Connected to Freya core!';
  }
});

// Listen for messages
socket.addEventListener('message', (event) => {
  console.log('Message from server:', event.data);
});

// Handle errors
socket.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
  if (statusElement) {
    statusElement.textContent = 'Error connecting to Freya core.';
  }
});

// Handle connection close
socket.addEventListener('close', () => {
  console.log('WebSocket connection closed');
  if (statusElement) {
    statusElement.textContent = 'Freya core connection closed.';
  }
});

export default socket;