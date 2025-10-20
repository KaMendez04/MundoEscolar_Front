import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import router from "../routes"; // aquí importas lo que defines en routes.tsx
import "./index.css";
import React from "react";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
