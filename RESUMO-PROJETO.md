# TaskFlow - Resumo do Projeto

## Estrutura de Pastas

| Arquivo | Função |
|---------|--------|
| `src/main.jsx` | Ponto de entrada, envolve tudo com Providers |
| `src/App.jsx` | Define as rotas (URLs) |
| `src/index.css` | Estilos globais + controle dark/light |
| `src/Pages/Home/Home.jsx` | Página inicial |
| `src/Pages/Login/Login.jsx` | Página de login |
| `src/Pages/Register/Register.jsx` | Página de cadastro |
| `src/Pages/TaskFlow/TaskFlow.jsx` | Kanban board (projeto principal) |
| `src/components/layouts/Header/Header.jsx` | Menu de navegação (topo) |
| `src/components/layouts/Layout/Layout.jsx` | Estrutura que envolve todas as páginas |
| `src/components/layouts/ui/RotaProtegida.jsx` | Protege rotas (exige login) |
| `src/contexts/AuthContext.jsx` | Gerencia login/logout/cadastro |
| `src/contexts/ThemeContext.jsx` | Gerencia dark/light mode |

---

## 1. main.jsx - Ponto de Entrada

Ordem dos wrappers (de fora pra dentro):

1. **StrictMode** - modo rigoroso do React (ajuda a encontrar bugs)
2. **BrowserRouter** - habilita o sistema de rotas (URLs)
3. **ThemeProvider** - disponibiliza o tema para toda a app
4. **AuthProvider** - disponibiliza os dados do usuario para toda a app
5. **App** - o app em si

Por que essa ordem? Os Providers "envolvem" tudo que esta dentro. Assim qualquer componente filho pode acessar o tema e o usuario.

---

## 2. App.jsx - Roteador

| Rota | Pagina | Protegida? |
|------|--------|-----------|
| `/` | Home | Nao |
| `/login` | Login | Nao |
| `/register` | Register | Nao |
| `/app` | TaskFlow (kanban) | Sim |

O `Layout` e a "casca" - ele renderiza o Header e depois o `Outlet` mostra a pagina correspondente a URL atual.

---

## 3. AuthContext.jsx - Contexto de Autenticacao

### Estado inicial
Ao carregar, verifica se ja tem um usuario salvo no localStorage (persistencia entre sessoes).

### Funcoes:

**register(nome, email, senha)**
1. Pega lista de usuarios do localStorage
2. Verifica se email ja existe - se sim, lanca erro
3. Adiciona novo usuario na lista
4. Salva no localStorage

**login(email, senha)**
1. Pega lista de usuarios do localStorage
2. Procura um que tenha email E senha iguais
3. Se nao encontrar - lanca erro
4. Se encontrar - salva no state e no localStorage

**logout()**
1. Seta user como null
2. Remove do localStorage

**useAuth()** - hook para usar em qualquer componente:
- Retorna: `{ user, login, logout, register }`

---

## 4. ThemeContext.jsx - Contexto de Tema

### Estado inicial
Carrega tema salvo do localStorage, ou usa 'light' como padrao.

### useEffect
Toda vez que o tema muda:
1. Aplica `data-theme` no elemento HTML raiz
2. Salva no localStorage

### toggleTheme()
Se esta light vai pra dark. Se esta dark vai pra light.

**useTheme()** - hook:
- Retorna: `{ theme, toggleTheme }`

---

## 5. Layout.jsx - Estrutura das Paginas

Renderiza:
1. Header (sempre visivel)
2. `<Outlet />` (componente do React Router que renderiza a pagina da rota atual)

---

## 6. Header.jsx - Navegacao

Usa `useTheme()` para acessar tema e `useAuth()` para acessar usuario.

Logica condicional:
- Se user existe: mostra "Ola, nome" + botao Sair
- Se user e null: mostra botao "Entrar"

---

## 7. RotaProtegida.jsx - Guardar Rotas

Logica simples:
- Se nao tem usuario logado: redireciona para `/login`
- Se tem usuario: mostra a pagina normalmente (children)

---

## 8. Login.jsx - Pagina de Login

### States:
- `email`, `senha` - campos do formulario
- `erro` - mensagem de erro
- `carregando` - desabilita botao enquanto processa

### handleLogin(e):
1. `e.preventDefault()` - impede o form de recarregar a pagina
2. Valida se campos estao preenchidos
3. Chama `login(email, senha)` do AuthContext
4. Se deu certo: navigate('/') (vai pra home)
5. Se deu erro: mostra mensagem

---

## 9. Register.jsx - Pagina de Cadastro

Mesma logica do Login, com mais campos (nome, confirmarSenha).

### Validacoes extras:
- Senha minimo 6 caracteres
- Senhas devem coincidir
- Apos cadastro: redireciona pro /login

---

## 10. TaskFlow.jsx - O Kanban Board

### State principal - columns
Objeto com 3 colunas (todo, inProgress, done), cada uma com nome e array de items.

### addNewTask()
1. Verifica se input nao esta vazio
2. Cria novo item com id = Date.now() (timestamp como ID unico)
3. Adiciona na coluna selecionada (activeColumn)
4. Limpa o input

### removeTask(columnId, taskId)
1. Filtra o array da coluna, removendo o item com aquele ID

### Drag and Drop (arrastar e soltar):

**handleDragStart(columnId, item)** - Quando comeca a arrastar:
- Salva qual item e de qual coluna veio

**handleDragOver(e)** - Quando passa por cima de uma coluna:
- `e.preventDefault()` - necessario para permitir o drop

**handleDrop(e, columnId)** - Quando solta numa coluna:
1. Se nao tem item sendo arrastado: ignora
2. Se soltou na mesma coluna: ignora
3. Remove o item da coluna de origem
4. Adiciona na coluna de destino

### columnStyle - Cores de cada coluna:
- todo: azul (blue)
- inProgress: amarelo (yellow)
- done: verde (green)

---

## 11. index.css - Como o Dark Mode Funciona

O ThemeContext coloca `data-theme="dark"` no elemento `<html>`.
O CSS usa o seletor `[data-theme="dark"]` para mudar cores.

Exemplo:
- Light (padrao): fundo #f9fafb, texto #1f2937
- Dark: fundo #0f0f1a, texto #e5e7eb

---

## Conceitos Importantes

| Conceito | Onde aparece | O que faz |
|----------|-------------|-----------|
| useState | Todos os componentes | Guarda e atualiza dados |
| useEffect | ThemeContext | Executa codigo quando algo muda |
| useContext | Auth e Theme | Compartilha dados entre componentes |
| createContext | Contexts | Cria o "canal" de compartilhamento |
| useNavigate | Login, Register | Muda de pagina programaticamente |
| Outlet | Layout | Renderiza a rota filha |
| Navigate | RotaProtegida | Redireciona para outra rota |
| localStorage | Auth, Theme | Salva dados no navegador |
| Drag and Drop | TaskFlow | HTML5 drag API nativa |
| Conditional rendering | Header | {user ? (...) : (...)} |

---

## Fluxo Completo

1. Usuario abre o app - main.jsx carrega tudo
2. BrowserRouter le a URL - App.jsx decide qual pagina mostrar
3. Layout renderiza Header + a pagina
4. Se vai pro /app sem login - RotaProtegida redireciona pro /login
5. Usuario faz login - AuthContext salva no state + localStorage
6. Agora pode acessar /app - TaskFlow aparece
7. Usuario clica Dark - ThemeContext muda data-theme - CSS atualiza
8. Usuario fecha e reabre - localStorage mantem login e tema
