const API_URL = "http://localhost:3000/usuarios";

export async function getAll() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`GET fallo: ${res.status}`);
    return res.json();
}

export async function getById(id_usuario) {
    const usuarios = await getAll();
    return usuarios.find(u => u.id_usuario === id_usuario) || null;
}

export async function create(usuario) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    });
    if (!res.ok) throw new Error(`POST fallo: ${res.status}`);
    return res.json();
}

export async function update(id_usuario, usuario) {
    const res = await fetch(`${API_URL}/${id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    });
    if (!res.ok) throw new Error(`PUT fallo: ${res.status}`);
    return res.json();
}

export async function remove(id_usuario) {
    const res = await fetch(`${API_URL}/${id_usuario}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`DELETE fallo: ${res.status}`);
    return true;
}