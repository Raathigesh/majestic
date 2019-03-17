import { Application } from "express";
import { resolve } from "path";

export function initializeStaticRoutes(express: Application) {
  express.get("/", (req, res) =>
    res.sendFile("./ui/index.html", {
      root: resolve(__dirname, "..")
    })
  );
  express.get("/ui.bundle.js", (req, res) =>
    res.sendFile("./ui/ui.bundle.js", {
      root: resolve(__dirname, "..")
    })
  );
  express.get("/favicon.ico", (req, res) =>
    res.sendFile("./ui/favicon.ico", {
      root: resolve(__dirname, "..")
    })
  );
}
