// @ts-ignore
import fileLoader from "./fileLoader.worker?worker";

export default function load(name: string, version?: string) {
  const worker: Worker = new fileLoader();
  worker.onmessage = ({ data: { type, data } }) => {
    switch (type) {
      case "tree":
        console.log(data);
        break;
      case "file":
        const { name, content, binary } = data;
        console.log(name, content, binary);
        break;
      default:
        console.error("Invalid message type of " + type);
    }
  };

  worker.postMessage({ name, version });
}
