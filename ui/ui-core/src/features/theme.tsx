"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { ThemeProvider, useTheme } from "next-themes";

import { cn } from "..";
import { Button } from "../shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/ui/dropdown-menu";

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon
            className={cn(
              "size-5 transition-all",
              // "size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0",
              resolvedTheme === "light"
                ? "rotate-0 scale-100"
                : "-rotate-90 scale-0",
            )}
          />
          <MoonIcon
            className={cn(
              "absolute size-5 transition-all",
              // "absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100",
              resolvedTheme === "dark"
                ? "rotate-0 scale-100"
                : "-rotate-90 scale-0",
            )}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ThemeProvider, ThemeToggle };
