import moor from '../assets/work/moorabbin.webp';
import presia from '../assets/work/presia.webp';
import alira from '../assets/work/alira.webp';
import varia from '../assets/work/varia.webp';
import kaven from '../assets/work/kaven.webp';
import rest from '../assets/work/restaurant.webp';
import laibaHero from '../assets/work/laiba-hero.webp';
import laibaRunway from '../assets/work/laiba-runway.webp';
import laibaVideo from '../assets/work/laiba-runway.mp4';
import moorVideo from '../assets/work/moorabbin.mp4';
import kavenVideo from '../assets/work/kaven-nav.mp4';
import restVideo from '../assets/work/restaurant.mp4';
import presiaAdmin from '../assets/work/presia-admin.mp4';
import presiaAdminPoster from '../assets/work/presia-admin-poster.jpg';
import aliraAdmin from '../assets/work/alira-admin.mp4';
import aliraAdminPoster from '../assets/work/alira-admin-poster.jpg';
import variaAdmin from '../assets/work/varia-admin.mp4';
import variaAdminPoster from '../assets/work/varia-admin-poster.jpg';
import cstudVideo from '../assets/work/connectstud.mp4';
import cstud from '../assets/work/connectstud-poster.jpg';

export const IMG = { moor, presia, alira, varia, kaven, rest, laibaHero, laibaRunway, cstud };

/* Muted looping clips recorded from the live sites: [video, poster shown before it plays] */
export const VIDEO = {
  laibaRunway: [laibaVideo, laibaHero],
  moor: [moorVideo, moor],
  kaven: [kavenVideo, kaven],
  rest: [restVideo, rest],
  cstud: [cstudVideo, cstud],
  presiaAdmin: [presiaAdmin, presiaAdminPoster],
  aliraAdmin: [aliraAdmin, aliraAdminPoster],
  variaAdmin: [variaAdmin, variaAdminPoster],
};
