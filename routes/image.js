const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const router = Router();
const { verifyTokens } = require("./middlewares");

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

router.get('/stock/:filename', function(req,res) {
  const file = req.params.filename;
  const defaultPath = path.join(__dirname, "../uploads", 'default-logo.png' );
  const filepath = path.join(__dirname, "../uploads", file );
  const jpgFile = `${filepath}.jpg`;
  const pngFile = `${filepath}.png`;
  const realPath = fs.existsSync(jpgFile) ? jpgFile : fs.existsSync(pngFile) ? pngFile : defaultPath;

  res.sendFile(realPath);
});

module.exports = router;
