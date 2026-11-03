import { createRoot } from "react-dom/client";
import "./index.css";
import { ScrollTrigger } from "./lib/motion";
import App from "./App";

/* Visitors start in their system theme; a saved choice from the toggle wins */
try {
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.dataset.theme = saved;
} catch (e) {}

createRoot(document.getElementById("root")).render(<App />);

addEventListener("load", () => ScrollTrigger.refresh());
if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
