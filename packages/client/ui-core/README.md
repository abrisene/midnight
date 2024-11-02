# @acausal/ui-core

A comprehensive UI component library built on top of shadcn/ui and magicui, with additional custom components.

## Installation

```bash
pnpm add @acausal/ui-core
```

## Features

### Base Components

This package includes all [shadcn/ui](https://ui.shadcn.com/) components with consistent styling and theming.

### Magic UI Components

Includes enhanced components from [magicui](https://magicui.design/) for advanced animations and effects.

### Custom Components

#### Color Input

Enhanced color picker with preview and accessibility features:

```typescript
import { ColorInput } from '@acausal/ui-core/color-input';

<ColorInput
  value={color}
  onChange={(e) => setColor(e.target.value)}
/>
```

#### Key-Value Input

Input component for key-value pair management:

```typescript
import { KeyValueEditor } from '@acausal/ui-core/key-value-input';

<KeyValueEditor
  type="string"
  onKeyChanged={handleKeyChange}
  onValueChanged={handleValueChange}
/>
```

#### Radial Menu

Circular menu component with customizable layout:

```typescript
import { RadialMenu } from '@acausal/ui-core/radial-menu';

<RadialMenu
  radius={125}
  arcStart={0}
  arcEnd={180}
>
  {menuItems}
</RadialMenu>
```

#### Separator Label

Styled separator with centered label:

```typescript
import { SeparatorLabel } from '@acausal/ui-core/separator-label';

<SeparatorLabel>Section Title</SeparatorLabel>
```

#### Text Component

Enhanced text component with typography variants:

```typescript
import { Text } from '@acausal/ui-core/text';

<Text variant="h1" size="lg">Heading</Text>
```

### Extensions

- **Cursor**: Custom cursor animations and effects
- **File Uploader**: Advanced file upload component
- **Multi-Select**: Enhanced select with multiple selection
- **Tree View**: Hierarchical data display
- **Skeleton Browser**: Loading state browser mockup

## Theme Support

Built-in dark mode support using next-themes:

```typescript
import { ThemeProvider, ThemeToggle } from '@acausal/ui-core/theme';

function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## Documentation

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [magicui Documentation](https://magicui.design/)
- [Custom Components API](./docs/api.md)
