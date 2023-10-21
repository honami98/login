-- Crear la base de datos
CREATE DATABASE dbproducto1;

-- Usar la base de datos
USE dbproducto1;

-- Crear la tabla 'usuarios'
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  contraseña VARCHAR(255) NOT NULL
  rol VARCHAR(10) NOT NULL
);

-- Crear la tabla 'pedidos'
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  producto VARCHAR(255) NOT NULL,
  cantidad INT NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  estado VARCHAR (30)
);
