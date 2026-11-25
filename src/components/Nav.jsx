import { useLayoutEffect, useEffect, useState } from "react";
import { gsap, ScrollTrigger, reduce } from "../lib/motion";
import { DATA } from "../data";

/* From the navbar, Skills and Contact land on the finished state of their scroll animation */
const FINISH = { skills: 0.9, contact: 1 };
export function goTo(e, id, finish) {
  e.preventDefault();
  let el = id === "top" ? null : document.getElementById(id);
  if (el && el.parentElement.classList.contains("pin-spacer"))
    el = el.parentElement;
  const st =
    finish &&
    id in FINISH &&
    ScrollTrigger.getAll().find(
      (t) => t.pin && t.trigger === document.getElementById(id),
    );
  const target = st
    ? st.start + (st.end - st.start) * FINISH[id]
    : el
      ? { y: el }
      : 0;
  gsap.to(window, {
    scrollTo: target,
    duration: reduce ? 0 : 1.3,
    ease: "power3.inOut",
  });
}

const NAV_LINKS = ["Skills", "Experience", "Work", "Services", "Contact"];

export default function Nav() {
  const [mode, setMode] = useState(
    () =>
      document.documentElement.dataset.theme ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  );
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(null);
  /* Highlight the section under the middle of the screen. Pinned sections are measured by their pin spacer,
     which spans the whole scroll distance of the animation. */
  useEffect(() => {
    let raf = 0;
    const ids = NAV_LINKS.map((n) => n.toLowerCase());
    const check = () => {
      raf = 0;
      const mid = innerHeight / 2;
      let c = null;
      for (const id of ids) {
        let el = document.getElementById(id);
        if (!el) continue;
        if (el.parentElement.classList.contains("pin-spacer"))
          el = el.parentElement;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) c = id;
      }
      setCur(c);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
    };
  }, []);
  const flip = () => {
    const next = mode === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    setMode(next);
  };
  const lock = (on) => {
    document.documentElement.style.overflow = on ? "hidden" : "";
  };
  const close = () => {
    setOpen(false);
    lock(false);
  };
  const toggle = () => {
    setOpen(!open);
    lock(!open);
  };
  useLayoutEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") close();
    };
    const wide = matchMedia("(min-width: 768px)"),
      onWide = () => {
        if (wide.matches) close();
      };
    addEventListener("keydown", esc);
    wide.addEventListener("change", onWide);
    return () => {
      removeEventListener("keydown", esc);
      wide.removeEventListener("change", onWide);
      lock(false);
    };
  }, []);
  const go = (e, id) => {
    close();
    goTo(e, id, true);
  };
  return (
    <div>
      <header
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 pb-4 text-base text-white mix-blend-difference sm:px-6 md:px-12 md:pb-5 md:text-lg"
        style={{ paddingTop: "calc(1.25rem + env(safe-area-inset-top, 0px))" }}
      >
        <a
          href="#top"
          onClick={(e) => {
            close();
            goTo(e, "top");
          }}
          className="hit relative font-semibold"
        >
          <span className="hidden sm:inline">{DATA.name}</span>
          <span className="sm:hidden">SA</span>
        </a>
        <nav className="flex items-center gap-3 md:gap-6">
          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((n) => (
              <a
                key={n}
                href={"#" + n.toLowerCase()}
                onClick={(e) => goTo(e, n.toLowerCase(), true)}
                aria-current={cur === n.toLowerCase() ? "true" : undefined}
                className={
                  "relative underline-offset-4 hover:underline " +
                  (cur === n.toLowerCase() ? "nav-on" : "")
                }
              >
                {n}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={flip}
            aria-label={
              "Switch to " + (mode === "dark" ? "light" : "dark") + " mode"
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {mode === "dark" ? (
                <g>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </g>
              ) : (
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              )}
            </svg>
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </nav>
      </header>
      <div
        id="mobile-menu"
        aria-hidden={!open}
        inert={open ? undefined : ""}
        className="fixed inset-0 z-40 md:hidden"
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <div
          onClick={close}
          className="absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none"
          style={{ background: "rgba(8,10,20,.55)", opacity: open ? 1 : 0 }}
        ></div>
        <nav
          aria-label="Mobile menu"
          className={
            "absolute right-0 top-0 flex h-full w-[84%] max-w-sm flex-col justify-between overflow-y-auto bg-paper px-6 pb-8 pt-28 text-ink transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] motion-reduce:transition-none " +
            (open ? "translate-x-0" : "translate-x-full")
          }
        >
          <ul>
            {NAV_LINKS.map((n) => (
              <li key={n}>
                <a
                  href={"#" + n.toLowerCase()}
                  onClick={(e) => go(e, n.toLowerCase())}
                  aria-current={cur === n.toLowerCase() ? "true" : undefined}
                  className={
                    "block py-2 text-5xl font-extrabold tracking-tight " +
                    (cur === n.toLowerCase() ? "text-accent" : "")
                  }
                  style={{ fontStretch: "80%" }}
                >
                  {n}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={DATA.whatsapp}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-accent px-6 py-3 text-center text-lg font-semibold text-paper"
            >
              Chat on WhatsApp
            </a>
            <p className="break-all text-sm">{DATA.email}</p>
          </div>
        </nav>
      </div>
    </div>
  );
}
