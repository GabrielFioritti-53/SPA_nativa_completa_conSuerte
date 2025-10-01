import * as UsuarioService from "./services/usuario_services.js";
import * as AuthService from "./services/auth_services.js";

let usuarioEditando = null;
let listadoVisible = true;

const loginDiv = document.getElementById("login");
const appDiv = document.getElementById("app");
const btnLogin = document.getElementById("btnLogin");
const loginNombre = document.getElementById("loginNombre");
const loginAdmin = document.getElementById("loginAdmin");
const btnLogout = document.getElementById("btnLogout");
const contenido = document.getElementById("contenido");
const usuarioNuevo = document.getElementById("nuevoUsuario");
const form = document.getElementById("formUsuario");
const inputNombre = document.getElementById("nombre");
const inputApellido = document.getElementById("apellido");
const inputEmail = document.getElementById("email");
const btnCancelar = document.getElementById("cancelar");
const btnToggleListado = document.getElementById("toggleListado");
const btnIrListado = document.getElementById("irListado");
const tituloListado = document.getElementById("tituloListado");
const lista = document.getElementById("lista");

function toggleListadoElementos(mostrar) {
    if (mostrar) {
        lista.style.display = "block";
        contenido.style.display = "block";
        tituloListado.style.display = "block";
    } else {
        lista.style.display = "none";
        contenido.style.display = "none";
        tituloListado.style.display = "none";
    }
}

function mostrarFormulario(usuario) {
    usuarioEditando = null;
    if (usuario) {
        usuarioEditando = usuario;
        inputNombre.value = usuario.nombre;
        inputApellido.value = usuario.apellido;
        inputEmail.value = usuario.email;
    } else {
        inputNombre.value = "";
        inputApellido.value = "";
        inputEmail.value = "";
    }

    form.style.display = "block";
    toggleListadoElementos(false);
}

function ocultarFormulario() {
    usuarioEditando = null;
    form.style.display = "none";

    if (listadoVisible) {
        toggleListadoElementos(true);
    }
}

function actualizarVistaLogin() {
    const usuario = AuthService.getUsuarioActual();
    if (usuario) {
        loginDiv.style.display = "none";
        appDiv.style.display = "block";
        if (usuario.is_admin) {
            usuarioNuevo.style.display = "inline-block";
        } else {
            usuarioNuevo.style.display = "none";
        }
    } else {
        loginDiv.style.display = "block";
        appDiv.style.display = "none";
    }
}

btnLogin.addEventListener("click", function () {
    const nombre = loginNombre.value.trim();
    const esAdmin = loginAdmin.checked;
    if (!nombre) {
        alert("Ingrese un nombre");
        return;
    }

    AuthService.login(nombre, esAdmin);
    actualizarVistaLogin();
    mostrarListado();
});

btnLogout.addEventListener("click", function () {
    AuthService.logout();
    actualizarVistaLogin();
});

usuarioNuevo.addEventListener("click", function () { mostrarFormulario(); });
btnCancelar.addEventListener("click", function () { ocultarFormulario(); });
btnIrListado.addEventListener("click", function () { ocultarFormulario(); });
btnToggleListado.addEventListener("click", function () {
    listadoVisible = !listadoVisible;
    toggleListadoElementos(listadoVisible);

    if (listadoVisible) {
        btnToggleListado.textContent = "Ocultar Listado";
    } else {
        btnToggleListado.textContent = "Mostrar Listado";
    }
});

async function mostrarListado() {
    try {
        const usuarios = await UsuarioService.getAll();
        contenido.innerHTML = "";
        lista.innerHTML = "";

        usuarios.forEach(function (usuario) {
            const registro = document.createElement("li");

            const infoUsuario = document.createElement("span");
            infoUsuario.textContent = usuario.nombre + " " + usuario.apellido + " - " + usuario.email;

            const btnModificar = document.createElement("button");
            btnModificar.textContent = "Modificar";
            btnModificar.addEventListener("click", async function () {
                const actual = AuthService.getUsuarioActual();
                if (!actual || !actual.is_admin) {
                    alert("Solo admins pueden modificar");
                    return;
                }
                const usuarioCompleto = await UsuarioService.getById(usuario.id_usuario);
                mostrarFormulario(usuarioCompleto);
            });

            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.addEventListener("click", async function () {
                const actual = AuthService.getUsuarioActual();
                if (!actual || !actual.is_admin) {
                    alert("Solo admins pueden eliminar");
                    return;
                }
                await UsuarioService.remove(usuario.id_usuario);
                await mostrarListado();
            });

            registro.appendChild(infoUsuario);
            registro.appendChild(btnModificar);
            registro.appendChild(btnEliminar);
            lista.appendChild(registro);
        });

    } catch (err) {
        console.error("Error en mostrarListado:", err);
        contenido.innerHTML = "<p style='color:red'>No se pudo cargar la lista (ver consola)</p>";
    }
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = inputNombre.value.trim();
    const apellido = inputApellido.value.trim();
    const email = inputEmail.value.trim();

    try {
        if (usuarioEditando) {
            await UsuarioService.update(usuarioEditando.id_usuario, { nombre: nombre, apellido: apellido, email: email });
        } else {
            await UsuarioService.create({ nombre: nombre, apellido: apellido, email: email });
        }
        ocultarFormulario();
        await mostrarListado();
    } catch (err) {
        console.error("Error al guardar usuario:", err);
        alert("Error de red al guardar usuario (ver consola)");
    }
});

actualizarVistaLogin();
if (AuthService.getUsuarioActual()) {
    mostrarListado();
}