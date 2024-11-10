# Atelier

A comprehensive TypeScript monorepo featuring a collection of UI components, utilities, and tools built with modern web technologies.

## Project Structure

```bash
atelier/
├── packages/
│   ├── shared/           # Shared utilities and tools
│   │   ├── structs/      # Data structures
│   │   │   ├── observable/       # Observer pattern implementations
│   │   │   └── spatial/          # Spatial data structures
│   │   ├── types/       # TypeScript type utilities
│   │   └── utils/       # Utility functions
│   │       ├── api/     # API client utilities
│   │       ├── common/  # Common utilities
│   │       ├── hash/    # Hashing utilities
│   │       ├── http/    # HTTP client utilities
│   │       ├── image/   # Image utilities
│   │       ├── json/    # JSON manipulation
│   │       ├── logger/  # Logging utilities
│   │       ├── promise/ # Promise utilities
│   │       ├── random/  # Random number generation
│   │       ├── schema/  # Schema tools
│   │       └── zod/     # Zod utilities
│   └── client/          # Client-side packages
│       ├── hooks/       # React hooks
│       │   ├── core/    # Core React hooks
│       │   └── crdt/    # CRDT collaboration hooks
│       └── ui/          # UI components
│           ├── admin/   # Admin interface components
│           ├── core/    # Core UI components
│           ├── json/    # JSON visualization
│           ├── llm/     # LLM interface components
│           └── viz/     # Visualization components
└── configs/             # Shared configurations
```

## Core Modules

### Shared Packages

#### Data Structures

- [@atelier/structs-observable](packages/shared/structs/observable/README.md) - Observer pattern implementation
- [@acausal/structs-spatial](packages/shared/structs/spatial-partitioning/README.md) - Spatial data structures

#### Type System

- [@acausal/types](packages/shared/types/README.md) - TypeScript type utilities

#### Core Utilities

- [@acausal/utils-api](packages/shared/utils/api/README.md) - API client wrapper utilities
- [@acausal/utils-common](packages/shared/utils/common/README.md) - Common utility functions
- [@acausal/utils-hash](packages/shared/utils/hash/README.md) - Hashing algorithms and utilities
- [@acausal/utils-http](packages/shared/utils/http/README.md) - HTTP client with Zod validation
- [@acausal/utils-image](packages/shared/utils/image/README.md) - Image type detection and handling
- [@acausal/utils-json](packages/shared/utils/json/README.md) - JSON manipulation utilities
- [@acausal/utils-logger](packages/shared/utils/logger/README.md) - Structured logging utilities
- [@acausal/utils-promise](packages/shared/utils/promise/README.md) - Promise utilities with backoff
- [@acausal/utils-random](packages/shared/utils/random/README.md) - Random number generation
- [@acausal/utils-schema](packages/shared/utils/schema/README.md) - Schema analysis tools
- [@acausal/utils-zod](packages/shared/utils/zod/README.md) - Zod schema utilities

### Client Packages

#### React Hooks

- [@acausal/hooks-core](packages/client/hooks/hooks-core/README.md) - Core React hooks
- [@acausal/hooks-crdt](packages/client/hooks/hooks-crdt/README.md) - CRDT collaboration hooks

#### UI Components

- [@acausal/ui-admin](packages/client/ui/ui-admin/README.md) - Admin interface components
- [@acausal/ui-core](packages/client/ui/ui-core/README.md) - Core UI components
- [@acausal/ui-json](packages/client/ui/ui-json/README.md) - JSON visualization
- [@acausal/ui-llm](packages/client/ui/ui-llm/README.md) - LLM interface components
- [@acausal/ui-viz](packages/client/ui/ui-viz/README.md) - Visualization components

## Getting Started

### Prerequisites

- Node.js >= 18
- PNPM >= 8

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/atelier.git

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Development

```bash
# Start development mode
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm typecheck
```

## Key Features

### Type Safety

- Full TypeScript support across all packages
- Zod schema validation
- Runtime type checking
- Advanced type utilities

### UI Components

- Shadcn/ui integration
- Responsive design
- Dark mode support
- Accessibility features

### Data Handling

- CRDT-based collaboration
- JSON visualization
- Schema analysis
- Data validation

### Development Tools

- Storybook documentation
- Jest testing
- ESLint configuration
- Prettier formatting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
