const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { encode } = require("blurhash");
const path = require("path");
const sharp = require("sharp");
const { ImageSchema } = require("./image");
const sizeOf = require("image-size");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads/")));

mongoose.connect("mongodb://0.0.0.0:27017/BlurHash");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB connected...");
});

// =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    // 3746674586-836534453.png
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 * 15 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
    }
  },
});

// =====================

const encodeImageToBlurhash = (path) =>
  new Promise((resolve, reject) => {
    sharp(path)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: "inside" })
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return reject(err);
        resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
      });
  });

app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    // Check if file is present in the request
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const dimensions = sizeOf(req.file.path);
    const blurhashString = await encodeImageToBlurhash(req.file.path);

    const data = await ImageSchema.create({
      hash: blurhashString,
      url: req.file.path,
      width: dimensions.width,
      height: dimensions.height,
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
});

///
app.get("/api", (req, res) => res.send("Hello Server!"));

app.get("/api/getImage", async (req, res) => {
  try {
    const data = await ImageSchema.find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

app.listen(5500, () => console.log("Server listening on port 5500"));
