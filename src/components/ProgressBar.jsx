import { useLayoutEffect } from "react";
import { gsap, NOPREF } from "../lib/motion";

export default function ProgressBar() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(NOPREF, () => {
      gsap.fromTo(
        ".pbar",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);
  return (
    <div
      aria-hidden="true"
      className="pbar fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-accent"
      style={{ transform: "scaleX(0)" }}
    ></div>
  );
}
