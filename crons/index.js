const cron = require("node-cron");
const { updateAssetHistory } = require("./history");
const { updateRealData } = require("./stock");

module.exports = {
  start: () => {
    // updateAssetHistory();
    updateRealData();
    cron.schedule("0 0 * * *", () => {
      updateAssetHistory();
    });
  },
};
