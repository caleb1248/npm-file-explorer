import tarball from "./tarball.js";

async function fetchLatest(name: string) {
  const { version } = await (
    await fetch(`https://registry.npmjs.org/${name}/latest`)
  ).json();
  console.log(version);
}

fetchLatest("esbuild-wasm");

function fetchSampleBlob() {
  fetch("https://registry.npmjs.org/esbuild/-/esbuild-0.19.5.tgz");
}
fetch("https://registry.npmjs.org/esbuild/-/esbuild-0.19.5.tgz");

const blobToDir = (blob: Blob) => new tarball.TarReader().readFile(blob);

fetchSampleBlob()
  .then((e) => fetchStreamToDecompressionStream(e))
  .then((e) => decompressionStreamToBlob(e))
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
