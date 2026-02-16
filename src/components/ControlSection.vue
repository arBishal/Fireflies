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
  <div class="relative">
    <Tooltip :text="tooltipText">
      <button 
        class="flex flex-col items-center text-xs" 
        @click="$emit('toggle')"
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
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-black/80 backdrop-blur-md rounded-2xl p-2 border border-white/10 flex flex-col gap-2 min-w-[max-content]"
      >
        <slot name="content"></slot>
      </div>
    </Transition>
  </div>
</template>
