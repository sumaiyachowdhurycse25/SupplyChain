const { trainModel } = require("./nlpModel");

(async () => {
  await trainModel();
  console.log("✅ NLP trained");
})();
