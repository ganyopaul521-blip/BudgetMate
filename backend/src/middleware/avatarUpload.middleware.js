const fs = require("fs");
const path = require("path");
const multer = require("multer");

const AVATARS_DIR = path.join(__dirname, "../../uploads/avatars");
fs.mkdirSync(AVATARS_DIR, { recursive: true });

const EXTENSIONS_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, AVATARS_DIR),
  filename: (req, file, cb) => {
    const ext = EXTENSIONS_BY_MIME[file.mimetype] || path.extname(file.originalname) || "";
    cb(null, `${req.userId}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!EXTENSIONS_BY_MIME[file.mimetype]) {
      cb(new Error("INVALID_FILE_TYPE"));
      return;
    }
    cb(null, true);
  },
}).single("avatar");

/** Wraps multer so its errors become curated, user-safe messages via the shared error handler. */
function avatarUpload(req, res, next) {
  upload(req, res, (err) => {
    if (!err) {
      next();
      return;
    }
    res.status(400);
    if (err.code === "LIMIT_FILE_SIZE") {
      next(new Error("Image must be smaller than 5MB."));
    } else if (err.message === "INVALID_FILE_TYPE") {
      next(new Error("Please upload a JPG, PNG, or WebP image."));
    } else {
      next(new Error("Could not upload image. Please try again."));
    }
  });
}

module.exports = { avatarUpload, AVATARS_DIR };
