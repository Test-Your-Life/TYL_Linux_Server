// const fetch = require("node-fetch");
const axios = require("axios");
const { Coin } = require("./sequelize");

// const url =
//   "https://api.upbit.com/v1/candles/minutes/1?market=KRW-BTC&count=365";
const url = "https://api.upbit.com/v1/market/all?isDetails=false";
// const url = "https://api.upbit.com/v1/ticker?markets=KRW-BTC";
// const url2 = "https://api.upbit.com/v1/ticker?markets=KRW-BCHA";
// const url3 = "https://api.upbit.com/v1/ticker?markets=KRW-POLY";

axios.get(url).then((res) => {
  // console.log(res.data);
  const krw = res.data.filter((e) => e.market.match(/KRW/));
  console.log(krw);
  console.log(res.headers["remaining-req"]);
  krw.forEach((e) => {
    Coin.create({
      COIN_CD: e.market,
      COIN_NM: e.korean_name,
    });
  });
});
