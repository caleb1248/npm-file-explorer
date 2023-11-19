import { TarReader } from "./tarball";

interface FileLike {
  name: string;
  type: string;
}

interface FolderFile extends FileLike {
  content: string;
  type: "File";
}

interface Folder extends FileLike {}
function file(name: string, content: Blob) {
  return { name, content };
}

function folder(name: string): {
  name: string;
  contents: (ReturnType<typeof file> | ReturnType<typeof folder>)[];
} {
  return { name, contents: [] };
}

function fileListToTree(reader: TarReader) {
  const nameList = reader.fileInfo.map(({ name }) =>
    name.replace("package/", "")
  );

  const root = folder("");

  for (const name of nameList) {
  }
}

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
