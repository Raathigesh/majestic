module.exports = async function setup() {
  return new Promise(function(resolve) {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
};
