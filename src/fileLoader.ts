// @ts-ignore
import fileLoader from "./fileLoader.worker?worker";

export default function load(name: string, version?: string) {
  function loadFile() {}
  const worker: Worker = new fileLoader();

  worker.postMessage({ name, version });
  worker.onmessage = ({ data }) => {};
}
