import { useRef, useLayoutEffect, useEffect, useState, useCallback } from "react";
import { gsap, NOPREF, reduce } from "../lib/motion";
import { SKILLS, SKILL_CATS } from "../data";
import { goTo } from "./Nav";

/* Skills as a mechanical keyboard. Scroll and the keycaps rain into the case; then click a key or type its letter
   and the little screen decodes what that skill is and where it was used. Spacebar is the hire-me key. */

/* Rows in key units. Numbers are SKILLS indexes, arrays are decorative modifiers, strings are action keys. */
const ROWS = [
  [["esc", 1.5], 0, 1, 2, 3, ["delete", 2.5]],
  [["tab", 2], 4, 5, 6, 7, ["\\", 2]],
  [["caps", 2.5], 8, 9, 10, 11, "work"],
  [["shift", 2], 12, 13, 14, 15, ["shift", 2]],
  [["ctrl", 1.5], ["alt", 1.5], "space", ["alt", 1.5], ["ctrl", 1.5]],
];
const SWATCH = {
  front: "var(--paper)",
  back: "color-mix(in srgb, var(--accent) 28%, var(--paper))",
  motion: "var(--accent)",
  cms: "var(--ink)",
  cloud: "var(--s4)",
};
const CANPIN =
  `${NOPREF} and (min-width: 1024px) and (min-height: 600px), ` +
  `${NOPREF} and (min-height: 760px)`;
const pad = (n) => String(n).padStart(2, "0");

/* Short mechanical "thock", synthesized so there is no audio file to load */
let actx;
function thock() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime,
      sr = actx.sampleRate;
    const buf = actx.createBuffer(1, sr * 0.03, sr),
      d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4);
    const src = actx.createBufferSource(),
      bp = actx.createBiquadFilter(),
      g = actx.createGain();
    src.buffer = buf;
    bp.type = "bandpass";
    bp.frequency.value = 2000 + Math.random() * 700;
    bp.Q.value = 0.9;
    g.gain.value = 0.45;
    src.connect(bp).connect(g).connect(actx.destination);
    src.start(t);
    const o = actx.createOscillator(),
      og = actx.createGain();
    o.frequency.setValueAtTime(170, t);
    o.frequency.exponentialRampToValueAtTime(55, t + 0.06);
    og.gain.setValueAtTime(0.3, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    o.connect(og).connect(actx.destination);
    o.start(t);
    o.stop(t + 0.08);
  } catch (e) {}
}

/* Text decodes left to right out of random glyphs whenever it changes */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/";
function useScramble(text) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (reduce) return setOut(text);
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = (now - t0) / 480;
      if (p >= 1.2) return setOut(text);
      let s = "";
      for (let i = 0; i < text.length; i++)
        s +=
          text[i] === " " || p > i / text.length + 0.18
            ? text[i]
            : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      setOut(s);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);
  return out;
}

export default function Skills() {
  const ref = useRef(null);
  const [active, setActive] = useState(3);
  const [down, setDown] = useState(null);
  const [booted, setBooted] = useState(reduce);
  const [sound, setSound] = useState(() => {
    try {
      return localStorage.getItem("kb-sound") === "1";
    } catch (e) {
      return false;
    }
  });
  const [touch] = useState(() => !matchMedia("(hover: hover)").matches);
  const st = useRef({ active: 3, lastUser: 0, inView: false, sound });
  st.current.sound = sound;

  const press = useCallback((i, user) => {
    setActive(i);
    st.current.active = i;
    setDown(i);
    if (user) {
      st.current.lastUser = Date.now();
      if (st.current.sound) thock();
    }
  }, []);
  const release = useCallback(
    (i) => setDown((d) => (i == null || d === i ? null : d)),
    [],
  );

  /* Scroll scene: case tilts flat, keycaps fall into place, screen boots */
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      { canPin: CANPIN, motion: NOPREF },
      (ctx) => {
        const { canPin, motion } = ctx.conditions;
        if (!motion) return;
        const keys = gsap.utils.toArray(".kfly");
        const R = gsap.utils.random;
        if (!canPin) {
          setBooted(true);
          gsap.from(keys, {
            y: -40,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(2)",
            stagger: { each: 0.03, from: "random" },
            scrollTrigger: { trigger: ".kb", start: "top 85%", once: true },
          });
          return;
        }
        let on = false;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "+=220%",
            pin: true,
            scrub: 0.6,
            onUpdate: (s) => {
              const b = s.progress > 0.8;
              if (b !== on) setBooted((on = b));
            },
          },
        });
        tl.fromTo(
          ".kb",
          {
            rotationX: 38,
            y: 80,
            scale: 0.9,
            transformPerspective: 1400,
            transformOrigin: "50% 100%",
          },
          { rotationX: 0, y: 0, scale: 1, ease: "none", duration: 0.35 },
          0,
        )
          .from(".boot-bar", { scaleX: 0, ease: "none", duration: 0.7 }, 0.1)
          .from(
            keys,
            {
              x: () => R(-320, 320),
              y: () => R(-760, -380),
              rotation: () => R(-80, 80),
              rotationX: () => R(-60, 60),
              scale: () => R(0.6, 1.35),
              opacity: 0,
              ease: "power3.out",
              duration: 0.35,
              stagger: { each: 0.02, from: "random" },
            },
            0.1,
          )
          .to({}, { duration: 0.2 });
        return () => setBooted(false);
      },
      ref,
    );
    return () => mm.revert();
  }, []);

  /* Case leans toward the pointer */
  useEffect(() => {
    if (reduce || touch) return;
    const el = ref.current.querySelector(".kb-tilt");
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
    gsap.set(el, { transformPerspective: 1600 });
    const move = (e) => {
      const b = el.getBoundingClientRect();
      ry(((e.clientX - b.left) / b.width - 0.5) * 7);
      rx(-((e.clientY - b.top) / b.height - 0.5) * 7);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [touch]);

  /* Real keyboard: type a key's letter while the section is on screen */
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => (st.current.inView = e.isIntersecting),
      { threshold: 0.35 },
    );
    io.observe(ref.current);
    const idx = (e) => SKILLS.findIndex((s) => s[0] === e.key.toLowerCase());
    const skip = (e) =>
      !st.current.inView ||
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) ||
      e.target.isContentEditable;
    const kd = (e) => {
      if (skip(e) || e.repeat) return;
      const i = idx(e);
      if (i >= 0) press(i, true);
    };
    const ku = (e) => {
      const i = idx(e);
      if (i >= 0) release(i);
    };
    addEventListener("keydown", kd);
    addEventListener("keyup", ku);
    return () => {
      io.disconnect();
      removeEventListener("keydown", kd);
      removeEventListener("keyup", ku);
    };
  }, [press, release]);

  /* Attract mode: until someone plays with it, the keyboard demos itself */
  useEffect(() => {
    if (!booted || reduce) return;
    const id = setInterval(() => {
      const s = st.current;
      if (!s.inView || Date.now() - s.lastUser < 9000) return;
      const n = (s.active + 1) % SKILLS.length;
      press(n, false);
      setTimeout(() => release(n), 170);
    }, 2600);
    return () => clearInterval(id);
  }, [booted, press, release]);

  const flipSound = () => {
    const v = !sound;
    setSound(v);
    try {
      localStorage.setItem("kb-sound", v ? "1" : "0");
    } catch (e) {}
    if (v) thock();
  };

  const [, name, , cat, line, used] = SKILLS[active];
  const shown = useScramble(name);

  const keyProps = (i) => ({
    onPointerDown: () => press(i, true),
    onPointerUp: () => release(i),
    onPointerLeave: () => release(i),
    onPointerCancel: () => release(i),
    onClick: (e) => {
      /* Enter or Space on a focused key: no pointer events, so flash the press here */
      if (e.detail === 0) {
        press(i, true);
        setTimeout(() => release(i), 150);
      }
    },
  });

  const renderKey = (k, j) => {
    if (Array.isArray(k))
      return (
        <div
          key={j}
          className="kfly hidden sm:block"
          style={{ flex: `${k[1]} 1 0` }}
          aria-hidden="true"
        >
          <span className="key k-mod">
            <span className="cap">
              <span className="nm font-mono text-xs opacity-60">{k[0]}</span>
            </span>
          </span>
        </div>
      );
    if (k === "space" || k === "work") {
      const space = k === "space";
      return (
        <div
          key={j}
          className={"kfly " + (space ? "" : "hidden sm:block")}
          style={{ flex: `${space ? 6 : 1.5} 1 0` }}
        >
          <a
            href={space ? "#contact" : "#work"}
            onClick={(e) => {
              if (st.current.sound) thock();
              goTo(e, space ? "contact" : "work", true);
            }}
            className={"key " + (space ? "k-space" : "k-mod")}
          >
            <span className="cap">
              <span className="lg">{space ? "space" : "enter"}</span>
              <span className="nm">
                {space ? "Hire me" : "↵ Work"}
              </span>
            </span>
          </a>
        </div>
      );
    }
    const [hot, nm, short, c] = SKILLS[k];
    return (
      <div key={j} className="kfly" style={{ flex: "2 1 0" }}>
        <button
          type="button"
          aria-pressed={active === k}
          aria-keyshortcuts={hot.toUpperCase()}
          aria-label={nm}
          className={
            "key k-" +
            c +
            (active === k ? " on" : "") +
            (down === k ? " down" : "")
          }
          {...keyProps(k)}
        >
          <span className="cap">
            <span className="lg">{hot.toUpperCase()}</span>
            <span className="nm">
              <span className="lg:hidden">{short}</span>
              <span className="hidden lg:inline">{nm}</span>
            </span>
          </span>
        </button>
      </div>
    );
  };

  return (
    <section
      ref={ref}
      id="skills"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-x-clip px-4 pb-8 pt-20 sm:px-6 md:px-12"
    >
      <div className="mb-5 flex w-full max-w-6xl flex-wrap items-end justify-between gap-x-6 gap-y-1 md:mb-8">
        <h2
          className="text-4xl font-bold tracking-tight md:text-6xl"
          style={{ fontStretch: "80%" }}
        >
          The toolkit
        </h2>
        <p className="text-sm opacity-70 md:text-base">
          {touch
            ? "Tap a key to see where I used it."
            : "Click a key, or type its letter on your keyboard."}
        </p>
      </div>

      <div className="kb-tilt w-full max-w-6xl">
        <div
          className="kb rounded-[1.25rem] border-2 border-ink p-3 sm:p-4 md:rounded-[1.75rem] md:p-5"
          style={{ background: "var(--s2)", boxShadow: "8px 8px 0 var(--ink)" }}
        >
          <div className="mb-3 flex items-center justify-between gap-3 px-1 font-mono text-xs md:mb-4">
            <span className="flex items-center gap-2 font-bold tracking-widest">
              <span className="kb-led" aria-hidden="true"></span>
              SA-{SKILLS.length}
            </span>
            <button
              type="button"
              onClick={flipSound}
              aria-pressed={sound}
              className="hit relative flex items-center gap-2 rounded-full border-2 border-ink px-3 py-1 font-semibold"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 9v6h4l5 4V5L8 9H4z" />
                {sound ? (
                  <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
                ) : (
                  <path d="M17 9l5 6M22 9l-5 6" />
                )}
              </svg>
              Sound {sound ? "on" : "off"}
            </button>
          </div>

          <div className="grid gap-3 md:gap-4 lg:grid-cols-[1.7fr_1fr]">
            <div className="screen relative grid overflow-hidden rounded-xl border-2 border-ink bg-ink p-4 text-paper md:p-5 lg:order-last">
              <p className="sr-only" aria-live="polite">
                {booted
                  ? `${name}, ${SKILL_CATS[cat]}. ${line} Used in ${used.join(", ")}.`
                  : ""}
              </p>
              <div
                aria-hidden="true"
                className="boot col-start-1 row-start-1 flex flex-col justify-center gap-3 font-mono text-xs transition-opacity duration-300"
                style={{ opacity: booted ? 0 : 1 }}
              >
                <span className="tracking-widest">LOADING TOOLKIT</span>
                <span className="h-2 w-full overflow-hidden rounded-full border border-current">
                  <span className="boot-bar block h-full origin-left bg-current"></span>
                </span>
                <span className="opacity-60">{SKILLS.length} keys, {Object.keys(SKILL_CATS).length} colorways</span>
              </div>
              <div
                aria-hidden="true"
                className="col-start-1 row-start-1 flex min-h-[12rem] flex-col transition-opacity duration-300 lg:min-h-0"
                style={{ opacity: booted ? 1 : 0 }}
              >
                <div className="flex items-start justify-between gap-3 font-mono text-[11px] tracking-wider">
                  <span>
                    {pad(active + 1)}/{pad(SKILLS.length)}
                  </span>
                  <ul className="flex flex-wrap justify-end gap-x-3 gap-y-1">
                    {Object.entries(SKILL_CATS).map(([c, label]) => (
                      <li
                        key={c}
                        className={
                          "flex items-center gap-1.5 transition-opacity " +
                          (c === cat ? "opacity-100" : "hidden opacity-40 sm:flex")
                        }
                      >
                        <i
                          className="inline-block h-2.5 w-2.5 rounded-sm border border-current"
                          style={{ background: SWATCH[c] }}
                        ></i>
                        {label.toUpperCase()}
                      </li>
                    ))}
                  </ul>
                </div>
                <p
                  className="mt-auto break-words pt-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl"
                  style={{ fontStretch: "80%" }}
                >
                  {shown}
                </p>
                <p className="mt-3 text-sm leading-snug opacity-80 md:text-base">
                  {line}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 font-mono text-[11px] tracking-wider opacity-60">
                    USED IN
                  </span>
                  {used.map((u) => (
                    <span
                      key={u}
                      className="rounded-full border border-current px-2.5 py-0.5 text-xs font-medium"
                    >
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-2.5">
              {ROWS.map((row, r) => (
                <div key={r} className="flex gap-1.5 sm:gap-2 md:gap-2.5">
                  {row.map(renderKey)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
