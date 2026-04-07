import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.jsx'

// IMPORTANT: Replace 'YOUR_GOOGLE_CLIENT_ID_HERE' with your actual Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = '303912239205-i0n0pkqa40a7555kvg4qt2hmdbolri7b.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
