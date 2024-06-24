const express = require('express');
const router = express.Router();
const { ObjectId } = require("mongodb");
const { getCollection } = require('../db');

//Ruta que obtiene y muestra comentarios
router.get('/', async (req, res) => {
  try {
    const { id, email } = req.query;
    const coleccion = getCollection();
    let comentarios;
    if (id) {
      comentarios = await coleccion.find({ _id: new ObjectId(id) }).toArray();
    } else if (email) {
      comentarios = await coleccion.find({ email: email }).toArray();
    } else {
      comentarios = await coleccion.find().toArray();
    }
    res.render('index', { comentarios });
  } catch (error) {
    console.error('Error interno del servidor - Error al buscar comentarios: ', error.message);
    res.status(500).send('Error interno del servidor - Error al buscar comentarios: ' + error.message);
  }
});

//Ruta que agrega un comentario
router.post('/agregar', async (req, res) => {
  try {
    const fecha = new Date().toLocaleString();
    const { apellido, nombre, email, asunto, mensaje } = req.body;
    const coleccion = getCollection();
    await coleccion.insertOne({ fecha, apellido, nombre, email, asunto, mensaje });
    res.redirect('/');
  } catch (error) {
    console.error('Error interno del servidor - Error al agregar comentarios: ', error.message);
    res.status(500).send('Error interno del servidor - Error al agregar comentarios: ' + error.message);
  }
});

//Ruta que actualiza un comentario
router.put('/editar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { apellido, nombre, email, asunto, mensaje } = req.body;
    const coleccion = getCollection();
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
    console.error('Error interno del servidor - Error al actualizar comentarios: ', error.message);
    res.status(500).send('Error interno del servidor - Error al actualizar comentarios: ' + error.message);
  }
});

//Ruta que elimina un comentario
router.delete('/eliminar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const coleccion = getCollection();
    const result = await coleccion.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.status(200).send('Comentario eliminado');
    } else {
      res.status(404).send('Comentario no encontrado');
    }
  } catch (error) {
    console.error('Error interno del servidor - Error al eliminar comentarios: ', error.message);
    res.status(500).send('Error interno del servidor - Error al eliminar comentarios: ' + error.message);
  }
});

module.exports = router;