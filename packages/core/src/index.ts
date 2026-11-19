// Public surface of @kaithozhil/core: types, zod schemas, the Supabase client
// and shared business logic will live here (Sprint 2 onwards). Apps and the
// admin panel import only from this file.
export { compareVersions, fetchAppStatus, isUpdateRequired, type AppStatus } from './appStatus';
export { CONNECTIVITY_CHECK_URL, isOnline, type IsOnlineOptions } from './connectivity';
export { formatRupees } from './money';
export { formatIndianMobile, INDIAN_MOBILE_DIGITS } from './phone';
