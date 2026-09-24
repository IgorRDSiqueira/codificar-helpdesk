# HelpDesk - Gestão de Chamados Internos

Aplicação web desenvolvida como desafio técnico para a Codificar.

O objetivo do projeto é centralizar solicitações internas de uma empresa, permitindo o cadastro, acompanhamento e gerenciamento de chamados, além da distribuição automática dos atendimentos entre os responsáveis disponíveis.

---

## Funcionalidades

### Chamados

A aplicação permite:

- Criar chamados
- Listar chamados
- Visualizar os detalhes de um chamado
- Editar chamados
- Alterar o status
- Alterar a prioridade
- Transferir o responsável
- Buscar chamados por título, descrição ou responsável
- Filtrar chamados por status
- Filtrar chamados por prioridade
- Filtrar chamados por responsável

Cada chamado possui:

- Título
- Descrição
- Prioridade
- Status
- Responsável
- Data e hora de abertura
- Data e hora da última atualização

### Prioridades

As prioridades disponíveis são:

- Baixa
- Média
- Alta

### Status

Os chamados podem assumir os seguintes estados:

- Aberto
- Em andamento
- Resolvido
- Fechado

---

## Distribuição automática de chamados

Ao criar um chamado, o usuário pode escolher entre:

1. selecionar manualmente um responsável;
2. utilizar a distribuição automática.

Na distribuição automática, o sistema seleciona o responsável com a menor quantidade de chamados ativos.

### O que é considerado um chamado ativo?

Para fins de distribuição de carga, são considerados ativos:

- `OPEN`
- `IN_PROGRESS`

Não são considerados ativos:

- `RESOLVED`
- `CLOSED`

A decisão foi tomada porque chamados resolvidos ou fechados não representam mais trabalho pendente para o responsável.

### Critério de desempate

Caso dois ou mais responsáveis possuam a mesma quantidade de chamados ativos, é selecionado o responsável mais antigo no cadastro.

A consulta dos responsáveis é ordenada por `createdAt ASC`, tornando o critério de desempate determinístico.

Exemplo:

```text
Ana Souza      -> 3 chamados ativos
Bruno Lima     -> 1 chamado ativo
Carlos Mendes  -> 2 chamados ativos

Novo chamado com distribuição automática
                    |
                    v
               Bruno Lima
```

---

## Responsáveis

A aplicação possui responsáveis previamente cadastrados para atendimento dos chamados.

Não foi criada uma tela administrativa específica para responsáveis porque o requisito do desafio determina apenas que exista um conjunto de responsáveis disponíveis para seleção.

Os dados iniciais são criados através do seed do banco.

---

## Dashboard

A página inicial apresenta uma visão geral da operação, incluindo informações como:

- quantidade de chamados ativos;
- chamados de alta prioridade;
- chamados concluídos;
- quantidade de responsáveis;
- chamados recentes.

O objetivo é permitir que a equipe tenha uma visão rápida do estado atual dos atendimentos.

---

## Busca e filtros

A tela de chamados possui ferramentas para facilitar o acompanhamento diário.

É possível:

- pesquisar por título;
- pesquisar por descrição;
- pesquisar por responsável;
- filtrar por status;
- filtrar por prioridade;
- filtrar por responsável;
- combinar múltiplos filtros;
- limpar todos os filtros.

---

## Tecnologias utilizadas

### Aplicação

- Next.js
- React
- TypeScript
- App Router

### Interface

- Tailwind CSS
- shadcn
- Base UI
- Lucide React

### Backend

A própria aplicação Next.js fornece as rotas HTTP através de Route Handlers.

Isso permite manter frontend e backend no mesmo projeto, reduzindo o atrito de desenvolvimento para uma equipe full stack pequena.

### Banco de dados

- PostgreSQL
- Prisma ORM
- Prisma PostgreSQL Adapter

### Testes

- Vitest

### Infraestrutura local

- Docker
- Docker Compose

---

## Decisões arquiteturais

### Full stack com Next.js

Foi utilizada uma arquitetura full stack com Next.js.

A escolha reduz a quantidade de projetos e configurações necessárias para manter a aplicação, compartilhando TypeScript, modelos e estrutura entre interface e backend.

Para uma equipe pequena, isso reduz o custo de manutenção e o atrito entre frontend e backend.

### PostgreSQL

O PostgreSQL foi escolhido por ser um banco relacional robusto e adequado para representar entidades relacionadas, como chamados e responsáveis.

### Prisma

O Prisma foi utilizado para:

- modelagem do banco;
- migrations;
- consultas;
- relacionamentos;
- tipagem;
- seed dos dados.

O uso de tipos gerados também reduz inconsistências entre banco de dados e aplicação.

### Separação da regra de distribuição

A lógica de seleção do responsável foi separada da camada de acesso ao banco.

A função responsável pela decisão recebe as cargas de trabalho e retorna o responsável com menor quantidade de chamados ativos.

Essa separação facilita:

- testes unitários;
- manutenção;
- leitura do código;
- evolução futura da estratégia de distribuição.

---

## Estrutura simplificada

```text
codificar-helpdesk/
|
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
|
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── assignees/
│   │   │   └── tickets/
│   │   │
│   │   ├── chamados/
│   │   │   ├── [id]/
│   │   │   │   └── editar/
│   │   │   └── novo/
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   ├── generated/
│   ├── lib/
│   └── services/
|
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

# Executando o projeto localmente

## Pré-requisitos

Antes de iniciar, tenha instalado:

- Node.js
- npm
- Docker Desktop
- Git

---

## 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta:

```bash
cd codificar-helpdesk
```

---

## 2. Instalar as dependências

```bash
npm install
```

---

## 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto.

Exemplo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/codificar_helpdesk?schema=public"
```

A URL deve corresponder às configurações presentes no `docker-compose.yml`.

O arquivo `.env` não deve ser versionado.

---

## 4. Iniciar o PostgreSQL

Com o Docker Desktop em execução:

```bash
docker compose up -d
```

Confira o container:

```bash
docker compose ps
```

---

## 5. Gerar o Prisma Client

```bash
npx prisma generate
```

---

## 6. Aplicar as migrations

```bash
npx prisma migrate deploy
```

Para desenvolvimento, também pode ser utilizado:

```bash
npx prisma migrate dev
```

---

## 7. Popular o banco

Execute o seed:

```bash
npx prisma db seed
```

O seed cria os responsáveis iniciais utilizados pela aplicação.

---

## 8. Executar a aplicação

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

---

# Testes

Execute todos os testes com:

```bash
npm test
```

Também existe o modo de observação para desenvolvimento:

```bash
npm run test:watch
```

Os testes cobrem principalmente a regra central de distribuição dos chamados.

Entre os cenários testados estão:

- seleção do responsável com menor carga;
- responsável sem chamados ativos;
- empate entre responsáveis;
- ausência de responsáveis;
- preservação dos dados recebidos pela regra;
- definição dos status considerados ativos;
- filtro utilizado na consulta ao banco;
- integração entre carga retornada e seleção do responsável.

---

## Qualidade de código

### TypeScript

```bash
npx tsc --noEmit
```

### ESLint

```bash
npm run lint
```

### Build de produção

```bash
npm run build
```

Antes da entrega, o projeto foi validado através de testes automatizados, TypeScript, ESLint e build de produção.

---

## API

### Responsáveis

```text
GET /api/assignees
```

Retorna os responsáveis disponíveis.

### Chamados

```text
GET /api/tickets
POST /api/tickets
```

### Chamado específico

```text
GET /api/tickets/:id
PATCH /api/tickets/:id
```

---

## Princípios adotados

Durante o desenvolvimento foram priorizados:

- separação de responsabilidades;
- componentização;
- tipagem estática;
- DRY;
- regras de negócio isoladas;
- código simples e legível;
- testes da lógica crítica;
- tratamento de erros;
- interface responsiva;
- facilidade de execução local.

---

## Trade-offs

O projeto foi desenvolvido priorizando os requisitos principais e a qualidade da implementação.

Por esse motivo, algumas funcionalidades comuns em sistemas de help desk não fazem parte deste escopo, como:

- autenticação;
- permissões por usuário;
- comentários;
- anexos;
- notificações;
- histórico detalhado de alterações;
- SLA;
- categorias;
- cadastro administrativo de responsáveis.

Essas funcionalidades podem ser incorporadas futuramente sem alterar a regra central de distribuição.

A opção foi manter o escopo enxuto e investir em uma implementação consistente dos requisitos solicitados.

---

## Referências e bibliotecas externas

Foram utilizadas bibliotecas e ferramentas externas, incluindo:

- Next.js
- React
- TypeScript
- Prisma
- PostgreSQL
- Tailwind CSS
- shadcn
- Base UI
- Lucide React
- Vitest
- Docker

As respectivas documentações oficiais foram utilizadas como referência durante o desenvolvimento.

---

## Autor

Desenvolvido por **Igor Rafael** como parte do desafio técnico da Codificar.