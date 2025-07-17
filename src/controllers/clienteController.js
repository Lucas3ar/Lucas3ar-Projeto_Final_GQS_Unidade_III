const Cliente = require('../models/Cliente');

class ClienteController {
    // Exibir formulário de cadastro de cliente
    static exibirFormulario(req, res) {
        res.render('clientes/novo', { title: 'Cadastrar Cliente', erro: null });
    }

    // Listar todos os clientes
    static listar(req, res) {
        const cliente = new Cliente();
        cliente.listarTodos((err, clientes) => {
            if (err) {
                res.status(500).json({ erro: 'Erro interno do servidor' });
            } else {
                res.render('clientes/listar', { title: 'Lista de Clientes', clientes });
            }
            cliente.fecharConexao();
        });
    }

    // Criar novo cliente (API)
    static criar(req, res) {
        const { nome, email, telefone } = req.body;

        // Validação básica
        if (!nome || !email) {
            return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
        }

        const cliente = new Cliente();
        cliente.criar({ nome, email, telefone }, (err, novoCliente) => {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                    res.status(400).json({ erro: 'Email já cadastrado' });
                } else {
                    res.status(500).json({ erro: 'Erro interno do servidor' });
                }
            } else {
                res.status(201).json(novoCliente);
            }
            cliente.fecharConexao();
        });
    }

    // Criar novo cliente (formulário web)
    static criarWeb(req, res) {
        const { nome, email, telefone } = req.body;

        // Validação básica
        if (!nome || !email) {
            return res.render('clientes/novo', { 
                title: 'Cadastrar Cliente', 
                erro: 'Nome e email são obrigatórios' 
            });
        }

        const cliente = new Cliente();
        cliente.criar({ nome, email, telefone }, (err, novoCliente) => {
            if (err) {
                let mensagemErro = 'Erro interno do servidor';
                if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                    mensagemErro = 'Email já cadastrado';
                }
                res.render('clientes/novo', { 
                    title: 'Cadastrar Cliente', 
                    erro: mensagemErro 
                });
            } else {
                res.redirect('/clientes?sucesso=Cliente cadastrado com sucesso');
            }
            cliente.fecharConexao();
        });
    }

    // Buscar cliente por ID (API)
    static buscarPorId(req, res) {
        const id = req.params.id;
        const cliente = new Cliente();
        
        cliente.buscarPorId(id, (err, clienteEncontrado) => {
            if (err) {
                res.status(500).json({ erro: 'Erro interno do servidor' });
            } else if (!clienteEncontrado) {
                res.status(404).json({ erro: 'Cliente não encontrado' });
            } else {
                res.json(clienteEncontrado);
            }
            cliente.fecharConexao();
        });
    }

    // Atualizar cliente (API)
    static atualizar(req, res) {
        const id = req.params.id;
        const { nome, email, telefone } = req.body;

        // Validação básica
        if (!nome || !email) {
            return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
        }

        const cliente = new Cliente();
        cliente.atualizar(id, { nome, email, telefone }, (err, clienteAtualizado) => {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                    res.status(400).json({ erro: 'Email já cadastrado' });
                } else {
                    res.status(500).json({ erro: 'Erro interno do servidor' });
                }
            } else if (clienteAtualizado.changes === 0) {
                res.status(404).json({ erro: 'Cliente não encontrado' });
            } else {
                res.json(clienteAtualizado);
            }
            cliente.fecharConexao();
        });
    }

    // Deletar cliente (API)
    static deletar(req, res) {
        const id = req.params.id;
        const cliente = new Cliente();
        
        cliente.deletar(id, (err, resultado) => {
            if (err) {
                res.status(500).json({ erro: 'Erro interno do servidor' });
            } else if (resultado.changes === 0) {
                res.status(404).json({ erro: 'Cliente não encontrado' });
            } else {
                res.json({ mensagem: 'Cliente deletado com sucesso' });
            }
            cliente.fecharConexao();
        });
    }
}

module.exports = ClienteController;

