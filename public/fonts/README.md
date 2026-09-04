# Self-hosted webfonts

Both families ship with the repository instead of being fetched from Google at
build time. `fonts.googleapis.com` is not reachable from every network this app
is built on, and `next/font/google` fails *quietly* there: the build succeeds
and every page silently renders in a system fallback. The admin panel showed it
worst, because it is the one surface with no display type to disguise it.

| File | Family | Subset | Axis |
| --- | --- | --- | --- |
| `vazirmatn-v16-arabic.woff2` | Vazirmatn | arabic | `wght` 300–800 |
| `vazirmatn-v16-latin.woff2` | Vazirmatn | latin | `wght` 300–800 |
| `vazirmatn-v16-latin-ext.woff2` | Vazirmatn | latin-ext | `wght` 300–800 |
| `baloo-bhaijaan-2-v21-arabic.woff2` | Baloo Bhaijaan 2 | arabic | `wght` 500–800 |
| `baloo-bhaijaan-2-v21-latin.woff2` | Baloo Bhaijaan 2 | latin | `wght` 500–800 |
| `baloo-bhaijaan-2-v21-latin-ext.woff2` | Baloo Bhaijaan 2 | latin-ext | `wght` 500–800 |

These are the byte-identical variable subsets Google Fonts served for the
`Vazirmatn:wght@300..800` and `Baloo+Bhaijaan+2:wght@500..800` requests that
`app/layout.tsx` used to make — one file per family covers every weight, and the
`unicode-range` split in `app/globals.css` means a Persian page downloads only
the ~46 KB and ~38 KB arabic cuts.

The version in each filename is Google's (`v16`, `v21`). Keep it: `next.config.ts`
serves `/fonts/*` as `immutable`, so a new revision has to arrive under a new
name to reach browsers that already cached the old one.

## Licence

Both families are released under the SIL Open Font License 1.1.

- Vazirmatn — <https://github.com/rastikerdar/vazirmatn>
- Baloo Bhaijaan 2 — <https://github.com/googlefonts/baloo>

## Refreshing

```sh
curl -sL -A 'Mozilla/5.0' "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300..800&display=swap"
```

Run that with a browser user-agent (Google serves `ttf` to anything else), then
download the `woff2` URLs it prints and update the `@font-face` block in
`app/globals.css` if the `unicode-range` values changed.
