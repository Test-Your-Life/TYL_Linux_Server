module.exports = {
  getTotalAssetData: (assets) => {
    let cash;
    let stock = { stockList: [], stockAsset: 0, stockProfit: 0 };
    let coin = { coinList: [], coinAsset: 0, coinProfit: 0 };

    const assetSum = assets.reduce((acc, cur) => {
      const asset = cur.PRC * cur.CNT;
      const profit = asset - cur.TOT;

      if (cur.CNT > 0) {
        if (cur.TRS_TP === "CASH") cash = { amount: cur.PRC };
        else if (cur.TRS_TP === "STOCK") {
          stock.stockList.push({
            code: cur.ASS_CD,
            name: cur.TRS_NM,
            price: cur.PRC,
            quantity: cur.CNT,
            profit: profit,
          });
          stock.stockProfit += profit;
          stock.stockAsset += asset;
        } else if (cur.TRS_TP === "COIN") {
          coin.coinList.push({
            code: cur.ASS_CD,
            name: cur.TRS_NM,
            price: cur.PRC,
            quantity: cur.CNT,
            profit: profit,
          });
          coin.coinProfit += profit;
          coin.coinAsset += asset;
        }
      }
      return acc + cur.PRC * cur.CNT;
    }, 0);

    return {
      asset: assetSum,
      cash: cash,
      stock: stock,
      coin: coin,
    };
  },
};
