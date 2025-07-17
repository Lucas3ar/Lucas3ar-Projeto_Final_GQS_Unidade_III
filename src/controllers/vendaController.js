const Venda = require('../models/Venda');
const Cliente = require('../models/Cliente');

class VendaController {
    // Exibir formulário de cadastro de venda
    static exibirFormulario(req, res) {
        const cliente = new Cliente();
        cliente.listarTodos((err, clientes) => {
            if (err) {
                res.status(500).render('erro', { erro: 'Erro ao carregar clientes' });
            } else {
                res.render('vendas/novo', { 
                    title: 'Cadastrar Venda', 
                    clientes, 
                    erro: null 
                });
            }
            cliente.fecharConexao();
        });
    }

    // Listar todas as vendas
    static listar(req, res) {
        const venda = new Venda();
        venda.listarTodos((err, vendas) => {
            if (err) {
                res.status(500).json({ erro: 'Erro interno do servidor' });
            } else {
                res.render('vendas/listar', { title: 'Lista de Vendas', vendas });
            }
            venda.fecharConexao();
        });
    }

    // Criar nova venda (API)
    static criar(req, res) {
        const { id_cliente, data, valor, descricao } = req.body;

        // Validação básica
        if (!id_cliente || !data || !valor) {
            return res.status(400).json({ erro: 'Cliente, data e valor são obrigatórios' });
        }

        // Validar se o valor é um número positivo
        if (isNaN(valor) || parseFloat(valor) <= 0) {
            return res.status(400).json({ erro: 'Valor deve ser um número positivo' });
        }

        const venda = new Venda();
        venda.criar({ 
            id_cliente: parseInt(id_cliente), 
            data, 
            valor: parseFloat(valor), 
            descricao 
        }, (err, novaVenda) => {
            if (err) {
                res.status(500).json({ erro: 'Erro interno do servidor' });
            } else {
                res.status(201).json(novaVenda);
            }
            venda.fecharConexao();
        });
    }

    // Criar nova venda (formulário web)
    static criarWeb(req, res) {
        const { id_cliente, data, valor, descricao } = req.body;

        // Validação básica
        if (!id_cliente || !data || !valor) {
            const cliente = new Cliente();
            cliente.listarTodos((err, clientes) => {
                res.render('vendas/novo', { 
                    title: 'Cadastrar Venda', 
                    clientes: clientes || [], 
                    erro: 'Cliente, data e valor são obrigatórios' 
                });
                cliente.fecharConexao();
            });
            return;
        }

        // Validar se o valor é um número positivo
        if (isNaN(valor) || parseFloat(valor) <= 0) {
            const cliente = new Cliente();
            cliente.listarTodos((err, clientes) => {
                res.render('vendas/novo', { 
                    title: 'Cadastrar Venda', 
                    clientes: clientes || [], 
                    erro: 'Valor deve ser um número positivo' 
                });
                cliente.fecharConexao();
            });
            return;
        }

        const venda = new Venda();
        venda.criar({ 
            id_cliente: parseInt(id_cliente), 
            data, 
            valor: parseFloat(valor), 
            descricao 
        }, (err, novaVenda) => {
            if (err) {
                const cliente = new Cliente();
                cliente.listarTodos((errCliente, clientes) => {
                    res.render('vendas/novo', { 
                        title: 'Cadastrar Venda', 
                        clientes: clientes || [], 
                        erro: 'Erro interno do servidor' 
                    });
                    cliente.fecharConexao();
                });
            } else {
                res.redirect('/vendas?sucesso=Venda cadastrada com sucesso');
            }
            venda.fecharConexao();
        });
    }

    // Buscar venda por ID (API)
    static buscarPorId(req, res) {
        const id = req.params.id;
        const venda = new Venda();
        
        venda.buscarPorId(id, (err, vendaEncontrada) => {
            if (err) {
                res.status(500).json({ erro: 'Erro interno do servidor' });
            } else if (!vendaEncontrada) {
                res.status(404).json({ erro: 'Venda não encontrada' });
            } else {
                res.json(vendaEncontrada);
            }
            venda.fecharConexao();
        });
    }

    // Atualizar venda (API)
    static atualizar(req, res) {
        const id = req.params.id;
        const { id_cliente, data, valor, descricao } = req.body;

        // Validação básica
        if (!id_cliente || !data || !valor) {
            return res.status(400).json({ erro: 'Cliente, data e valor são obrigatórios' });
        }

        // Validar se o valor é um número positivo
        if (isNaN(valor) || parseFloat(valor) <= 0) {
            return res.status(400).json({ erro: 'Valor deve ser um número positivo' });
        }

        const venda = new Venda();
        venda.atualizar(id, { 
            id_cliente: parseInt(id_cliente), 
            data, 
            valor: parseFloat(valor), 
            descricao 
        }, (err, vendaAtualizada) => {
            if (err) {
                res.status(500).json({ erro: 'Erro interno do servidor' });
            } else if (vendaAtualizada.changes === 0) {
                res.status(404).json({ erro: 'Venda não encontrada' });
            } else {
                res.json(vendaAtualizada);
            }
            venda.fecharConexao();
        });
    }

    // Deletar venda (API)
    static deletar(req, res) {
        const id = req.params.id;
        const venda = new Venda();
        
        venda.deletar(id, (err, resultado) => {
            if (err) {
                res.status(500).json({ erro: 'Erro interno do servidor' });
            } else if (resultado.changes === 0) {
                res.status(404).json({ erro: 'Venda não encontrada' });
            } else {
                res.json({ mensagem: 'Venda deletada com sucesso' });
            }
            venda.fecharConexao();
        });
    }
}

module.exports = VendaController;

