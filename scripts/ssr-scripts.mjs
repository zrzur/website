/**
 * The HTML that Solid renders at build time may carry inline script elements:
 * the hand-over of Suspense boundaries and resource data for hydration. The
 * page policy allows no inline script, so they are taken out. That is safe
 * only for boundary keys (a Suspense boundary that is simply done): data in
 * them would be lost and the browser would draw something else than the page
 * shows. So each script runs here in a sandbox first, and anything that is
 * not a finished boundary stops the build.
 */
import { runInNewContext } from "node:vm";

const SCRIPT = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;

/** What one inline script hands over: { key: value } for every _$HY.r entry */
function handOver(source) {
  const sandbox = { _$HY: { r: {} } };
  sandbox.self = sandbox;
  runInNewContext(source, sandbox, { timeout: 1000 });
  return Object.fromEntries(
    Object.entries(sandbox._$HY.r).map(([key, value]) => [
      key,
      // a boundary is a resolver promise; its value sits in .v once resolved
      value && typeof value === "object" && "v" in value ? value.v : value,
    ]),
  );
}

/** The HTML without its inline scripts; throws if one carries more than a finished boundary */
export function stripSsrScripts(html, where = "page") {
  return html.replace(SCRIPT, (_, source) => {
    let entries;
    try {
      entries = handOver(source);
    } catch (error) {
      throw new Error(`${where}: an inline script in the rendered page could not be read (${error.message})`);
    }
    for (const [key, value] of Object.entries(entries))
      if (value !== true)
        throw new Error(`${where}: the rendered page hands data to the browser (${key}); render it from loaded data instead`);
    return "";
  });
}
