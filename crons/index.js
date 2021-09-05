const cron = require("node-cron");
const { updateAssetHistory } = require("./history");
const { updateRealData, updatePredictionData } = require("./stock");
const { updateCoinRealData } = require("./coin");

module.exports = {
  start: () => {
    updateRealData();
    updateCoinRealData();
    updatePredictionData();
    cron.schedule("0 0 * * *", () => {
      updateAssetHistory();
    });
  },
};
