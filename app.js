/*
Universidad Nacional del Oeste
Materia: Programación Web 2
Alumno: Nicolás Agnessi Vuelta
Proyecto: App de Comentarios
Objetivo: El objetivo de esta App es funcionar como un módulo de gestión de comentarios 
que pueda agregarse a un CV Online, permitiendo a los visitantes dejar opiniones sobre el mismo, 
ofrecer capacitaciones u oportunidades laborales, entre otras opciones.
APIS:
  *GET:
    .Mostrar todos los comentarios.
    .Mostrar un comentario indicando su ID.
    .Mostrar los comentarios indicando su email.
  *POST: Agrega un comentario.
  *PUT: Actualiza un comenteario.
  *DELETE: 
    .Elimina un comentario.
    .Eliminar todos los comentarios.
*/

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const { connectToDatabase } = require("./db");
const routes = require("./routes");

connectToDatabase();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Configura de rutas
app.use("/", routes);

//Inicia el servidor en el puerto 3000
app.listen(port, () => {
  console.log(`App escuchando en http://localhost:${port}`);
});
