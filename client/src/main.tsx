import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css';
import { Providers } from './provider'
import { Toaster } from './components/ui/toaster'
import App from './App'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <Providers>
      <App />
      </Providers>
      <Toaster/>
    </QueryClientProvider>
  </React.StrictMode>
)