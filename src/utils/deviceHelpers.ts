// Move device-related utility functions to a separate file
export const getDeviceIcon = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'light': return 'lightbulb';
    case 'thermostat': return 'thermostat';
    case 'camera': return 'videocam';
    case 'lock': return 'lock';
    case 'switch': return 'power_settings_new';
    default: return 'devices_other';
  }
};

export const getStateColor = (state: string): string => {
  switch (state.toLowerCase()) {
    case 'on':
    case 'active':
    case 'online': return 'text-green-500';
    case 'off':
    case 'inactive':
    case 'offline': return 'text-gray-400';
    default: return 'text-yellow-500';
  }
};