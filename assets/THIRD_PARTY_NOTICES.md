# Third-party notices — site assets

## Typefaces (self-hosted, `assets/fonts/`)

| Face | Files | Licence | Notice |
|---|---|---|---|
| Geist | `geist-latin.woff2`, `geist-latin-ext.woff2` | SIL Open Font License 1.1 | `OFL-geist.txt` — © 2024 The Geist Project Authors |
| Geist Mono | `geist-mono-latin.woff2`, `geist-mono-latin-ext.woff2` | SIL Open Font License 1.1 | `OFL-geistmono.txt` — © 2024 The Geist Project Authors |
| Instrument Serif | `instrument-serif-latin.woff2`, `instrument-serif-latin-ext.woff2` | SIL Open Font License 1.1 | `OFL-instrumentserif.txt` — © 2022 The Instrument Serif Project Authors |

The files are the Latin and Latin Extended subsets served by Google Fonts. They are unmodified and hosted here so the site makes no third-party font requests.

## Partner and program marks

Monochrome mark outlines for Databricks, ElevenLabs, and Neon come from [Simple Icons](https://simpleicons.org) v16.33.0. The path data is CC0-1.0, and the outlines are inlined in the page markup.

The marks are trademarks of their respective owners. They appear only to identify programs Zero State takes part in, and they do not imply endorsement. Each owner's brand guidelines apply. See `intent/2026-10-02-site-redesign.md` § Open questions before shipping.

## three.js (self-hosted, `assets/vendor/three/0.170.0/`)

The home page's 3D marks (`aperture-3d.js`, `marks-3d.js`) use [three.js](https://threejs.org) 0.170.0, MIT License, © 2010-2024 three.js authors. The licence text is `assets/vendor/three/0.170.0/LICENSE`.

The files are unmodified copies from the npm package `three@0.170.0`. The package tarball matched the registry's published integrity, `sha512-FQK+LEpYc0fBD+J8g6oSEyyNzjp+Q7Ks1C568WWaoMRLW+TkNNWmenWeGgJjV105Gd+p/2ql1ZcjYvNiPZBhuQ==`, on 2026-11-07.

| File | From the package | SHA-256 |
|---|---|---|
| `three.module.min.js` | `build/three.module.min.js` | `08fd7545d13d2c7fb65ab691530a802dafefd638596501854f267d0fb13c39e7` |
| `addons/environments/RoomEnvironment.js` | `examples/jsm/environments/RoomEnvironment.js` | `85869bdd22f7cf0b22e68dcefe6cb710480af0f5c901a76f7a7764fd07fc8014` |
| `LICENSE` | `LICENSE` | `4c40a1ef62450b857c3b2aaf294936304cd552d965fbcd9d32d4c5bcf4ba4454` |

They are hosted here so the page loads no third-party code at run time. To upgrade, add a new versioned folder from a verified tarball and change the import map in `index.html`.
