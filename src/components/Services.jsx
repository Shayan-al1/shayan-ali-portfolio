import { useRef, useLayoutEffect } from "react";
import { gsap, NOPREF } from "../lib/motion";
import { DATA, SERVICES, PROCESS } from "../data";
import { goTo } from "./Nav";
import { goToProject } from "./Work";

/* What I build (three offers, each linking to the matching work) and how a project runs.
   Screenshots live in Work only; this section is about working together. */
const ICONS = {
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M13 6l-2 12",
  bag: "M6 7h12l-1 13H7L6 7zM9 7a3 3 0 0 1 6 0",
  layout: "M4 5h16v14H4zM4 10h16M10 10v9",
};
const pad = (n) => String(n).padStart(2, "0");
const projectIndex = (short) =>
  Math.max(
    0,
    DATA.projects.findIndex((p) => p.short === short),
  );
const wide = () => matchMedia("(min-width: 768px)").matches;

export default function Services() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      NOPREF,
      () => {
        gsap.utils.toArray(".svc-rise").forEach((el) =>
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }),
        );
        gsap.from(".svc-card", {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".svc-cards", start: "top 85%", once: true },
        });
        /* The process line draws as you scroll; each step lights up when the line reaches it */
        const steps = gsap.utils.toArray(".step");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".steps",
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(
          ".step-fill",
          { scaleX: () => (wide() ? 0 : 1), scaleY: () => (wide() ? 1 : 0) },
          { scaleX: 1, scaleY: 1, ease: "none", duration: 1 },
          0,
        );
        steps.forEach((s, i) =>
          tl.call(
            () => s.classList.toggle("on", tl.scrollTrigger.direction > 0),
            null,
            (i / (steps.length - 1)) * 0.98 + 0.01,
          ),
        );
        return () => steps.forEach((s) => s.classList.remove("on"));
      },
      ref,
    );
    return () => mm.revert();
  }, []);
  return (
    <section
      ref={ref}
      id="services"
      className="px-5 py-20 sm:px-6 md:px-12 md:py-32"
    >
      <h2
        className="svc-rise max-w-3xl text-4xl font-bold tracking-tight md:text-6xl"
        style={{ fontStretch: "80%" }}
      >
        What I can build for you
      </h2>

      <ul className="svc-cards mt-10 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-6">
        {SERVICES.map(([t, d, ico, ex], i) => (
          <li
            key={t}
            className="svc-card group flex flex-col rounded-2xl border-2 border-ink bg-paper p-6 transition-transform duration-300 hover:-translate-y-1 md:p-7"
            style={{ boxShadow: "6px 6px 0 var(--ink)" }}
          >
            <div className="flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-paper">
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={ICONS[ico]} />
                </svg>
              </span>
              <span className="font-mono text-sm opacity-50">{pad(i + 1)}</span>
            </div>
            <h3
              className="mt-6 text-2xl font-extrabold leading-tight tracking-tight md:text-3xl"
              style={{ fontStretch: "80%" }}
            >
              {t}
            </h3>
            <p className="mt-3 text-base">{d}</p>
            <div className="mt-auto pt-6">
              <p className="font-mono text-xs uppercase tracking-wider opacity-60">
                See it in
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {ex.map(([x, to]) => (
                  <li key={x}>
                    {to == null ? (
                      <span className="inline-block rounded-full border-2 border-ink px-3 py-0.5 text-sm font-medium">
                        {x}
                      </span>
                    ) : (
                      <a
                        href="#work"
                        onClick={(e) => goToProject(projectIndex(to), e)}
                        className="inline-flex items-center gap-1 rounded-full border-2 border-ink px-3 py-0.5 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
                      >
                        {x}
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-20 md:mt-28">
        <h3
          className="svc-rise text-3xl font-bold tracking-tight md:text-5xl"
          style={{ fontStretch: "80%" }}
        >
          How a project runs
        </h3>
        <ol className="steps relative mt-10 grid gap-8 md:mt-14 md:grid-cols-4 md:gap-6">
          <span
            aria-hidden="true"
            className="absolute bottom-4 left-[19px] top-4 w-[3px] bg-line md:bottom-auto md:left-5 md:right-5 md:top-[19px] md:h-[3px] md:w-auto"
          >
            <span className="step-fill block h-full w-full origin-top bg-accent md:origin-left"></span>
          </span>
          {PROCESS.map(([s, d], i) => (
            <li key={s} className="step relative pl-16 md:pl-0">
              <span className="step-dot absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-paper font-mono text-sm font-bold md:relative">
                {pad(i + 1)}
              </span>
              <p
                className="pt-1.5 text-xl font-extrabold tracking-tight md:pt-5 md:text-2xl"
                style={{ fontStretch: "80%" }}
              >
                {s}
              </p>
              <p className="mt-2 text-base md:max-w-[16rem]">{d}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="svc-rise mt-16 flex flex-col gap-6 rounded-3xl bg-ink p-6 text-paper md:mt-24 md:flex-row md:items-center md:justify-between md:p-10">
        <div>
          <p
            className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl"
            style={{ fontStretch: "80%" }}
          >
            Ready to start?
          </p>
          <p className="mt-2 max-w-xl text-base md:text-lg">
            Tell me what you need and we can talk it through.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="#contact"
            onClick={(e) => goTo(e, "contact", true)}
            className="rounded-full bg-accent px-6 py-3 text-base font-semibold text-paper md:text-lg"
          >
            Start a project
          </a>
          <a
            href={DATA.whatsapp}
            target="_blank"
            rel="noopener"
            className="rounded-full border-2 border-paper px-6 py-3 text-base font-semibold text-paper md:text-lg"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
