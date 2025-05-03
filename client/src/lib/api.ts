import axios from 'axios';
// Import necessary hooks from React Query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// Make sure this path is correct for your project structure
import { CreateUrlRequest, CreateUrlResponse, UrlListResponse } from '../shared/types';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const useCreateShortUrl = () => {
  // 1. Get the query client instance
  const queryClient = useQueryClient();

  return useMutation<CreateUrlResponse, Error, CreateUrlRequest>({
    mutationFn: async (data) => {
      const response = await api.post('/urls', data);
      return response.data;
    },
    // 3. Add the onSuccess callback
    onSuccess: () => {
      console.log("Mutation successful, invalidating 'urls' query...");
      // 4. Invalidate the 'urls' query cache.
      // This tells React Query that the data for queries with this key is stale
      // and needs to be refetched the next time it's requested or rendered.
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
    // Optional: You can add onError for error handling specific to the mutation
    // onError: (error) => {
    //   console.error("Error creating short URL:", error);
    // },
  });
};

export const useGetUrlList = () => {
  // Specify the Error type for better handling in components
  return useQuery<UrlListResponse, Error>({
    queryKey: ['urls'], // This is the key used for caching and invalidation
    queryFn: async () => {
      const response = await api.get('/urls');
      // You might want error handling for the GET request itself here
      // or rely on React Query's error state in the component
      return response.data;
    },
    // Optional: Add other query options like staleTime if desired
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// No changes needed for getFullShortUrl
export const getFullShortUrl = (shortCode: string): string => {
    // Use VITE_API_URL for the redirect base, assuming redirects are served from the API domain
    const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    // Ensure no double slashes and construct the redirect path (e.g., /r/ or /s/)
    // Use the path your backend redirect logic expects (e.g., /s/ based on your example)
    const redirectPath = '/s/'; // Or '/r/' if that's what your backend uses
    return `${baseUrl.replace(/\/$/, '')}${redirectPath}${shortCode}`;
};