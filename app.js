const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { sequelize } = require("./sequelize");
const authRouter = require("./routes/auth");
const tokenRouter = require("./routes/token");
const assetRouter = require("./routes/asset");
const rankRouter = require("./routes/rank");
const stockRouter = require("./routes/stock");

const { updateRealData } = require("./helpers/stockHelper.js");
const PORT = 4000;
const app = express();

sequelize
  .sync()
  .then(() => {
    console.log("DB 연결");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

updateRealData();

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./build")));
app.use("/auth", authRouter);
app.use("/token", tokenRouter);
app.use("/asset", assetRouter);
app.use("/rank", rankRouter);
app.use("/stock", stockRouter);

app.listen(PORT, function () {
  console.log(`포트번호 ${PORT}번에서 서버 동작 중..`);
});

app.get("/", function (req, res) {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});
