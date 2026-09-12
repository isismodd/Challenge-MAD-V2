# ClyvoPet

**ClyvoPet** é um aplicativo mobile desenvolvido para **clínicas veterinárias**, permitindo que profissionais gerenciem animais, consultas e lembretes de forma integrada a uma API REST real hospedada no Microsoft Azure.

O aplicativo é **exclusivo para profissionais da área veterinária** e possui autenticação real, CRUD completo e integração de ponta a ponta com o backend Java Spring Boot.

---

## Sobre o Projeto

O Clivo Vet oferece duas experiências distintas:

###  Veterinário
- Gerenciar pacientes e seus dados
- Agendar e gerenciar consultas
- Acompanhar saúde preventiva dos animais

---

## Tecnologias Utilizadas

| React Native | 0.81.5 | Framework mobile |
| Expo | ~52.0.0 | Plataforma de desenvolvimento |
| TypeScript | ~5.3.3 | Tipagem estática |
| React Navigation | ^6.x | Navegação entre telas (Stack + Tabs) |
| TanStack Query | ^5.x | Gerenciamento de estado e cache de dados |
| Axios | ^1.x | Cliente HTTP para integração com a API |
| AsyncStorage | 1.23.1 | Persistência local do token e sessão |

## Integração com a API

O aplicativo consome a **API REST ClyvoPet**, hospedada no Microsoft Azure:

**URL Base:** `https://clyvo-pet-rm561497.azurewebsites.net/api`

### Endpoints Utilizados

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Autenticação do veterinário |
| `POST` | `/auth/register` | Cadastro de novo veterinário |
| `GET` | `/animais` | Listar todos os animais |
| `GET` | `/animais/{id}` | Buscar animal por ID |
| `POST` | `/animais` | Criar novo animal |
| `PUT` | `/animais/{id}` | Atualizar animal |
| `DELETE` | `/animais/{id}` | Excluir animal |
| `GET` | `/consultas` | Listar todas as consultas |
| `GET` | `/consultas/{id}` | Buscar consulta por ID |
| `POST` | `/consultas` | Criar nova consulta |
| `PUT` | `/consultas/{id}` | Atualizar consulta |
| `DELETE` | `/consultas/{id}` | Excluir consulta |
| `GET` | `/lembretes` | Listar todos os lembretes |
| `POST` | `/lembretes/enviar-todos` | Enviar todos os lembretes pendentes |
| `GET` | `/veterinarios` | Listar veterinários |


## Estrutura de Pastas

```
Challenge-MAD-V2/
├── assets/ # Imagens e ícones
│ ├── clyvoLogo.png
│ └── homeBG.jpg
├── src/
│ ├── control/
│ │ └── AuthContext.tsx # Autenticação + persistência de sessão
│ ├── hooks/ # Hooks do TanStack Query (lógica de negócio)
│ │ ├── useAnimais.ts
│ │ ├── useConsultas.ts
│ │ ├── useLembretes.ts
│ │ └── useVeterinarios.ts
│ ├── services/ # Camada de acesso à API (Axios)
│ │ ├── api.ts # Configuração do Axios + interceptor JWT
│ │ ├── authService.ts
│ │ ├── animalService.ts
│ │ ├── consultaService.ts
│ │ ├── lembreteService.ts
│ │ └── veterinarioService.ts
│ └── view/ # Interface (telas e navegação)
│ ├── App/
│ │ └── App.tsx # Navegação raiz + QueryClientProvider
│ ├── login/
│ │ ├── LoginScreen.tsx
│ │ └── CadastroScreen.tsx
│ └── vet/
│ ├── VetNavigator.tsx # Navegação por abas
│ ├── HomeScreen.tsx
│ ├── PerfilAnimaisScreen.tsx
│ ├── CadastroAnimalScreen.tsx
│ ├── DetalhesAnimalScreen.tsx
│ ├── AgendaScreen.tsx
│ ├── CadastroConsultaScreen.tsx
│ ├── DetalhesConsultaScreen.tsx
│ └── SaudePreventivaScreen.tsx
├── App.tsx (ou index.ts)
├── app.json
└── package.json

```

## Telas do Aplicativo

| Tela | Funcionalidade |
| :--- | :--- |
| **Login** | Autenticação do veterinário |
| **Cadastro** | Cadastro de novo veterinário |
| **Início** | Boas-vindas + logout |
| **Animais** | Lista de animais com botões: Visualizar, Editar, Excluir |
| **Detalhes do Animal** | Tabela com todos os dados do animal + Editar/Excluir/Voltar |
| **Cadastro/Editar Animal** | Formulário com labels + campos validados |
| **Agenda (Consultas)** | Lista de consultas com 5 ações: Visualizar, Editar, Cancelar, Finalizar, Enviar Lembrete |
| **Detalhes da Consulta** | Tabela de dados + Finalizar/Editar/Cancelar/Voltar |
| **Cadastro/Editar Consulta** | Formulário com seleção de animal e veterinário |
| **Lembretes** | Painel com Total/Enviados/Pendentes + Filtro + Enviar Todos |

## Como Instalar e Executar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo Go (no celular) ou emulador Android/iOS

### Passos para execução

1. **Clone o repositório**
```
git clone https://github.com/isismodd/Challenge-MAD-V2.git
cd Challenge-MAD-V2
```
2. Instale as dependências

```
npm install --legacy-peer-deps
```
3. Instale as dependências do Expo
   
```
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-gesture-handler
npx expo install @tanstack/react-query axios
npm install react-icons --save
```
4. Inicie o projeto

```
npm run android
```

## Credenciais de Teste

| Perfil | Email | Senha |
|--------|-------|-------|
| **Veterinário** | `vet@clivovet.com` | qualquer |
| **Veterinário** | `veterinario@clivovet.com` | qualquer |
| **Veterinário** | `dr@clivovet.com` | qualquer |

> 💡 **Dica:** Qualquer email/senha funciona! O sistema identifica automaticamente seu perfil pelo email informado.

## Dependências Principais
```
{
  "react-native": "0.81.5",
  "expo": "~52.0.0",
  "@react-navigation/native": "^6.1.18",
  "@react-navigation/stack": "^6.4.1",
  "@react-navigation/bottom-tabs": "^6.6.1",
  "@react-native-async-storage/async-storage": "1.23.1",
  "react-native-screens": "~4.16.0",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-gesture-handler": "~2.20.2",
  "typescript": "^5.3.3"
}
```

## Observações
-Todos os dados são provenientes da API REST real no Azure.

-A sessão do usuário é persistida com AsyncStorage (não precisa logar novamente ao reabrir).

-As rotas são protegidas — só acessa telas internas após autenticação.

-O cache é gerenciado pelo TanStack Query (atualização automática após mutações).

-O app é exclusivo para veterinários (não há perfil de tutor).
```

## Backend
-O backend do ClyvoPet foi desenvolvido em Java Spring Boot e está hospedado no Microsoft Azure App Service.

-Repositório do backend: https://github.com/isismodd/ChallengeJava3.git

-URL da API: https://clyvo-pet-rm561497.azurewebsites.net

-Banco de dados: Oracle Database

-Autenticação: Spring Security + JWT

## Grupo do Challenge
Ana Clara de Oliveira Nascimento | RM 561957
Isis Macedo | RM 561497
Henrique Pereira | RM 565608
Rafael Carvalho Meireles | RM 563413

**Link do vídeo no YouTube:**
