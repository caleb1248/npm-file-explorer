import { TarReader } from "./tarball";

interface FolderFile {
  name: string;
  content: Blob;
  type: "File";
}

interface Folder {
  name: string;
  contents: (FolderFile | Folder)[];
  type: "Folder";
}

function file(name: string, content: Blob): FolderFile {
  return { name, content, type: "File" };
}

function folder(name: string): Folder {
  return { name, contents: [], type: "Folder" };
}

function fileListToTree(reader: TarReader) {
  const nameList = reader.fileInfo.map(({ name }) =>
    name.replace("package/", "")
  );

  const root = folder("");

  for (const name of nameList) {
    const pathSegments = name.split(""),
      fileName = pathSegments.pop()!;

    let currentFolder = root;

    for (const segment of pathSegments)
      currentFolder = (currentFolder.contents.find(
        ({ name }) => name === segment
      ) ||
        currentFolder.contents[
          currentFolder.contents.push(folder(segment)) - 1
        ]) as Folder;

    currentFolder.contents.push(
      //@ts-ignore
      file(fileName, reader.getFileBlob("package/" + name)!)
    );
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
reader.readArrayBuffer(packageTar);

console.log(fileListToTree(reader));
