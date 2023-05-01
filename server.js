/**
 * @file quick static file server
 * bare minimum
 */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const host = "localhost";
const port = 8888;
const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".woff": "application/font-woff",
  ".ttf": "application/font-ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "application/font-otf",
  ".wasm": "application/wasm",
  ".txt": "text/plain",
};

http
  .createServer((req, res) => {
    let p = path.normalize(req.url ?? "/");
    if (p.endsWith("/")) {
      p = path.normalize(p + "index.html");
    }
    if (!p.startsWith("..")) {
      if (p.startsWith("/")) {
        p = "." + p;
      }
      fs.readFile(p, (err, content) => {
        if (err) {
          if ((err.code = "ENOENT")) {
            res.writeHead(404);
            res.end("404 file not found", "utf-8", () =>
              console.log(`${p} ${err.code} 404`)
            );
            return;
          }
          res.writeHead(500);
          res.end("sorry error", "utf-8", () =>
            console.log(`${p} ${err.code} 500`)
          );
          return;
        }
        res.writeHead(200, {
          "Content-Type":
            mimeTypes[path.extname(p)] || "application/octet-stream",
        });
        res.end(content, "utf-8", () => console.log(`${p} 200`));
      });
    } else {
      res.writeHead(404);
      res.end("404 file not found", "utf-8", () => console.log(`${p} 404`));
    }
  })
  .listen(port, host, () =>
    console.log(`node http server💪 running at http://${host}:${port}`)
  );
