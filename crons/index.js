const cron = require("node-cron");
const { updateAssetHistory } = require("./history");

module.exports = {
  start: () => {
    // updateAssetHistory();
    cron.schedule("0 15 * * *", () => {
      updateAssetHistory();
    });
  },
};
