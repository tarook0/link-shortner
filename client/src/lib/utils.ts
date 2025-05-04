import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// In your api hooks file (e.g., lib/api.ts) or utils file

export const getFullShortUrl = (shortCode: string): string => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  const backendBaseUrl = apiUrl.replace(/\/api$/, ''); // Removes '/api' if it's at the end
  const redirectPath = '/s/'; 
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