const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = process.env.PORT || 3000;
const root = __dirname;

const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const relative = urlPath === "/" ? "index.html" : path.normalize(urlPath).replace(/^([/\\])+/, "");
    const filePath = path.join(root, relative);

    if (!filePath.startsWith(root)) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
        return;
      }

      const ext = path.extname(filePath);
      res
        .writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" })
        .end(data);
    });
  })
  .listen(port, () => {
    console.log(`Age Calculator running at http://localhost:${port}`);
  });
