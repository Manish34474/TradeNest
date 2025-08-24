import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/authProvider.tsx";
import { CartProvider } from "./context/cartProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <Router>
          <App />
          <Toaster position="top-center" />
        </Router>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
