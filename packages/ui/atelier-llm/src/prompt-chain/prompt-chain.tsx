import React from "react";
import { Alert, AlertDescription } from "@acausal/ui-core/alert";
import { Button } from "@acausal/ui-core/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acausal/ui-core/card";
import { Input } from "@acausal/ui-core/input";
import { Label } from "@acausal/ui-core/label";
import { Textarea } from "@acausal/ui-core/textarea";

// Types
interface PromptStep {
  id: number;
  key: string;
  name: string;
  content: string;
  previewResponse: string;
}

interface PromptChain {
  name: string;
  description: string;
  steps: PromptStep[];
}

// Custom Hook
export const usePromptChain = () => {
  const [chain, setChain] = React.useState<PromptChain>({
    name: "New Chain",
    description: "A new prompt chain",
    steps: [
      {
        id: 1,
        key: "s1",
        name: "Analyze Situation",
        content:
          "Analyze the following situation and figure out what to do: {SITUATION}",
        previewResponse:
          "Based on the situation, we should contact the customer and offer a replacement product.",
      },
      {
        id: 2,
        key: "s2",
        name: "Determine Tools",
        content:
          "You have decided to perform the following action: {ctx.LAST}. Based off of this action, determine which of the following tools to use: {TOOLS}",
        previewResponse:
          "We should use the Customer Service Hotline to contact the customer and the Product Replacement process to send a new item.",
      },
      {
        id: 3,
        key: "s3",
        name: "Execute Action",
        content: "Use {ctx.LAST} to {ctx.S1}",
        previewResponse:
          "I will use the Customer Service Hotline to contact the customer and initiate the Product Replacement process to resolve their complaint about the defective product.",
      },
    ],
  });

  const [variables, setVariables] = React.useState<Set<string>>(new Set());

  const updateChainMetadata = (name: string, description: string) => {
    setChain((prevChain) => ({ ...prevChain, name, description }));
  };

  const addPromptStep = () => {
    const newId = chain.steps.length + 1;
    setChain((prevChain) => ({
      ...prevChain,
      steps: [
        ...prevChain.steps,
        {
          id: newId,
          key: `s${newId}`,
          name: `Step ${newId}`,
          content: "",
          previewResponse: "",
        },
      ],
    }));
  };

  const updatePromptStep = (id: number, updates: Partial<PromptStep>) => {
    setChain((prevChain) => ({
      ...prevChain,
      steps: prevChain.steps.map((step) =>
        step.id === id ? { ...step, ...updates } : step,
      ),
    }));
  };

  const removePromptStep = (id: number) => {
    setChain((prevChain) => ({
      ...prevChain,
      steps: prevChain.steps.filter((step) => step.id !== id),
    }));
  };

  const detectVariables = (text: string) => {
    const matches = text.match(/\{([^}]+)\}/g) || [];
    return new Set(matches.map((match) => match.slice(1, -1)));
  };

  React.useEffect(() => {
    const allVariables = new Set<string>();
    chain.steps.forEach((step) => {
      const stepVariables = detectVariables(step.content);
      stepVariables.forEach((variable) => allVariables.add(variable));
    });
    setVariables(allVariables);
  }, [chain.steps]);

  const getCombinedTemplate = () => {
    return chain.steps
      .map((step) => `${step.key} (${step.name}): ${step.content}`)
      .join("\n\n");
  };

  const saveChain = () => {
    localStorage.setItem("promptChain", JSON.stringify(chain));
    alert("Chain saved successfully!");
  };

  const loadChain = () => {
    const savedChain = localStorage.getItem("promptChain");
    if (savedChain) {
      setChain(JSON.parse(savedChain));
      alert("Chain loaded successfully!");
    } else {
      alert("No saved chain found.");
    }
  };

  return {
    chain,
    variables,
    updateChainMetadata,
    addPromptStep,
    updatePromptStep,
    removePromptStep,
    getCombinedTemplate,
    saveChain,
    loadChain,
  };
};

// Utility function
const highlightVariables = (text: string) => {
  return text.replace(
    /\{([^}]+)\}/g,
    (match, variable) =>
      `<span class="bg-yellow-200/20 px-1 rounded">${match}</span>`,
  );
};

// Components
export const ChainMetadata: React.FC<{
  name: string;
  description: string;
  onUpdate: (name: string, description: string) => void;
}> = ({ name, description, onUpdate }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Chain Metadata</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="chain-name">Chain Name</Label>
          <Input
            id="chain-name"
            value={name}
            onChange={(e) => onUpdate(e.target.value, description)}
            placeholder="Enter chain name"
          />
        </div>
        <div>
          <Label htmlFor="chain-description">Description</Label>
          <Input
            id="chain-description"
            value={description}
            onChange={(e) => onUpdate(name, e.target.value)}
            placeholder="Enter chain description"
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const VariableDisplay: React.FC<{ variables: Set<string> }> = ({
  variables,
}) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Detected Variables</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2">
        {Array.from(variables).map((variable) => (
          <Button key={variable} variant="secondary" className="cursor-default">
            {variable}
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const PromptStepCard: React.FC<{
  step: PromptStep;
  onUpdate: (id: number, updates: Partial<PromptStep>) => void;
  onRemove: (id: number) => void;
}> = ({ step, onUpdate, onRemove }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Prompt Step {step.id}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="mb-2 grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <Label htmlFor={`key-${step.id}`}>Key</Label>
          <Input
            id={`key-${step.id}`}
            value={step.key}
            onChange={(e) => onUpdate(step.id, { key: e.target.value })}
            placeholder="Step key"
          />
        </div>
        <div className="col-span-3">
          <Label htmlFor={`name-${step.id}`}>Name</Label>
          <Input
            id={`name-${step.id}`}
            value={step.name}
            onChange={(e) => onUpdate(step.id, { name: e.target.value })}
            placeholder="Step name"
          />
        </div>
      </div>
      <div className="mb-2">
        <Label htmlFor={`content-${step.id}`}>Content</Label>
        <Textarea
          id={`content-${step.id}`}
          value={step.content}
          onChange={(e) => onUpdate(step.id, { content: e.target.value })}
          placeholder={`Enter prompt for step ${step.id}`}
        />
      </div>
      <div className="mb-2">
        <Label htmlFor={`preview-${step.id}`}>Preview Response</Label>
        <Textarea
          id={`preview-${step.id}`}
          value={step.previewResponse}
          onChange={(e) =>
            onUpdate(step.id, { previewResponse: e.target.value })
          }
          placeholder={`Enter preview response for step ${step.id}`}
        />
      </div>
      <div
        className="mb-2 rounded bg-muted p-2"
        dangerouslySetInnerHTML={{ __html: highlightVariables(step.content) }}
      />
      <Button variant="destructive" onClick={() => onRemove(step.id)}>
        Remove Step
      </Button>
    </CardContent>
  </Card>
);

export const CombinedTemplate: React.FC<{ template: string }> = ({
  template,
}) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Combined Prompt Template</CardTitle>
    </CardHeader>
    <CardContent>
      <div
        className="whitespace-pre-wrap rounded bg-muted p-4"
        dangerouslySetInnerHTML={{ __html: highlightVariables(template) }}
      />
    </CardContent>
  </Card>
);

export const SimulatedResponses: React.FC<{ steps: PromptStep[] }> = ({
  steps,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Simulated LLM Responses</CardTitle>
    </CardHeader>
    <CardContent>
      {steps.map((step) => (
        <div key={step.key} className="mb-4">
          <h3 className="font-bold">
            {step.key} ({step.name}):
          </h3>
          <p className="whitespace-pre-wrap rounded p-2">
            {step.previewResponse}
          </p>
        </div>
      ))}
    </CardContent>
  </Card>
);

// Main Component
export const PromptChainEditor: React.FC = () => {
  const {
    chain,
    variables,
    updateChainMetadata,
    addPromptStep,
    updatePromptStep,
    removePromptStep,
    getCombinedTemplate,
    saveChain,
    loadChain,
  } = usePromptChain();

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Enhanced Prompt Chain Editor</h1>

      <Alert className="mb-4">
        <AlertDescription>
          Variables are automatically detected when you use the format{" "}
          {"{variable}"} in your prompts. Use {"{ctx.LAST}"} to reference the
          previous step's response, or {"{ctx.Sx}"} to reference a specific
          step's response (where x is the step number).
        </AlertDescription>
      </Alert>

      <div className="mb-4 flex justify-end space-x-2">
        <Button onClick={saveChain}>Save Chain</Button>
        <Button onClick={loadChain}>Load Chain</Button>
      </div>

      <ChainMetadata
        name={chain.name}
        description={chain.description}
        onUpdate={updateChainMetadata}
      />

      <VariableDisplay variables={variables} />

      {chain.steps.map((step) => (
        <PromptStepCard
          key={step.id}
          step={step}
          onUpdate={updatePromptStep}
          onRemove={removePromptStep}
        />
      ))}

      <Button onClick={addPromptStep} className="mb-4">
        Add Prompt Step
      </Button>

      <CombinedTemplate template={getCombinedTemplate()} />

      <SimulatedResponses steps={chain.steps} />
    </div>
  );
};
