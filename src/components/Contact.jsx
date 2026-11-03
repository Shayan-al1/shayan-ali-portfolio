import { useRef, useLayoutEffect, useState } from "react";
import { gsap, NOPREF } from "../lib/motion";
import { DATA } from "../data";

/* The email arrives letter by letter from all directions */
export default function Contact() {
  const [time, setTime] = useState("");
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
      <h2
        className="max-w-3xl font-extrabold leading-[.95] tracking-tight"
        style={{ fontSize: "clamp(2rem,9vw,8rem)", fontStretch: "80%" }}
      >
        Have a project in mind?
      </h2>
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
            href={import.meta.env.BASE_URL + "Shayan_Ali_CV.pdf"}
            download
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
