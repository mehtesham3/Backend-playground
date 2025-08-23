//Create a script to read/write JSON files

import { promises as fs } from "fs";
import { json } from "stream/consumers";

/*
//Read JSON file
const rawData = await fs.readFile("simple.json", "utf-8")
let Data;

try {
  Data = JSON.parse(rawData);
} catch (err) {
  console.error(err);
}
console.log(Data);
*/

//Write JSON in a file 
const jsonObj = {
  name: "Mehtesham",
  role: "student",
  location:
  {
    Country: "India",
    State: "Madhya Pradesh",
    City: "Singrauli"
  }
}

await fs.appendFile("simple.json", JSON.stringify(jsonObj, null, 3), (err) => {
  if (err) { throw err };
  console.log("File appended ");
});

// const rawData = await fs.readFile("fake.json", "utf-8")
// let Data;

// try {
//   Data = JSON.parse(rawData);
// } catch (err) {
//   console.error(`Invalid JSON : ${err}`);
// }
// console.log(Data);