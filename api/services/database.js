//Aqui la bd y un encapsulamiento de los metodos que deben pedir a la bd (getbyid and all)

// Defino un array en memoria con usuarios (esto hace de "base de datos" temporal)

export const usuarios = [
  {
    id_usuario: 1,
    nombre: "Gabriel",
    apellido: "Fioritti",
    email: "fiorittigabriel@gmail.com",
    password: "1234",
    roles: ["admin", "user"],
  },
  {
    id_usuario: 2,
    nombre: "Paula",
    apellido: "Tomas",
    email: "tomasannapaula@gmail.com",
    password: "1234",
    roles: ["user"],
  },
];
