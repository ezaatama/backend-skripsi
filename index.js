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
const buyerHasUnitRoutes = require("./routes/buyer_has_unit.js");
const multer = require('multer');
const upload = multer();
const BuyerHasUnit = require("./models/buyer_has_units.js");
const Buyer = require("./models/buyer.js");
const TipeProyek = require("./models/tipe_proyek.js");
const Proyek = require("./models/proyek.js");

dotEnv.config();

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Database connected...");
//     // Buyer.sync({alter: true});
//     // TipeProyek.sync({alter: true});
//     // Proyek.sync({alter: true});
//     BuyerHasUnit.sync({alter: true});
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
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public/assets/images', express.static('public/assets/images/'));
app.use('/public/assets/document', express.static('public/assets/document/'));

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})

app.use(authRoutes);
app.use(accountRoutes);
app.use(proyekRoutes);
app.use(tipeProyekRoutes);
app.use(unitsRoutes);
app.use(progressUnitRoutes);
app.use(progressImageRoutes);
app.use(buyerRoutes);
app.use(buyerHasUnitRoutes);

app.listen(process.env.APP_PORT, () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`);
});
