import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useCanvas() {
    const canvas = ref(null)
    const width = ref(window.innerWidth)
    const height = ref(window.innerHeight)

    const handleResize = () => {
        if (canvas.value) {
            width.value = canvas.value.width = window.innerWidth
            height.value = canvas.value.height = window.innerHeight
        }
    }

    onMounted(() => {
        window.addEventListener('resize', handleResize)
        // Initial size set
        handleResize()
    })

    onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize)
    })

    return {
        canvas,
        width,
        height,
    }
}
