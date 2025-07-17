const express = require('express');
const ClienteController = require('../controllers/clienteController');

const router = express.Router();

// Rotas para views (páginas web)
router.get('/novo', ClienteController.exibirFormulario);
router.post('/novo', ClienteController.criarWeb);
router.get('/', ClienteController.listar);

// Rotas da API RESTful
router.post('/api/clientes', ClienteController.criar);
router.get('/api/clientes', (req, res) => {
    const Cliente = require('../models/Cliente');
    const cliente = new Cliente();
    cliente.listarTodos((err, clientes) => {
        if (err) {
            res.status(500).json({ erro: 'Erro interno do servidor' });
        } else {
            res.json(clientes);
        }
        cliente.fecharConexao();
    });
});
router.get('/api/clientes/:id', ClienteController.buscarPorId);
router.put('/api/clientes/:id', ClienteController.atualizar);
router.delete('/api/clientes/:id', ClienteController.deletar);

module.exports = router;

