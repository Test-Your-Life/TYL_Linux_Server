const cron = require("node-cron");
const { updateAssetHistory } = require("./history");
const { updateRealData } = require("./stock");
const { updateCoinRealData } = require("./coin");

module.exports = {
  start: () => {
    updateRealData();
    updateCoinRealData();
    cron.schedule("0 0 * * *", () => {
      updateAssetHistory();
    });
  },
};
