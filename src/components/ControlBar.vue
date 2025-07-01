<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  SwatchIcon,
  Squares2X2Icon,
  BoltIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/vue/24/outline'

import { PRESETS, COLOR_OPTIONS } from '../constants/constants.js'

const root = ref(null)

const activeSection = ref(null)
const fireflyCountLevel = ref(2)
const speedLevel = ref(2)
const sizeLevel = ref(2)
const selectedColors = ref(['#ffff96'])

const toggleColor = (color) => {
  const i = selectedColors.value.indexOf(color)
  if (i >= 0 && selectedColors.value.length > 1) {
    selectedColors.value.splice(i, 1)
  } else if (i === -1) {
    selectedColors.value.push(color)
  }
}

const toggleSection = (section) => {
  activeSection.value = activeSection.value === section ? null : section
}

const handleClickOutside = (e) => {
  if (root.value && !root.value.contains(e.target)) {
    activeSection.value = null
  }
}

const handleEscape = (e) => {
  if (e.key === 'Escape') {
    activeSection.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div
    class="fixed bottom-4 right-1/2 translate-x-1/2 z-50 w-fit backdrop-blur-xs text-white"
    ref="root"
  >
    <div
      class="flex justify-center items-center gap-4 md:gap-6 mt-2 border border-white/20 px-4 py-2 md:px-6 md:py-3 rounded-full"
    >
      <!-- COUNT -->
      <div class="relative transition-all duration-300">
        <button class="flex flex-col items-center text-xs" @click="toggleSection('count')">
          <Squares2X2Icon
            class="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 hover:text-amber-300 active:scale-90"
          />
        </button>
        <div
          v-show="activeSection === 'count'"
          class="absolute bottom-full mb-3 sm:mb-4 left-1/2 -translate-x-1/2 transform transition-all duration-300 opacity-0 scale-95"
          :class="{
            'opacity-100 scale-100 pointer-events-auto': activeSection === 'count',
          }"
        >
          <div class="flex gap-2 bg-black/80 rounded-xl px-4 py-2">
            <button
              v-for="(preset, index) in PRESETS"
              :key="'count-' + index"
              @click="fireflyCountLevel = index"
              class="flex items-center justify-center p-2 transition-all duration-300"
              :class="
                fireflyCountLevel === index
                  ? 'bg-white/20 rounded-full'
                  : 'opacity-50 hover:opacity-100'
              "
            >
              <component :is="preset.icon" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- SPEED -->
      <div class="relative">
        <button class="flex flex-col items-center text-xs" @click="toggleSection('speed')">
          <BoltIcon
            class="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 hover:text-amber-300 active:scale-90"
          />
        </button>
        <div
          v-show="activeSection === 'speed'"
          class="absolute bottom-full mb-3 sm:mb-4 left-1/2 -translate-x-1/2 transform transition-all duration-300 opacity-0 scale-95"
          :class="{
            'opacity-100 scale-100 pointer-events-auto': activeSection === 'speed',
          }"
        >
          <div class="flex gap-2 bg-black/80 rounded-xl px-4 py-2">
            <button
              v-for="(preset, index) in PRESETS"
              :key="'speed-' + index"
              @click="speedLevel = index"
              class="flex items-center justify-center p-2 transition-all duration-300"
              :class="
                speedLevel === index ? 'bg-white/20 rounded-full' : 'opacity-50 hover:opacity-100'
              "
            >
              <component :is="preset.icon" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- SIZE -->
      <div class="relative">
        <button class="flex flex-col items-center text-xs" @click="toggleSection('size')">
          <ArrowsPointingOutIcon
            class="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 hover:text-amber-300 active:scale-90"
          />
        </button>
        <div
          v-show="activeSection === 'size'"
          class="absolute bottom-full mb-3 sm:mb-4 left-1/2 -translate-x-1/2 transform transition-all duration-300 opacity-0 scale-95"
          :class="{
            'opacity-100 scale-100 pointer-events-auto': activeSection === 'size',
          }"
        >
          <div class="flex gap-2 bg-black/80 rounded-xl px-4 py-2">
            <button
              v-for="(preset, index) in PRESETS"
              :key="'size-' + index"
              @click="sizeLevel = index"
              class="flex items-center justify-center p-2 transition-all duration-300"
              :class="
                sizeLevel === index ? 'bg-white/20 rounded-full' : 'opacity-50 hover:opacity-100'
              "
            >
              <component :is="preset.icon" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- COLOR -->
      <div class="relative">
        <button class="flex flex-col items-center text-xs" @click="toggleSection('color')">
          <SwatchIcon
            class="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 hover:text-amber-300 active:scale-90"
          />
        </button>
        <div
          v-show="activeSection === 'color'"
          class="absolute bottom-full mb-3 sm:mb-4 left-1/2 -translate-x-1/2 transform transition-all duration-300 opacity-0 scale-95"
          :class="{
            'opacity-100 scale-100 pointer-events-auto': activeSection === 'color',
          }"
        >
          <div class="flex gap-2 bg-black/80 rounded-xl px-4 py-2">
            <div
              v-for="color in COLOR_OPTIONS"
              :key="color"
              :style="{ backgroundColor: color }"
              @click="toggleColor(color)"
              class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 cursor-pointer transition duration-300"
              :class="
                selectedColors.includes(color)
                  ? 'ring-2 ring-offset-1 ring-white/50'
                  : 'opacity-50 hover:opacity-80'
              "
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
