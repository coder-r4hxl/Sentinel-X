import type { BrowserSnapshot } from '../../types';
import type { CapabilityPoint, PermissionPoint, StagePoint } from './reportTypes';

export function buildCapabilities(snapshot: BrowserSnapshot): CapabilityPoint[] {
  return [
    { name: 'WebGL', value: snapshot.webglSupport ? 1 : 0 },
    { name: 'Canvas', value: snapshot.canvasSupport ? 1 : 0 },
    { name: 'WebRTC', value: snapshot.webrtcSupport ? 1 : 0 },
    { name: 'Service Worker', value: snapshot.serviceWorker ? 1 : 0 },
    { name: 'Storage', value: snapshot.localStorage ? 1 : 0 },
  ];
}

export function buildPermissions(): PermissionPoint[] {
  return [
    { name: 'Granted', value: 2 },
    { name: 'Prompt', value: 2 },
    { name: 'Denied', value: 1 },
  ];
}

export function buildStages(): StagePoint[] {
  return [
    { name: 'Boot', value: 100 },
    { name: 'Identity', value: 100 },
    { name: 'Permissions', value: 85 },
    { name: 'Assessment', value: 100 },
    { name: 'Report', value: 100 },
  ];
}

