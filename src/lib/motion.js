import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* Media query for visitors who are fine with animation */
export const NOPREF = '(prefers-reduced-motion: no-preference)';
export const reduce = !matchMedia(NOPREF).matches;

export { gsap, ScrollTrigger };
