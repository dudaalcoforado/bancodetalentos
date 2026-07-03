'use client'

import { cn } from '@/lib/utils'

interface ChipGroupProps {
  options: string[]
  multiple?: boolean
  value: string | string[] | undefined
  onChange: (value: string | string[]) => void
}

export function ChipGroup({ options, multiple, value, onChange }: ChipGroupProps) {
  const selected = multiple ? (Array.isArray(value) ? value : []) : value

  function toggle(option: string) {
    if (!multiple) {
      onChange(option)
      return
    }
    const current = Array.isArray(value) ? value : []
    onChange(
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    )
  }

  return (
    <div className="flex flex-wrap gap-2" role={multiple ? 'group' : 'radiogroup'}>
      {options.map((option) => {
        const isOn = multiple
          ? Array.isArray(selected) && selected.includes(option)
          : selected === option
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isOn}
            onClick={() => toggle(option)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              isOn
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:border-primary/50',
            )}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
