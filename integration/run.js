const path = require("path");
const child_process = require("child_process");

run();

function run() {
  child_process.spawn(
    "node",
    [path.join(__dirname, "../dist/server/index.js"), "--port=9000"],
    {
      cwd: path.join(__dirname, "./projects/basic"),
      env: {
        ROOT: path.join(__dirname, "./projects/basic")
      }
    }
  );
}
