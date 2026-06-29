import type { BrowserSnapshot } from '../../types';

export function getBrowserMediaSupport(): Pick<BrowserSnapshot, 'mediaDevicesSupport'> {
  return {
    mediaDevicesSupport: !!navigator.mediaDevices,
  };
}

