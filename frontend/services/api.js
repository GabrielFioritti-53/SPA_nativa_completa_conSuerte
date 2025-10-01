const API_BASE = "http://localhost:3000/usuarios";

export async function apiGetAll() {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`GET fallo: ${res.status}`);
    return res.json();
}

export async function apiGetById(id_usuario) {
    const res = await fetch(`${API_BASE}/${id_usuario}`);
    if (!res.ok) throw new Error(`GET by id fallo: ${res.status}`);
    return res.json();
}

export async function apiCreate(usuario) {
    const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    });
    if (!res.ok) throw new Error(`POST fallo: ${res.status}`);
    return res.json();
}

export async function apiUpdate(id_usuario, usuario) {
    const res = await fetch(`${API_BASE}/${id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    });
    if (!res.ok) throw new Error(`PUT fallo: ${res.status}`);
    return res.json();
}

export async function apiDelete(id_usuario) {
    const res = await fetch(`${API_BASE}/${id_usuario}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`DELETE fallo: ${res.status}`);
    return true;
}