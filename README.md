
# Cashly 2.0

**Seu dinheiro, seu controle.**

## Sobre o projeto

O Cashly é um aplicativo mobile de controle de despesas pessoais,
desenvolvido como atividade avaliativa da disciplina de
Desenvolvimento para Dispositivos Móveis do curso de Sistemas
de Informação.

O aplicativo tem como objetivo facilitar o registro, a consulta
e o gerenciamento de despesas, proporcionando ao usuário uma
visão organizada de seus gastos.

## Funcionalidades

- Cadastro de despesas com descrição, valor e categoria.
- Consulta das despesas cadastradas.
- Edição e exclusão de despesas.
- Confirmação antes da exclusão.
- Validação dos campos do formulário.
- Busca de despesas por descrição.
- Filtro de despesas por categoria.
- Exibição da data de cadastro.
- Dashboard com total de despesas, quantidade e gasto médio.
- Resumo dos gastos por categoria com barras de porcentagem.
- Persistência local dos dados.
- Autenticação utilizando os recursos de segurança do dispositivo.

## Tecnologias utilizadas

- React Native
- TypeScript
- Expo
- React Navigation
- AsyncStorage
- Expo Local Authentication
- Expo Vector Icons

## Navegação

O aplicativo possui quatro telas:

- **Autenticação:** controla o acesso ao aplicativo.
- **Início:** apresenta o resumo financeiro e os gastos por categoria.
- **Cadastro:** permite adicionar e editar despesas.
- **Histórico:** permite consultar, buscar, filtrar e excluir despesas.

A navegação entre as três telas principais é realizada por meio
de uma barra de navegação inferior (Bottom Tabs).

## Persistência de dados

A persistência é realizada utilizando a biblioteca AsyncStorage.

As despesas são armazenadas localmente no dispositivo em formato
JSON e recuperadas após a autenticação do usuário.

As operações de cadastro, edição e exclusão são salvas
automaticamente, permitindo que os dados permaneçam disponíveis
mesmo após o encerramento do aplicativo.

## Recurso nativo

O aplicativo utiliza a biblioteca expo-local-authentication
para realizar a autenticação nativa do dispositivo.

O acesso pode ser autorizado por impressão digital,
reconhecimento facial compatível ou credenciais de segurança
do dispositivo, conforme a disponibilidade do sistema operacional.

Também são tratados casos de cancelamento, falha na autenticação
e ausência de métodos de segurança cadastrados.

O aplicativo não armazena informações biométricas ou senhas.
A autenticação controla o acesso à interface, mas não criptografa
os dados armazenados no AsyncStorage.

## Organização do projeto

- `components/`: componentes reutilizáveis do aplicativo.
- `screens/`: telas de autenticação, início, cadastro e histórico.
- `services/`: funções de armazenamento e recuperação dos dados.
- `types/`: definição dos tipos utilizados no projeto.
- `assets/`: recursos visuais.
- `App.tsx`: gerenciamento dos estados e integração das telas.

## Bibliotecas adicionais

- `@react-native-async-storage/async-storage`
- `@react-navigation/native`
- `@react-navigation/bottom-tabs`
- `react-native-screens`
- `react-native-safe-area-context`
- `expo-local-authentication`
- `@expo/vector-icons`

## Como executar o projeto

### Pré-requisitos

- Node.js instalado.
- Gerenciador de pacotes npm.
- Aplicativo Expo Go instalado em um dispositivo compatível.

### Instalação

Instale as dependências do projeto:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npx expo start
```

Escaneie o QR Code apresentado no terminal utilizando o Expo Go.

O dispositivo deve possuir um método de segurança configurado
para realizar a autenticação.

## Desenvolvimento

## Vídeo de demonstração

O vídeo apresenta as principais funcionalidades do Cashly 2.0.

[Baixar vídeo de demonstração](./demonstracao/Demonstracao-Cashly.mp4?raw=true)

Devido ao tamanho do arquivo, pode ser necessário realizar
o download para assistir ao vídeo.
Projeto acadêmico desenvolvido para a disciplina de
Desenvolvimento para Dispositivos Móveis.

Curso: Sistemas de Informação.

Versão: 2.0.0
