import {
  ChevronDoubleDownIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  ChevronUpIcon,
  ChevronDoubleUpIcon,
} from '@heroicons/vue/24/outline'

// Icon-based preset levels
export const PRESETS = [
  { label: 'Low', icon: ChevronDownIcon },
  { label: 'Default', icon: ArrowPathIcon },
  { label: 'High', icon: ChevronUpIcon },
]

// Value mappings for each preset level
export const FIREFLY_COUNT_LEVELS = [40, 80, 120]
export const SPEED_LEVELS = [0.5, 1, 2]
export const SIZE_LEVELS = [
  { min: 1, max: 2 },
  { min: 2, max: 5 },
  { min: 5, max: 8 },
]

// Color palette options (Tailwind colors)
export const COLOR_OPTIONS = [
  '#ddff11', // yellow
  '#aaff77', // lime green
  '#93C5FD', // blueish white
]

export const DEFAULT_COLOR = COLOR_OPTIONS[0]

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
}

// Logic Constants
export const FIREFLY_CONFIG = {
  MIN_ALPHA: 0.1,
  MAX_ALPHA: 1,
  PULSE_SPEED: 0.015,
  SPEED_RANGE_X: [-0.5, 0.5],
  SPEED_RANGE_Y: [-0.5, 0.5],
  INTERACTION_RADIUS: 160,
  REPEL_FORCE: 3,
  REPEL_MULTIPLIER: 2,
  ATTRACTION_STRENGTH: 0.01,
}
