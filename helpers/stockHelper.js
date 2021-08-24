const fs = require("fs");
const path = require("path");
const moment = require("moment");
const { Stock } = require("../sequelize");

const updateStockTable = (stocks) => {
  stocks.forEach((e, idx) => {
    Stock.update(
      {
        VL: Number(e.open),
        STR_VL: Number(e.open),
        END_VL: Number(e.close),
        LOW_VL: Number(e.low),
        HIGH_VL: Number(e.high),
        AMT: Number(e.amount),
        RATE: Number(e.rate),
      },
      {
        where: {
          STK_CD: e.code,
        },
      }
    );
  });
};

const checkStockMarketTime = () => {
  const MARKET_OPEN_HOUR = 9;
  const MARKET_OPEN_MIN = 0;
  const MARKET_CLOSE_HOUR = 15;
  const MARKET_CLOSE_MIN = 30;
  const SAT = 6;
  const SUN = 0;
  const seoul = moment(new Date()).tz("Asia/Seoul");
  const hour = Number(seoul.format("hh"));
  const minute = Number(seoul.format("mm"));
  const day = seoul.day();

  if (day === SUN || day === SAT) return false;
  if (MARKET_OPEN_HOUR <= hour && hour < MARKET_CLOSE_HOUR) return true;
  else if (MARKET_CLOSE_HOUR === hour && minute < MARKET_CLOSE_MIN) return true;
  else return false;
};

module.exports = {
  updateRealData: () => {
    const dirPath = __dirname.split("/");
    const filePath = `${dirPath
      .splice(0, dirPath.length - 1)
      .join("/")}/stock/stock-real-data.json`;

    setInterval(() => {
      if (!checkStockMarketTime()) {
        console.log(
          `주식 시장이 열린 시간이 아닙니다. [${moment(new Date())
            .tz("Asia/Seoul")
            .format("yyyy-MM-DD hh:mm:ss")}]`
        );
        return;
      }
      console.log("주식 데이터 업데이트가 시작되었습니다.");
      const fileContent = fs.readFileSync(filePath, "utf-8");
      updateStockTable(JSON.parse(fileContent));
    }, 1000 * 10);
  },
};
