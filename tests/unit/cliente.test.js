const Cliente = require('../../src/models/Cliente');
const fs = require('fs');
const path = require('path');

// Configurar banco de dados de teste
const testDbPath = path.join(__dirname, '..', '..', 'src', 'database', 'test.sqlite');

describe('Modelo Cliente', () => {
    let cliente;

    beforeEach(() => {
        // Remover banco de teste se existir
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }
        
        // Criar nova instância do modelo
        cliente = new Cliente();
        
        // Configurar banco de teste
        cliente.db.close();
        const sqlite3 = require('sqlite3').verbose();
        cliente.db = new sqlite3.Database(testDbPath);
        
        // Criar tabelas
        cliente.db.run(`CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            telefone TEXT
        )`);
    });

    afterEach(() => {
        cliente.fecharConexao();
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }
    });

    describe('criar', () => {
        test('deve criar um cliente com dados válidos', (done) => {
            const novoCliente = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '11999999999'
            };

            cliente.criar(novoCliente, (err, resultado) => {
                expect(err).toBeNull();
                expect(resultado).toHaveProperty('id');
                expect(resultado.nome).toBe(novoCliente.nome);
                expect(resultado.email).toBe(novoCliente.email);
                expect(resultado.telefone).toBe(novoCliente.telefone);
                done();
            });
        });

        test('deve falhar ao criar cliente com email duplicado', (done) => {
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

            cliente.criar(cliente1, (err1, resultado1) => {
                expect(err1).toBeNull();
                expect(resultado1).toHaveProperty('id');

                cliente.criar(cliente2, (err2, resultado2) => {
                    expect(err2).not.toBeNull();
                    expect(err2.code).toBe('SQLITE_CONSTRAINT_UNIQUE');
                    expect(resultado2).toBeNull();
                    done();
                });
            });
        });
    });

    describe('listarTodos', () => {
        test('deve retornar lista vazia quando não há clientes', (done) => {
            cliente.listarTodos((err, clientes) => {
                expect(err).toBeNull();
                expect(clientes).toEqual([]);
                done();
            });
        });

        test('deve retornar todos os clientes cadastrados', (done) => {
            const cliente1 = { nome: 'João', email: 'joao@email.com', telefone: '11999999999' };
            const cliente2 = { nome: 'Maria', email: 'maria@email.com', telefone: '11888888888' };

            cliente.criar(cliente1, (err1) => {
                expect(err1).toBeNull();
                
                cliente.criar(cliente2, (err2) => {
                    expect(err2).toBeNull();
                    
                    cliente.listarTodos((err, clientes) => {
                        expect(err).toBeNull();
                        expect(clientes).toHaveLength(2);
                        expect(clientes[0].nome).toBe('João');
                        expect(clientes[1].nome).toBe('Maria');
                        done();
                    });
                });
            });
        });
    });

    describe('buscarPorId', () => {
        test('deve retornar cliente existente', (done) => {
            const novoCliente = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '11999999999'
            };

            cliente.criar(novoCliente, (err, clienteCriado) => {
                expect(err).toBeNull();
                
                cliente.buscarPorId(clienteCriado.id, (err, clienteEncontrado) => {
                    expect(err).toBeNull();
                    expect(clienteEncontrado).not.toBeNull();
                    expect(clienteEncontrado.id).toBe(clienteCriado.id);
                    expect(clienteEncontrado.nome).toBe(novoCliente.nome);
                    done();
                });
            });
        });

        test('deve retornar null para ID inexistente', (done) => {
            cliente.buscarPorId(999, (err, clienteEncontrado) => {
                expect(err).toBeNull();
                expect(clienteEncontrado).toBeUndefined();
                done();
            });
        });
    });

    describe('atualizar', () => {
        test('deve atualizar cliente existente', (done) => {
            const clienteOriginal = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '11999999999'
            };

            cliente.criar(clienteOriginal, (err, clienteCriado) => {
                expect(err).toBeNull();
                
                const dadosAtualizados = {
                    nome: 'João Santos',
                    email: 'joao.santos@email.com',
                    telefone: '11888888888'
                };

                cliente.atualizar(clienteCriado.id, dadosAtualizados, (err, resultado) => {
                    expect(err).toBeNull();
                    expect(resultado.changes).toBe(1);
                    expect(resultado.nome).toBe(dadosAtualizados.nome);
                    done();
                });
            });
        });

        test('deve retornar changes = 0 para ID inexistente', (done) => {
            const dadosAtualizados = {
                nome: 'João Santos',
                email: 'joao.santos@email.com',
                telefone: '11888888888'
            };

            cliente.atualizar(999, dadosAtualizados, (err, resultado) => {
                expect(err).toBeNull();
                expect(resultado.changes).toBe(0);
                done();
            });
        });
    });

    describe('deletar', () => {
        test('deve deletar cliente existente', (done) => {
            const novoCliente = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '11999999999'
            };

            cliente.criar(novoCliente, (err, clienteCriado) => {
                expect(err).toBeNull();
                
                cliente.deletar(clienteCriado.id, (err, resultado) => {
                    expect(err).toBeNull();
                    expect(resultado.changes).toBe(1);
                    done();
                });
            });
        });

        test('deve retornar changes = 0 para ID inexistente', (done) => {
            cliente.deletar(999, (err, resultado) => {
                expect(err).toBeNull();
                expect(resultado.changes).toBe(0);
                done();
            });
        });
    });
});

