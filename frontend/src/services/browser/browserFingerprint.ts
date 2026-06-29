import type { BrowserSnapshot } from '../../types';

export function getBrowserFingerprint(): Pick<
  BrowserSnapshot,
  | 'browserName'
  | 'browserVersion'
  | 'operatingSystem'
  | 'platform'
  | 'userAgent'
  | 'language'
  | 'doNotTrack'
  | 'online'
  | 'cookiesEnabled'
  | 'connectionType'
  | 'connectionDownlink'
  | 'connectionRtt'
> {
  const nav = navigator;
  const ua = nav.userAgent;

  const browserName = ua.includes('Edg/')
    ? 'Microsoft Edge'
    : ua.includes('Chrome/')
      ? 'Chrome'
      : ua.includes('Firefox/')
        ? 'Firefox'
        : ua.includes('Safari/')
          ? 'Safari'
          : 'Unknown';

  const browserVersion = ua.match(/(Edg|Chrome|Firefox|Safari)\/(\d+(?:\.\d+)?)/)?.[2] ?? 'Unknown';

  const operatingSystem = ua.includes('Windows')
    ? 'Windows'
    : ua.includes('Mac OS X')
      ? 'macOS'
      : ua.includes('Linux')
        ? 'Linux'
        : ua.includes('Android')
          ? 'Android'
          : ua.includes('iPhone')
            ? 'iOS'
            : 'Unknown';

  const connection = (nav as Navigator & {
    connection?: { effectiveType?: string; downlink?: number; rtt?: number };
  }).connection;

  return {
    browserName,
    browserVersion,
    operatingSystem,
    platform: nav.platform,
    userAgent: ua,
    language: nav.language,
    cookiesEnabled: nav.cookieEnabled,
    doNotTrack: nav.doNotTrack || 'unknown',
    online: nav.onLine,
    connectionType: connection?.effectiveType ?? 'unknown',
    connectionDownlink: connection?.downlink ?? null,
    connectionRtt: connection?.rtt ?? null,
  };
}


