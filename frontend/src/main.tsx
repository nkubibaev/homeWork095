import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {CssBaseline} from "@mui/material";
import {BrowserRouter} from "react-router-dom";
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId="350421679088-0o651u0ggm4a9fiv3femamnui5n3r5u3.apps.googleusercontent.com">
        <BrowserRouter>
            <CssBaseline/>
            <App />
        </BrowserRouter>
    </GoogleOAuthProvider>

)
