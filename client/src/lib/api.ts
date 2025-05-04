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
  const queryClient = useQueryClient();

  return useMutation<CreateUrlResponse, Error, CreateUrlRequest>({
    mutationFn: async (data) => {
      const response = await api.post('/urls', data);
      return response.data;
    },
    onSuccess: () => {
      console.log("Mutation successful, invalidating 'urls' query...");
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },

  });
};

export const useGetUrlList = () => {
  return useQuery<UrlListResponse, Error>({
    queryKey: ['urls'], 
    queryFn: async () => {
      const response = await api.get('/urls');
      return response.data;
    },
  });
};

export const getFullShortUrl = (shortCode: string): string => {

    const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    const redirectPath = '/s/'; 
    return `${baseUrl.replace(/\/$/, '')}${redirectPath}${shortCode}`;
};