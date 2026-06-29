import type { BrowserSnapshot } from '../../types';

export function getBrowserStorageSupport(): Pick<BrowserSnapshot, 'localStorage' | 'sessionStorage'> {
  const localStorage = (() => {
    try {
      window.localStorage.setItem('__sentinel_test__', '1');
      window.localStorage.removeItem('__sentinel_test__');
      return true;
    } catch {
      return false;
    }
  })();

  const sessionStorage = (() => {
    try {
      window.sessionStorage.setItem('__sentinel_test__', '1');
      window.sessionStorage.removeItem('__sentinel_test__');
      return true;
    } catch {
      return false;
    }
  })();

  return { localStorage, sessionStorage };
}

