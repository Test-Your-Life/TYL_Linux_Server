const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const PORT = 80;
const app = express();

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("DB 연결");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(cors());
app.use(express.json());

app.listen(PORT, function () {
  console.log(`포트번호 ${PORT}번에서 서버 동작 중..`);
});

app.get("/", function (req, res) {
  res.send("<h1>틸 세팅 중..</h1>");
});

app.post("/login", function (req, res) {
  console.log(req.body);
  res.send("");
});
