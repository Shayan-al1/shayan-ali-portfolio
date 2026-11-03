import { useRef, useLayoutEffect } from "react";
import { gsap, NOPREF } from "../lib/motion";
import { DATA } from "../data";
import { IMG } from "../lib/images";

/* Pinned stage: each project wipes up over the last while its content drifts */
export default function Work() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      NOPREF,
      () => {
        const P = gsap.utils.toArray(".pnl"),
          rail = gsap.utils.toArray(".ri"),
          W = 1.3;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "+=400%",
            pin: true,
            scrub: true,
            onUpdate: () => {
              const i = Math.min(
                P.length - 1,
                Math.floor((tl.time() + 0.5) / W),
              );
              rail.forEach((r, k) => r.classList.toggle("on", k === i));
            },
          },
        });
        P.slice(1).forEach((p, j) => {
          const at = 0.3 + j * W;
          tl.fromTo(
            p,
            { clipPath: "polygon(0% 100%,100% 100%,100% 100%,0% 100%)" },
            {
              clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
              ease: "none",
              duration: 1,
            },
            at,
          )
            .fromTo(
              p.querySelector(".pc"),
              { yPercent: 25 },
              { yPercent: 0, ease: "none", duration: 1 },
              at,
            )
            .to(
              P[j].querySelector(".pc"),
              { yPercent: -12, ease: "none", duration: 1 },
              at,
            );
        });
        tl.to({}, { duration: 0.3 }, 0.3 + (P.length - 1) * W);
        rail[0].classList.add("on");
        /* Mouse devices: the project window tilts toward the cursor */
        if (matchMedia("(hover: hover)").matches) {
          const q = gsap.utils.toArray(".mock").map((el) => {
            gsap.set(el, { transformPerspective: 900 });
            const o = { duration: 0.6, ease: "power3" };
            return [
              gsap.quickTo(el, "rotationX", o),
              gsap.quickTo(el, "rotationY", o),
            ];
          });
          const tilt = (x, y) =>
            q.forEach(([rx, ry]) => {
              rx(x);
              ry(y);
            });
          const mv = (e) =>
            tilt(
              -(e.clientY / innerHeight - 0.5) * 12,
              (e.clientX / innerWidth - 0.5) * 16,
            );
          const lv = () => tilt(0, 0);
          addEventListener("pointermove", mv);
          document.addEventListener("mouseleave", lv);
          return () => {
            removeEventListener("pointermove", mv);
            document.removeEventListener("mouseleave", lv);
          };
        }
      },
      ref,
    );
    return () => mm.revert();
  }, []);
  return (
    <section
      ref={ref}
      id="work"
      className="stage relative isolate h-[100svh] overflow-hidden"
    >
      {DATA.projects.map((p, i) => (
        <article
          key={p.title}
          className="pnl absolute inset-0 flex items-center px-5 pb-6 pt-32 sm:px-6 md:px-16 md:py-0 lg:pr-56"
          style={{ background: "var(--s" + (i + 1) + ")" }}
        >
          <div className="pc flex w-full flex-col justify-between gap-4 md:flex-row md:items-center md:gap-8">
            <div className="max-w-xl">
              <h3
                className="font-extrabold leading-[.98] tracking-tight"
                style={{ fontSize: "clamp(1.6rem,6vw,5.5rem)" }}
              >
                {p.title}
              </h3>
              <p className="mt-3 line-clamp-4 text-sm leading-snug sm:line-clamp-none sm:text-base md:mt-5 md:text-xl">
                {p.text}
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5 md:mt-6 md:gap-2">
                {p.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-medium md:px-3 md:py-1 md:text-sm"
                  >
                    {s}
                  </li>
                ))}
                {(p.links || []).map(([t, u]) => (
                  <li key={t}>
                    <a
                      href={u}
                      target="_blank"
                      rel="noopener"
                      className="inline-block rounded-full bg-ink px-2.5 py-0.5 text-xs font-medium text-paper underline-offset-4 hover:underline md:px-3 md:py-1 md:text-sm"
                    >
                      {t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="mock order-first w-full overflow-hidden rounded-xl border-2 border-ink bg-paper shadow-[5px_5px_0_var(--ink)] md:order-last md:w-[min(34vw,30rem)] md:rounded-2xl md:shadow-[10px_10px_0_var(--ink)]">
              <div className="flex gap-1.5 border-b-2 border-ink px-3 py-2 md:gap-2 md:px-4 md:py-3">
                {[0, 1, 2].map((k) => (
                  <span
                    key={k}
                    className="h-2 w-2 rounded-full bg-ink md:h-3 md:w-3"
                  ></span>
                ))}
              </div>
              <div
                className={
                  "relative h-[22svh] min-h-[7.5rem] md:h-auto " +
                  (p.shots.length > 1 ? "md:aspect-[4/3]" : "md:aspect-[16/9]")
                }
                style={
                  p.shots.length > 1 ? { background: "var(--s3)" } : undefined
                }
              >
                {p.shots.map(([k, alt], i) => (
                  <img
                    key={k}
                    src={IMG[k]}
                    alt={alt}
                    className={
                      p.shots.length > 1
                        ? "absolute left-[calc(var(--i)*24%)] top-[calc(var(--i)*16%)] w-[52%] rounded-md border-2 border-ink md:left-[calc(var(--i)*13%)] md:top-[calc(var(--i)*22%)] md:w-[74%] md:rounded-lg"
                        : "h-full w-full object-cover object-top"
                    }
                    style={{ "--i": i }}
                  />
                ))}
              </div>
              <figcaption className="border-t-2 border-ink px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm">
                {p.cap}
              </figcaption>
            </figure>
          </div>
        </article>
      ))}
      <p className="absolute left-6 top-24 z-10 text-base font-semibold md:left-16">
        Selected work
      </p>
      <ul
        aria-hidden="true"
        className="rail absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 text-sm font-medium lg:flex"
      >
        {DATA.projects.map((p) => (
          <li key={p.short} className="ri flex items-center justify-end">
            <i></i>
            {p.short}
          </li>
        ))}
      </ul>
    </section>
  );
}
