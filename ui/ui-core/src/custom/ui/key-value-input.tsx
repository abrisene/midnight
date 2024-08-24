import React, { useCallback, useState } from "react";

import { Button } from "../../shadcn/ui/button";
import { Input } from "../../shadcn/ui/input";
import { Label } from "../../shadcn/ui/label";
import { cn } from "../../utils";

interface KeyValuePair {
  key: string;
  value: string;
  weight?: number;
}

interface KeyValueEditorProps<ValueType extends string | number | boolean> {
  type: ValueType extends string
    ? "string"
    : ValueType extends number
      ? "number"
      : "boolean";
  defaultValues?: Partial<KeyValuePair>;
  label?: string;
  onKeyChanged?: (key: string) => void;
  onValueChanged?: (value: ValueType) => void;
  onWeightChanged?: (weight: number) => void;
  className?: string;
  inputClassName?: string;
  combinedInputClassName?: string;
  keyInputClassName?: string;
  valueInputClassName?: string;
  weightInputClassName?: string;
}

export const KeyValueEditor: React.FC<
  KeyValueEditorProps<string | number | boolean>
> = ({
  label,
  onKeyChanged,
  onValueChanged,
  onWeightChanged,
  defaultValues,
  className,
  inputClassName,
  combinedInputClassName,
  keyInputClassName,
  valueInputClassName,
  weightInputClassName,
}) => {
  const [combinedInput, setCombinedInput] = useState("");
  const [key, setKey] = useState(defaultValues?.key || "");
  const [value, setValue] = useState(defaultValues?.value || "");
  const [weight, setWeight] = useState<number | undefined>(
    defaultValues?.weight,
  );
  const [showSeparateFields, setShowSeparateFields] = useState(false);

  /* const parseCombinedInput = useCallback((input: string) => {
    const parts = input.split(":").map((part) => part.trim());
    const newKey = parts[0] || "";
    const newValue = parts[1] || "1";
    const newWeight = parts[2] ? parseFloat(parts[2]) : undefined;

    setKey(newKey);
    setValue(newValue);
    setWeight(newWeight);

    if (newKey && newValue) {
      setShowSeparateFields(true);
    }
  }, []); */

  const parseCombinedInput = useCallback((input: string) => {
    // First, check if the input is tab-separated (from Google Sheets)
    const spaceParts = input.split(/[\s\t]+/);
    if (spaceParts.length > 1) {
      const [newKey, newValue, newWeight] = spaceParts;
      setKey(newKey || "");
      setValue(newValue || "1");
      setWeight(newWeight ? parseFloat(newWeight) : undefined);
    } else {
      // If not tab-separated, use the original colon-separated logic
      const parts = input.split(":").map((part) => part.trim());
      const newKey = parts[0] || "";
      const newValue = parts[1] || "1";
      const newWeight = parts[2] ? parseFloat(parts[2]) : undefined;

      setKey(newKey);
      setValue(newValue);
      setWeight(newWeight);
    }

    if (key && value) {
      setShowSeparateFields(true);
    }
  }, []);

  const handleCombinedInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCombinedInput(e.target.value);
  };

  const handleCombinedInputBlur = () => {
    parseCombinedInput(combinedInput);
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
    if (onKeyChanged) {
      onKeyChanged(e.target.value);
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const weightValue = e.target.value ? parseFloat(e.target.value) : undefined;
    setWeight(weightValue);
    if (onWeightChanged && weightValue !== undefined) {
      onWeightChanged(weightValue);
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onValueChanged) {
      onValueChanged(e.target.value);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      {!showSeparateFields && (
        <div className="flex space-x-2">
          <Input
            placeholder="key:value:weight"
            value={combinedInput}
            onChange={handleCombinedInputChange}
            onBlur={handleCombinedInputBlur}
            className={cn("flex-grow", inputClassName, combinedInputClassName)}
          />
          {weight !== undefined && (
            <Input
              type="number"
              placeholder="Weight"
              value={weight}
              onChange={handleWeightChange}
              className={cn("w-24", weightInputClassName)}
            />
          )}
        </div>
      )}
      {showSeparateFields && (
        <div className="flex space-x-2">
          <Input
            placeholder="Key"
            value={key}
            onChange={handleKeyChange}
            className={cn("flex-grow", inputClassName, keyInputClassName)}
          />
          <Input
            placeholder="Value"
            value={value}
            onChange={handleValueChange}
            className={cn("flex-grow", inputClassName, valueInputClassName)}
          />
          <Input
            type="number"
            placeholder="Weight"
            value={weight}
            onChange={handleWeightChange}
            className={cn("w-24", inputClassName, weightInputClassName)}
          />
        </div>
      )}
    </div>
  );
};
