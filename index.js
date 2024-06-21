const express = require('express');
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const { MONGODB_USR, MONGODB_PWD } =  require("./config.js");
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const uri = "mongodb+srv://" + MONGODB_USR + ":" + MONGODB_PWD + "@cluster0.rntnac4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
let database;
let coleccion;

async function connectToDatabase() {
  try {
    await client.connect();
    database = client.db("db");
    coleccion = database.collection("comentarios");
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
}

connectToDatabase();

app.set("view engine", "ejs");
app.use(express.static('img'));
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  try {
    let comentarios;
    const id = req.query.id;
    const email = req.query.email;
    if (id) {
      comentarios = await coleccion.find({ _id: new ObjectId(id) }).toArray();
    } else if (email) {
      comentarios = await coleccion.find({ email: email }).toArray();
    } else {
      comentarios = await coleccion.find().toArray();
    }
    res.render('index', { comentarios });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/agregar', async (req, res) => {
  try {
    const fecha = new Date().toLocaleString();
    const { apellido, nombre, email, asunto, mensaje } = req.body;
    await coleccion.insertOne({ fecha, apellido, nombre, email, asunto, mensaje });
    res.redirect('/');
  } catch (error) {
    console.error('Error al insertar el comentario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.put('/editar/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { apellido, nombre, email, asunto, mensaje } = req.body;
    const result = await coleccion.updateOne(
      { _id: new ObjectId(id) },
      { $set: { apellido, nombre, email, asunto, mensaje } }
    );
    if (result.matchedCount === 1) {
      res.status(200).send('Comentario actualizado');
    } else {
      res.status(404).send('Comentario no encontrado');
    }
  } catch (error) {
    console.error('Error al actualizar el comentario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.delete('/eliminar/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await coleccion.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.status(200).send('Comentario eliminado');
    } else {
      res.status(404).send('Comentario no encontrado');
    }
  } catch (error) {
    console.error('Error al eliminar el comentario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(port, () => {
  console.log(`App escuchando en http://localhost:${port}`);
});

/*const express = require("express");
const path = require("path");
const ejs = require("ejs");
const { MongoClient, ObjectId } = require("mongodb");
const { MONGODB_USR, MONGODB_PWD } =  require("./config.js");

const app = express();
const uri = "mongodb+srv://" + MONGODB_USR + ":" + MONGODB_PWD + "@cluster0.rntnac4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
const database = client.db("db");
const comentarios = database.collection("comentarios");

app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'img')));
app.set("view engine", "html");
app.engine('html', require('ejs').renderFile);
app.set("views", path.join(__dirname, "/"));

app.get("/", async (req, res) => {
  res.render("index", {
    comentarios : await comentarios.find({}).toArray()
  });
});

app.get("/comentarios/:id", async (req, res) => {
  const { id } = req.params;
  const respuesta = await comentarios.findOne({ _id: new ObjectId(id) });
  res.json(respuesta);
});

app.get("/comentariosPorEmail/:email", async (req, res) => {
  const { email } = req.params;
  const respuesta = await comentarios.find({ email: email }).toArray();
  res.json(respuesta);
});

app.post("/", async (req, res) => {
  const fecha = new Date().toLocaleString();
  const { apellido, nombre, email, asunto, mensaje } = req.body;
  console.log({ fecha, apellido, nombre, email, asunto, mensaje })
  await comentarios.insertOne({ fecha, apellido, nombre, email, asunto, mensaje });
  res.render("index", {
    comentarios : await comentarios.find({}).toArray()
  });
});

app.put("/comentarios/:id", async (req, res) => {
  const { id } = req.params;
  const { fecha, apellido, nombre, email, asunto, mensaje } = req.body;
  await comentarios.updateOne(
    { _id: new ObjectId(id) },
    { $set: { fecha, apellido, nombre, email, asunto, mensaje } });
  res.json({ message: "Comentario actualizado correctamente." });
});

app.delete("/comentarios", async (req, res) => {
  await comentarios.deleteOne({ _id: new ObjectId(req.body) });
  res.render("index", {
    comentarios : await comentarios.find({}).toArray()
  });
});

app.delete("/comentariosPorEmail/:email", async (req, res) => {
  const { email } = req.params;
  await comentarios.deleteMany({ email: email });
  res.json({ message: "Comentarios eliminados correctamente." });
});

app.listen(3000);
console.log("Servidor en el puerto 3000");*/