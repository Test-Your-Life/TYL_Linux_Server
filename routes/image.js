const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./utils/db");
const { verifyTokens } = require("./middlewares");

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).single("profile_img");

router.post("/profile", verifyTokens, function (req, res) {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      image: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.get("/stock/:filename", function (req, res) {
  const file = req.params.filename;
  const defaultPath = path.join(__dirname, "../uploads", "default-logo.png");
  const filepath = path.join(__dirname, "../uploads", file);
  const jpgFile = `${filepath}.jpg`;
  const pngFile = `${filepath}.png`;
  const realPath = fs.existsSync(jpgFile)
    ? jpgFile
    : fs.existsSync(pngFile)
    ? pngFile
    : defaultPath;

  res.sendFile(realPath);
});

router.get("/profile", async function (req, res) {
  const { email } = req.query;
  const defaultPath = path.join(__dirname, "../uploads", "default-logo.png");
  const user = await db.getUserByEmail(email);
  if (!user) return res.sendFile(defaultPath);
  const filepath = path.join(
    __dirname,
    "../uploads",
    `${user.USER_ID}_profile`
  );
  const jpgFile = `${filepath}.jpg`;
  const pngFile = `${filepath}.png`;
  const realPath = fs.existsSync(jpgFile)
    ? jpgFile
    : fs.existsSync(pngFile)
    ? pngFile
    : defaultPath;

  res.sendFile(realPath);
});

module.exports = router;
