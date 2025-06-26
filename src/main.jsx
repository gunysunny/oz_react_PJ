import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import { SupabaseProvider } from "../supabase/context";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  </StrictMode>,
)