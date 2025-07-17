const request = require('supertest');
const app = require('../../app');
const fs = require('fs');
const path = require('path');

// Configurar banco de dados de teste
const testDbPath = path.join(__dirname, '..', '..', 'src', 'database', 'test.sqlite');

describe('API Integration Tests', () => {
    beforeEach(() => {
        // Remover banco de teste se existir
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }
    });

    afterEach(() => {
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }
    });

    describe('API Clientes', () => {
        describe('POST /api/clientes', () => {
            test('deve criar um novo cliente', async () => {
                const novoCliente = {
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    telefone: '11999999999'
                };

                const response = await request(app)
                    .post('/api/clientes')
                    .send(novoCliente)
                    .expect(201);

                expect(response.body).toHaveProperty('id');
                expect(response.body.nome).toBe(novoCliente.nome);
                expect(response.body.email).toBe(novoCliente.email);
                expect(response.body.telefone).toBe(novoCliente.telefone);
            });

            test('deve retornar erro 400 para dados inválidos', async () => {
                const clienteInvalido = {
                    nome: '', // Nome vazio
                    email: 'email-invalido' // Email inválido
                };

                const response = await request(app)
                    .post('/api/clientes')
                    .send(clienteInvalido)
                    .expect(400);

                expect(response.body).toHaveProperty('erro');
            });

            test('deve retornar erro 400 para email duplicado', async () => {
                const cliente1 = {
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    telefone: '11999999999'
                };

                const cliente2 = {
                    nome: 'Maria Silva',
                    email: 'joao@email.com', // Email duplicado
                    telefone: '11888888888'
                };

                // Criar primeiro cliente
                await request(app)
                    .post('/api/clientes')
                    .send(cliente1)
                    .expect(201);

                // Tentar criar segundo cliente com email duplicado
                const response = await request(app)
                    .post('/api/clientes')
                    .send(cliente2)
                    .expect(400);

                expect(response.body.erro).toContain('Email já cadastrado');
            });
        });

        describe('GET /api/clientes', () => {
            test('deve retornar lista vazia quando não há clientes', async () => {
                const response = await request(app)
                    .get('/api/clientes')
                    .expect(200);

                expect(response.body).toEqual([]);
            });

            test('deve retornar lista de clientes', async () => {
                // Criar alguns clientes primeiro
                const cliente1 = { nome: 'João', email: 'joao@email.com', telefone: '11999999999' };
                const cliente2 = { nome: 'Maria', email: 'maria@email.com', telefone: '11888888888' };

                await request(app).post('/api/clientes').send(cliente1);
                await request(app).post('/api/clientes').send(cliente2);

                const response = await request(app)
                    .get('/api/clientes')
                    .expect(200);

                expect(response.body).toHaveLength(2);
                expect(response.body[0].nome).toBe('João');
                expect(response.body[1].nome).toBe('Maria');
            });
        });

        describe('GET /api/clientes/:id', () => {
            test('deve retornar cliente específico', async () => {
                const novoCliente = {
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    telefone: '11999999999'
                };

                const createResponse = await request(app)
                    .post('/api/clientes')
                    .send(novoCliente);

                const response = await request(app)
                    .get(`/api/clientes/${createResponse.body.id}`)
                    .expect(200);

                expect(response.body.id).toBe(createResponse.body.id);
                expect(response.body.nome).toBe(novoCliente.nome);
            });

            test('deve retornar erro 404 para ID inexistente', async () => {
                const response = await request(app)
                    .get('/api/clientes/999')
                    .expect(404);

                expect(response.body.erro).toContain('Cliente não encontrado');
            });
        });

        describe('PUT /api/clientes/:id', () => {
            test('deve atualizar cliente existente', async () => {
                const clienteOriginal = {
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    telefone: '11999999999'
                };

                const createResponse = await request(app)
                    .post('/api/clientes')
                    .send(clienteOriginal);

                const dadosAtualizados = {
                    nome: 'João Santos',
                    email: 'joao.santos@email.com',
                    telefone: '11888888888'
                };

                const response = await request(app)
                    .put(`/api/clientes/${createResponse.body.id}`)
                    .send(dadosAtualizados)
                    .expect(200);

                expect(response.body.nome).toBe(dadosAtualizados.nome);
                expect(response.body.email).toBe(dadosAtualizados.email);
            });

            test('deve retornar erro 404 para ID inexistente', async () => {
                const dadosAtualizados = {
                    nome: 'João Santos',
                    email: 'joao.santos@email.com',
                    telefone: '11888888888'
                };

                const response = await request(app)
                    .put('/api/clientes/999')
                    .send(dadosAtualizados)
                    .expect(404);

                expect(response.body.erro).toContain('Cliente não encontrado');
            });
        });

        describe('DELETE /api/clientes/:id', () => {
            test('deve deletar cliente existente', async () => {
                const novoCliente = {
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    telefone: '11999999999'
                };

                const createResponse = await request(app)
                    .post('/api/clientes')
                    .send(novoCliente);

                const response = await request(app)
                    .delete(`/api/clientes/${createResponse.body.id}`)
                    .expect(200);

                expect(response.body.mensagem).toContain('Cliente deletado com sucesso');
            });

            test('deve retornar erro 404 para ID inexistente', async () => {
                const response = await request(app)
                    .delete('/api/clientes/999')
                    .expect(404);

                expect(response.body.erro).toContain('Cliente não encontrado');
            });
        });
    });

    describe('API Vendas', () => {
        let clienteId;

        beforeEach(async () => {
            // Criar um cliente para usar nos testes de venda
            const cliente = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '11999999999'
            };

            const response = await request(app)
                .post('/api/clientes')
                .send(cliente);

            clienteId = response.body.id;
        });

        describe('POST /api/vendas', () => {
            test('deve criar uma nova venda', async () => {
                const novaVenda = {
                    id_cliente: clienteId,
                    data: '2025-07-17',
                    valor: 150.50,
                    descricao: 'Venda de produtos'
                };

                const response = await request(app)
                    .post('/api/vendas')
                    .send(novaVenda)
                    .expect(201);

                expect(response.body).toHaveProperty('id');
                expect(response.body.id_cliente).toBe(clienteId);
                expect(response.body.valor).toBe(150.50);
                expect(response.body.descricao).toBe(novaVenda.descricao);
            });

            test('deve retornar erro 400 para dados inválidos', async () => {
                const vendaInvalida = {
                    id_cliente: '', // Cliente vazio
                    data: '',       // Data vazia
                    valor: -10      // Valor negativo
                };

                const response = await request(app)
                    .post('/api/vendas')
                    .send(vendaInvalida)
                    .expect(400);

                expect(response.body).toHaveProperty('erro');
            });
        });

        describe('GET /api/vendas', () => {
            test('deve retornar lista de vendas', async () => {
                const venda1 = {
                    id_cliente: clienteId,
                    data: '2025-07-17',
                    valor: 100.00,
                    descricao: 'Venda 1'
                };

                const venda2 = {
                    id_cliente: clienteId,
                    data: '2025-07-18',
                    valor: 200.00,
                    descricao: 'Venda 2'
                };

                await request(app).post('/api/vendas').send(venda1);
                await request(app).post('/api/vendas').send(venda2);

                const response = await request(app)
                    .get('/api/vendas')
                    .expect(200);

                expect(response.body).toHaveLength(2);
                expect(response.body[0]).toHaveProperty('cliente_nome');
                expect(response.body[0]).toHaveProperty('cliente_email');
            });
        });

        describe('GET /api/vendas/:id', () => {
            test('deve retornar venda específica', async () => {
                const novaVenda = {
                    id_cliente: clienteId,
                    data: '2025-07-17',
                    valor: 150.50,
                    descricao: 'Venda de produtos'
                };

                const createResponse = await request(app)
                    .post('/api/vendas')
                    .send(novaVenda);

                const response = await request(app)
                    .get(`/api/vendas/${createResponse.body.id}`)
                    .expect(200);

                expect(response.body.id).toBe(createResponse.body.id);
                expect(response.body.valor).toBe(150.50);
                expect(response.body).toHaveProperty('cliente_nome');
            });

            test('deve retornar erro 404 para ID inexistente', async () => {
                const response = await request(app)
                    .get('/api/vendas/999')
                    .expect(404);

                expect(response.body.erro).toContain('Venda não encontrada');
            });
        });

        describe('PUT /api/vendas/:id', () => {
            test('deve atualizar venda existente', async () => {
                const vendaOriginal = {
                    id_cliente: clienteId,
                    data: '2025-07-17',
                    valor: 150.50,
                    descricao: 'Venda original'
                };

                const createResponse = await request(app)
                    .post('/api/vendas')
                    .send(vendaOriginal);

                const dadosAtualizados = {
                    id_cliente: clienteId,
                    data: '2025-07-18',
                    valor: 200.00,
                    descricao: 'Venda atualizada'
                };

                const response = await request(app)
                    .put(`/api/vendas/${createResponse.body.id}`)
                    .send(dadosAtualizados)
                    .expect(200);

                expect(response.body.valor).toBe(200.00);
                expect(response.body.descricao).toBe('Venda atualizada');
            });
        });

        describe('DELETE /api/vendas/:id', () => {
            test('deve deletar venda existente', async () => {
                const novaVenda = {
                    id_cliente: clienteId,
                    data: '2025-07-17',
                    valor: 150.50,
                    descricao: 'Venda para deletar'
                };

                const createResponse = await request(app)
                    .post('/api/vendas')
                    .send(novaVenda);

                const response = await request(app)
                    .delete(`/api/vendas/${createResponse.body.id}`)
                    .expect(200);

                expect(response.body.mensagem).toContain('Venda deletada com sucesso');
            });
        });
    });
});

