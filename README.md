# Frontend RFSmart React

Aplicação web moderna construída com React, TypeScript e Vite, projetada para fornecer uma interface robusta e amigável para a plataforma RFSmart.

## Stack Tecnológica

- **React 19** - Biblioteca JavaScript para construção de interfaces de usuário
- **TypeScript** - Adiciona tipagem estática ao JavaScript
- **Vite** - Ferramenta de nova geração para frontend
- **TailwindCSS** - Framework CSS utilitário
- **React Router DOM** - Biblioteca de roteamento para React
- **Framer Motion** - Biblioteca de animação para React

## Começando

### Pré-requisitos

- Node.js (versão LTS recomendada)
- Gerenciador de pacotes npm ou yarn

### Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   #ou
   bun install
   ```

### Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
 npm run dev
 # ou
 yarn dev
 #ou
 bun run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Compilação para Produção

```bash
npm run build
# ou
yarn build
#ou
bun run build
```

## Estrutura do Projeto

```
src/
  ├── assets/      # Recursos estáticos
  ├── components/  # Componentes UI reutilizáveis
  ├── pages/       # Páginas/rotas da aplicação
  ├── App.tsx      # Componente principal da aplicação
  └── main.tsx     # Ponto de entrada da aplicação
```

## Diretrizes de Desenvolvimento

### Estilo de Código

- O projeto utiliza ESLint para linting de código
- Modo estrito do TypeScript está ativado
- Siga as melhores práticas e diretrizes de hooks do React

### Verificação de Tipos

Execute a verificação de tipos:

```bash
tsc -b
```

### Linting

Execute o ESLint:

```bash
npm run lint
# ou
yarn lint
#ou
bun run lint
```

## Dependências

### Principais

- react: ^19.0.0
- react-dom: ^19.0.0
- react-router-dom: ^7.2.0
- framer-motion: ^12.4.7
- tailwindcss: ^4.0.9

### Desenvolvimento

- typescript: ~5.7.2
- vite: ^6.2.0
- eslint: ^9.21.0
- @vitejs/plugin-react: ^4.3.4

## Licença

Este projeto é privado e confidencial. Todos os direitos reservados.
# FrontEnd-RFSmartReact
# FrontEnd-RFSmartReact
