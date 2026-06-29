import type { BrowserSnapshot } from '../../types';

export function getBrowserCapabilitiesSupport(): Pick<
  BrowserSnapshot,
  | 'javascriptEnabled'
  | 'clipboardSupport'
  | 'indexedDB'
  | 'serviceWorker'
  | 'notificationPermission'
  | 'batterySupport'
  | 'bluetoothSupport'
  | 'usbSupport'
  | 'darkMode'
  | 'reducedMotion'
  | 'installedPwa'
> {
  const battery = (navigator as Navigator & {
    getBattery?: () => Promise<{ level: number; charging: boolean }>;
  }).getBattery;

  const notificationPermission: BrowserSnapshot['notificationPermission'] =
    'Notification' in window
      ? Notification.permission === 'default'
        ? 'prompt'
        : (Notification.permission as BrowserSnapshot['notificationPermission'])
      : 'unavailable';


  return {
    javascriptEnabled: true,
    clipboardSupport: !!navigator.clipboard,
    indexedDB: 'indexedDB' in window,
    serviceWorker: 'serviceWorker' in navigator,
    notificationPermission,
    batterySupport: typeof battery === 'function',
    bluetoothSupport: !!(navigator as Navigator & { bluetooth?: unknown }).bluetooth,
    usbSupport: !!(navigator as Navigator & { usb?: unknown }).usb,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    installedPwa: window.matchMedia('(display-mode: standalone)').matches,
  };
}

