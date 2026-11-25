import { useRef, useLayoutEffect, useState } from "react";
import { gsap, NOPREF } from "../lib/motion";
import { DATA } from "../data";

/* Clipboard API needs a secure context; fall back to a hidden textarea */
async function copyText(t) {
  try {
    await navigator.clipboard.writeText(t);
    return true;
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = t;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e2) {}
    ta.remove();
    return ok;
  }
}

/* The email arrives letter by letter from all directions */
export default function Contact() {
  const [time, setTime] = useState("");
  const [copied, setCopied] = useState(null);
  const timer = useRef(0);
  const copy = async () => {
    const ok = await copyText(DATA.email);
    setCopied(ok ? "ok" : "fail");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 2200);
  };
  useLayoutEffect(() => {
    const f = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Karachi",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    f();
    const id = setInterval(f, 30000);
    return () => clearInterval(id);
  }, []);
  const ref = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      NOPREF,
      () => {
        gsap.from(".ch", {
          x: () => gsap.utils.random(-700, 700),
          y: () => gsap.utils.random(-450, 450),
          rotation: () => gsap.utils.random(-120, 120),
          opacity: 0,
          ease: "power3.out",
          stagger: { amount: 0.5 },
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "+=130%",
            pin: true,
            scrub: true,
          },
        });
      },
      ref,
    );
    return () => mm.revert();
  }, []);
  return (
    <section
      ref={ref}
      id="contact"
      className="relative flex h-[100svh] flex-col justify-between overflow-hidden px-5 pb-6 pt-20 sm:px-6 md:px-12 md:pb-10 md:pt-28"
    >
      <div>
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-ink px-3 py-1 text-xs font-semibold sm:text-sm md:mb-5">
          <span className="avail-dot" aria-hidden="true"></span>
          {DATA.available}
        </p>
        <h2
          className="max-w-3xl font-extrabold leading-[.95] tracking-tight"
          style={{ fontSize: "clamp(2rem,9vw,8rem)", fontStretch: "80%" }}
        >
          Have a project in mind?
        </h2>
      </div>
      <div>
        <a
          href={"mailto:" + DATA.email}
          aria-label={DATA.email}
          className="inline-block text-[clamp(1.1rem,5.2vw,4.5rem)] font-semibold underline decoration-accent decoration-4 underline-offset-8"
        >
          {DATA.email.split("").map((c, i) => (
            <span key={i} aria-hidden="true" className="ch inline-block">
              {c}
            </span>
          ))}
        </a>
        <div className="mt-6 flex flex-wrap gap-2 md:mt-8 md:gap-3">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper sm:px-5 sm:py-2.5 sm:text-base md:px-6 md:py-3 md:text-lg"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {copied === "ok" ? (
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              ) : (
                <g>
                  <rect x="9" y="9" width="11" height="11" rx="2" />
                  <path d="M5 15V6a2 2 0 0 1 2-2h8" />
                </g>
              )}
            </svg>
            {copied === "ok"
              ? "Copied"
              : copied === "fail"
                ? "Couldn’t copy"
                : "Copy email"}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied === "ok" ? "Email address copied" : ""}
          </span>
          <a
            href={DATA.whatsapp}
            target="_blank"
            rel="noopener"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-paper sm:px-5 sm:py-2.5 sm:text-base md:px-6 md:py-3 md:text-lg"
          >
            Chat on WhatsApp
          </a>
          <a
            href={DATA.tel}
            className="rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold sm:px-5 sm:py-2.5 sm:text-base md:px-6 md:py-3 md:text-lg"
          >
            Call {DATA.phone}
          </a>
          <a
            href={DATA.linkedin}
            target="_blank"
            rel="noopener"
            className="rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold sm:px-5 sm:py-2.5 sm:text-base md:px-6 md:py-3 md:text-lg"
          >
            LinkedIn
          </a>
          <a
            href="/Shayan_Ali_CV.pdf"
            download="Shayan_Ali_CV.pdf"
            className="rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold sm:px-5 sm:py-2.5 sm:text-base md:px-6 md:py-3 md:text-lg"
          >
            Download CV
          </a>
        </div>
        <dl className="cdl mt-5 grid grid-cols-3 gap-x-3 gap-y-3 border-t-2 border-ink pt-4 text-xs sm:text-sm md:mt-8 md:gap-x-6 md:pt-5 md:text-base">
          <div>
            <dt className="text-sm font-semibold text-accent">Based in</dt>
            <dd>Quetta-Karachi, Pakistan</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-accent">Local time</dt>
            <dd>{time ? time + " PKT" : "Pakistan Standard Time"}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-accent">Languages</dt>
            <dd>{DATA.languages}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs sm:text-sm">
          © {new Date().getFullYear()} {DATA.name}
        </p>
      </div>
    </section>
  );
}
