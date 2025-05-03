import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// In your api hooks file (e.g., lib/api.ts) or utils file

export const getFullShortUrl = (shortCode: string): string => {
  // 1. Get the full API URL (e.g., http://localhost:4000/api)
  // Ensure VITE_API_URL points to the *base* of your API, including the '/api' part if used for other endpoints
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  // 2. Extract the base URL of the backend server
  //    (e.g., remove '/api' to get http://localhost:4000)
  //    This assumes your API routes are consistently under '/api'. Adjust if needed.
  //    A more robust way might be to have a separate VITE_BACKEND_BASE_URL env var.
  const backendBaseUrl = apiUrl.replace(/\/api$/, ''); // Removes '/api' if it's at the end

  // 3. Define the redirect path prefix used by the backend router
  const redirectPath = '/s/'; // This MUST match app.use('/s', ...) in backend index.ts

  // 4. Construct the correct URL
  //    Ensure no double slashes between base URL and path
  return `${backendBaseUrl.replace(/\/$/, '')}${redirectPath}${shortCode}`;
  // Example output: http://localhost:4000/s/yourShortCode
};
export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}