import fs from "fs"

fs.readFile("example.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading a file ", err);
    return;
  }
  console.log("Reading file data : ", data);

  fs.writeFile('copy.txt', data, (err) => {
    if (err) {
      console.error("Error : ", err);
      return;
    }
    console.log("File compied successfully ");

  })
})

console.log("This run immediately ");

