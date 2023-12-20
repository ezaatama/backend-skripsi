const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();

const sequelize = require("./config/databases.js");
const accountRoutes = require("./routes/account.js");
const authRoutes = require("./routes/auth.js");
const proyekRoutes = require("./routes/proyek.js");
const tipeProyekRoutes = require("./routes/tipe_proyek.js");
const unitsRoutes = require("./routes/units.js");
const progressUnitRoutes = require("./routes/progress_unit.js");
const progressImageRoutes = require("./routes/progress_images.js");
const buyerRoutes = require("./routes/buyer.js");
const multer = require("multer");
const upload = multer();
const Buyer = require("./models/buyer.js");
const ProgressImages = require("./models/progress_images.js");
const Accounts = require("./models/accounts.js");
const Proyek = require("./models/proyek.js");
const Units = require("./models/units.js");

dotEnv.config();

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Database connected...");
//     // Units.sync({alter: true});
//     // TipeProyek.sync({alter: true});
//     // Proyek.sync({alter: true});
//     Accounts.sync({alter: true});
//     // user.sync({force: true});
//     // roles.drop();
//     // user.drop();
//   })
//   .catch((err) => {
//     console.error(err);
//   });

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      //jika menggunakan https atur secure jadi true
      //karna disini masih local menggunakan http maka secure jadi false
      secure: false,
      sameSite: "none",
    },
  })
);

const corsOptions = {
  exposedHeaders: ["Authorization", "x-access-token"],
  credentials: true,
  origin: ["https://sandbox-gethome.my.id", "http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/public/assets/images", express.static("public/assets/images/"));
app.use("/public/assets/document", express.static("public/assets/document/"));

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.use(authRoutes);
app.use(accountRoutes);
app.use(proyekRoutes);
app.use(tipeProyekRoutes);
app.use(unitsRoutes);
app.use(progressUnitRoutes);
app.use(progressImageRoutes);
app.use(buyerRoutes);

app.listen(process.env.APP_PORT, () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`);
});
