const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Cliente {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, '..', 'database', 'database.sqlite'));
    }

    // Criar um novo cliente
    criar(cliente, callback) {
        const { nome, email, telefone } = cliente;
        const sql = 'INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)';
        this.db.run(sql, [nome, email, telefone], function(err) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, { id: this.lastID, nome, email, telefone });
            }
        });
    }

    // Listar todos os clientes
    listarTodos(callback) {
        const sql = 'SELECT * FROM clientes ORDER BY nome';
        this.db.all(sql, [], (err, rows) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    }

    // Buscar cliente por ID
    buscarPorId(id, callback) {
        const sql = 'SELECT * FROM clientes WHERE id = ?';
        this.db.get(sql, [id], (err, row) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, row);
            }
        });
    }

    // Atualizar cliente
    atualizar(id, cliente, callback) {
        const { nome, email, telefone } = cliente;
        const sql = 'UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?';
        this.db.run(sql, [nome, email, telefone, id], function(err) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, { id, nome, email, telefone, changes: this.changes });
            }
        });
    }

    // Deletar cliente
    deletar(id, callback) {
        const sql = 'DELETE FROM clientes WHERE id = ?';
        this.db.run(sql, [id], function(err) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, { id, changes: this.changes });
            }
        });
    }

    // Fechar conexão com o banco
    fecharConexao() {
        this.db.close();
    }
}

module.exports = Cliente;

