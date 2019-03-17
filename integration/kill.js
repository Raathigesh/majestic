const fkill = require("fkill");

fkill(":9000", {
  force: true,
  tree: true
})
  .then(() => {
    console.log("Killed process");
  })
  .catch(e => {
    console.log("Coudn't kill process: ", e);
  });
