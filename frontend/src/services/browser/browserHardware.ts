import type { BrowserSnapshot } from '../../types';

export function getBrowserHardwareSupport(): Pick<
  BrowserSnapshot,
  | 'hardwareConcurrency'
  | 'deviceMemory'
  | 'touchSupport'
  | 'screenResolution'
  | 'colorDepth'
  | 'pixelRatio'
> {
  return {
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio || 1,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null,
  };
}

