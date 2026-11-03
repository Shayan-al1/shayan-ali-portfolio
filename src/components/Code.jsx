import { useRef, useLayoutEffect } from "react";
import { gsap, NOPREF, reduce } from "../lib/motion";
import { DATA } from "../data";

/* Profile as code: the window tilts flat while the file types itself out */
const tokenize = (l) =>
  l.split(/('[^']*'|\bconst\b|\w+(?=:)|[{}\[\],=:;])/).filter(Boolean);
const kind = (t, n) =>
  t[0] === "'"
    ? "s"
    : t === "const"
      ? "k"
      : /^\w+$/.test(t) && n === ":"
        ? "y"
        : "p";

export default function Code() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      NOPREF,
      () => {
        const spans = [...ref.current.querySelectorAll(".tk")],
          full = spans.map((s) => s.textContent);
        const total = full.reduce((a, t) => a + t.length, 0),
          P = { n: 0 };
        const upd = () => {
          let r = P.n;
          spans.forEach((s, i) => {
            s.textContent = full[i].slice(
              0,
              Math.max(0, Math.min(full[i].length, r)),
            );
            r -= full[i].length;
          });
        };
        upd();
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "+=250%",
            pin: true,
            scrub: true,
          },
        });
        tl.fromTo(
          ".win",
          { rotationX: 16, scale: 0.88, transformPerspective: 1200 },
          { rotationX: 0, scale: 1, ease: "none", duration: 0.3 },
          0,
        )
          .to(
            P,
            { n: total, ease: "none", duration: 0.65, onUpdate: upd },
            0.15,
          )
          .to({}, { duration: 0.2 }, 0.8);
      },
      ref,
    );
    return () => mm.revert();
  }, []);
  return (
    <section
      ref={ref}
      id="skills"
      className="relative flex h-[100svh] items-center justify-center px-4 md:px-12"
    >
      <div
        className="win w-full max-w-3xl overflow-hidden rounded-2xl border-2 border-ink bg-paper"
        style={{ boxShadow: "8px 8px 0 var(--ink)" }}
      >
        <div className="flex items-center gap-2 border-b-2 border-ink px-4 py-3">
          {[0, 1, 2].map((k) => (
            <span key={k} className="h-3 w-3 rounded-full bg-ink"></span>
          ))}
          <span className="ml-3 font-mono text-sm font-medium">
            shayan.config.js
          </span>
        </div>
        <pre
          className="whitespace-pre-wrap p-5 font-mono text-xs sm:text-sm md:p-8 md:text-lg"
          style={{ lineHeight: 1.7, minHeight: DATA.code.length * 1.7 + "em" }}
        >
          {DATA.code.map((l, i) => {
            const t = tokenize(l);
            return (
              <span key={i}>
                {t.map((x, j) => (
                  <span key={j} className={"tk " + kind(x, t[j + 1])}>
                    {x}
                  </span>
                ))}
                {"\n"}
              </span>
            );
          })}
        </pre>
      </div>
    </section>
  );
}
