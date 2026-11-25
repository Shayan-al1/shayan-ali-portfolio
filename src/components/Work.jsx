import { useRef, useLayoutEffect, useEffect, useState } from "react";
import { gsap, NOPREF, reduce } from "../lib/motion";
import { DATA } from "../data";
import { IMG, VIDEO } from "../lib/images";

/* Pinned stage: each project wipes up over the last while its content drifts */
const W = 1.3;
let stage = null;

/* Scroll to the point where project i is fully revealed (works from anywhere on the page) */
export function goToProject(i, e) {
  if (e) e.preventDefault();
  const st = stage && stage.scrollTrigger;
  let y;
  if (st) {
    const t = i === 0 ? 0 : 0.3 + (i - 1) * W + 1;
    y = st.start + (st.end - st.start) * (t / stage.duration());
  } else {
    const p = document.querySelectorAll("#work .pnl")[i];
    if (!p) return;
    y = p.getBoundingClientRect().top + scrollY;
  }
  gsap.to(window, {
    scrollTo: y,
    duration: reduce ? 0 : 1.3,
    ease: "power3.inOut",
  });
}

export default function Work() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      NOPREF,
      () => {
        const P = gsap.utils.toArray(".pnl"),
          rail = gsap.utils.toArray(".ri");
        /* Only the clip on the panel in front plays, and only while the stage is on screen */
        let front = 0,
          seen = false,
          playing = -1;
        const sync = () => {
          const want = seen ? front : -1;
          if (want === playing) return;
          playing = want;
          P.forEach((p, k) => {
            const v = p.querySelector("video");
            if (!v) return;
            v.dataset.front = k === want ? "1" : "0";
            if (k === want) v.play().catch(() => {});
            else v.pause();
          });
        };
        const io = new IntersectionObserver(
          ([e]) => {
            seen = e.isIntersecting;
            sync();
          },
          { threshold: 0.3 },
        );
        io.observe(ref.current);
        const stop = () => {
          io.disconnect();
          seen = false;
          sync();
        };
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "+=" + P.length * 70 + "%",
            invalidateOnRefresh: true,
            pin: true,
            scrub: true,
            onUpdate: () => {
              const i = Math.min(
                P.length - 1,
                Math.floor((tl.time() + 0.5) / W),
              );
              rail.forEach((r, k) => r.classList.toggle("on", k === i));
              front = i;
              sync();
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
        stage = tl;
        rail[0].classList.add("on");
        const off = () => {
          stage = null;
        };
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
            off();
            stop();
            removeEventListener("pointermove", mv);
            document.removeEventListener("mouseleave", lv);
          };
        }
        return () => {
          off();
          stop();
        };
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
          className="pnl absolute inset-0 flex items-center px-5 pb-6 pt-32 sm:px-6 md:px-16 md:pb-8 md:pt-28 lg:pr-56"
          style={{ background: "var(--s" + (i + 1) + ")" }}
        >
          <Project p={p} />
        </article>
      ))}
      <p className="wlabel absolute left-6 top-24 z-10 text-base font-semibold md:left-16">
        Selected work
      </p>
      <nav
        aria-label="Projects"
        className="rail absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 lg:block"
      >
        <ul className="flex flex-col gap-1 text-sm font-medium">
          {DATA.projects.map((p, i) => (
            <li key={p.short} className="ri">
              <a
                href="#work"
                onClick={(e) => goToProject(i, e)}
                className="flex items-center justify-end py-1 underline-offset-4 hover:underline"
              >
                <i></i>
                {p.short}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

/* One project's content. Projects with `apps` get browser-style tabs: each app has its own clip,
   description and App Store link, and the next tab opens when a clip ends. */
function Project({ p }) {
  const apps = p.apps;
  const [tab, setTab] = useState(0);
  /* The "click to switch" hint shows on every visit and hides once someone picks a tab */
  const [hint, setHint] = useState(true);
  const pick = (k) => {
    setTab(k);
    setHint(false);
  };
  const [touch] = useState(() => !matchMedia("(hover: hover)").matches);
  const vref = useRef(null);
  const bar = useRef(null);
  const app = apps ? apps[tab] : null;
  const video = app ? [app.video, app.alt] : p.video;
  const links = app ? [[app.name + " on the App Store", app.link]] : p.links;
  const cap = app ? app.name + " admin, run locally on sample data" : p.cap;
  const onTime = (e) => {
    const v = e.currentTarget;
    if (bar.current && v.duration)
      bar.current.style.transform =
        "scaleX(" + v.currentTime / v.duration + ")";
  };
  /* New tab: the browser loads the new source; keep playing if this project is the one in front */
  useEffect(() => {
    const v = vref.current;
    if (!apps || !v) return;
    if (bar.current) bar.current.style.transform = "scaleX(0)";
    if (v.dataset.front === "1" && !reduce) v.play().catch(() => {});
  }, [tab]);
  return (
    <div className="pc flex w-full flex-col justify-between gap-4 md:gap-6 row:flex-row row:items-center row:gap-8">
      <div className="min-w-0 max-w-xl row:flex-1">
        <h3 className="work-title font-extrabold leading-[.98] tracking-tight">
          {p.title}
        </h3>
        <p
          className={
            (apps ? "wapps hidden sm:block " : "") +
            "wdesc mt-3 text-sm leading-snug sm:text-base md:mt-5 md:text-xl"
          }
        >
          {p.text}
        </p>
        {app ? (
          <p
            aria-live="polite"
            className="mt-3 rounded-lg border-2 border-ink bg-paper px-3 py-2 text-sm leading-snug md:mt-4 md:text-base"
          >
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider opacity-60">
              {app.name} · {tab + 1} of {apps.length}
            </span>
            {app.line}
          </p>
        ) : null}
        <ul className="mt-4 flex flex-wrap gap-1.5 md:mt-6 md:gap-2">
          {p.stack.map((s) => (
            <li
              key={s}
              className="rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-medium md:px-3 md:py-1 md:text-sm"
            >
              {s}
            </li>
          ))}
          {(links || []).map(([t, u]) => (
            <li key={t}>
              <a
                href={u}
                target="_blank"
                rel="noopener"
                className="hit relative inline-block rounded-full bg-ink px-2.5 py-0.5 text-xs font-medium text-paper underline-offset-4 hover:underline md:px-3 md:py-1 md:text-sm"
              >
                {t}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <figure className="mock order-first w-full overflow-hidden rounded-xl border-2 border-ink bg-paper shadow-[5px_5px_0_var(--ink)] row:order-last row:w-[min(38vw,30rem)] row:shrink-0 row:lg:w-[min(36vw,calc((100svh-17rem)*4/3))] row:xl:w-[min(44vw,60rem,calc((100svh-17rem)*4/3))] row:2xl:w-[min(48vw,60rem,calc((100svh-17rem)*4/3))] md:rounded-2xl md:shadow-[10px_10px_0_var(--ink)]">
        <div className="flex items-center gap-1.5 border-b-2 border-ink px-3 py-2 md:gap-2 md:px-4 md:py-3">
          {[0, 1, 2].map((k) => (
            <span
              key={k}
              className="h-2 w-2 shrink-0 rounded-full bg-ink md:h-3 md:w-3"
            ></span>
          ))}
          {apps ? (
            <div
              role="tablist"
              aria-label="Apps"
              className="ml-1 flex min-w-0 gap-1 md:ml-2"
            >
              {apps.map((a, k) => (
                <button
                  key={a.name}
                  type="button"
                  role="tab"
                  aria-selected={k === tab}
                  onClick={() => pick(k)}
                  className={
                    "app-tab relative shrink-0 overflow-hidden rounded-md border-2 px-2 py-0.5 text-[11px] font-semibold md:px-3 md:py-1 md:text-xs [@media(pointer:coarse)]:py-1.5 " +
                    (k === tab ? "on border-ink bg-ink text-paper" : "")
                  }
                >
                  {a.name}
                  {/* Story-style progress: watched tabs full, current one filling, upcoming empty */}
                  <span
                    ref={k === tab ? bar : undefined}
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-accent"
                    style={{ transform: "scaleX(" + (k < tab ? 1 : 0) + ")" }}
                  ></span>
                </button>
              ))}
              {hint ? (
                <span
                  aria-hidden="true"
                  className="apps-hint ml-1 inline-flex min-w-0 items-center gap-1 whitespace-nowrap rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-paper sm:inline-flex md:ml-2 md:text-xs"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="13"
                    height="13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M11 6l-6 6 6 6" />
                  </svg>
                  <span className="hint-s sm:hidden row:lg:inline row:xl:hidden">
                    {touch ? "Tap" : "Click"}
                  </span>
                  <span className="hint-l hidden sm:inline row:lg:hidden row:xl:inline">
                    {apps.length} apps · {touch ? "tap" : "click"} to switch
                  </span>
                </span>
              ) : null}
            </div>
          ) : p.links && p.links.length === 1 ? (
            <span className="ml-2 min-w-0 truncate font-mono text-[11px] opacity-60 md:ml-3 md:text-xs">
              {new URL(p.links[0][1]).hostname.replace(/^www\./, "")}
            </span>
          ) : null}
        </div>
        <div
          className={
            "mvid relative h-[22svh] min-h-[7.5rem] md:h-auto " +
            (p.shots.length > 1 && !video
              ? "md:aspect-[4/3]"
              : "md:aspect-[16/9]")
          }
          style={
            p.shots.length > 1 && !video
              ? { background: "var(--s3)" }
              : undefined
          }
        >
          {video ? (
            <video
              ref={vref}
              className="h-full w-full bg-ink object-cover"
              src={VIDEO[video[0]][0]}
              poster={VIDEO[video[0]][1]}
              aria-label={video[1]}
              muted
              loop={!apps}
              onEnded={
                apps ? () => setTab((t) => (t + 1) % apps.length) : undefined
              }
              onTimeUpdate={apps ? onTime : undefined}
              playsInline
              preload="none"
              controls={reduce || undefined}
            />
          ) : null}
          {(video ? [] : p.shots).map(([k, alt], i) => (
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
        <figcaption className="wcap border-t-2 border-ink px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm">
          {cap}
        </figcaption>
      </figure>
    </div>
  );
}
