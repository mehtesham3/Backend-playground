//Build a simple HTTP server without Express
import http from "http"

const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/plain" });
  //Routing
  if (req.url === "/" && req.method === "GET") {
    res.end("Hey, from NodeJS ");
  } else if (req.url === "/about" && req.method === "POST") {
    res.end("Hii , I'm from the '/about' route ");
  } else {
    res.end("Not-Found");
  }
})

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000/");
})