const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Importar rotas
const clienteRoutes = require('./src/routes/clienteRoutes');
const vendaRoutes = require('./src/routes/vendaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do banco de dados SQLite
const db = new sqlite3.Database(path.join(__dirname, 'src', 'database', 'database.sqlite'), (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        db.run(`CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            telefone TEXT
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_cliente INTEGER NOT NULL,
            data TEXT NOT NULL,
            valor REAL NOT NULL,
            descricao TEXT,
            FOREIGN KEY (id_cliente) REFERENCES clientes(id)
        )`);
    }
});

// Configuração do EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Middleware para parsear JSON e URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.get('/', (req, res) => {
    res.render('index', { title: 'Controle de Vendas e Clientes' });
});

// Usar as rotas
app.use('/clientes', clienteRoutes);
app.use('/vendas', vendaRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app; // Exportar app para testes

