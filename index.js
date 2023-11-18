import './tarball';

async function fetchPackage(name) {
  const { latest } = await fetch(`https://registry.npmjs.org/${name}`).then(
    (res) => res.json()
  )['dist-tags'];
  console.log(latest);
}

fetchPackage('esbuild-wasm');

const fetchSampleBlob = () =>
  fetch('https://registry.npmjs.org/esbuild/-/esbuild-0.19.5');

const fetchStreamToDecompressionStream = (response) =>
  response.body.pipeThrough(new window.DecompressionStream('gzip'));

const decompressionStreamToBlob = (decompressedStream) =>
  new Response(decompressedStream).blob();

const blobToDir = (blob) => new tarball.TarReader().readFile(blob);

fetchSampleBlob()
  .then((e) => (console.log('yay'), e))
  .then((e) => fetchStreamToDecompressionStream(e))
  .then((e) => decompressionStreamToBlob(e))
  .then((e) => blobToDir(e))
  .then((e) => console.log(e))
  .then(() => console.log('yay!')); // you should see a few files from the downloaded git repo tarball

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
