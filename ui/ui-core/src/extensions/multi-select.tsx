import * as React from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { Check, ChevronsUpDown, Edit2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../shadcn/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../shadcn/ui/alert-dialog";
import { Badge } from "../shadcn/ui/badge";
import { Button } from "../shadcn/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../shadcn/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../shadcn/ui/dialog";
import { Input } from "../shadcn/ui/input";
import { Label } from "../shadcn/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/ui/popover";
import { cn } from "../utils/cn";

export interface Option {
  value: string;
  label: string;
  color: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: Option[];
  onChange: (selectedOptions: Option[]) => void;
  onCreateOption?: (name: string) => void;
  onUpdateOption?: (oldOption: Option, newOption: Option) => void;
  onDeleteOption?: (option: Option) => void;
  allowCreate?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  placeholder?: string;
}

const badgeStyle = (color: string) => ({
  borderColor: `${color}20`,
  backgroundColor: `${color}30`,
  color,
});

export const useMultiSelect = (
  initialOptions: Option[],
  initialSelectedValues: Option[] = [],
) => {
  const [options, setOptions] = React.useState<Option[]>(initialOptions);
  const [selectedValues, setSelectedValues] = React.useState<Option[]>(
    initialSelectedValues,
  );

  const createOption = React.useCallback((name: string) => {
    const newOption = {
      value: name.toLowerCase(),
      label: name,
      color: "#ffffff",
    };
    setOptions((prev) => [...prev, newOption]);
    setSelectedValues((prev) => [...prev, newOption]);
  }, []);

  const updateOption = React.useCallback(
    (oldOption: Option, newOption: Option) => {
      setOptions((prev) =>
        prev.map((o) => (o.value === oldOption.value ? newOption : o)),
      );
      setSelectedValues((prev) =>
        prev.map((o) => (o.value === oldOption.value ? newOption : o)),
      );
    },
    [],
  );

  const deleteOption = React.useCallback((option: Option) => {
    setOptions((prev) => prev.filter((o) => o.value !== option.value));
    setSelectedValues((prev) => prev.filter((o) => o.value !== option.value));
  }, []);

  const toggleOption = React.useCallback((option: Option) => {
    setSelectedValues((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o.value !== option.value)
        : [...prev, option],
    );
  }, []);

  return {
    options,
    selectedValues,
    createOption,
    updateOption,
    deleteOption,
    toggleOption,
    setSelectedValues,
  };
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  onCreateOption,
  onUpdateOption,
  onDeleteOption,
  allowCreate = true,
  allowEdit = true,
  allowDelete = true,
  placeholder = "Select options",
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>("");

  const toggleOption = (option: Option) => {
    const newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter((o) => o.value !== option.value)
      : [...selectedValues, option];
    onChange(newSelectedValues);
    inputRef?.current?.focus();
  };

  const onComboboxOpenChange = (value: boolean) => {
    inputRef.current?.blur();
    setOpenCombobox(value);
  };

  return (
    <div className="max-w-[200px]">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="w-[200px] justify-between text-foreground"
          >
            <span className="truncate">
              {selectedValues.length === 0 && placeholder}
              {selectedValues.length === 1 && selectedValues[0]!.label}
              {selectedValues.length === 2 &&
                selectedValues.map(({ label }) => label).join(", ")}
              {selectedValues.length > 2 &&
                `${selectedValues.length} options selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder="Search options..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandGroup className="max-h-[145px] overflow-auto">
                {options.map((option) => {
                  const isActive = selectedValues.includes(option);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => toggleOption(option)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex-1">{option.label}</div>
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                    </CommandItem>
                  );
                })}
                {allowCreate && (
                  <CommandItemCreate
                    onSelect={() =>
                      onCreateOption && onCreateOption(inputValue)
                    }
                    inputValue={inputValue}
                    options={options}
                  />
                )}
              </CommandGroup>
              {allowEdit && (
                <>
                  <CommandSeparator alwaysRender />
                  <CommandGroup>
                    <CommandItem
                      value={`:${inputValue}:`}
                      className="text-xs text-muted-foreground"
                      onSelect={() => setOpenDialog(true)}
                    >
                      <div className={cn("mr-2 h-4 w-4")} />
                      <Edit2 className="mr-2 h-2.5 w-2.5" />
                      Edit Options
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {allowEdit && (
        <Dialog
          open={openDialog}
          onOpenChange={(open) => {
            if (!open) {
              setOpenCombobox(true);
            }
            setOpenDialog(open);
          }}
        >
          <DialogContent className="flex max-h-[90vh] flex-col">
            <DialogHeader>
              <DialogTitle>Edit Options</DialogTitle>
              <DialogDescription>
                Change the option names or delete the options. Create an option
                through the combobox.
              </DialogDescription>
            </DialogHeader>
            <div className="-mx-6 flex-1 overflow-scroll px-6 py-2">
              {options.map((option) => (
                <DialogListItem
                  key={option.value}
                  onDelete={
                    allowDelete
                      ? () => onDeleteOption && onDeleteOption(option)
                      : undefined
                  }
                  onSubmit={(e) => {
                    e.preventDefault();
                    const target = e.target as typeof e.target &
                      Record<"name" | "color", { value: string }>;
                    const newOption = {
                      value: target.name.value.toLowerCase(),
                      label: target.name.value,
                      color: target.color.value,
                    };
                    onUpdateOption && onUpdateOption(option, newOption);
                  }}
                  {...option}
                />
              ))}
            </div>
            <DialogFooter className="bg-opacity-40">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div className="relative -mb-24 mt-3 h-24 overflow-y-auto">
        {selectedValues.map(({ label, value, color }) => (
          <Badge
            key={value}
            variant="outline"
            style={badgeStyle(color)}
            className="mb-2 mr-2"
          >
            {label}
          </Badge>
        ))}
      </div>
    </div>
  );
};

const CommandItemCreate: React.FC<{
  inputValue: string;
  options: Option[];
  onSelect: () => void;
}> = ({ inputValue, options, onSelect }) => {
  const hasNoOption = !options
    .map(({ value }) => value)
    .includes(inputValue.toLowerCase());

  if (inputValue === "" || !hasNoOption) return null;

  return (
    <CommandItem
      value={inputValue}
      className="text-xs text-muted-foreground"
      onSelect={onSelect}
    >
      <div className={cn("mr-2 h-4 w-4")} />
      Create new option &quot;{inputValue}&quot;
    </CommandItem>
  );
};

const DialogListItem: React.FC<
  Option & {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onDelete?: () => void;
  }
> = ({ value, label, color, onSubmit, onDelete }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [accordionValue, setAccordionValue] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState<string>(label);
  const [colorValue, setColorValue] = React.useState<string>(color);
  const disabled = label === inputValue && color === colorValue;

  React.useEffect(() => {
    if (accordionValue !== "") {
      inputRef.current?.focus();
    }
  }, [accordionValue]);

  return (
    <Accordion
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
    >
      <AccordionItem value={value}>
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" style={badgeStyle(color)}>
              {label}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <AccordionTrigger>Edit</AccordionTrigger>
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to delete the option{" "}
                      <Badge variant="outline" style={badgeStyle(color)}>
                        {label}
                      </Badge>
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        <AccordionContent>
          <form
            className="flex items-end gap-4"
            onSubmit={(e) => {
              onSubmit(e);
              setAccordionValue("");
            }}
          >
            <div className="grid w-full gap-3">
              <Label htmlFor="name">Option name</Label>
              <Input
                ref={inputRef}
                id="name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                value={colorValue}
                onChange={(e) => setColorValue(e.target.value)}
                className="h-8 px-2 py-1"
              />
            </div>
            <Button type="submit" disabled={disabled} size="sm">
              Save
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
