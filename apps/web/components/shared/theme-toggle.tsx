"use client"

import {Moon, Sun} from "lucide-react"
import {Button} from "@/components/ui/button"
import {useTheme} from "./theme-provider"

export function ThemeToggle() {
  const {theme, toggleTheme} = useTheme()

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={toggleTheme}
      className='h-9 w-9 shrink-0 p-0'
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className='h-4 w-4' />
      ) : (
        <Moon className='h-4 w-4' />
      )}
    </Button>
  )
}
