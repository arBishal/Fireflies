import {
  ChevronDoubleDownIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  ChevronUpIcon,
  ChevronDoubleUpIcon,
} from '@heroicons/vue/24/outline'

// Icon-based preset levels
export const PRESETS = [
  { label: 'Very Low', icon: ChevronDoubleDownIcon },
  { label: 'Low', icon: ChevronDownIcon },
  { label: 'Default', icon: ArrowPathIcon },
  { label: 'High', icon: ChevronUpIcon },
  { label: 'Very High', icon: ChevronDoubleUpIcon },
]

// Value mappings for each preset level
export const FIREFLY_COUNT_LEVELS = [10, 20, 32, 50, 80]
export const SPEED_LEVELS = [0.25, 0.5, 1, 1.5, 2.5]
export const SIZE_LEVELS = [
  { min: 0.5, max: 1 },
  { min: 1, max: 2 },
  { min: 1, max: 4 },
  { min: 2, max: 6 },
  { min: 3, max: 8 },
]

// Color palette options
export const COLOR_OPTIONS = [
  '#ffff96', // soft yellow
  '#a5f3fc', // cyan
  '#f9a8d4', // pink
  '#86efac', // green
  '#fcd34d', // gold
]
