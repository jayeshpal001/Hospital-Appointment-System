// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CustomToaster } from "./components/ui/Form/ToastSystem.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
// import { CustomToaster } from './components/ui/Form/FormComponents.jsx'

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CustomToaster />
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
);
