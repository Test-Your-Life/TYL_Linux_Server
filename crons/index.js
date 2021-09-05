const cron = require("node-cron");
const { updateAssetHistory } = require("./history");
const { updateRealData, updatePredictionData } = require("./stock");
const { updateCoinRealData } = require("./coin");

module.exports = {
  start: () => {
    updateRealData();
    updateCoinRealData();
    cron.schedule("0 0 * * *", () => {
      updateAssetHistory();
      // updatePredictionData();
    });
  },
};
