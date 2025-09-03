import { createRoot } from "react-dom/client";
import App from "./routes.tsx";
import { BrowserRouter } from "react-router";
import "./main.css";
import { Toaster } from "react-hot-toast";
import { MessageProvider } from "./components/MessageProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MessageProvider>
      <App />
    </MessageProvider>

    <Toaster />
  </BrowserRouter>
);
