import fs from "fs/promises";
import path from "path";
import url, { fileURLToPath } from "url";

import {
  SchemaAnalyzer,
  SchemaVisualizer,
  ZodExporter,
} from "../dist/index.js";

// Add this near the top of the file
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

async function analyzeAndExport() {
  // Clear data directory
  const dataDir = path.resolve(__dirname, "../data");
  await fs.rm(dataDir, { recursive: true, force: true });
  await fs.mkdir(dataDir, { recursive: true });

  // Read game dataset
  const gameDataPath = path.resolve(__dirname, "../mocks/game-dataset.json");
  const gameData = JSON.parse(await fs.readFile(gameDataPath, "utf-8"));

  // Analyze schema
  const analyzer = new SchemaAnalyzer();
  const rootNodeId = analyzer.analyze(gameData);
  const graph = analyzer["graph"];

  // Generate visualization
  const visualizer = new SchemaVisualizer(graph);
  const visualization = visualizer.generateVisualization();
  const mermaidDiagram = visualizer.generateMermaidDiagram();

  // Export Zod schemas
  const zodExporter = new ZodExporter();
  const schemas = zodExporter.export(graph);

  // Save artifacts
  await Promise.all([
    fs.writeFile(
      path.join(dataDir, "schema-visualization.json"),
      JSON.stringify(visualization, null, 2),
    ),
    fs.writeFile(path.join(dataDir, "schema-diagram.mmd"), mermaidDiagram),
    fs.writeFile(
      path.join(dataDir, "schema-zod.ts"),
      generateZodSchemaFile(schemas),
    ),
    fs.writeFile(
      path.join(dataDir, "schema-graph.json"),
      JSON.stringify(graph.getAllNodes(), null, 2),
    ),
  ]);
}

/**
 * @param {Record<string, import("zod").ZodType<any, import("zod").ZodTypeDef, any>>} schemas
 */
function generateZodSchemaFile(schemas) {
  return `import { z } from "zod";

// Generated Zod schemas
export const schemas = ${JSON.stringify(schemas, null, 2)};
`;
}

// Run if called directly
// @ts-ignore
if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  analyzeAndExport().catch(console.error);
}
