<script setup>
import Tooltip from './Tooltip.vue'

const props = defineProps({
  isActive: {
    type: Boolean,
    required: true,
  },
  tooltipText: {
    type: String,
    required: true,
  },
  hoverColor: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <div class="relative flex items-center justify-center">
    <Tooltip :text="tooltipText">
      <button 
        class="flex justify-center items-center w-full h-full" 
        @click="$emit('toggle')"
        :aria-label="tooltipText"
        :aria-expanded="isActive"
        aria-controls="control-content"
      >
        <div 
          class="transition-all duration-300 active:scale-90"
          :style="hoverColor ? { '--hover-color': hoverColor } : {}"
          @mouseenter="hoverColor && ($event.currentTarget.style.color = hoverColor)"
          @mouseleave="hoverColor && ($event.currentTarget.style.color = '')"
        >
          <slot name="icon" class="w-5 h-5 md:w-6 md:h-6"></slot>
        </div>
      </button>
    </Tooltip>
    
    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-300"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isActive"
        id="control-content"
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-black/80 backdrop-blur-md flex flex-col gap-2 min-w-[max-content]"
        role="region"
        :aria-label="tooltipText + ' controls'"
      >
        <slot name="content"></slot>
      </div>
    </Transition>
  </div>
</template>
