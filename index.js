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