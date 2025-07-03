import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import { SupabaseProvider } from "../supabase/context";
import { UserProvider } from "./context/UserContext"; // ← 추가!

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SupabaseProvider>
      <UserProvider>       {/* ← 이렇게 감싸주기 */}
        <App />
      </UserProvider>
    </SupabaseProvider>
  </StrictMode>,
)