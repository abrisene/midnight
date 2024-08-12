import { z } from "zod";

export type RandomSamplerType = RandomSamplerDTO["type"];
export const RandomSamplerType = z.enum([
  "default",
  "uniform",
  "normal",
  "logNormal",
  "bates",
  "irwinHall",
  "exponential",
  "pareto",
  "bernoulli",
  "geometric",
  "binomial",
  "gamma",
  "beta",
  "weibull",
  "cauchy",
  "logistic",
  "poisson",
]);

export const UniformDTO = z.object({
  type: z.literal(RandomSamplerType.enum.uniform),
  min: z.number().describe("The minimum value"),
  max: z.number().describe("The maximum value"),
});

export const NormalDTO = z.object({
  type: z.literal("normal"),
  mu: z.number().describe("The mean"),
  sigma: z.number().describe("The standard deviation"),
});

export const LogNormalDTO = z.object({
  type: z.literal("logNormal"),
  mu: z.number().describe("The mean"),
  sigma: z.number().describe("The standard deviation"),
});

export const BatesDTO = z.object({
  type: z.literal("bates"),
  n: z.number().describe("The number of samples"),
});

export const IrwinHallDTO = z.object({
  type: z.literal("irwinHall"),
  n: z.number().describe("The number of samples"),
});

export const ExponentialDTO = z.object({
  type: z.literal("exponential"),
  lambda: z.number().describe("The rate"),
});

export const ParetoDTO = z.object({
  type: z.literal("pareto"),
  alpha: z.number().describe("The shape"),
});

export const BernoulliDTO = z.object({
  type: z.literal("bernoulli"),
  p: z.number().describe("The probability of success"),
});

export const GeometricDTO = z.object({
  type: z.literal("geometric"),
  p: z.number().describe("The probability of success"),
});

export const BinomialDTO = z.object({
  type: z.literal("binomial"),
  n: z.number().describe("The number of trials"),
});

export const GammaDTO = z.object({
  type: z.literal("gamma"),
  k: z.number().describe("The shape"),
  theta: z.number().describe("The scale").optional(),
});

export const BetaDTO = z.object({
  type: z.literal("beta"),
  alpha: z.number().describe("The shape"),
  beta: z.number().describe("The shape"),
});

export const WeibullDTO = z.object({
  type: z.literal("weibull"),
  k: z.number().describe("The shape"),
  a: z.number().describe("The scale").optional(),
  b: z.number().describe("The shape").optional(),
});

export const CauchyDTO = z.object({
  type: z.literal("cauchy"),
  a: z.number().describe("The location").optional(),
  b: z.number().describe("The scale").optional(),
});

export const LogisticDTO = z.object({
  type: z.literal("logistic"),
  a: z.number().describe("The location").optional(),
  b: z.number().describe("The scale").optional(),
});

export const PoissonDTO = z.object({
  type: z.literal("poisson"),
  lambda: z.number().describe("The rate"),
});

export type RandomSamplerDTO = z.infer<typeof RandomSamplerDTO>;
export const RandomSamplerDTO = z.discriminatedUnion("type", [
  UniformDTO,
  NormalDTO,
  LogNormalDTO,
  BatesDTO,
  IrwinHallDTO,
  ExponentialDTO,
  ParetoDTO,
  BernoulliDTO,
  GeometricDTO,
  BinomialDTO,
  GammaDTO,
  BetaDTO,
  WeibullDTO,
  CauchyDTO,
  LogisticDTO,
  PoissonDTO,
]);
