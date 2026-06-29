import type { BrowserSnapshot } from '../../types';

export function getBrowserGraphicsSupport(): Pick<
  BrowserSnapshot,
  | 'webglSupport'
  | 'canvasSupport'
  | 'webrtcSupport'
  | 'cameraSupport'
  | 'microphoneSupport'
> {
  const mediaDevices = navigator.mediaDevices;
  const cameraSupport = !!mediaDevices?.getUserMedia;
  const microphoneSupport = !!mediaDevices?.getUserMedia;

  const webglSupport = (() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!context;
  })();

  const canvasSupport = !!document.createElement('canvas').getContext('2d');

  const webrtcSupport = !!(window as Window & { RTCPeerConnection?: unknown }).RTCPeerConnection;

  return { webglSupport, canvasSupport, webrtcSupport, cameraSupport, microphoneSupport };
}

