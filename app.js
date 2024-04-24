// Esperar a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function() {
    // Obtener referencias a los elementos del formulario y la lista de tareas
    const formTarea = document.getElementById("formTarea");
    const tituloInput = document.getElementById("titulo");
    const descripcionInput = document.getElementById("descripcion");
    const listaTareas = document.getElementById("listaTareas");
    let tareas = []; // Array para almacenar las tareas
  
    // Función para obtener la fecha y hora actual formateada
    function obtenerFechaHora() {
      const fechaHoraActual = new Date();
      const fecha = fechaHoraActual.toLocaleDateString();
      const hora = fechaHoraActual.toLocaleTimeString();
      return `${fecha} - ${hora}`;
    }
  
    // Función para agregar una nueva tarea
    function agregarTarea(event) {
      event.preventDefault(); // Evitar el comportamiento por defecto del formulario
      const titulo = tituloInput.value.trim();
      const descripcion = descripcionInput.value.trim();
      if (titulo !== "" && descripcion !== "") { // Verificar que los campos no estén vacíos
        // Crear objeto de tarea con la información del formulario
        const nuevaTarea = {
          titulo: titulo,
          descripcion: descripcion,
          fechaHora: obtenerFechaHora(),
          completada: false // Por defecto, la tarea no está completada
        };
  
        // Agregar tarea al principio del array de tareas
        tareas.unshift(nuevaTarea);
  
        // Guardar tareas en localStorage
        localStorage.setItem("tareas", JSON.stringify(tareas));
  
        // Crear elemento de lista de Bootstrap para la nueva tarea
        const nuevaTareaElemento = document.createElement("a");
        nuevaTareaElemento.href = "#";
        nuevaTareaElemento.className = "list-group-item list-group-item-action";
  
        // Contenido HTML de la nueva tarea
        nuevaTareaElemento.innerHTML = `
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${titulo}</h5>
            <small>${obtenerFechaHora()}</small>
          </div>
          <p class="mb-1">${descripcion}</p>
          <div>
            <button class="btn btn-success me-2 btn-completar">Completada</button>
            <button class="btn btn-danger btn-eliminar">Eliminar</button>
          </div>
        `;
  
        // Botón para marcar como completada
        const btnCompletar = nuevaTareaElemento.querySelector(".btn-completar");
        btnCompletar.addEventListener("click", function() {
          // Cambiar el estado de la tarea y actualizar la clase CSS
          nuevaTarea.completada = !nuevaTarea.completada;
          if (nuevaTarea.completada) {
            nuevaTareaElemento.classList.add("tarea-completada");
          } else {
            nuevaTareaElemento.classList.remove("tarea-completada");
          }
          // Actualizar localStorage con las tareas actualizadas
          actualizarLocalStorage();
        });
  
        // Botón para eliminar la tarea
        const btnEliminar = nuevaTareaElemento.querySelector(".btn-eliminar");
        btnEliminar.addEventListener("click", function() {
          // Eliminar la tarea del DOM y del array de tareas
          listaTareas.removeChild(nuevaTareaElemento);
          tareas = tareas.filter(t => t !== nuevaTarea);
          // Actualizar localStorage con las tareas actualizadas
          actualizarLocalStorage();
        });
  
        // Insertar la nueva tarea al principio de la lista
        listaTareas.insertBefore(nuevaTareaElemento, listaTareas.firstChild);
  
        // Limpiar campos de entrada del formulario
        tituloInput.value = "";
        descripcionInput.value = "";
      }
    }
  
    // Función para actualizar localStorage con las tareas actuales
    function actualizarLocalStorage() {
      localStorage.setItem("tareas", JSON.stringify(tareas));
    }
  
    // Función para cargar tareas almacenadas al cargar la página
    function cargarTareas() {
      const tareasGuardadas = localStorage.getItem("tareas");
      if (tareasGuardadas) {
        tareas = JSON.parse(tareasGuardadas);
        tareas.forEach(tarea => {
          // Crear elemento de lista de Bootstrap para cada tarea almacenada
          const nuevaTareaElemento = document.createElement("a");
          nuevaTareaElemento.href = "#";
          nuevaTareaElemento.className = "list-group-item list-group-item-action";
  
          // Contenido HTML de la tarea almacenada
          nuevaTareaElemento.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">${tarea.titulo}</h5>
              <small>${tarea.fechaHora}</small>
            </div>
            <p class="mb-1">${tarea.descripcion}</p>
            <div>
              <button class="btn btn-success me-2 btn-completar">Completada</button>
              <button class="btn btn-danger btn-eliminar">Eliminar</button>
            </div>
          `;
  
          // Marcar como completada si está en estado completado
          if (tarea.completada) {
            nuevaTareaElemento.classList.add("tarea-completada");
          }
  
          // Agregar event listeners a los botones de la tarea para marcar como completada o eliminar
          const btnCompletar = nuevaTareaElemento.querySelector(".btn-completar");
          btnCompletar.addEventListener("click", function() {
            tarea.completada = !tarea.completada;
            if (tarea.completada) {
              nuevaTareaElemento.classList.add("tarea-completada");
            } else {
              nuevaTareaElemento.classList.remove("tarea-completada");
            }
            actualizarLocalStorage();
          });
  
          const btnEliminar = nuevaTareaElemento.querySelector(".btn-eliminar");
          btnEliminar.addEventListener("click", function() {
            listaTareas.removeChild(nuevaTareaElemento);
            tareas = tareas.filter(t => t !== tarea);
            actualizarLocalStorage();
          });
  
          // Insertar la tarea en la lista de tareas
          listaTareas.appendChild(nuevaTareaElemento);
        });
      }
    }
  
    // Escuchar el evento de submit del formulario para agregar una nueva tarea
    formTarea.addEventListener("submit", agregarTarea);
  
    // Cargar tareas almacenadas al cargar la página
    cargarTareas();
  });
  