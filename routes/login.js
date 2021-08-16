const { Router } = require("express");
const { User } = require("../sequelize");

const router = Router();

router.post("/", function (req, res) {
  const { email, name } = req.body;

  User.findAll({
    where: {
      EMAIL: email,
    },
  }).then((rows) => {
    if (rows.length === 0) {
      User.create({
        EMAIL: email,
        NK: name,
        JN_DT: new Date(),
      });
    } else console.log("기존 가입 유저~");
  });

  res.send("");
});

module.exports = router;
