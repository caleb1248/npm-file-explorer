import { Buffer } from "buffer";
import { TarReader } from "./tarball";
import { isText } from "./textorbinary";
import { fetchPackage } from "./fetcher";

import fileLoader from "./fileLoader";

interface FolderFile {
  name: string;
  fullPath: string;
  type: "File";
  binary: boolean;
}

interface Folder {
  name: string;
  contents: (FolderFile | Folder)[];
  type: "Folder";
}

function file(name: string, fullPath: string, binary: boolean): FolderFile {
  return { name, fullPath, binary, type: "File" };
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
    const pathSegments = name.split("/"),
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
      file(fileName, name)
    );
    console.log(
      isText(fileName, Buffer.from(reader.getFileBinary("package/" + name)!))
    );
  }

  return JSON.stringify(root.contents, null, 2);
}

const packageTar = await fetchPackage("esbuild-wasm", "0.19.5");

const reader = new TarReader();
// reader.readArrayBuffer(packageTar);
/*@ts-ignore*/
// document.querySelector("pre").innerHTML = fileListToTree(reader);
