describe('Cadastro de Clientes', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve navegar para a página de cadastro de cliente', () => {
    cy.contains('Cadastrar Cliente').click();
    cy.url().should('include', '/clientes/novo');
    cy.contains('h2', 'Cadastrar Cliente').should('be.visible');
  });

  it('deve cadastrar um novo cliente com sucesso', () => {
    cy.contains('Cadastrar Cliente').click();
    
    // Preencher o formulário
    cy.get('#nome').type('João Silva');
    cy.get('#email').type('joao.silva@email.com');
    cy.get('#telefone').type('11987654321');
    
    // Submeter o formulário
    cy.get('button[type="submit"]').click();
    
    // Verificar redirecionamento e mensagem de sucesso
    cy.url().should('include', '/clientes');
    cy.contains('Cliente cadastrado com sucesso').should('be.visible');
    
    // Verificar se o cliente aparece na lista
    cy.contains('João Silva').should('be.visible');
    cy.contains('joao.silva@email.com').should('be.visible');
  });

  it('deve mostrar erro ao tentar cadastrar cliente sem nome', () => {
    cy.contains('Cadastrar Cliente').click();
    
    // Preencher apenas o email
    cy.get('#email').type('teste@email.com');
    
    // Tentar submeter o formulário
    cy.get('button[type="submit"]').click();
    
    // Verificar que permanece na página de cadastro
    cy.url().should('include', '/clientes/novo');
  });

  it('deve mostrar erro ao tentar cadastrar cliente sem email', () => {
    cy.contains('Cadastrar Cliente').click();
    
    // Preencher apenas o nome
    cy.get('#nome').type('João Silva');
    
    // Tentar submeter o formulário
    cy.get('button[type="submit"]').click();
    
    // Verificar que permanece na página de cadastro
    cy.url().should('include', '/clientes/novo');
  });

  it('deve formatar o telefone automaticamente', () => {
    cy.contains('Cadastrar Cliente').click();
    
    // Digitar números do telefone
    cy.get('#telefone').type('11987654321');
    
    // Verificar se foi formatado
    cy.get('#telefone').should('have.value', '(11) 98765-4321');
  });

  it('deve navegar para a lista de clientes', () => {
    cy.contains('Ver Clientes').click();
    cy.url().should('include', '/clientes');
    cy.contains('h2', 'Lista de Clientes').should('be.visible');
  });

  it('deve cancelar o cadastro e voltar para a lista', () => {
    cy.contains('Cadastrar Cliente').click();
    cy.contains('Cancelar').click();
    cy.url().should('include', '/clientes');
  });
});

