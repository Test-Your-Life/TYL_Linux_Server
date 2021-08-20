const express = require("express");
const cors = require("cors");
const { sequelize } = require("./sequelize");
const loginRouter = require("./routes/login");
const tokenRouter = require("./routes/token");

const PORT = 80;
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
app.use(express.json());
app.use("/login", loginRouter);
app.use("/token", tokenRouter);

app.listen(PORT, function () {
  console.log(`포트번호 ${PORT}번에서 서버 동작 중..`);
});

app.get("/", function (req, res) {
  res.send("<h1>틸 세팅 중..</h1>");
});
