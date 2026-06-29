import type { BrowserSnapshot } from '../types';

import { getBrowserCapabilitiesSupport } from './browser/browserCapabilities';
import { getBrowserFingerprint } from './browser/browserFingerprint';
import { getBrowserHardwareSupport } from './browser/browserHardware';
import { getBrowserMediaSupport } from './browser/browserMedia';
import { getBrowserGraphicsSupport } from './browser/browserGraphics';
import { getBrowserStorageSupport } from './browser/browserStorage';
import { getBrowserTimezone } from './browser/browserTime';

export function detectBrowserInfo(): BrowserSnapshot {
  const fingerprint = getBrowserFingerprint();
  const { browserName, browserVersion, operatingSystem, platform, userAgent, language, doNotTrack, online, connectionType, connectionDownlink, connectionRtt } =
    fingerprint;

  const capabilities = getBrowserCapabilitiesSupport();
  const hardware = getBrowserHardwareSupport();
  const graphics = getBrowserGraphicsSupport();
  const media = getBrowserMediaSupport();
  const storage = getBrowserStorageSupport();

  return {
    browserName,
    browserVersion,
    operatingSystem,
    platform,
    userAgent,
    language,
    timezone: getBrowserTimezone(),
    cookiesEnabled: fingerprint.cookiesEnabled,
    javascriptEnabled: capabilities.javascriptEnabled,
    doNotTrack,
    online,
    touchSupport: hardware.touchSupport,
    screenResolution: hardware.screenResolution,
    colorDepth: hardware.colorDepth,
    pixelRatio: hardware.pixelRatio,
    hardwareConcurrency: hardware.hardwareConcurrency,
    deviceMemory: hardware.deviceMemory,
    localStorage: storage.localStorage,
    sessionStorage: storage.sessionStorage,
    indexedDB: capabilities.indexedDB,
    serviceWorker: capabilities.serviceWorker,
    notificationPermission: capabilities.notificationPermission,
    clipboardSupport: capabilities.clipboardSupport,
    cameraSupport: graphics.cameraSupport,
    microphoneSupport: graphics.microphoneSupport,
    batterySupport: capabilities.batterySupport,
    bluetoothSupport: capabilities.bluetoothSupport,
    usbSupport: capabilities.usbSupport,
    webglSupport: graphics.webglSupport,
    canvasSupport: graphics.canvasSupport,
    webrtcSupport: graphics.webrtcSupport,
    mediaDevicesSupport: media.mediaDevicesSupport,
    connectionType,
    connectionDownlink,
    connectionRtt,
    darkMode: capabilities.darkMode,
    reducedMotion: capabilities.reducedMotion,
    installedPwa: capabilities.installedPwa,
  };
}

