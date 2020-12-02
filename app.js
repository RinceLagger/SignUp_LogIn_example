const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { User } = require("./model.js");

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const MONGODB_URI = "mongodb://localhost:27017/signup";

async function connect() {
  try {
    const self = await mongoose.connect(MONGODB_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await self.connection.dropDatabase();
  } catch (e) {
    console.error("Error connecting to the database", error);
  }
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signIn", (req, res) => {
  res.render("signin");
});

app.get("/logIn", (req, res) => {
  res.render("login");
});

app.post("/newUser", async (req, res) => {
  const { user, password } = req.body;
  //console.log(user,password);
  const newUser = {
    userName: user,
    password: password,
  };
  try {
    const datosNewUser = await User.create(newUser);
    //console.log("usuario creado con éxito", datosNewUser.userName, datosNewUser.password);
    res.render("index");
  } catch (e) {
    res.send(`error ${e} -->datos introducidos no correctos`);
  }
});

app.post("/loginData", async (req, res) => {
  const { user, password } = req.body;
  //console.log(user,password);
  const newUser = {
    userName: user,
    password: password,
  };
  try {
    const [datosNewUser] = await User.find({
      userName: newUser.userName,
      password: newUser.password,
    });
    console.log("Logueado!!", datosNewUser);
    if (datosNewUser) res.render("homepage");
    else {
      res.send("usuario o contraseña incorrectos");
    }
  } catch (e) {
    res.send(`error ${e} -->datos no corresponden a ningún usuario`);
  }
});

mongoose.connection.on("connected", () =>
  console.log("Mongoose default connection open")
);
mongoose.connection.on("error", (err) =>
  console.log(`Mongoose default connection error: ${err}`)
);
mongoose.connection.on("disconnected", () =>
  console.log("Mongoose default connection disconnected")
);

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

connect();
app.listen(4000, () => console.log("server running in port 4000"));
