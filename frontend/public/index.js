import { getAll, getById, erase, update } from "../services/usuario.js";
import { register, login } from "./services/auth.js";

/* ----------------------------
   DOM: botones, listas (listas primero)
   ---------------------------- */
const btnList = document.getElementById("btn-list");
const btnCreate = document.getElementById("btn-create");
const btnLogin = document.getElementById("btn-login");
const btnRegister = document.getElementById("btn-register");

const sections = {
  list: document.getElementById("section-list"),
  create: document.getElementById("section-create"),
  edit: document.getElementById("section-edit"),
  login: document.getElementById("section-login"),
  register: document.getElementById("section-register"),
};

const usersEl = document.getElementById("users");

/* ----------------------------
   Formularios
   ---------------------------- */
const formCreate = document.getElementById("form-create");
const formEdit = document.getElementById("form-edit");
const formLogin = document.getElementById("form-login");
const formRegister = document.getElementById("form-register");
const btnCancelEdit = document.getElementById("btn-cancel-edit");

let isAuthenticated = Boolean(localStorage.getItem("token"));

/* ----------------------------
   Helpers: mostrar/ocultar vistas (una a la vez)
   ---------------------------- */
function hideAll() {
  Object.values(sections).forEach((s) => (s.style.display = "none"));
}
function toggleSection(name) {
  const s = sections[name];
  if (!s) return;
  const currentlyVisible = s.style.display === "block";
  hideAll();
  if (!currentlyVisible) s.style.display = "block";
}

/* ----------------------------
   Render listado
   ---------------------------- */
async function renderList() {
  try {
    const usuarios = await getAll();
    if (!Array.isArray(usuarios) || usuarios.length === 0) {
      usersEl.innerHTML = "<li>No hay usuarios</li>";
      return;
    }
    usersEl.innerHTML = usuarios
      .map(
        (u) => `
      <li data-id="${u.id_usuario}">
        ${u.nombre} ${u.apellido ?? ""} ${u.edad ?? ""}
        <button class="edit" data-id="${u.id_usuario}" data-nombre="${
          u.nombre
        }" data-apellido="${u.apellido ?? ""}" data-email="${
          u.email ?? ""
        }">Editar</button>
        <button class="delete" data-id="${u.id_usuario}">Borrar</button>
      </li>`
      )
      .join("");
  } catch (err) {
    console.error("Error al listar:", err);
    usersEl.innerHTML = "<li>Error al cargar usuarios</li>";
  }
}

/* ----------------------------
   Abrir formulario de edición con datos
   ---------------------------- */
function openEditFromDataset(ds) {
  formEdit.elements["id"].value = ds.id;
  formEdit.elements["nombre"].value = ds.nombre || "";
  formEdit.elements["apellido"].value = ds.apellido || "";
  formEdit.elements["email"].value = ds.email || "";
  toggleSection("edit");
}

/* ----------------------------
   Listeners: botones y delegación en la lista
   ---------------------------- */
btnList.addEventListener("click", async () => {
  await renderList();
  toggleSection("list");
});

btnCreate.addEventListener("click", () => toggleSection("create"));
btnLogin.addEventListener("click", () => toggleSection("login"));
btnRegister.addEventListener("click", () => toggleSection("register"));

usersEl.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.classList.contains("edit")) {
    openEditFromDataset(btn.dataset);
    return;
  }
  if (btn.classList.contains("delete")) {
    if (confirm("¿Eliminar usuario?")) {
      try {
        await erase(Number(id));
        await renderList();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

/* ----------------------------
   Form handlers
   ---------------------------- */
formCreate.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = formCreate.elements["nombre"].value.trim();
  const apellido = formCreate.elements["apellido"].value.trim();
  const email = String(formCreate.elements["email"].value) || null;
  try {
    await create({ nombre, apellido, email });
    formCreate.reset();
    await renderList();
    toggleSection("list"); // después de crear, volvemos al listado
  } catch (err) {
    console.error(err);
  }
});

formEdit.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = Number(formEdit.elements["id"].value);
  const nombre = formEdit.elements["nombre"].value.trim();
  const apellido = formEdit.elements["apellido"].value.trim();
  const email = String(formEdit.elements["email"].value) || null;
  try {
    await update(id, { nombre, apellido, email });
    formEdit.reset();
    await renderList();
    toggleSection("list");
  } catch (err) {
    console.error(err);
  }
});

btnCancelEdit.addEventListener("click", () => toggleSection("edit"));

formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = formRegister.elements["nombre"].value.trim();
  const apellido = formRegister.elements["apellido"].value.trim();
  const email = String(formRegister.elements["email"].value) || null;
  const password = formRegister.elements["password"].value;
  try {
    await register({ nombre, apellido, email, password });
    formRegister.reset();
    await renderList();
    toggleSection("list");
  } catch (err) {
    console.error(err);
  }
});

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = formLogin.elements["nombre"].value.trim();
  const password = formLogin.elements["password"].value;
  try {
    await login({ nombre, password });
    if (localStorage.getItem("token")) isAuthenticated = true;
    formLogin.reset();
    await renderList();
    toggleSection("list");
  } catch (err) {
    console.error(err);
  }
});

/* ----------------------------
   WebSocket (opcional, lo dejo mínimo)
   ---------------------------- */
const socket = new WebSocket("ws://localhost:4000");
socket.addEventListener("message", (ev) => console.log("WS:", ev.data));

/* carga inicial opcional (no muestra nada hasta que pulses) */
// await renderList(); // descomenta si quieres que se listé al cargar
