import { useRef, useLayoutEffect, useState } from "react";
import { gsap, NOPREF } from "../lib/motion";
import { DATA, SERVICES } from "../data";
import { IMG } from "../lib/images";
import { goTo } from "./Nav";

/* Three offers in plain words. Pick one and the preview frame swaps to matching work; everything stays readable at rest. */
const ICONS = {
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M13 6l-2 12",
  bag: "M6 7h12l-1 13H7L6 7zM9 7a3 3 0 0 1 6 0",
  layout: "M4 5h16v14H4zM4 10h16M10 10v9",
};
export default function Services() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      NOPREF,
      () => {
        gsap.utils
          .toArray(".svc-rise")
          .forEach((el) =>
            gsap.from(el, {
              y: 40,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            }),
          );
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
        className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl"
        style={{ fontStretch: "80%" }}
      >
        What I can build for you
      </h2>
      <div className="mt-10 grid gap-8 md:mt-16 md:grid-cols-[1.05fr_1fr] md:items-start md:gap-14">
        <div
          role="tablist"
          aria-label="Services"
          className="svc-rise order-last md:order-first"
        >
          {SERVICES.map(([t, d, ex, ico], i) => (
            <div
              key={t}
              className={
                "svc-row border-t-2 border-ink " + (active === i ? "on" : "")
              }
            >
              <button
                type="button"
                role="tab"
                id={"svc-tab-" + i}
                aria-selected={active === i}
                aria-controls={"svc-body-" + i}
                onClick={() => setActive(i)}
                className="flex w-full items-center gap-4 py-5 text-left md:gap-5 md:py-6"
              >
                <span className="svc-ico grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-ink md:h-12 md:w-12">
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
                <span
                  className="svc-title text-2xl font-extrabold leading-tight tracking-tight md:text-4xl"
                  style={{ fontStretch: "80%" }}
                >
                  {t}
                </span>
                <span
                  aria-hidden="true"
                  className="svc-plus ml-auto text-3xl leading-none"
                >
                  +
                </span>
              </button>
              <div
                id={"svc-body-" + i}
                role="tabpanel"
                aria-labelledby={"svc-tab-" + i}
                aria-hidden={active !== i}
                inert={active === i ? undefined : ""}
                className="svc-body"
              >
                <div className="overflow-hidden">
                  <div className="pb-6 pl-[3.75rem] md:pl-[4.25rem]">
                    <p className="text-base md:text-lg">{d}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {ex.map((x) => (
                        <li
                          key={x}
                          className="rounded-full border-2 border-ink px-3 py-0.5 text-sm font-medium"
                        >
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="border-t-2 border-ink"></div>
        </div>
        <figure
          className="svc-rise order-first overflow-hidden rounded-2xl border-2 border-ink bg-paper md:sticky md:top-28 md:order-last md:self-start"
          style={{ boxShadow: "8px 8px 0 var(--ink)" }}
        >
          <div className="flex gap-2 border-b-2 border-ink px-4 py-3">
            {[0, 1, 2].map((k) => (
              <span key={k} className="h-3 w-3 rounded-full bg-ink"></span>
            ))}
          </div>
          <div
            className="relative aspect-[16/11] md:aspect-[4/3]"
            style={{ background: "var(--s3)" }}
          >
            {SERVICES.map(([t, , , , shots], i) => (
              <div
                key={t}
                aria-hidden={active !== i}
                className={"pv absolute inset-0 " + (active === i ? "on" : "")}
              >
                {shots.map(([k, alt], j) => (
                  <img
                    key={k}
                    src={IMG[k]}
                    alt={alt}
                    className={
                      shots.length > 1
                        ? "absolute left-[calc(var(--i)*var(--l))] top-[calc(var(--i)*var(--t1))] w-[62%] rounded-lg border-2 border-ink md:top-[calc(var(--i)*var(--t2))]"
                        : "absolute inset-0 h-full w-full object-cover object-top"
                    }
                    style={{
                      "--i": j,
                      "--l": 38 / (shots.length - 1 || 1) + "%",
                      "--t1": 49 / (shots.length - 1 || 1) + "%",
                      "--t2": 53 / (shots.length - 1 || 1) + "%",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          <figcaption className="border-t-2 border-ink px-4 py-2 text-sm">
            {SERVICES[active][5]}
          </figcaption>
        </figure>
      </div>
      <div className="svc-rise mt-12 flex flex-col gap-6 rounded-3xl bg-ink p-6 text-paper md:mt-16 md:flex-row md:items-center md:justify-between md:p-10">
        <div>
          <p
            className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl"
            style={{ fontStretch: "80%" }}
          >
            Ready to start?
          </p>
          <p className="mt-2 max-w-xl text-base md:text-lg">
            Tell me what you need and we can talk it through. I can also deploy
            it on Google Cloud with Cloudflare in front.
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
