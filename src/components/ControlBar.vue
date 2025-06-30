<script setup>
import { ref } from 'vue'
import {
  SwatchIcon,
  Squares2X2Icon,
  BoltIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/vue/24/outline'

import {
  PRESETS,
  FIREFLY_COUNT_LEVELS,
  SPEED_LEVELS,
  SIZE_LEVELS,
  COLOR_OPTIONS,
} from '../constants/constants.js'

// Active control section: 'count' | 'speed' | 'size' | 'color' | null
const activeControl = ref(null)

// Preset states
const fireflyCountLevel = ref(2)
const speedLevel = ref(2)
const sizeLevel = ref(2)

// Color selection
const selectedColors = ref(['#ffff96'])
const toggleColor = (color) => {
  const i = selectedColors.value.indexOf(color)
  if (i >= 0) {
    if (selectedColors.value.length > 1) selectedColors.value.splice(i, 1)
  } else {
    selectedColors.value.push(color)
  }
}

const toggleControl = (section) => {
  activeControl.value = activeControl.value === section ? null : section
}
</script>

<template>
  <div class="fixed bottom-4 right-1/2 translate-x-1/2 z-50 w-fit backdrop-blur-xs text-white">
    <!-- Preset Sections -->
    <div v-if="activeControl === 'count'" class="transition-all duration-300">
      <div class="flex justify-center w-full">
        <button
          v-for="(preset, index) in PRESETS"
          :key="'count-' + index"
          @click="fireflyCountLevel = index"
          class="flex items-center justify-center p-2 md:p-2 transition-all duration-300"
          :class="
            fireflyCountLevel === index
              ? 'bg-white/10 rounded-full'
              : 'opacity-50 hover:opacity-100'
          "
        >
          <component :is="preset.icon" class="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>

    <div v-if="activeControl === 'speed'" class="transition-all duration-300">
      <div class="flex justify-center w-full">
        <button
          v-for="(preset, index) in PRESETS"
          :key="'speed-' + index"
          @click="speedLevel = index"
          class="flex items-center justify-center p-2 md:p-2 transition-all duration-300"
          :class="
            speedLevel === index ? 'bg-white/10 rounded-full' : 'opacity-50 hover:opacity-100'
          "
        >
          <component :is="preset.icon" class="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>

    <div v-if="activeControl === 'size'" class="transition-all duration-300">
      <div class="flex justify-center w-full">
        <button
          v-for="(preset, index) in PRESETS"
          :key="'size-' + index"
          @click="sizeLevel = index"
          class="flex items-center justify-center p-2 md:p-2 transition-all duration-300"
          :class="sizeLevel === index ? 'bg-white/10 rounded-full' : 'opacity-50 hover:opacity-100'"
        >
          <component :is="preset.icon" class="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>

    <div v-if="activeControl === 'color'">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="color in COLOR_OPTIONS"
          :key="color"
          :style="{ backgroundColor: color }"
          @click="toggleColor(color)"
          class="w-6 h-6 rounded-full border-2 cursor-pointer transition duration-150"
          :class="
            selectedColors.includes(color)
              ? 'ring-2 ring-offset-1 ring-black dark:ring-white'
              : 'opacity-40 hover:opacity-80'
          "
        ></div>
      </div>
    </div>

    <!-- Control Icons Bar -->
    <div
      class="flex justify-center items-center gap-4 md:gap-6 mt-2 border border-white/20 px-4 py-2 md:px-6 md:py-3 rounded-full"
    >
      <button class="flex flex-col items-center text-xs" @click="toggleControl('count')">
        <Squares2X2Icon
          class="w-5 h-5 md:w-6 md:h-6 active:scale-90 transition-all duration-300 hover:text-amber-300"
        />
      </button>
      <button class="flex flex-col items-center text-xs" @click="toggleControl('speed')">
        <BoltIcon
          class="w-5 h-5 md:w-6 md:h-6 active:scale-90 transition-all duration-300 hover:text-amber-300"
        />
      </button>
      <button class="flex flex-col items-center text-xs" @click="toggleControl('size')">
        <ArrowsPointingOutIcon
          class="w-5 h-5 md:w-6 md:h-6 active:scale-90 transition-all duration-300 hover:text-amber-300"
        />
      </button>
      <button class="flex flex-col items-center text-xs" @click="toggleControl('color')">
        <SwatchIcon
          class="w-5 h-5 md:w-6 md:h-6 active:scale-90 transition-all duration-300 hover:text-amber-300"
        />
      </button>
    </div>
  </div>
</template>
