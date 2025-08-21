import fs from "fs"
import util from "util"

function freadFilePromise(path, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) {
        reject("Error : ", err);
        return;
      }
      resolve("Data : ", data);
    })
  })
}
function fwriteFilePromise(filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, (err) => {
      if (err) {
        reject("Error : ", err);
        return;
      }
      resolve("Copied successfully");
    })
  })
}

const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);

readFilePromise("example.txt", "utf-8")
  .then((data) => {
    console.log("Data : ", data);
    return writeFilePromise("copy.txt", data)
  })
  .then(() => {
    console.log('File copied successfully!');
  })
  .catch((error) => {
    console.error("An error occured : ", error);
  })

console.log("This runs immediately!");