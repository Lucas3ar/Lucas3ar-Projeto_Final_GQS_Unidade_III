# Sistema de Controle de Vendas e Clientes

## Descrição

Este é um sistema completo de controle de vendas e clientes desenvolvido como projeto final da disciplina de Gestão da Qualidade de Software. O sistema foi construído seguindo a arquitetura MVC (Model-View-Controller) utilizando Node.js, Express.js e SQLite, oferecendo uma interface web intuitiva e uma API RESTful completa.

## Funcionalidades

### Gerenciamento de Clientes
- Cadastro de novos clientes com validação de dados
- Listagem de todos os clientes cadastrados
- Visualização de detalhes de clientes específicos
- Atualização de informações de clientes existentes
- Exclusão de clientes do sistema
- Validação de email único para evitar duplicatas

### Controle de Vendas
- Registro de novas vendas vinculadas aos clientes
- Listagem completa de vendas com informações do cliente
- Visualização detalhada de vendas específicas
- Atualização de dados de vendas existentes
- Exclusão de registros de vendas
- Cálculo automático de totais e resumos

### Interface Web
- Design responsivo e moderno
- Navegação intuitiva entre as funcionalidades
- Formulários com validação em tempo real
- Mensagens de feedback para o usuário
- Formatação automática de campos (telefone, valores)

### API RESTful
- Endpoints completos para operações CRUD
- Validação de dados de entrada
- Tratamento adequado de erros
- Respostas em formato JSON
- Códigos de status HTTP apropriados

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js
- **Banco de Dados**: SQLite
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Template Engine**: EJS
- **Testes**: Jest, Supertest, Cypress
- **Controle de Versão**: Git

## Estrutura do Projeto

```
projeto-final/
├── src/
│   ├── controllers/          # Controladores MVC
│   │   ├── clienteController.js
│   │   └── vendaController.js
│   ├── models/              # Modelos de dados
│   │   ├── Cliente.js
│   │   └── Venda.js
│   ├── routes/              # Definição de rotas
│   │   ├── clienteRoutes.js
│   │   └── vendaRoutes.js
│   ├── views/               # Templates EJS
│   │   ├── index.ejs
│   │   ├── clientes/
│   │   │   ├── novo.ejs
│   │   │   └── listar.ejs
│   │   └── vendas/
│   │       ├── novo.ejs
│   │       └── listar.ejs
│   ├── public/              # Arquivos estáticos
│   │   └── style.css
│   └── database/            # Banco de dados
│       └── database.sqlite
├── tests/
│   ├── unit/                # Testes unitários
│   │   └── cliente.simple.test.js
│   └── integration/         # Testes de integração
│       └── api.test.js
├── cypress/
│   └── e2e/                 # Testes E2E
│       ├── cliente.cy.js
│       └── venda.cy.js
├── app.js                   # Arquivo principal
├── package.json             # Dependências e scripts
├── cypress.config.js        # Configuração do Cypress
└── README.md               # Este arquivo
```

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd projeto-final
```

2. Instale as dependências:
```bash
npm install
```

3. Instale as dependências de desenvolvimento (para testes):
```bash
npm install --save-dev jest supertest cypress
```

## Como Executar

### Executar a Aplicação

1. Inicie o servidor:
```bash
npm start
```
ou
```bash
node app.js
```

2. Acesse a aplicação no navegador:
```
http://localhost:3000
```

### Executar os Testes

#### Testes Unitários e de Integração
```bash
npm test
```

#### Testes com Cobertura
```bash
npm run test:coverage
```

#### Testes E2E com Cypress
```bash
# Executar em modo headless
npm run cypress:run

# Abrir interface gráfica do Cypress
npm run cypress:open
```

## API Endpoints

### Clientes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/clientes` | Criar novo cliente |
| GET | `/api/clientes` | Listar todos os clientes |
| GET | `/api/clientes/:id` | Buscar cliente por ID |
| PUT | `/api/clientes/:id` | Atualizar cliente |
| DELETE | `/api/clientes/:id` | Deletar cliente |

#### Exemplo de Payload para Cliente:
```json
{
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "telefone": "11987654321"
}
```

### Vendas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/vendas` | Criar nova venda |
| GET | `/api/vendas` | Listar todas as vendas |
| GET | `/api/vendas/:id` | Buscar venda por ID |
| PUT | `/api/vendas/:id` | Atualizar venda |
| DELETE | `/api/vendas/:id` | Deletar venda |

#### Exemplo de Payload para Venda:
```json
{
  "id_cliente": 1,
  "data": "2025-07-17",
  "valor": 150.50,
  "descricao": "Venda de produtos de informática"
}
```

## Rotas Web

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial |
| `/clientes` | Lista de clientes |
| `/clientes/novo` | Formulário de cadastro de cliente |
| `/vendas` | Lista de vendas |
| `/vendas/novo` | Formulário de cadastro de venda |

## Banco de Dados

O sistema utiliza SQLite como banco de dados, com as seguintes tabelas:

### Tabela `clientes`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `nome` (TEXT NOT NULL)
- `email` (TEXT UNIQUE NOT NULL)
- `telefone` (TEXT)

### Tabela `vendas`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `id_cliente` (INTEGER NOT NULL, FOREIGN KEY)
- `data` (TEXT NOT NULL)
- `valor` (REAL NOT NULL)
- `descricao` (TEXT)

## Validações

### Cliente
- Nome: obrigatório, máximo 100 caracteres
- Email: obrigatório, formato válido, único no sistema
- Telefone: opcional, máximo 20 caracteres

### Venda
- Cliente: obrigatório, deve existir no sistema
- Data: obrigatória, formato de data válido
- Valor: obrigatório, número positivo
- Descrição: opcional, máximo 500 caracteres

## Tratamento de Erros

O sistema implementa tratamento adequado de erros com:
- Códigos de status HTTP apropriados
- Mensagens de erro descritivas
- Validação de entrada de dados
- Tratamento de erros de banco de dados
- Feedback visual para o usuário na interface web

## Testes

O projeto inclui uma suíte completa de testes:

### Testes Unitários
- Testam os modelos de dados isoladamente
- Verificam operações CRUD básicas
- Validam tratamento de erros

### Testes de Integração
- Testam a API completa
- Verificam endpoints e respostas
- Validam integração entre componentes

### Testes E2E (End-to-End)
- Testam fluxos completos da aplicação
- Verificam interface do usuário
- Simulam interações reais do usuário

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do curso de Análise e Desenvolvimento de Sistemas.

## Autor

Desenvolvido como projeto final da disciplina TAD0203 - Gestão da Qualidade de Software.

## Suporte

Para dúvidas ou problemas, entre em contato através dos canais de comunicação da disciplina.

