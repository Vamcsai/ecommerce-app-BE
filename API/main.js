import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import session from "express-session";
import { promisify } from "util";
import path, { dirname } from "path";
import { signUp, getUsers, login, addBook, getbooks } from "./db.js";

const app = express();
const port = 3001;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.listen(port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "my-ecommerce-app",
    cookie: {
      path: "/",
      secure: false,
      maxAge: 30000,
    },
    saveUninitialized: false,
    resave: false,
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./cover-images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1048576 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
    }
  },
}).single("bookimage");

app.get("/api/authuser", (req, res) => {
  if (req.session.user) {
    res.status(200).json({
      result: {
        username: req.session.user.username,
        userrole: req.session.user.userrole,
      },
    });
  } else {
    res.status(401).json({ result: "no user" });
  }
});

app.post("/api/signup", (req, res) => {
  const userData = req.body.userdata;
  signUp(userData, res);
});

app.get("/api/getusers", (req, res) => {
  getUsers(res);
});

app.post("/api/login", (req, res) => {
  const userData = req.body.userdata;
  login(req, userData, res);
});

app.get("/api/signout", (req, res) => {
  req.session.destroy();
  if (req.session) {
    res.status(400).json({
      result: {
        username: req.session.user.username,
        userrole: req.session.user.userrole,
      },
    });
  } else {
    res.sendStatus(200);
  }
});

app.post("/api/addbook", (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      res.status(500).json({ result: err.message });
    } else if (err) {
      res.status(500).json({ result: err.message });
    } else {
      const bookImage = fs.readFileSync(req.file.path);
      const bufferBookImage = new Buffer(bookImage);
      const bookData = {
        bookName: req.body.bookname,
        bookAuthor: req.body.bookauthor,
        bookPrice: req.body.bookprice,
        bookImage: bufferBookImage,
      };
      const removeFile = promisify(fs.unlink);
      await removeFile(req.file.path);
      addBook(bookData, res);
    }
  });
});

app.get("/api/getbooks", (req, res) => {
  getbooks(req, res);
});
