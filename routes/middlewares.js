const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyTokens = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    const secret = process.env.JWT_SECRET;
    req.decoded = jwt.verify(token, secret);
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(419).json({
        code: 419,
        message: "토큰이 만료되었습니다.",
      });
    }

    return res.status(401).json({
      code: 401,
      message: "유효하지 않은 토큰입니다.",
    });
  }
};
