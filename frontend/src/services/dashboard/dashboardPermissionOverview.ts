import type { PermissionCapability } from '../../types';
import type { PermissionOverviewData } from '../../types/dashboard';

export function buildPermissionOverview(args: {
  evaluated: boolean;
  capabilities: PermissionCapability[];
}): PermissionOverviewData | null {
  const { evaluated, capabilities } = args;

  if (!evaluated || !capabilities.length) return null;

  const normalize = (s: string) => s.toLowerCase();

  const byState = {
    granted: capabilities.filter((c) => normalize(c.state) === 'granted').length,
    prompt: capabilities.filter((c) => normalize(c.state) === 'prompt').length,
    denied: capabilities.filter((c) => normalize(c.state) === 'denied').length,
    unavailable: capabilities.filter((c) => normalize(c.state) === 'unavailable').length,
  };

  const total = Math.max(1, capabilities.length);

  const permissionScore = Math.round(
    ((byState.granted + byState.prompt * 0.6) / total) * 100
  );

  return {
    byState,
    permissionScore,
  };
}