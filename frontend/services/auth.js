const USUARIO_KEY = "usuario_actual";

export function login(nombre, esAdmin = false) {
    const usuario = { nombre, is_admin: esAdmin };
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
}

export function logout() {
    localStorage.removeItem(USUARIO_KEY);
}

export function getUsuarioActual() {
    const usuarioStr = localStorage.getItem(USUARIO_KEY);
    return usuarioStr ? JSON.parse(usuarioStr) : null;
}

export function mantenerSesion() {
    return !!getUsuarioActual();
}