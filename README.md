# Context Manager - Sistema de Gerenciamento de Contextos Pessoal

Um sistema pessoal de gerenciamento de contextos que utiliza **engenharia de contextos** para organizar, categorizar e acessar rapidamente informações relevantes para diferentes situações e projetos.

## 🎯 Visão Geral

O **Context Manager** é uma aplicação web moderna que permite aos usuários:

- **Organizar conhecimento** por domínios específicos (trabalho, estudo, pessoal, saúde, financeiro)
- **Acelerar o acesso** a informações relevantes através de contextos bem definidos
- **Melhorar a produtividade** através de transições rápidas entre contextos
- **Criar um sistema escalável** para uso pessoal sem dependência de bancos de dados

## 🏗️ Arquitetura

### Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Armazenamento**: Sistema de arquivos local (JSON)
- **Build Tools**: Vite, ESLint, Prettier
- **UI Components**: Lucide React (ícones)

### Estrutura do Projeto

```
context-manager/
├── src/
│   ├── client/           # Frontend React
│   │   ├── components/   # Componentes React
│   │   ├── hooks/        # Hooks customizados
│   │   ├── services/     # Serviços de API
│   │   ├── types/        # Tipos TypeScript
│   │   └── utils/        # Utilitários
│   ├── server/           # Backend Node.js
│   └── types/            # Tipos compartilhados
├── data/                 # Armazenamento local
├── dist/                 # Build de produção
└── docs/                 # Documentação
```

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd context-manager
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute em modo de desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Executa frontend e backend simultaneamente
npm run dev:client       # Executa apenas o frontend
npm run dev:server       # Executa apenas o backend

# Build
npm run build           # Build completo
npm run build:client    # Build do frontend
npm run build:server    # Build do backend

# Produção
npm start               # Executa em modo produção

# Qualidade de código
npm run lint            # Executa ESLint
npm run lint:fix        # Corrige problemas do ESLint
npm run format          # Formata código com Prettier
npm run type-check      # Verifica tipos TypeScript
```

## 📋 Funcionalidades

### 1. Gerenciamento de Contextos
- ✅ Criar, editar e deletar contextos
- ✅ Hierarquia de contextos (contexto pai/filho)
- ✅ Tags e categorização
- ✅ Cores contextuais (trabalho, estudo, pessoal, saúde, financeiro)
- ✅ Status ativo/inativo

### 2. Gerenciamento de Informações
- ✅ Adicionar notas, links, arquivos, tarefas e lembretes
- ✅ Sistema de busca contextual
- ✅ Filtros por tipo de informação
- ✅ Prioridades (baixa, média, alta, urgente)
- ✅ Tags para organização

### 3. Interface de Contexto
- ✅ Dashboard contextual com estatísticas
- ✅ Transição rápida entre contextos
- ✅ Visualização hierárquica
- ✅ Indicadores de contexto ativo

### 4. Sistema de Busca
- ✅ Busca por título, conteúdo e tags
- ✅ Filtros por tipo de informação
- ✅ Resultados em tempo real

### 5. Backup e Restauração
- ✅ Exportação de dados em JSON
- ✅ Importação de dados
- ✅ Backup automático

## 🎨 Design System

### Paleta de Cores Contextual

- **Trabalho**: Azul (#0ea5e9)
- **Estudo**: Amarelo (#eab308)
- **Pessoal**: Rosa (#ec4899)
- **Saúde**: Verde (#22c55e)
- **Financeiro**: Laranja (#f59e0b)

### Componentes

- **Botões**: Primário, secundário, perigo, fantasma
- **Inputs**: Texto, textarea, seleção
- **Cards**: Containers com sombras e bordas
- **Badges**: Contexto e prioridade
- **Modais**: Para criação e edição

## 🔧 Engenharia de Contextos

O sistema implementa os princípios de **engenharia de contextos**:

### 1. Context Switching
- Minimiza o custo de transição entre contextos
- Interface adaptativa baseada no contexto ativo
- Indicadores visuais de contexto atual

### 2. Context Awareness
- Sistema adaptativo baseado no contexto atual
- Filtros automáticos por contexto
- Sugestões contextuais

### 3. Context Persistence
- Mantém informações relevantes entre sessões
- Backup automático de dados
- Restauração de estado

### 4. Context Hierarchy
- Organização hierárquica de informações
- Relacionamentos pai/filho entre contextos
- Navegação estruturada

## 📊 API Endpoints

### Contextos
```
GET    /api/contexts              # Listar contextos
GET    /api/contexts/:id          # Obter contexto específico
POST   /api/contexts              # Criar contexto
PUT    /api/contexts/:id          # Atualizar contexto
DELETE /api/contexts/:id          # Deletar contexto
```

### Informações
```
GET    /api/information           # Listar informações
GET    /api/information/:id       # Obter informação específica
POST   /api/information           # Criar informação
PUT    /api/information/:id       # Atualizar informação
DELETE /api/information/:id       # Deletar informação
```

### Busca e Estatísticas
```
POST   /api/search                # Buscar informações
GET    /api/dashboard             # Estatísticas do dashboard
GET    /api/health                # Health check
```

## 🗄️ Estrutura de Dados

### Context
```typescript
interface Context {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  tags: string[];
  isActive: boolean;
  color?: ContextColor;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Information
```typescript
interface Information {
  id: string;
  contextId: string;
  type: 'note' | 'link' | 'file' | 'task' | 'reminder';
  title: string;
  content: string;
  metadata: Record<string, any>;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚀 Roadmap

### Fase 1 - MVP ✅
- [x] Estrutura básica do projeto
- [x] Gerenciamento básico de contextos
- [x] Interface de listagem
- [x] CRUD de informações

### Fase 2 - Funcionalidades Core ✅
- [x] Sistema de busca
- [x] Hierarquia de contextos
- [x] Dashboard contextual
- [x] Exportação de dados

### Fase 3 - Melhorias 🔄
- [ ] Interface responsiva completa
- [ ] Temas visuais (dark/light mode)
- [ ] Atalhos de teclado
- [ ] Validações avançadas

### Fase 4 - Otimizações 📋
- [ ] Performance e otimizações
- [ ] Acessibilidade (WCAG)
- [ ] Testes automatizados
- [ ] Documentação completa

### Fase 5 - Expansões 🔮
- [ ] Sincronização em nuvem
- [ ] Integração com APIs externas
- [ ] Sistema de plugins
- [ ] Análise avançada de dados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ usando engenharia de contextos para melhorar a produtividade pessoal.

---

**Context Manager** - Organize seu conhecimento, maximize sua produtividade.