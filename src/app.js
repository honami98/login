const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secreto',
  resave: true,
  saveUninitialized: true
}));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'dbproducto1'
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos: ' + err.message);
  } else {
    console.log('Conexión a la base de datos establecida');
  }
});

// Rutas de inicio de sesión y autenticación

// Ruta para el formulario de registro
app.get('/registro', (req, res) => {
    res.sendFile(__dirname + '/registro.html');
  });
  
  app.post('/registro', (req, res) => {
    const { nombre, email_registro, contraseña_registro, rol } = req.body;
  
    if (nombre && email_registro && contraseña_registro && rol != null) {
      
  
        // Almacena el nuevo usuario en la base de datos
        db.query('INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?,?)', [nombre, email_registro, contraseña_registro, rol], (err, results) => {
          res.redirect('/login'); // Redirige al inicio de sesión después del registro
        });
      
    } else {
      res.send('Por favor, ingresa todos los campos requeridos. <a href="/registro">Intentar nuevamente</a>');
    }
  });

app.get('/index',(req, res) => {
    
    res.sendFile(__dirname + '/index.html');
  });

  app.post('/login', (req, res) => {
  const { email, contraseña } = req.body;

  if (email && contraseña) {
    db.query('SELECT * FROM usuarios WHERE email = ? AND contraseña = ?', [email, contraseña], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        req.session.loggedin = true;
        req.session.email = email;
        req.session.rol= results[0].rol;
        //console.log(results[0].rol);
        res.redirect('/index');
        
        
      } else {
        res.send('Credenciales incorrectas. <a href="/login">Intentar nuevamente</a>');
      }
    });
  } else {
    res.send('Por favor, ingresa un correo electrónico y una contraseña. <a href="/login">Intentar nuevamente</a>');
  }
});

  app.get('/obtener-rol', (req, res) => {
    
      const nombre=req.session.email;
      const rol=req.session.rol;
      // Obtener el rol del usuario desde la sesión
      const queryNombre = 'SELECT nombre, rol FROM usuarios WHERE id = ?';
  
      // Enviar el nombre y el rol como respuesta JSON
      res.json({ nombre,rol });

  });

  app.get('/usuario/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT nombre, rol FROM usuarios WHERE id = ?';
  
    db.query(query, [userId], (err, result) => {
      if (err) throw err;
      res.json(result[0]);
    });
  });
  

app.get('/', (req, res) => {
  res.send('Bienvenido al sistema de inicio de sesión');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});


app.get('/pedidos', (req, res) => {
  if (req.session.loggedin) {
    db.query('SELECT * FROM pedidos WHERE usuario_id = ?', [req.session.email], (err, results) => {
      if (err) throw err;
      res.send('Lista de pedidos: ' + JSON.stringify(results));
    });
  } else {
    res.send('Acceso no autorizado. <a href="/login">Iniciar sesión</a>');
  }
});

app.listen(3000, () => {
  console.log('Servidor en funcionamiento en http://localhost:3000');
});
