import { useLayoutEffect, useState } from "react";
import { reduce } from "../lib/motion";
import { goTo } from "./Nav";

/* Separate from the hero on purpose: it only listens to scroll position and never touches the zoom */
export default function SkipIntro() {
  const [show, setShow] = useState(true);
  useLayoutEffect(() => {
    const on = () => setShow(scrollY < innerHeight * 2.2);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  if (reduce || !show) return null;
  return (
    <a
      href="#skills"
      onClick={(e) => goTo(e, "skills")}
      className="fixed bottom-16 right-5 z-[30] text-sm text-white underline underline-offset-4 mix-blend-difference sm:right-6 md:bottom-6 md:right-12 md:text-base"
    >
      Skip intro
    </a>
  );
}
