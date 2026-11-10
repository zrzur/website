// The build takes Solid's inline scripts out of the rendered pages (the page
// policy allows none), but only when they carry nothing but finished
// boundaries; data in them would be lost, so that stops the build.
import test from "node:test";
import assert from "node:assert/strict";

import { stripSsrScripts } from "../scripts/ssr-scripts.mjs";

// what Solid 1.9 writes for a finished Suspense boundary (copied from a build)
const RESOLVER = `($R[2]=() => {
	const resolver = { p: 0, s: 0, f: 0 };
	resolver.p = new Promise((resolve, reject) => { resolver.s = resolve; resolver.f = reject; });
	return resolver;
})()`;
const SETTLE = `($R[3]=(resolver, data) => { resolver.s(data); resolver.p.s = 1; resolver.p.v = data; })`;
const boundary = (attributes = "") =>
  `<script${attributes}>self.$R=self.$R||[];_$HY.r["0a160"]=$R[0]=($R[1]=${RESOLVER}).p;${SETTLE}($R[1],!0);</script>`;
const withData = (attributes = "") =>
  `<script${attributes}>self.$R=self.$R||[];_$HY.r["0a160"]=$R[0]=($R[1]=${RESOLVER}).p;${SETTLE}($R[1],$R[5]={kindLegend:"Que signales-tu ?"});</script>`;

test("a finished boundary is taken out, the page stays", () => {
  const html = `<main><h1>Titre</h1>${boundary()}<p>Texte</p></main>`;
  assert.equal(stripSsrScripts(html), "<main><h1>Titre</h1><p>Texte</p></main>");
  // attributes do not hide a script from the strip
  assert.equal(stripSsrScripts(`<div>${boundary(' nonce="x"')}</div>`), "<div></div>");
});

test("a script that hands data over stops the build, with or without attributes", () => {
  assert.throws(() => stripSsrScripts(`<main>${withData()}</main>`, "/fr/report"), /\/fr\/report: the rendered page hands data/);
  assert.throws(() => stripSsrScripts(`<main>${withData(' nonce="x"')}</main>`), /hands data/);
  assert.throws(() => stripSsrScripts(`<main>${withData(' type="text/javascript" nonce="x"')}</main>`), /hands data/);
});

test("a script that cannot be read stops the build", () => {
  assert.throws(() => stripSsrScripts('<script nonce="x">this is not code</script>'), /could not be read/);
});

test("a resource that resolves to true is no boundary: nested keys are refused", () => {
  // a resource lives inside a boundary, so its key extends the boundary's key
  const nested = `<script>self.$R=self.$R||[];_$HY.r["0a160"]=$R[0]=($R[1]=${RESOLVER}).p;_$HY.r["0a160100"]=$R[6]=($R[7]=$R[2]()).p;${SETTLE}($R[1],!0);$R[3]($R[7],!0);</script>`;
  assert.throws(() => stripSsrScripts(nested), /0a160100/);
  // a key that is no hydration key at all is refused too
  const odd = `<script>self.$R=self.$R||[];_$HY.r["x y"]=$R[0]=($R[1]=${RESOLVER}).p;${SETTLE}($R[1],!0);</script>`;
  assert.throws(() => stripSsrScripts(odd), /x y/);
});

test("a boundary settled later in the script still counts as settled", () => {
  // the settle call runs in a microtask: the sandbox runs microtasks before it reads
  const later = `<script>self.$R=self.$R||[];_$HY.r["0a160"]=$R[0]=($R[1]=${RESOLVER}).p;Promise.resolve().then(() => ${SETTLE}($R[1],!0));</script>`;
  assert.equal(stripSsrScripts(`<p>${later}</p>`), "<p></p>");
});
