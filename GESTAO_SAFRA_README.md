# Gestão de Safra - Frontend

## 📋 Funcionalidades Implementadas

### ✅ Cadastro de Safra
- Formulário completo com validações
- Seleção de cultura, responsável e talhões
- Definição de metas (produtividade alvo, custo estimado)
- Valores estimados (receita e lucro previsto)
- Múltiplos talhões por safra
- Cálculo automático da data de colheita (backend)

### ✅ Listagem de Safras
- Tabela com todas as safras cadastradas
- Visualização de progresso
- Status da safra com cores (🟢🟡🔴)
- Dias até colheita
- Ações: visualizar, editar, deletar

### ✅ Dashboard
- Cards de safras ativas
- Visualização em cards seguindo o documento
- Ações rápidas
- Placeholders para custos e estoque

### ✅ Menu Lateral
- Item "Safra" com submenus
- Itens para Atividades, Custos e Estoque (aguardando implementação)

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
cd /home/victor.santos@kryptus.lan/Documentos/gitRepos/germinai/Repo-Germinai-react
npm install
```

### 2. Iniciar o Frontend

```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

### 3. Garantir que o Backend está Rodando

O backend deve estar rodando em: `http://localhost:8080`

```bash
cd /home/victor.santos@kryptus.lan/Documentos/gitRepos/germinai/Repo-Germinai-Java
./mvnw spring-boot:run
```

## 🧪 Como Testar

### 1. Login
- Acesse `http://localhost:5173/login`
- Faça login com suas credenciais

### 2. Dashboard
- Após o login, você será direcionado para `/application/home`
- Visualize as safras ativas em cards
- Use as ações rápidas para navegar

### 3. Criar Safra
- No menu lateral, clique em **Safra > Nova Safra**
- Ou clique no botão **"Nova Safra"** no dashboard
- Preencha o formulário:
  - **Nome**: Ex: "Safra de Milho 2024"
  - **Cultura**: Selecione uma cultura cadastrada (ID 1, 2 ou 3)
  - **Responsável**: Selecione um funcionário cadastrado
  - **Data de Início**: Selecione a data
  - **Área Total**: Ex: 80.0 ha
  - **(Opcional) Talhões**: Adicione talhões com área utilizada
  - **(Opcional) Metas**: Defina produtividade alvo e custo estimado
  - **(Opcional) Valores**: Receita estimada e lucro previsto
- Clique em **"Cadastrar Safra"**

### 4. Listar Safras
- No menu lateral, clique em **Safra > Listar Safras**
- Visualize todas as safras em formato de tabela
- Ações disponíveis:
  - 👁️ Visualizar (a implementar)
  - ✏️ Editar (a implementar)
  - 🗑️ Deletar

## 📦 Componentes Criados

### Services
- `SafraService.ts` - Comunicação com API de safras
- `CulturaService.ts` - Comunicação com API de culturas
- `TalhaoService.ts` - Comunicação com API de talhões
- `FuncionarioService.ts` - Comunicação com API de funcionários

### Pages
- `CreateSafra.tsx` - Formulário de cadastro de safra
- `ListSafras.tsx` - Listagem de safras em tabela
- `Dashboard.tsx` - Dashboard com visão geral

### Components
- `SafraCard.tsx` - Card de safra para o dashboard
- `SideBarMenu.tsx` - Menu lateral atualizado

## 🎨 Seguindo o Documento

As telas foram criadas seguindo as especificações do documento:

### Cards de Safra (Página 4)
✅ Nome da cultura
✅ Área plantada (ha)
✅ Fase atual (status)
✅ Dias até colheita
✅ Status geral com ícone colorido (🟢🟡🔴)
✅ Progresso da safra (%)
✅ Responsável

### Formulário de Cadastro
✅ Nome da safra
✅ Cultura (dropdown)
✅ Responsável (dropdown)
✅ Data de início
✅ Área total
✅ Talhões (múltiplos)
✅ Metas (produtividade alvo, custo estimado)
✅ Valores estimados (receita, lucro)

## 📝 Próximos Passos

- [ ] Página de visualização detalhada de safra
- [ ] Página de edição de safra
- [ ] Gestão de Atividades
- [ ] Gestão de Custos
- [ ] Gestão de Estoque
- [ ] Calendário da safra
- [ ] Relatórios financeiros
- [ ] Gráficos de custos x receitas
- [ ] IA de Preços

## 🐛 Troubleshooting

### Erro de CORS
Se você receber erro de CORS, verifique se o backend está configurado para aceitar requisições do frontend (porta 5173).

### Erro 401 (Unauthorized)
A autenticação está temporariamente desabilitada no backend para testes. Se receber erro 401, verifique a configuração de segurança no backend.

### Erro ao carregar dropdowns
Certifique-se de que existem culturas, funcionários e talhões cadastrados no backend. Use o Postman para criar registros antes de testar o frontend.

## 📚 Tecnologias Utilizadas

- **React** 19.1.1
- **TypeScript** 5.8.3
- **Vite** 7.1.2
- **React Router DOM** 7.8.2
- **PrimeReact** 10.9.7 (componentes UI)
- **PrimeIcons** 7.0.0 (ícones)
- **Axios** 1.11.0 (requisições HTTP)

## 🎯 Compatibilidade com Backend

As interfaces TypeScript seguem exatamente os DTOs do backend:
- `SafraCreateRequest` ↔️ `SafraCreateRequest.java`
- `SafraResponse` ↔️ `SafraResponse.java`
- `TalhaoSafraRequest` ↔️ `TalhaoSafraRequest.java`
- `MetaSafraRequest` ↔️ `MetaSafraRequest.java`
