const express = require('express');
const VendaController = require('../controllers/vendaController');

const router = express.Router();

// Rotas para views (páginas web)
router.get('/novo', VendaController.exibirFormulario);
router.post('/novo', VendaController.criarWeb);
router.get('/', VendaController.listar);

// Rotas da API RESTful
router.post('/api/vendas', VendaController.criar);
router.get('/api/vendas', (req, res) => {
    const Venda = require('../models/Venda');
    const venda = new Venda();
    venda.listarTodos((err, vendas) => {
        if (err) {
            res.status(500).json({ erro: 'Erro interno do servidor' });
        } else {
            res.json(vendas);
        }
        venda.fecharConexao();
    });
});
router.get('/api/vendas/:id', VendaController.buscarPorId);
router.put('/api/vendas/:id', VendaController.atualizar);
router.delete('/api/vendas/:id', VendaController.deletar);

module.exports = router;

