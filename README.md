# Pool Pet

Pet Project

## Project Structure

This is a monorepo using Turborepo with the following structure:

### Apps

- `web`: Next.js frontend application
- `api`: Backend API service

### Packages

- `db`: Database package with shared database configurations and utilities
- `ui`: Shared React component library (Was in template, I think can be removed)
- `eslint-config`: Shared ESLint configurations
- `typescript-config`: Shared TypeScript configurations

## Prerequisites

- Node.js >= 18 (20.19.0 Recommended)
- npm >= 10.8.2

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

This will start both the frontend and backend applications in development mode.

## Available Scripts

- `npm run dev`: Start all applications in development mode
- `npm run build`: Build all applications and packages
- `npm run lint`: Run ESLint across all packages and applications
- `npm run format`: Format code using Prettier
- `npm run check-types`: Run TypeScript type checking across all packages

## Development

The project uses:

- [Turborepo](https://turbo.build/repo) for build system and task running
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## License

[Add your license information here]
