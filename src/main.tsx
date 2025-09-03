import { createRoot } from "react-dom/client";
import App from "./routes.tsx";
import { BrowserRouter } from "react-router";
import "./main.css";
import { Toaster } from "react-hot-toast";
import { WebSocketProvider } from "./components/WebSocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <WebSocketProvider>
      <App />
    </WebSocketProvider>

    <Toaster />
  </BrowserRouter>
);
