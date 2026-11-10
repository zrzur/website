/**
 * The HTML that Solid renders at build time may carry inline script elements:
 * the hand-over of Suspense boundaries and resource data for hydration. The
 * page policy allows no inline script, so they are taken out. That is safe
 * only for boundary keys (a Suspense boundary that is simply done): data in
 * them would be lost and the browser would draw something else than the page
 * shows. So each script runs here in a sandbox first, and anything that is
 * not a finished boundary stops the build.
 *
 * A finished boundary: its key is a hydration key (digits and small letters)
 * that no other key in the hand-over contains as its beginning, and it
 * settles to true. Solid gives a resource inside a boundary a key that
 * extends the boundary's, so a resource that settles to true is still
 * refused; the site renders no resources at build time (src/report.tsx).
 */
import { runInNewContext } from "node:vm";

const SCRIPT = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
const KEY = /^[0-9a-z]+$/;

/** What one inline script hands over: { key: value } for every _$HY.r entry */
function handOver(source) {
  const sandbox = { _$HY: { r: {} } };
  sandbox.self = sandbox;
  // microtasks run before the script counts as done, so a boundary settled
  // in a promise callback is read settled
  runInNewContext(source, sandbox, { timeout: 1000, microtaskMode: "afterEvaluate" });
  return Object.fromEntries(
    Object.entries(sandbox._$HY.r).map(([key, value]) => [
      key,
      // a boundary is a resolver promise; its value sits in .v once resolved
      value && typeof value === "object" && "v" in value ? value.v : value,
    ]),
  );
}

/** The HTML without its inline scripts; throws if one carries more than finished boundaries */
export function stripSsrScripts(html, where = "page") {
  return html.replace(SCRIPT, (_, source) => {
    let entries;
    try {
      entries = handOver(source);
    } catch (error) {
      throw new Error(`${where}: an inline script in the rendered page could not be read (${error.message})`);
    }
    const keys = Object.keys(entries);
    for (const [key, value] of Object.entries(entries)) {
      if (!KEY.test(key)) throw new Error(`${where}: the rendered page hands over "${key}", which is no hydration key`);
      if (keys.some((other) => other !== key && key.startsWith(other)))
        throw new Error(`${where}: the rendered page hands over ${key} inside a boundary: a resource, not a boundary`);
      if (value !== true)
        throw new Error(`${where}: the rendered page hands data to the browser (${key}); render it from loaded data instead`);
    }
    return "";
  });
}
