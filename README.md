# iPag Pagamentos Digitais

Sistema de gestão de pedidos desenvolvido com Node.js, PostgreSQL e RabbitMQ.

## 🏗️ Arquitetura

O sistema é composto por:

- **API REST**: Gerenciamento de pedidos e clientes
- **Worker**: Processamento assíncrono de atualizações de status
- **PostgreSQL**: Banco de dados relacional
- **RabbitMQ**: Sistema de mensageria para comunicação assíncrona

## 🚀 Como Executar o Projeto

Todo o projeto foi configurado para rodar com Docker. A única dependência que você precisa ter instalada na sua máquina é o Docker e o Docker Compose.

### 1. Clonar o Repositório

```bash
git clone https://github.com/JoaoValim/desafioIpag
cd desafioIpag
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```env
# --- Configuração do Banco de Dados ---
DB_USER=postgres
DB_HOST=database
DB_DATABASE=ipag_db
DB_PASSWORD=123456
DB_PORT=5433

# URL de conexão completa
DATABASE_URL="postgres://postgres:123456@database:5433/ipag_db"

# --- Configuração do RabbitMQ ---
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672

# --- Configuração das Filas e Exchanges ---
EXCHANGE_NAME_STATUS=pagamentos.direct
EXCHANGE_TYPE_STATUS=direct
QUEUE_STATUS=order_status_updates
QUEUE_STATUS_ROUTING_KEY=status.update
QUEUE_STATUS_DLQ=order_status_updates_dlq
QUEUE_STATUS_DLQ_ROUTING_KEY=update.error
```

### 3. Construir e Iniciar os Contêineres

Este comando irá construir a imagem da sua aplicação e iniciar todos os serviços (API, worker, Postgres, RabbitMQ) em segundo plano.

```bash
docker-compose up -d --build
```

### 4. Executar as Migrations do Banco

Com os contêineres em execução, execute as migrations para criar as tabelas no banco de dados.

```bash
docker-compose exec app npm run migrate:up
```

### 5. Verificar se Tudo está Rodando

- **API**: A sua API estará disponível em http://localhost:3000
- **RabbitMQ Management**: A interface de gerenciamento do RabbitMQ estará disponível em http://localhost:15672 (login: guest, senha: guest)
- **Banco de Dados**: Seu banco estará acessível na porta 5433 do seu localhost

## ⚙️ Fluxo de Trabalho de Desenvolvimento

Para aplicar alterações no código:

```bash
docker-compose up -d --build
```

Para ver os logs em tempo real:

```bash
docker-compose logs -f app      # Logs da API
docker-compose logs -f worker   # Logs do Worker
```

Para parar todo o ambiente:

```bash
docker-compose down
```

## 📄 Documentação da API

A documentação completa dos endpoints, incluindo exemplos de requisição e resposta, está disponível no arquivo OpenAPI/Swagger em `documentation/swagger.yml`.

### Principais rotas disponíveis:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/orders` | Lista todos os pedidos |
| POST | `/orders` | Cria um novo pedido |
| GET | `/orders/{id}` | Busca um pedido por ID |
| PUT | `/orders/{id}/status` | Atualiza o status de um pedido |
| GET | `/orders/summary` | Retorna um resumo estatístico completo |

### Exemplos de Requisições

#### 1. Criar um novo pedido - `POST /orders`

```json
{
  "customer": {
    "id": 1,
    "name": "João Silva",
    "document": "12345678901",
    "email": "joao@email.com",
    "phone": "(11) 99999-9999"
  },
  "order": {
    "total_value": 150.50,
    "items": [
      {
        "product_name": "Produto A",
        "quantity": 2,
        "unit_value": 50.25
      },
      {
        "product_name": "Produto B",
        "quantity": 1,
        "unit_value": 50.00
      }
    ]
  }
}
```

#### 2. Atualizar status do pedido - `PUT /orders/{id}/status`

```json
{
  "id": 1,
  "status": "PAID",
  "notes": "Pagamento confirmado via PIX"
}
```

**Status disponíveis:**
- `PENDING` - Pendente
- `WAITING_PAYMENT` - Aguardando pagamento
- `PAID` - Pago
- `PROCESSING` - Processando
- `SHIPPED` - Enviado
- `DELIVERED` - Entregue
- `CANCELED` - Cancelado

#### 3. Buscar pedido por ID - `GET /orders/{id}`

Não requer body, apenas o ID na URL:
```
GET /orders/1
```

#### 4. Listar todos os pedidos - `GET /orders`

Não requer body:
```
GET /orders
```

#### 5. Resumo estatístico - `GET /orders/summary`

Não requer body:
```
GET /orders/summary
```

### Exemplo de Resposta

#### Resposta de criação de pedido (201):
```json
{
  "message": "Pedido criado com sucesso"
}
```

#### Resposta de consulta de pedido (200):
```json
{
  "order_id": "ORD-12345",
  "status": "PENDING",
  "total_value": 150.50,
  "customer": {
    "id": 1,
    "name": "João Silva",
    "document": "12345678901",
    "email": "joao@email.com",
    "phone": "11999999999"
  },
  "items": [
    {
      "product_name": "Produto A",
      "quantity": 2,
      "unit_value": 50.25
    }
  ],
  "created_at": "2025-08-29T12:00:00Z"
}
```

#### Resposta de resumo estatístico (200):
```json
{
  "total_orders": 150,
  "total_value": 15750.80,
  "by_status": {
    "PENDING": 25,
    "PAID": 80,
    "DELIVERED": 35,
    "CANCELED": 10
  }
}
```

## 🗂️ Estrutura do Projeto

```
├── api/                          # API REST
│   ├── controllers/              # Controladores da API
│   ├── db/                       # Configuração do banco e migrations
│   ├── dto/                      # Data Transfer Objects
│   ├── errors/                   # Classes de erro customizadas
│   ├── model/                    # Modelos de dados
│   ├── repositories/             # Camada de acesso aos dados
│   ├── routes/                   # Definição das rotas
│   ├── services/                 # Lógica de negócio
│   └── utils/                    # Utilitários
├── worker/                       # Worker para processamento assíncrono
├── rabbitmq/                     # Configuração do RabbitMQ
├── documentation/                # Documentação da API
├── docker-compose.yml            # Configuração dos serviços
└── Dockerfile                    # Imagem da aplicação
```

## 🔧 Tecnologias Utilizadas

- **Node.js**: JavaScript
- **Express**: Framework web
- **PostgreSQL**: Banco de dados 
- **RabbitMQ**: Sistema de mensageria
- **Docker**: Containerização
- **node-postgres**: Driver PostgreSQL para Node.js
- **amqplib**: Client RabbitMQ para Node.js

## 📝 Funcionalidades

- ✅ Criação e gerenciamento de pedidos
- ✅ Processamento assíncrono de atualizações de status
- ✅ Sistema de notificações via RabbitMQ
- ✅ Validação de dados com DTOs
- ✅ Tratamento de erros customizado
- ✅ Migrations automáticas do banco de dados
- ✅ Documentação completa da API