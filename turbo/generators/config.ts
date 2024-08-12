import { execSync } from "node:child_process";
import type { PlopTypes } from "@turbo/gen";

interface PackageJson {
  name: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("init", {
    description: "Generate a new package for the Monorepo",
    prompts: [
      {
        type: "input",
        name: "workspace",
        message: "What is the workspace of the package?",
      },
      {
        type: "input",
        name: "name",
        message:
          "What is the name of the package? (You can skip the `@acausal/` prefix)",
      },
      {
        type: "input",
        name: "deps",
        message:
          "Enter a space separated list of dependencies you would like to install",
      },
    ],
    actions: [
      (answers) => {
        if (
          "name" in answers &&
          typeof answers.name === "string" &&
          "workspace" in answers &&
          typeof answers.workspace === "string"
        ) {
          // if (!answers.name.startsWith("@")) {
          //   answers.name = `@acausal/${answers.name}`;
          // }
          // if (answers.name.startsWith("@acausal/")) {
          //   answers.name = answers.name.replace("@acausal/", "");
          // }
        }
        return "Config sanitized";
      },
      {
        type: "add",
        path: "packages/{{workspace}}/{{ name }}/eslint.config.js",
        templateFile: "templates/eslint.config.js.hbs",
      },
      {
        type: "add",
        path: "packages/{{workspace}}/{{ name }}/jest.config.js",
        templateFile: "templates/jest.config.js.hbs",
      },
      {
        type: "add",
        path: "packages/{{workspace}}/{{ name }}/package.json",
        templateFile: "templates/package.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{workspace}}/{{ name }}/tsconfig.json",
        templateFile: "templates/tsconfig.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{workspace}}/{{ name }}/src/index.ts",
        template: "export const name = '{{ name }}';",
      },
      {
        type: "modify",
        path: "packages/{{workspace}}/{{ name }}/package.json",
        async transform(content, answers) {
          if ("deps" in answers && typeof answers.deps === "string") {
            const pkg = JSON.parse(content) as PackageJson;
            for (const dep of answers.deps.split(" ").filter(Boolean)) {
              const version = await fetch(
                `https://registry.npmjs.org/-/package/${dep}/dist-tags`,
              )
                .then((res) => res.json())
                .then((json) => json.latest);
              if (!pkg.dependencies) pkg.dependencies = {};
              pkg.dependencies[dep] = `^${version}`;
            }
            return JSON.stringify(pkg, null, 2);
          }
          return content;
        },
      },
      async (answers) => {
        /**
         * Install deps and format everything
         */
        if (
          "name" in answers &&
          typeof answers.name === "string" &&
          "workspace" in answers &&
          typeof answers.workspace === "string"
        ) {
          // execSync("pnpm dlx sherif@latest --fix", {
          //   stdio: "inherit",
          // });
          execSync("pnpm i", { stdio: "inherit" });
          execSync(
            `pnpm prettier --write packages/${answers.workspace}/${answers.name}/** --list-different`,
          );
          return "Package scaffolded";
        }
        return "Package not scaffolded";
      },
    ],
  });
}
