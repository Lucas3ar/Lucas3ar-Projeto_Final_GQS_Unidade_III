describe('Cadastro de Vendas', () => {
  beforeEach(() => {
    cy.visit('/');
    
    // Cadastrar um cliente primeiro para usar nos testes de venda
    cy.contains('Cadastrar Cliente').click();
    cy.get('#nome').type('João Silva');
    cy.get('#email').type('joao.silva@email.com');
    cy.get('#telefone').type('11987654321');
    cy.get('button[type="submit"]').click();
    
    // Voltar para a página inicial
    cy.visit('/');
  });

  it('deve navegar para a página de cadastro de venda', () => {
    cy.contains('Cadastrar Venda').click();
    cy.url().should('include', '/vendas/novo');
    cy.contains('h2', 'Cadastrar Venda').should('be.visible');
  });

  it('deve cadastrar uma nova venda com sucesso', () => {
    cy.contains('Cadastrar Venda').click();
    
    // Preencher o formulário
    cy.get('#id_cliente').select('João Silva - joao.silva@email.com');
    cy.get('#valor').type('150.50');
    cy.get('#descricao').type('Venda de produtos de informática');
    
    // Submeter o formulário
    cy.get('button[type="submit"]').click();
    
    // Verificar redirecionamento e mensagem de sucesso
    cy.url().should('include', '/vendas');
    cy.contains('Venda cadastrada com sucesso').should('be.visible');
    
    // Verificar se a venda aparece na lista
    cy.contains('João Silva').should('be.visible');
    cy.contains('R$ 150,50').should('be.visible');
    cy.contains('Venda de produtos de informática').should('be.visible');
  });

  it('deve mostrar erro ao tentar cadastrar venda sem cliente', () => {
    cy.contains('Cadastrar Venda').click();
    
    // Preencher apenas valor e descrição
    cy.get('#valor').type('100.00');
    cy.get('#descricao').type('Teste');
    
    // Tentar submeter o formulário
    cy.get('button[type="submit"]').click();
    
    // Verificar que permanece na página de cadastro
    cy.url().should('include', '/vendas/novo');
  });

  it('deve mostrar erro ao tentar cadastrar venda sem valor', () => {
    cy.contains('Cadastrar Venda').click();
    
    // Preencher apenas cliente e descrição
    cy.get('#id_cliente').select('João Silva - joao.silva@email.com');
    cy.get('#descricao').type('Teste');
    
    // Tentar submeter o formulário
    cy.get('button[type="submit"]').click();
    
    // Verificar que permanece na página de cadastro
    cy.url().should('include', '/vendas/novo');
  });

  it('deve preencher a data atual automaticamente', () => {
    cy.contains('Cadastrar Venda').click();
    
    // Verificar se a data atual está preenchida
    const hoje = new Date().toISOString().split('T')[0];
    cy.get('#data').should('have.value', hoje);
  });

  it('deve navegar para a lista de vendas', () => {
    cy.contains('Ver Vendas').click();
    cy.url().should('include', '/vendas');
    cy.contains('h2', 'Lista de Vendas').should('be.visible');
  });

  it('deve cancelar o cadastro e voltar para a lista', () => {
    cy.contains('Cadastrar Venda').click();
    cy.contains('Cancelar').click();
    cy.url().should('include', '/vendas');
  });

  it('deve mostrar resumo das vendas na listagem', () => {
    // Cadastrar uma venda primeiro
    cy.contains('Cadastrar Venda').click();
    cy.get('#id_cliente').select('João Silva - joao.silva@email.com');
    cy.get('#valor').type('150.50');
    cy.get('#descricao').type('Venda teste');
    cy.get('button[type="submit"]').click();
    
    // Verificar o resumo
    cy.contains('Total de Vendas: 1').should('be.visible');
    cy.contains('Valor Total: R$ 150,50').should('be.visible');
  });

  it('deve abrir modal com detalhes da venda', () => {
    // Cadastrar uma venda primeiro
    cy.contains('Cadastrar Venda').click();
    cy.get('#id_cliente').select('João Silva - joao.silva@email.com');
    cy.get('#valor').type('150.50');
    cy.get('#descricao').type('Venda teste');
    cy.get('button[type="submit"]').click();
    
    // Clicar no botão "Ver"
    cy.contains('button', 'Ver').click();
    
    // Verificar se o modal abriu
    cy.contains('Detalhes da Venda').should('be.visible');
    cy.contains('João Silva').should('be.visible');
    cy.contains('R$ 150,50').should('be.visible');
    
    // Fechar o modal
    cy.contains('button', 'Fechar').click();
  });
});

