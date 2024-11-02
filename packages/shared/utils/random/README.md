# @acausal/utils-random

A comprehensive random number generation toolkit with support for seeded RNG, various distributions, and advanced sampling methods.

## Installation

```bash
pnpm add @acausal/utils-random
```

## Features

### Core Random Generation

Mersenne Twister implementation with seeding support:

- Predictable random sequences
- 32-bit number generation
- Long period (2^19937-1)
- High-quality distribution
- State management

### Distribution Types

#### Basic Distributions

- Uniform distribution
- Normal (Gaussian) distribution
- Log-normal distribution
- Exponential distribution
- Pareto distribution

#### Advanced Distributions

- Bates distribution
- Irwin-Hall distribution
- Beta distribution
- Gamma distribution
- Weibull distribution
- Cauchy distribution
- Logistic distribution

#### Discrete Distributions

- Bernoulli distribution
- Geometric distribution
- Binomial distribution
- Poisson distribution

### Random Sampling

Advanced sampling utilities:

- Weighted sampling
- Reservoir sampling
- Rejection sampling
- Importance sampling
- Stratified sampling

## Usage

### Basic Random Generation

```typescript
import { Random } from "@acausal/utils-random";

// Create a seeded random number generator
const rng = new Random({ seed: 12345 });

// Generate random numbers
const integer = rng.integer(1, 10); // Random integer between 1 and 10
const real = rng.real(0, 1); // Random float between 0 and 1
const bool = rng.bool(0.7); // Random boolean with 70% true probability
```

### Array Operations

```typescript
// Pick random items
const array = [1, 2, 3, 4, 5];
const item = rng.pick(array);

// Weighted selection
const weighted = {
  rare: 0.1,
  common: 0.6,
  uncommon: 0.3,
};
const selection = rng.pickWeighted(weighted);
```

### Distribution Sampling

```typescript
import { RandomSampler } from "@acausal/utils-random";

// Normal distribution
const normalSampler = new RandomSampler({
  type: "normal",
  mu: 0,
  sigma: 1,
});

// Poisson distribution
const poissonSampler = new RandomSampler({
  type: "poisson",
  lambda: 3,
});

// Beta distribution
const betaSampler = new RandomSampler({
  type: "beta",
  alpha: 2,
  beta: 5,
});
```

### State Management

```typescript
// Clone RNG state
const rngClone = rng.clone();

// Serialize state
const state = rng.serialize();

// Create from state
const newRng = Random.new(state.seed, state.uses);
```

## API Reference

### Random Class

```typescript
class Random {
  constructor(config: { seed?: number | number[]; uses?: number });

  integer(min: number, max: number): number;
  real(min: number, max: number): number;
  bool(percentage?: number): boolean;
  pick<T>(source: T[], begin?: number, end?: number): T;
  pickWeighted(weights: Record<string, number>, mask?: string[]): string;

  clone(useCount?: number): Random;
  serialize(): { seed: number | number[]; uses: number };
}
```

### Distribution Types

```typescript
type RandomSamplerType =
  | "uniform"
  | "normal"
  | "logNormal"
  | "bates"
  | "irwinHall"
  | "exponential"
  | "pareto"
  | "bernoulli"
  | "geometric"
  | "binomial"
  | "gamma"
  | "beta"
  | "weibull"
  | "cauchy"
  | "logistic"
  | "poisson";

interface RandomSamplerConfig {
  type: RandomSamplerType;
  // Distribution-specific parameters...
}
```

### Mersenne Twister

```typescript
class MersenneTwister {
  constructor(seed?: number | number[], uses?: number);

  random(): number; // [0, 1) interval
  randomIncl(): number; // [0, 1] interval
  randomExcl(): number; // (0, 1) interval
  randomInt(): number; // 32-bit integer
  randomInt31(): number; // 31-bit integer
  randomLong(): number; // 53-bit precision

  discard(count?: number): void;
}
```

## Documentation

See the [API documentation](./docs/api.md) for detailed usage information and advanced features.
