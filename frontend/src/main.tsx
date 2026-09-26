import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {CssBaseline} from "@mui/material";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <CssBaseline/>
        <App />
    </BrowserRouter>

)
