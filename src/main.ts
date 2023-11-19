import { TarReader } from "./tarball";

async function fetchLatest(name: string) {
  const res = await fetch(`https://registry.npmjs.org/${name}/latest`);
  const { version } = await res.json();
  return version;
}

async function fetchSampleBlob(packageName: string, version?: string) {
  const pkgVersion = version || (await fetchLatest(packageName));
  const res = await fetch(
    `https://registry.npmjs.org/${packageName}/-/${packageName}-${pkgVersion}.tgz`
  );

  if (res.status === 404 || !res.body) throw "Failed to fetch package";

  return await new Response(
    res.body.pipeThrough(new DecompressionStream("gzip"))
  ).arrayBuffer();
}

const packageTar = await fetchSampleBlob("esbuild-wasm");

const reader = new TarReader();
const result = reader.readArrayBuffer(packageTar);

console.log(result);
