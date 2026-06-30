import type { BrowserSnapshot } from '../../types';
import type { SystemInfoSection } from './reportTypes';

export function buildSystemInfo(snapshot: BrowserSnapshot): SystemInfoSection[] {
  return [
    {
      title: 'Browser',
      items: [
        { label: 'Browser', value: snapshot.browserName },
        { label: 'Version', value: snapshot.browserVersion },
        { label: 'Language', value: snapshot.language },
        { label: 'Timezone', value: snapshot.timezone },
      ],
    },
    {
      title: 'OS',
      items: [
        { label: 'Operating system', value: snapshot.operatingSystem },
        { label: 'Platform', value: snapshot.platform },
        { label: 'User Agent', value: snapshot.userAgent.slice(0, 80) },
      ],
    },
    {
      title: 'Network',
      items: [
        { label: 'Online', value: snapshot.online ? 'Yes' : 'No' },
        { label: 'Connection', value: snapshot.connectionType },
        { label: 'Downlink', value: `${snapshot.connectionDownlink ?? 'unknown'} Mb/s` },
        { label: 'RTT', value: `${snapshot.connectionRtt ?? 'unknown'} ms` },
      ],
    },
    {
      title: 'Display',
      items: [
        { label: 'Resolution', value: snapshot.screenResolution },
        { label: 'Color depth', value: `${snapshot.colorDepth}` },
        { label: 'Pixel ratio', value: `${snapshot.pixelRatio}` },
        { label: 'Dark mode', value: snapshot.darkMode ? 'Enabled' : 'Disabled' },
      ],
    },
    {
      title: 'Storage',
      items: [
        { label: 'Local storage', value: snapshot.localStorage ? 'Available' : 'Unavailable' },
        { label: 'Session storage', value: snapshot.sessionStorage ? 'Available' : 'Unavailable' },
        { label: 'IndexedDB', value: snapshot.indexedDB ? 'Supported' : 'Unsupported' },
        { label: 'Service Worker', value: snapshot.serviceWorker ? 'Supported' : 'Unsupported' },
      ],
    },
    {
      title: 'Permissions',
      items: [
        { label: 'Notifications', value: snapshot.notificationPermission },
        { label: 'Clipboard', value: snapshot.clipboardSupport ? 'Supported' : 'Unsupported' },
        { label: 'Camera', value: snapshot.cameraSupport ? 'Supported' : 'Unsupported' },
        { label: 'Microphone', value: snapshot.microphoneSupport ? 'Supported' : 'Unsupported' },
      ],
    },
    {
      title: 'Hardware',
      items: [
        { label: 'Hardware concurrency', value: `${snapshot.hardwareConcurrency}` },
        { label: 'Device memory', value: snapshot.deviceMemory ? `${snapshot.deviceMemory} GB` : 'Unavailable' },
        { label: 'Touch support', value: snapshot.touchSupport ? 'Yes' : 'No' },
      ],
    },
    {
      title: 'Media',
      items: [
        { label: 'Media devices', value: snapshot.mediaDevicesSupport ? 'Available' : 'Unavailable' },
        { label: 'WebGL', value: snapshot.webglSupport ? 'Supported' : 'Unsupported' },
        { label: 'Canvas', value: snapshot.canvasSupport ? 'Supported' : 'Unsupported' },
        { label: 'WebRTC', value: snapshot.webrtcSupport ? 'Supported' : 'Unsupported' },
      ],
    },
    {
      title: 'Experimental APIs',
      items: [
        { label: 'Battery API', value: snapshot.batterySupport ? 'Supported' : 'Unsupported' },
        { label: 'Bluetooth', value: snapshot.bluetoothSupport ? 'Supported' : 'Unsupported' },
        { label: 'USB', value: snapshot.usbSupport ? 'Supported' : 'Unsupported' },
        { label: 'PWA', value: snapshot.installedPwa ? 'Installed' : 'Not installed' },
      ],
    },
  ];
}

