import {TarReader} from "./tarball";

async function fetchLatest(name: string) {
  const { version } = await (
    await fetch(`https://registry.npmjs.org/${name}/latest`)
  ).json();
  console.log(version);
}

fetchLatest("esbuild-wasm");

async function fetchSampleBlob() {
  await (await (fetch("https://registry.npmjs.org/esbuild/-/esbuild-0.19.5.tgz"))).blob();
}
fetch("https://registry.npmjs.org/esbuild/-/esbuild-0.19.5.tgz");

const blobToDir = (blob: Blob) => new TarReader().readFile(blob);

const blob = fetchSampleBlob()
const stream = new DecompressionStream("gzip")
stream.writable.getWriter
  .then((e) => blobToDir(e))
  .then((e) => console.log(e));

/**
 * Output
 *
 * [
 *  {
 *    "name": "pax_global_header",
 *    "type": "g",
 *    "size": 52,
 *    "header_offset": 0
 *  },
 *  ...
 * ]
 */
