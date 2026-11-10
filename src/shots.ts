/**
 * The files of one app screen on the page (public/assets/product, made by
 * scripts/product-images.py): AVIF first, JPEG for the rest; 1152 and 2304 px
 * wide on larger screens; on phones a 780 x 488 crop of the phone capture,
 * the part a 16:10 frame shows. Shared by the app (Shot) and the build (the
 * first picture's preload, read by public/theme.js).
 */
export type Shade = "dark" | "light";
export type Source = { media?: string; type?: string; srcset: string; sizes?: string; width?: number; height?: number };
export type Files = { src: string; srcset?: string; sizes?: string; width: number; height: number; sources: Source[] };

export const PHONE_MEDIA = "(max-width: 600px)";
/** Most pictures sit in half the page on larger screens */
export const DEFAULT_SIZES = "(max-width: 900px) 100vw, 50vw";
/** The first picture of the home page spans the page */
export const HERO_SIZES = "(max-width: 1392px) calc(100vw - 32px), 1360px";

const at = (versions: Record<string, string>, name: string) =>
  `/assets/product/${name}${versions[name] ? `?v=${versions[name]}` : ""}`;

export function shotFiles(
  versions: Record<string, string>,
  options: { code: string; view: string; shade: Shade; phone?: boolean; hasPhone?: boolean; sizes?: string },
): Files {
  const { code, view, shade } = options;
  const url = (name: string) => at(versions, name);
  // the phone frame shows the whole phone capture
  if (options.phone) return { src: url(`${code}-${view}-phone-${shade}.jpg`), width: 780, height: 1688, sources: [] };
  const base = `${code}-${view}-${shade}`;
  const sizes = options.sizes ?? DEFAULT_SIZES;
  const sources: Source[] = [];
  if (options.hasPhone)
    sources.push(
      { media: PHONE_MEDIA, type: "image/avif", srcset: url(`${code}-${view}-crop-${shade}.avif`), width: 780, height: 488 },
      { media: PHONE_MEDIA, srcset: url(`${code}-${view}-crop-${shade}.jpg`), width: 780, height: 488 },
    );
  sources.push({ type: "image/avif", srcset: `${url(`${base}-1152.avif`)} 1152w, ${url(`${base}.avif`)} 2304w`, sizes });
  return {
    src: url(`${base}.jpg`),
    srcset: `${url(`${base}-1152.jpg`)} 1152w, ${url(`${base}.jpg`)} 2304w`,
    sizes,
    width: 2304,
    height: 1440,
    sources,
  };
}

/** What public/theme.js preloads for the first picture, per shade */
export function heroPreload(versions: Record<string, string>, code: string, view: string) {
  const entry = (shade: Shade) => {
    const files = shotFiles(versions, { code, view, shade, hasPhone: true, sizes: HERO_SIZES });
    const [phone, , larger] = files.sources;
    return [
      { media: PHONE_MEDIA, type: phone.type, href: phone.srcset },
      { media: "(min-width: 601px)", type: larger.type, srcset: larger.srcset, sizes: larger.sizes },
    ];
  };
  return { dark: entry("dark"), light: entry("light") };
}
