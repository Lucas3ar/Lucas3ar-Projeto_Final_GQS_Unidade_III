const Cliente = require('../../src/models/Cliente');

describe('Teste Simples do Cliente', () => {
    test('deve importar o modelo Cliente corretamente', () => {
        expect(Cliente).toBeDefined();
        expect(typeof Cliente).toBe('function');
    });

    test('deve criar uma instância do Cliente', () => {
        const cliente = new Cliente();
        expect(cliente).toBeDefined();
        expect(cliente).toBeInstanceOf(Cliente);
    });
});

