import type { BrowserSnapshot } from '../types';

export function detectBrowserInfo(): BrowserSnapshot {
  const nav = navigator;
  const ua = nav.userAgent;
  const connection = (nav as Navigator & { connection?: { effectiveType?: string; downlink?: number; rtt?: number } }).connection;
  const battery = (nav as Navigator & { getBattery?: () => Promise<{ level: number; charging: boolean }> }).getBattery;
  const mediaDevices = nav.mediaDevices;

  const browserName = ua.includes('Edg/') ? 'Microsoft Edge' : ua.includes('Chrome/') ? 'Chrome' : ua.includes('Firefox/') ? 'Firefox' : ua.includes('Safari/') ? 'Safari' : 'Unknown';
  const browserVersion = ua.match(/(Edg|Chrome|Firefox|Safari)\/(\d+(?:\.\d+)?)/)?.[2] ?? 'Unknown';
  const operatingSystem = ua.includes('Windows') ? 'Windows' : ua.includes('Mac OS X') ? 'macOS' : ua.includes('Linux') ? 'Linux' : ua.includes('Android') ? 'Android' : ua.includes('iPhone') ? 'iOS' : 'Unknown';

  return {
    browserName,
    browserVersion,
    operatingSystem,
    platform: nav.platform,
    userAgent: ua,
    language: nav.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookiesEnabled: nav.cookieEnabled,
    javascriptEnabled: true,
    doNotTrack: nav.doNotTrack || 'unknown',
    online: nav.onLine,
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio || 1,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null,
    localStorage: (() => {
      try {
        window.localStorage.setItem('__sentinel_test__', '1');
        window.localStorage.removeItem('__sentinel_test__');
        return true;
      } catch {
        return false;
      }
    })(),
    sessionStorage: (() => {
      try {
        window.sessionStorage.setItem('__sentinel_test__', '1');
        window.sessionStorage.removeItem('__sentinel_test__');
        return true;
      } catch {
        return false;
      }
    })(),
    indexedDB: 'indexedDB' in window,
    serviceWorker: 'serviceWorker' in navigator,
    notificationPermission: 'Notification' in window ? Notification.permission : 'unavailable',
    clipboardSupport: !!navigator.clipboard,
    cameraSupport: !!mediaDevices?.getUserMedia,
    microphoneSupport: !!mediaDevices?.getUserMedia,
    batterySupport: typeof battery === 'function',
    bluetoothSupport: !!(navigator as Navigator & { bluetooth?: unknown }).bluetooth,
    usbSupport: !!(navigator as Navigator & { usb?: unknown }).usb,
    webglSupport: (() => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!context;
    })(),
    canvasSupport: !!document.createElement('canvas').getContext('2d'),
    webrtcSupport: !!(window as Window & { RTCPeerConnection?: unknown }).RTCPeerConnection,
    mediaDevicesSupport: !!mediaDevices,
    connectionType: connection?.effectiveType ?? 'unknown',
    connectionDownlink: connection?.downlink ?? null,
    connectionRtt: connection?.rtt ?? null,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    installedPwa: window.matchMedia('(display-mode: standalone)').matches,
  };
}
