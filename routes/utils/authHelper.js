const { verifyToken } = require("./jwt");

module.exports = {
  verifyAuthorization: (auth) => {
    if (!auth) return { code: 401, message: "로그인이 필요한 서비스입니다." };
    const token = auth.split("Bearer ")[1];
    try {
      const result = verifyToken(token);
      return result.email;
    } catch (error) {
      return { code: 401, message: "계정 정보에 이상이 있습니다." };
    }
  },
};
