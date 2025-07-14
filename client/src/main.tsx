import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import ToastCustom from './components/shared/ToastCustom.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { queryClient } from './lib/queryClient.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <ToastCustom />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
