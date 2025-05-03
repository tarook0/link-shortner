import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CreateUrlRequest, CreateUrlResponse, UrlListResponse } from '../shared/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const useCreateShortUrl = () => {
  return useMutation<CreateUrlResponse, Error, CreateUrlRequest>({
    mutationFn: async (data) => {
      const response = await api.post('/urls', data);
      return response.data;
    },
  });
};

export const useGetUrlList = () => {
  return useQuery<UrlListResponse>({
    queryKey: ['urls'],
    queryFn: async () => {
      const response = await api.get('/urls');
      return response.data;
    },
  });
};

export const getFullShortUrl = (shortCode: string): string => {
  return `${window.location.origin}/s/${shortCode}`;
};