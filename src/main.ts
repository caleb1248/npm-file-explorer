import { TarReader } from "./tarball";

async function fetchLatest(name: string) {
  const res = await fetch(`https://registry.npmjs.org/${name}/latest`);
  const { version } = await res.json();
  return version;
}

async function fetchSampleBlob(packageName: string, version?: string) {
  const pkgVersion = version || (await fetchLatest(packageName));
  const stream = fetch(
    `https://registry.npmjs.org/${packageName}/-/${packageName}-${pkgVersion}.tgz`
  )
    .then(({ blob }) => blob())
    .then(({ stream }) => stream());
  return (await stream).pipeThrough(new DecompressionStream("gzip"));
}

const blobToDir = (blob: Blob) => new TarReader().readFile(blob);

const stream = await fetchSampleBlob("esbuild-wasm");
const blob = await new Response(stream).blob();

console.log(await blobToDir(blob));
