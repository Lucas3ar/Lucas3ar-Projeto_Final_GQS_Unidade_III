const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Venda {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, '..', 'database', 'database.sqlite'));
    }

    // Criar uma nova venda
    criar(venda, callback) {
        const { id_cliente, data, valor, descricao } = venda;
        const sql = 'INSERT INTO vendas (id_cliente, data, valor, descricao) VALUES (?, ?, ?, ?)';
        this.db.run(sql, [id_cliente, data, valor, descricao], function(err) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, { id: this.lastID, id_cliente, data, valor, descricao });
            }
        });
    }

    // Listar todas as vendas com informações do cliente
    listarTodos(callback) {
        const sql = `
            SELECT v.*, c.nome as cliente_nome, c.email as cliente_email 
            FROM vendas v 
            JOIN clientes c ON v.id_cliente = c.id 
            ORDER BY v.data DESC
        `;
        this.db.all(sql, [], (err, rows) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    }

    // Buscar venda por ID
    buscarPorId(id, callback) {
        const sql = `
            SELECT v.*, c.nome as cliente_nome, c.email as cliente_email 
            FROM vendas v 
            JOIN clientes c ON v.id_cliente = c.id 
            WHERE v.id = ?
        `;
        this.db.get(sql, [id], (err, row) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, row);
            }
        });
    }

    // Atualizar venda
    atualizar(id, venda, callback) {
        const { id_cliente, data, valor, descricao } = venda;
        const sql = 'UPDATE vendas SET id_cliente = ?, data = ?, valor = ?, descricao = ? WHERE id = ?';
        this.db.run(sql, [id_cliente, data, valor, descricao, id], function(err) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, { id, id_cliente, data, valor, descricao, changes: this.changes });
            }
        });
    }

    // Deletar venda
    deletar(id, callback) {
        const sql = 'DELETE FROM vendas WHERE id = ?';
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

module.exports = Venda;

