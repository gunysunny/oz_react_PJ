import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import { SupabaseProvider } from "../supabase/context";
import { UserProvider } from "./context/UserContext"; // ← 추가!
import App from './App.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SupabaseProvider>
      <UserProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </UserProvider>
    </SupabaseProvider>
  </StrictMode>
)