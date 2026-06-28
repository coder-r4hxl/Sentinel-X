import type { PermissionCapability, PermissionState } from '../types';

function getPermissionState(name: PermissionName): PermissionState {
  if (navigator.permissions && navigator.permissions.query) {
    try {
      const permission = navigator.permissions.query({ name } as PermissionDescriptor);
      return 'prompt';
    } catch {
      return 'unavailable';
    }
  }
  return 'unavailable';
}

export async function evaluatePermissionCapabilities(): Promise<PermissionCapability[]> {
  const capabilities: PermissionCapability[] = [
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Enable policy alerts and assessment prompts.',
      required: true,
      state: 'unavailable',
      supported: 'Notification' in window,
      compatibility: 'Notification API supported in modern Chromium and Firefox browsers.',
    },
    {
      id: 'clipboard-read',
      label: 'Clipboard Read',
      description: 'Allow safe, in-session clipboard inspection when needed.',
      required: false,
      state: 'unavailable',
      supported: !!navigator.clipboard,
      compatibility: 'Clipboard APIs are available in secure contexts.',
    },
    {
      id: 'clipboard-write',
      label: 'Clipboard Write',
      description: 'Permit secure clipboard writes for evidence transfer.',
      required: false,
      state: 'unavailable',
      supported: !!navigator.clipboard,
      compatibility: 'Clipboard APIs are available in secure contexts.',
    },
    {
      id: 'camera',
      label: 'Camera',
      description: 'Optional support for assisted identity verification.',
      required: false,
      state: 'unavailable',
      supported: !!navigator.mediaDevices?.getUserMedia,
      compatibility: 'Camera access requires user consent and browser support.',
    },
    {
      id: 'microphone',
      label: 'Microphone',
      description: 'Optional support for voice-guided review workflows.',
      required: false,
      state: 'unavailable',
      supported: !!navigator.mediaDevices?.getUserMedia,
      compatibility: 'Microphone access requires user consent and browser support.',
    },
    {
      id: 'geolocation',
      label: 'Geolocation',
      description: 'Optional context for device security posture.',
      required: false,
      state: 'unavailable',
      supported: 'geolocation' in navigator,
      compatibility: 'Geolocation requires explicit user approval and HTTPS.',
    },
  ];

  if (typeof window === 'undefined') {
    return capabilities;
  }

  if ('Notification' in window) {
    capabilities[0].state = Notification.permission as PermissionState;
  }

  if (navigator.clipboard) {
    capabilities[1].state = 'prompt';
    capabilities[2].state = 'prompt';
  }

  if (navigator.mediaDevices?.getUserMedia) {
    capabilities[3].state = 'prompt';
    capabilities[4].state = 'prompt';
  }

  if ('geolocation' in navigator) {
    capabilities[5].state = 'prompt';
  }

  return capabilities;
}

export async function requestPermission(id: PermissionCapability['id']): Promise<PermissionState> {
  if (id === 'notifications' && 'Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission as PermissionState;
  }

  if ((id === 'clipboard-read' || id === 'clipboard-write') && navigator.clipboard) {
    return 'granted';
  }

  if ((id === 'camera' || id === 'microphone') && navigator.mediaDevices?.getUserMedia) {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: id === 'microphone', video: id === 'camera' });
      return 'granted';
    } catch {
      return 'denied';
    }
  }

  if (id === 'geolocation' && 'geolocation' in navigator) {
    try {
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(() => resolve(), () => reject(new Error('denied')));
      });
      return 'granted';
    } catch {
      return 'denied';
    }
  }

  return 'unavailable';
}
