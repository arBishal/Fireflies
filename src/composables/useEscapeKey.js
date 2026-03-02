import { onMounted, onBeforeUnmount } from 'vue'

/**
 * Registers a keydown listener that fires the callback when Escape is pressed.
 * Automatically cleans up on component unmount.
 * @param {Function} callback - Function to call on Escape key press
 */
export function useEscapeKey(callback) {
    const handler = (e) => {
        if (e.key === 'Escape') callback()
    }
    onMounted(() => document.addEventListener('keydown', handler))
    onBeforeUnmount(() => document.removeEventListener('keydown', handler))
}
