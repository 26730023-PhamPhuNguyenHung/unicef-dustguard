export const OPERATIONS_APP_URL =
  import.meta.env.VITE_OPERATIONS_URL ||
  (import.meta.env.PROD ? '/operations' : 'http://localhost:3002');
