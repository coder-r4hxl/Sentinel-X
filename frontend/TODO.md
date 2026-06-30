# Sentinel-X Refactor TODO

## Mandatory Engineering Refactor: reportService.ts and dashboardService.ts modularization

- [x] Gather understanding of current `reportService.ts` and `dashboardService.ts` exports/usages.

- [ ] Implement modularization of `src/services/reportService.ts` into `src/services/report/*` while preserving exports.
- [ ] Implement modularization of `src/services/dashboardService.ts` into `src/services/dashboard/*` while preserving exports.
- [ ] Update all internal import paths (no UI changes).
- [ ] Remove old/duplicate code and ensure no TypeScript/Vite errors.
- [ ] Run `npm run build` after reportService changes.
- [ ] Run `npm run build` after dashboardService changes.

