import { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger, NOPREF } from "../lib/motion";
import { XP } from "../data";

/* Names fill with ink as each role scrolls in; a line and dots track your progress down the list. Everything stays readable at rest. */
export default function Experience() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      NOPREF,
      () => {
        const list = ref.current.querySelector(".xp-list");
        gsap.fromTo(
          ref.current.querySelector(".xp-fill"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: list,
              start: "top 60%",
              end: "bottom 60%",
              scrub: true,
            },
          },
        );
        gsap.utils.toArray(".xp-row").forEach((r) => {
          gsap.fromTo(
            r.querySelector(".fill"),
            { backgroundSize: "100% 0%" },
            {
              backgroundSize: "100% 100%",
              ease: "none",
              scrollTrigger: {
                trigger: r,
                start: "top 80%",
                end: "top 35%",
                scrub: true,
              },
            },
          );
          ScrollTrigger.create({
            trigger: r,
            start: "top 60%",
            onToggle: (s) =>
              r.querySelector(".xp-dot").classList.toggle("on", s.progress > 0),
          });
        });
      },
      ref,
    );
    return () => mm.revert();
  }, []);
  return (
    <section ref={ref} id="experience" className="px-6 py-24 md:px-12 md:py-32">
      <h2
        className="text-4xl font-bold tracking-tight md:text-6xl"
        style={{ fontStretch: "80%" }}
      >
        Experience
      </h2>
      <div className="xp-list relative mt-12 pl-8 md:mt-16 md:pl-16">
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 top-0 w-[3px] bg-line"
        >
          <div className="xp-fill h-full w-full origin-top bg-accent"></div>
        </div>
        {XP.map(([co, role, when, pts]) => (
          <article
            key={co}
            className="xp-row relative grid gap-5 border-t-2 border-ink py-10 md:grid-cols-[1.15fr_1fr] md:gap-12 md:py-14"
          >
            <span
              aria-hidden="true"
              className="xp-dot absolute -left-8 top-12 -ml-[5px] h-3.5 w-3.5 rounded-full border-2 border-ink bg-paper md:-left-16 md:top-16"
            ></span>
            <div>
              <h3
                className="fill block pb-[.1em] font-extrabold leading-[.98] tracking-tight"
                style={{
                  fontSize: "clamp(2.25rem,6.5vw,5.5rem)",
                  fontStretch: "75%",
                }}
              >
                {co}
              </h3>
              <p className="mt-3 text-xl font-semibold">{role}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-accent">{when}</p>
              {pts.length ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-base md:text-lg">
                  {pts.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
