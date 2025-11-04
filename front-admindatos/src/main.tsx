import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import router from "../routes"; // aquí importas lo que defines en routes.tsx
import "./index.css";
import React from "react";
import { NotificationProvider } from "./context/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <NotificationProvider>
      <RouterProvider router={router} />
    </NotificationProvider>
  </React.StrictMode>
);
