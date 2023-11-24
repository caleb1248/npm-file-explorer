import fileLoader from "./fileLoader";
import { Buffer } from "buffer";
fileLoader("lodash", {
  onTree(tree) {
    document.body.innerHTML += `<pre>${JSON.stringify(tree, null, 2)}</pre>`;
  },
  onFile(file) {
    // do stuff with file
    // document.body.innerHTML += Buffer.from(file.content).toString("binary");
  },
});
