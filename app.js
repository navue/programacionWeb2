const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const { connectToDatabase } = require("./db");
const routes = require("./routes");

connectToDatabase();

app.set("view engine", "ejs");
app.use(express.static('img'));
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Configura de rutas
app.use("/", routes);

//Inicia el servidor en el puerto 3000
app.listen(port, () => {
  console.log(`App escuchando en http://localhost:${port}`);
});