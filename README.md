# Clivo Vet

**Clivo Vet** é um aplicativo mobile desenvolvido para clínicas veterinárias e tutores de pets, permitindo gerenciar consultas, animais, comunicação e benefícios em um só lugar.

---

## Sobre o Projeto

O Clivo Vet oferece duas experiências distintas:

###  Veterinário
- Gerenciar pacientes e seus dados
- Agendar e gerenciar consultas
- Acompanhar saúde preventiva dos animais
- Chat com tutores
- Comunidade para troca de experiências

###  Tutor
- Cadastrar e gerenciar seus pets
- Editar e excluir animais cadastrados
- Chat com veterinários
- Acessar benefícios e planos de saúde
- Participar da comunidade

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|------------|
| React Native | 0.81.5 | Framework mobile |
| TypeScript | ~5.3.3 | Tipagem estática |
| React Navigation | ^6.x | Navegação entre telas |
| AsyncStorage | 1.23.1 | Armazenamento local |

## 📁 Estrutura de Pastas

```
ClivoVet/
├── src/
│ ├── control/
│ │ ├── AuthContext.tsx # Autenticação e persistência
│ │ └── AnimalContext.tsx # Gerenciamento dos pets
│ ├── model/
│ │ ├── index.ts # Exportações centralizadas
│ │ ├── User.ts # Tipos de usuário
│ │ ├── Veterinario.ts # Tipo Veterinário
│ │ ├── Tutor.ts # Tipo Tutor
│ │ ├── Animal.ts # Tipo Animal
│ │ └── Consulta.ts # Tipo Consulta
│ └── view/
│ ├── App/
│ │ └── App.tsx # Ponto de entrada
│ ├── login/
│ │ └── LoginScreen.tsx # Tela de autenticação
│ ├── vet/
│ │ ├── VetNavigator.tsx # Navegador do Veterinário
│ │ ├── perfilAnimaisScreen.tsx
│ │ ├── AgendaScreen.tsx
│ │ ├── SaudePreventivaScreen.tsx
│ │ ├── ChatScreen.tsx
│ │ └── ComunidadeScreen.tsx
│ └── tutor/
│ ├── TutorNavigator.tsx # Navegador do Tutor
│ ├── MeusAnimaisScreen.tsx
│ ├── CadastroAnimaisScreen.tsx
│ ├── ChatScreen.tsx
│ ├── ComunidadeScreen.tsx
│ └── BeneficiosScreen.tsx

```

## 🎯 Funcionalidades

### Veterinário (6 telas)

| Tela | Funcionalidade |
|------|----------------|
| 🏠 Início | Informações do usuário e logout |
| 🐕 Animais | Lista de pacientes com busca e filtros |
| 📅 Agenda | Consultas do dia + formulário nova consulta |
| 💉 Saúde Preventiva | Lembretes de vacinas, vermífugos e check-ups |
| 💬 Chat | Conversas com tutores |
| 🌐 Comunidade | Feed com posts e interações |

### Tutor (6 telas)

| Tela | Funcionalidade |
|------|----------------|
| 🏠 Início | Informações do usuário e logout |
| 🐾 Meus Pets | Lista de animais com editar e excluir |
| 📝 Cadastrar Pet | Formulário para adicionar novo animal |
| 💬 Chat | Conversas com veterinários |
| 🌐 Comunidade | Feed com posts e interações |
| 🎁 Benefícios | Planos de saúde e descontos |

---

## Como Instalar e Executar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo Go (no celular) ou emulador Android/iOS

### Passos para execução

1. **Clone o repositório**
```
git clone https://github.com/seu-usuario/clivo-vet.git
cd clivo-vet
```
2. Instale as dependências

```
npm install --legacy-peer-deps
Instale as dependências do Expo
```

```
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-gesture-handler
```
3. Inicie o projeto
4. 
```
npx run android
```

## 🔐 Credenciais de Teste

| Perfil | Email | Senha |
|--------|-------|-------|
| 👨‍⚕️ **Veterinário** | `vet@clivovet.com` | qualquer |
| 👨‍⚕️ **Veterinário** | `veterinario@clivovet.com` | qualquer |
| 👨‍⚕️ **Veterinário** | `dr@clivovet.com` | qualquer |
| 🏠 **Tutor** | `tutor@clivovet.com` | qualquer |
| 🏠 **Tutor** | `cliente@clivovet.com` | qualquer |

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
- Os dados são mockados (não há backend real)

- O AsyncStorage mantém o usuário logado entre sessões

- O chat possui respostas automáticas simuladas

- Os pets são compartilhados entre telas via Context API
