import * as exp from "express";
import { resolve, join } from "path";
import { pubsub } from "./event-emitter";

export function initializeStaticRoutes(express: exp.Application, root: string) {
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
  express.get("/logo.png", (req, res) =>
    res.sendFile("./ui/logo.png", {
      root: resolve(__dirname, "..")
    })
  );

  pubsub.subscribe("WorkspaceInitialized", ({ coverageDirectory }) => {
    if (coverageDirectory && coverageDirectory.trim() !== "") {
      express.use("/coverage", exp.static(coverageDirectory));
    }
  });
}
