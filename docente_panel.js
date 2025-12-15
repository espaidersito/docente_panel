

const docenteLogueado = localStorage.getItem('docente');

if (!docenteLogueado) {
  alert('Acceso restringido. Iniciá sesión primero.');
  window.location.href = 'login_docentes.html';
} else {
  const nombreDocentePC = document.getElementById('nombreDocente');
  const nombreDocenteMobile = document.getElementById('nombreDocenteOff');

  if (nombreDocentePC) nombreDocentePC.textContent = docenteLogueado;
  if (nombreDocenteMobile) nombreDocenteMobile.textContent = docenteLogueado;
}



function cerrarSesionDocente() {
  localStorage.removeItem('docente');
  localStorage.removeItem('registro_id');
  window.location.href = 'login_docentes.html';
}

const botonCerrarPC = document.getElementById('cerrarSesion');
if (botonCerrarPC) {
  botonCerrarPC.addEventListener('click', cerrarSesionDocente);
}

const botonCerrarMobile = document.getElementById('cerrarSesionOff');
if (botonCerrarMobile) {
  botonCerrarMobile.addEventListener('click', cerrarSesionDocente);
}


async function cargarPuntos() {
  try {
    const url = 'https://juegosinfantiles.tecnica4berazategui.edu.ar/essencial/excepcional/obtener_puntos.php';
    const respuesta = await fetch(url);
    const listaUsuarios = await respuesta.json();

  
    const cuerpoTabla = document.querySelector('#tablaPuntos tbody');

    if (cuerpoTabla) {
      cuerpoTabla.replaceChildren();

      if (!Array.isArray(listaUsuarios) || listaUsuarios.length === 0) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.colSpan = 4;
        celda.textContent = 'No hay registros aún.';
        fila.appendChild(celda);
        cuerpoTabla.appendChild(fila);
      } else {
        listaUsuarios.forEach(usuario => {
          const fila = document.createElement('tr');

          const celdaNombre = document.createElement('td');
          celdaNombre.textContent = usuario.nombre;

          const celdaPuntos = document.createElement('td');
          celdaPuntos.id = `puntos-${usuario.id}`;
          celdaPuntos.textContent = usuario.puntos;

          const celdaFecha = document.createElement('td');
          celdaFecha.textContent = usuario.ultima_actualizacion;

          const celdaAcciones = document.createElement('td');

          fila.append(
            celdaNombre,
            celdaPuntos,
            celdaFecha,
            celdaAcciones
          );

          cuerpoTabla.appendChild(fila);
        });
      }
    }

  
    const contenedorMobile = document.getElementById('tablaPuntosMobile');

    if (contenedorMobile) {
      contenedorMobile.replaceChildren();

      if (!Array.isArray(listaUsuarios) || listaUsuarios.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.className = 'text-center text-muted';
        mensaje.textContent = 'No hay registros aún.';
        contenedorMobile.appendChild(mensaje);
      } else {
        listaUsuarios.forEach(usuario => {
          const tarjeta = document.createElement('div');
          tarjeta.className = 'card mb-2 shadow-sm';

          const cuerpoTarjeta = document.createElement('div');
          cuerpoTarjeta.className = 'card-body';

          const titulo = document.createElement('h5');
          titulo.className = 'card-title mb-1';
          titulo.textContent = usuario.nombre;

          const parrafoPuntos = document.createElement('p');
          parrafoPuntos.className = 'mb-1';

          const textoPuntos = document.createElement('strong');
          textoPuntos.textContent = 'Puntos: ';

          const valorPuntos = document.createElement('span');
          valorPuntos.id = `mobile-puntos-${usuario.id}`;
          valorPuntos.textContent = usuario.puntos;

          parrafoPuntos.append(textoPuntos, valorPuntos);

          const parrafoFecha = document.createElement('p');
          parrafoFecha.className = 'mb-2 text-muted small';
          parrafoFecha.textContent = `Última: ${usuario.ultima_actualizacion}`;

          const contenedorBotones = document.createElement('div');
          contenedorBotones.className = 'd-flex gap-2';

          const botonSumar = document.createElement('button');
          botonSumar.className = 'btn btn-sm btn-success flex-fill';
          botonSumar.textContent = '+1';
          botonSumar.addEventListener('click', () => {
            actualizarPuntosUsuario(usuario.id, 1);
          });

          const botonRestar = document.createElement('button');
          botonRestar.className = 'btn btn-sm btn-danger flex-fill';
          botonRestar.textContent = '-1';
          botonRestar.addEventListener('click', () => {
            actualizarPuntosUsuario(usuario.id, -1);
          });

          contenedorBotones.append(botonSumar, botonRestar);
          cuerpoTarjeta.append(
            titulo,
            parrafoPuntos,
            parrafoFecha,
            contenedorBotones
          );

          tarjeta.appendChild(cuerpoTarjeta);
          contenedorMobile.appendChild(tarjeta);
        });
      }
    }

  } catch (error) {
    console.error('Error al cargar puntos:', error);
  }
}


async function actualizarPuntosUsuario(idUsuario, cambioPuntos) {
  try {
    const datosFormulario = new FormData();
    datosFormulario.append('usuario_id', idUsuario);
    datosFormulario.append('puntos', cambioPuntos);

    const url = 'https://juegosinfantiles.tecnica4berazategui.edu.ar/essencial/excepcional/actualizar_puntos.php';

    await fetch(url, {
      method: 'POST',
      body: datosFormulario
    });

    await cargarPuntos();

  } catch (error) {
    console.error('Error al actualizar puntos:', error);
  }
}



document.addEventListener('DOMContentLoaded', () => {
  cargarPuntos();
  setInterval(cargarPuntos, 10000);
});
