import { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger, NOPREF } from "../lib/motion";
import { DATA } from "../data";

/* The name is a window cut out of a dark sheet. Scroll zooms into the "l" until the whole screen is the scene behind it. */
export default function Hero() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      NOPREF,
      () => {
        const zt = ref.current.querySelector(".zt"),
          zl = ref.current.querySelector(".zl");
        const origin = () => {
          const a = zt.getBoundingClientRect(),
            b = zl.getBoundingClientRect();
          return (
            ((b.left + b.width / 2 - a.left) / a.width) * 100 +
            "% " +
            ((b.top + b.height / 2 - a.top) / a.height) * 100 +
            "%"
          );
        };
        /* Keep re-measuring the "l" while the page settles (styles and fonts arrive late on heavier pages); only while the zoom is at rest */
        let last = "",
          t0 = performance.now();
        const setO = () => {
          if (gsap.getProperty(zt, "scale") > 1.001) return;
          const o = origin();
          if (o !== last) {
            last = o;
            gsap.set(zt, { transformOrigin: o });
          }
        };
        const settle = () => {
          setO();
          if (performance.now() - t0 < 4000) requestAnimationFrame(settle);
        };
        settle();
        document.fonts && document.fonts.ready.then(setO);
        ScrollTrigger.addEventListener("refresh", setO);
        gsap.from(zt, { opacity: 0, duration: 1.2, ease: "power2.out" });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "+=260%",
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        tl.to(
          zt,
          {
            scale: () =>
              (Math.max(innerWidth, innerHeight) /
                (0.09 * parseFloat(getComputedStyle(zt).fontSize))) *
              1.4,
            ease: "power3.in",
            duration: 0.75,
          },
          0,
        )
          .to(".cue", { opacity: 0, duration: 0.08 }, 0)
          .to(".ov", { opacity: 0, duration: 0.12 }, 0.78)
          .fromTo(
            ".tag",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.2 },
            0.8,
          )
          .to({}, { duration: 0.1 }, 1);
      },
      ref,
    );
    return () => mm.revert();
  }, []);
  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate h-[100svh] overflow-hidden"
    >
      <div className="absolute inset-0 grid place-items-center overflow-hidden">
        <div className="grid-bg absolute inset-0"></div>
        <div className="glow absolute inset-0"></div>
        <p
          className="tag relative max-w-3xl px-6 text-center font-bold leading-tight opacity-0"
          style={{ fontSize: "clamp(1.75rem,5vw,4rem)" }}
        >
          {DATA.tagline}
        </p>
      </div>
      <div className="ov absolute inset-0 grid place-items-center overflow-hidden">
        <h1
          aria-label={DATA.name}
          className="zt relative font-extrabold tracking-[-0.04em]"
          style={{
            fontSize: "clamp(5rem,26vw,24rem)",
            lineHeight: 0.85,
            fontStretch: "75%",
          }}
        >
          {DATA.name.split(" ").map((w) => (
            <span key={w} aria-hidden="true" className="block">
              {[...w].map((c, i) => (
                <span
                  key={i}
                  className={c === "l" ? "zl inline-block" : "inline-block"}
                >
                  {c}
                </span>
              ))}
            </span>
          ))}
        </h1>
      </div>
      <p
        aria-hidden="true"
        className="cue absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-base"
        style={{ color: "var(--ov-fg)" }}
      >
        Scroll to dive in
      </p>
    </section>
  );
}
