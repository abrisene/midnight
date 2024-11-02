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
│   │       ├── json/    # JSON manipulation
│   │       ├── schema/  # Schema tools
│   │       └── zod/     # Zod utilities
│   └── client/          # Client-side packages
│       ├── hooks/       # React hooks
│       └── ui/          # UI components
└── configs/             # Shared configurations
```

## Core Modules

### Data Structures (@shared/structs)

#### Observable Pattern (@structs/observable)

Type-safe implementation of the Observer pattern with two main variants:

- **SimpleObservable**: Basic pub/sub implementation for event-driven architectures
- **StatefulObservable**: State management with automatic value broadcasting
- Perfect for building reactive systems and state management solutions

#### Spatial Partitioning (@structs/spatial)

Efficient spatial data structures for 2D and N-dimensional space:

- **Grid**: Optimized 2D grid with O(1) access and updates
- **MultiDimensionalGrid**: N-dimensional space partitioning
- Ideal for game development, spatial queries, and optimization problems

### Type Utilities (@shared/types)

Comprehensive TypeScript type helpers:

- **Function Types**: Advanced function type manipulation (currying, composition)
- **Object Types**: Deep partial, recursive types, and object manipulation
- **Promise Types**: Async operation type utilities
- **String Types**: Advanced string literal type manipulation
- **Zod Integration**: Enhanced schema type inference

### Utility Functions (@shared/utils)

#### API Client (@utils/api)

Robust API client building toolkit:

- Queue-based request management
- Automatic retry and reconnection
- Progress tracking for long operations
- Type-safe response handling
- Comprehensive error management

#### Common Utilities (@utils/common)

General-purpose utility functions:

- Array manipulation (chunking, shuffling, filtering)
- String operations (case conversion, templating)
- Number formatting and manipulation
- Type-safe utility functions

#### JSON Tools (@utils/json)

Advanced JSON manipulation utilities:

- Partial JSON parsing with error recovery
- JSON beautification with customization
- Deep equality checking
- Schema-based validation
- Circular reference handling

#### Schema Tools (@utils/schema)

Schema analysis and generation toolkit:

- Automatic schema inference from data
- Pattern detection and analysis
- Code generation (TypeScript, Zod)
- Schema visualization
- Documentation generation

#### Zod Extensions (@utils/zod)

Enhanced Zod schema utilities:

- Advanced schema composition
- Custom validation rules
- Schema transformation tools
- Code generation utilities
- Schema analysis and metrics

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

## Package Documentation

### Shared Packages

#### Data Structures

- [@atelier/structs-observable](packages/shared/structs/observable/README.md)
- [@acausal/structs-spatial](packages/shared/structs/spatial-partitioning/README.md)

#### Types

- [@acausal/types](packages/shared/types/README.md)

#### Utilities

- [@acausal/utils-api](packages/shared/utils/api/README.md)
- [@acausal/utils-common](packages/shared/utils/common/README.md)
- [@acausal/utils-json](packages/shared/utils/json/README.md)
- [@acausal/utils-schema](packages/shared/utils/schema/README.md)
- [@acausal/utils-zod](packages/shared/utils/zod/README.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
