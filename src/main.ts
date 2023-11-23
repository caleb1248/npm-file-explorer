import fileLoader from "./fileLoader";
fileLoader("esbuild-wasm");
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
