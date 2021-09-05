const axios = require("axios");
const { Coin } = require("../sequelize");
module.exports = {
  updateCoinRealData: async () => {
    const markets = await Coin.findAll({ order: [["AMT", "DESC"]] });
    const query = markets.reduce(
      (acc, cur) => `${acc}&markets=${cur.COIN_CD}`,
      ""
    );

    setInterval(() => {
      axios
        .get(`https://api.upbit.com/v1/ticker?${query}`)
        .then((res) => {
          console.log("비트 코인 데이터가 업데이트되었습니다.");
          const datas = res.data;
          datas.forEach((data) => {
            Coin.update(
              {
                VL: data.trade_price,
                STR_VL: data.opening_price,
                END_VL: data.trade_price,
                LOW_VL: data.low_price,
                HIGH_VL: data.high_price,
                AMT: data.acc_trade_price_24h,
              },
              {
                where: {
                  COIN_CD: data.market,
                },
              }
            );
          });
        })
        .catch((err) => {});
    }, 3000);
  },
};
