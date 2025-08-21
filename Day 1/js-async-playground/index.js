import { retry } from "./retry.js";
import fetch from "node-fetch";

async function fetchData(url) {
  return retry(async () => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`);

    }
    return res.json();
  }, 3, 1000)
}

//Usage 
(async () => {
  try {
    const data = await fetchData("https://jsonplaceholder.typicode.com/tdos/9");
    console.log("Data fetched ", data);
  } catch (error) {
    console.error("Failed after retries:", error.message);
  }
})();
