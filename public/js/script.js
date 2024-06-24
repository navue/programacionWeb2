//Función que muestra y ocultar el formulario de edición
function mostrarFormularioEditar(id) {
  const formulario = document.getElementById(`formulario-editar-${id}`);
  if (formulario.style.display === "none" || formulario.style.display === "") {
    formulario.style.display = "table-row";
  } else {
    formulario.style.display = "none";
  }
}

//Función que edita un comentario
function editarComentario(event, id) {
  event.preventDefault();

  const form = document.getElementById(`editarComentarioForm-${id}`);
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  fetch(`/editar/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        window.location.reload();
      } else {
        alert("Error al actualizar el comentario");
      }
    })
    .catch((error) => {
      console.error("Error al actualizar el comentario:", error);
    });
}

//Función que elimina un comentario
function eliminarComentario(id) {
  fetch(`/eliminar/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        window.location.reload();
      } else {
        alert("Error al eliminar el comentario");
      }
    })
    .catch((error) => {
      console.error("Error al eliminar el comentario:", error);
    });
}

//Función que elimina todos los comentario
function eliminarTodos() {
  fetch(`/eliminarTodos`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        window.location.reload();
      } else {
        alert("Error al eliminar los comentario");
      }
    })
    .catch((error) => {
      console.error("Error al eliminar los comentario:", error);
    });
}

//Reestablece el formulario de agregar comentario
document.getElementById("reestablecerBtn").addEventListener("click", () => {
  document.getElementById("insertarComentarioForm").reset();
});
