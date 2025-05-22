import {registerRoute as workbox_routing_registerRoute} from 'C:/Users/Saidi/OneDrive/Documents/Semeter4/DBS/Capstone/frontend/node_modules/workbox-routing/registerRoute.mjs';
import {ExpirationPlugin as workbox_expiration_ExpirationPlugin} from 'C:/Users/Saidi/OneDrive/Documents/Semeter4/DBS/Capstone/frontend/node_modules/workbox-expiration/ExpirationPlugin.mjs';
import {CacheableResponsePlugin as workbox_cacheable_response_CacheableResponsePlugin} from 'C:/Users/Saidi/OneDrive/Documents/Semeter4/DBS/Capstone/frontend/node_modules/workbox-cacheable-response/CacheableResponsePlugin.mjs';
import {CacheFirst as workbox_strategies_CacheFirst} from 'C:/Users/Saidi/OneDrive/Documents/Semeter4/DBS/Capstone/frontend/node_modules/workbox-strategies/CacheFirst.mjs';
import {clientsClaim as workbox_core_clientsClaim} from 'C:/Users/Saidi/OneDrive/Documents/Semeter4/DBS/Capstone/frontend/node_modules/workbox-core/clientsClaim.mjs';
import {precacheAndRoute as workbox_precaching_precacheAndRoute} from 'C:/Users/Saidi/OneDrive/Documents/Semeter4/DBS/Capstone/frontend/node_modules/workbox-precaching/precacheAndRoute.mjs';
import {cleanupOutdatedCaches as workbox_precaching_cleanupOutdatedCaches} from 'C:/Users/Saidi/OneDrive/Documents/Semeter4/DBS/Capstone/frontend/node_modules/workbox-precaching/cleanupOutdatedCaches.mjs';
import {NavigationRoute as workbox_routing_NavigationRoute} from 'C:/Users/Saidi/OneDrive/Documents/Semeter4/DBS/Capstone/frontend/node_modules/workbox-routing/NavigationRoute.mjs';
import {createHandlerBoundToURL as workbox_precaching_createHandlerBoundToURL} from 'C:/Users/Saidi/OneDrive/Documents/Semeter4/DBS/Capstone/frontend/node_modules/workbox-precaching/createHandlerBoundToURL.mjs';/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */








self.skipWaiting();

workbox_core_clientsClaim();


/**
 * The precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
workbox_precaching_precacheAndRoute([
  {
    "url": "assets/browser-CrbwC6py.js",
    "revision": null
  },
  {
    "url": "assets/index-C1k3Rad1.css",
    "revision": null
  },
  {
    "url": "assets/index-DCJDyJ_O.js",
    "revision": null
  },
  {
    "url": "assets/ui-pFbpyDq_.js",
    "revision": null
  },
  {
    "url": "assets/utils-r2rk5Hzu.js",
    "revision": null
  },
  {
    "url": "assets/vendor-CXyqWwaV.js",
    "revision": null
  },
  {
    "url": "assets/workbox-window.prod.es5-BJ8mGsQ1.js",
    "revision": null
  },
  {
    "url": "favicon.ico",
    "revision": "a0d726a37868380e05b379643e851f0f"
  },
  {
    "url": "images/guide/panduan1.png",
    "revision": "dd75a901313b31b1cae8008078ceb570"
  },
  {
    "url": "images/guide/panduan2.png",
    "revision": "8ff3f9bcfb24d6e71c0b645711dd26bc"
  },
  {
    "url": "images/guide/panduan3.png",
    "revision": "672aafd188b155f689553db6d21d039a"
  },
  {
    "url": "images/hero/HeroImage.png",
    "revision": "f5d0865e295ab2a7f3aa67aab0d0dfed"
  },
  {
    "url": "images/icons/apple-touch-icon.png",
    "revision": "668a1effa85d12f31eb34b5e1fad1d4f"
  },
  {
    "url": "images/icons/dampak1.png",
    "revision": "adf9c0128f559c72d3bc9f6fb46e824e"
  },
  {
    "url": "images/icons/dampak2.png",
    "revision": "22b4f38c9b3f84b058df4c2c4225d73a"
  },
  {
    "url": "images/icons/daun12.png",
    "revision": "bbacdc7eb7cb0538dcfc748d71f468fb"
  },
  {
    "url": "images/icons/masked-icon.svg",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  },
  {
    "url": "images/icons/pwa-192x192.png",
    "revision": "12ab4db686f2aeffc562e63d0b7d1a96"
  },
  {
    "url": "images/icons/pwa-512x512.png",
    "revision": "f780941dc30a0d5e448cf58fcf66c19e"
  },
  {
    "url": "images/icons/tomat.png",
    "revision": "27e0ae083e4277300f20ac6ad0290660"
  },
  {
    "url": "images/icons/tomat2.png",
    "revision": "b090c6ae09dc5fc0a95413a839ddb14d"
  },
  {
    "url": "images/logos/logo-shield.png",
    "revision": "3598d4a6b3128bcf7c1a4a879ab89b41"
  },
  {
    "url": "images/logos/logo.png",
    "revision": "7a28eaac7c2b14201358338bf33fe633"
  },
  {
    "url": "images/logos/logos.png",
    "revision": "cf635d2b612ad58d9fc6a9183208f926"
  },
  {
    "url": "images/team/akbar3.png",
    "revision": "c4e50cedd11eb7015702506b0269d2f0"
  },
  {
    "url": "images/team/nida.png",
    "revision": "135b2fcd972ea0f31f73100bb78152ab"
  },
  {
    "url": "images/team/nida.webp",
    "revision": "1e895c7dba9bf6d984ee542366d64055"
  },
  {
    "url": "images/team/noval.png",
    "revision": "e24aead323d15385cab0ed20bf2ef301"
  },
  {
    "url": "images/team/saidi.webp",
    "revision": "98578fe137b054684ea8dd629ba42fe1"
  },
  {
    "url": "images/team/ulfii.png",
    "revision": "4067c3bdd65fbf1ca90966f8848c8f72"
  },
  {
    "url": "index.html",
    "revision": "eefad63cd0dac8d1d1499de912c0e5a3"
  },
  {
    "url": "vite.svg",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  },
  {
    "url": "images/icons/apple-touch-icon.png",
    "revision": "668a1effa85d12f31eb34b5e1fad1d4f"
  },
  {
    "url": "images/icons/masked-icon.svg",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  },
  {
    "url": "images/icons/pwa-192x192.png",
    "revision": "12ab4db686f2aeffc562e63d0b7d1a96"
  },
  {
    "url": "images/icons/pwa-512x512.png",
    "revision": "f780941dc30a0d5e448cf58fcf66c19e"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "eba9d9396b47c02d7a384c053b835b8b"
  }
], {});
workbox_precaching_cleanupOutdatedCaches();
workbox_routing_registerRoute(new workbox_routing_NavigationRoute(workbox_precaching_createHandlerBoundToURL("index.html")));


workbox_routing_registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox_strategies_CacheFirst({ "cacheName":"google-fonts-cache", plugins: [new workbox_expiration_ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 31536000 }), new workbox_cacheable_response_CacheableResponsePlugin({ statuses: [ 0, 200 ] })] }), 'GET');




