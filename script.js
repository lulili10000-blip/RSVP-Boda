// ==========================================================
// COUNTDOWN EN TIEMPO REAL
// ==========================================================
// Fecha/hora de la ceremonia: 16 de octubre de 2026, 19:00 hs (hora de Uruguay, UTC-3).
var fechaBoda = new Date('2026-10-16T19:00:00-03:00').getTime();

var elDias = document.getElementById('cd-dias');
var elHoras = document.getElementById('cd-horas');
var elMinutos = document.getElementById('cd-minutos');
var elSegundos = document.getElementById('cd-segundos');

function dosDigitos(n) {
    return String(n).padStart(2, '0');
}

function actualizarCountdown() {
    var ahora = new Date().getTime();
    var restante = fechaBoda - ahora;

    if (restante <= 0) {
        elDias.textContent = '00';
        elHoras.textContent = '00';
        elMinutos.textContent = '00';
        elSegundos.textContent = '00';
        clearInterval(intervalo);
        return;
    }

    var dias = Math.floor(restante / (1000 * 60 * 60 * 24));
    var horas = Math.floor((restante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutos = Math.floor((restante % (1000 * 60 * 60)) / (1000 * 60));
    var segundos = Math.floor((restante % (1000 * 60)) / 1000);

    elDias.textContent = dosDigitos(dias);
    elHoras.textContent = dosDigitos(horas);
    elMinutos.textContent = dosDigitos(minutos);
    elSegundos.textContent = dosDigitos(segundos);
}

actualizarCountdown();
var intervalo = setInterval(actualizarCountdown, 1000);

// ==========================================================
// MOSTRAR/OCULTAR EL SELECTOR DE CANTIDAD SEGÚN LA URL
// ==========================================================
// Ejemplo:
//   tu-pagina.com/index.html?acompanante=si  -> invitado CON +1, muestra el selector
//   tu-pagina.com/index.html                 -> invitado SIN +1, lo oculta
var params = new URLSearchParams(window.location.search);
var tieneAcompanante = params.get('plus') === 'si';

var campoCantidad = document.getElementById('campo-cantidad');
var selectCantidad = document.getElementById('cantidad');

if (!tieneAcompanante) {
    campoCantidad.hidden = true;     // lo saca de la vista
    selectCantidad.required = false; // y deja de ser obligatorio, si no el form nunca se podría enviar
}

// ==========================================================
// ENVÍO DEL FORMULARIO A GOOGLE SHEETS
// ==========================================================
var URL_SCRIPT = "https://script.google.com/macros/s/AKfycbz7eK3dPC5bqwQhKrH5q7nbS2nq7RIh6ZDueoMs9d7yZssN-OGiXMl9FEc7KQgoq235uA/exec";

var form = document.getElementById('form-rsvp');
var mensaje = document.getElementById('form-mensaje');

form.addEventListener('submit', function (e) {
    e.preventDefault(); // evita que la página recargue/navegue a ningún lado

    if (!form.checkValidity()) {
        form.reportValidity(); // muestra los errores nativos del navegador
        return;
    }

    var datos = {
        tipo: tieneAcompanante ? "con +1" : "sin +1",
        concurrencia: form.concurrencia.value,
        cantidad: tieneAcompanante ? form.cantidad.value : "1", // sin +1 siempre es 1 persona
        nombre: form.nombre.value,
        alimentos: form.alimentos.value,
        cancion: form.cancion.value
    };

    // NOTA: mode: 'no-cors' significa que no podemos leer si Google realmente
    // guardó el dato o no; el mensaje de éxito se muestra apenas se envía la
    // petición, no cuando se confirma que se guardó.
    fetch(URL_SCRIPT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(datos)
    }).then(function () {
        form.hidden = true;
        mensaje.hidden = false;
    });
});

// ==========================================================
// COPIAR DATOS DE LA CUENTA BANCARIA
// ==========================================================
var checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

document.querySelectorAll('.btn-copy').forEach(function (btn) {
    var original = btn.innerHTML;
    btn.addEventListener('click', function () {
        navigator.clipboard.writeText(btn.dataset.copy).then(function () {
            btn.innerHTML = checkIcon;
            btn.classList.add('copiado');
            setTimeout(function () {
                btn.innerHTML = original;
                btn.classList.remove('copiado');
            }, 1500);
        });
    });
});