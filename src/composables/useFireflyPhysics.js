import { FIREFLY_CONFIG } from '../constants/constants.js'

// Helper to convert hex to rgb
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null
}

/**
 * Manages firefly physics, movement, and interaction logic.
 */
/**
 * Manages the physics engine for firefly movement and interaction.
 * 
 * This composable contains the core mathematical logic for:
 * 1. Updating positions based on velocity and drift.
 * 2. Handling mouse/touch interactions (attraction).
 * 3. Handling click interactions (repulsion).
 * 4. Rendering the fireflies to the canvas context.
 * 
 * @returns {Object} Physics methods and state
 */
export function useFireflyPhysics() {
    /**
     * Tracks the current mouse or touch position.
     * Initialized to {x: null, y: null} to indicate no interaction yet.
     */
    const mouse = { x: null, y: null }

    /**
     * Updates mouse coordinates on global mouse movement.
     * @param {MouseEvent} e - The mouse event
     */
    const handleMouseMove = (e) => {
        mouse.x = e.clientX
        mouse.y = e.clientY
    }

    /**
     * Updates mouse coordinates on touch movement.
     * @param {TouchEvent} e - The touch event
     */
    const handleTouchMove = (e) => {
        const touch = e.touches[0]
        if (touch) {
            mouse.x = touch.clientX
            mouse.y = touch.clientY
        }
    }

    /**
     * Repels fireflies away from a specific point (e.g., click location).
     * 
     * Uses a normalized vector to determine direction and applies an
     * impulsive force to the firefly's velocity vector.
     * 
     * @param {Array} fireflies - The array of firefly objects
     * @param {number} x - The x-coordinate of the repulsion source
     * @param {number} y - The y-coordinate of the repulsion source
     */
    const repelFireflies = (fireflies, x, y) => {
        for (let f of fireflies) {
            // Calculate distance between firefly and click point
            const dx = f.x - x
            const dy = f.y - y
            const dist = Math.sqrt(dx * dx + dy * dy)

            // Only affect fireflies within the interaction radius
            if (dist < FIREFLY_CONFIG.INTERACTION_RADIUS) {
                const baseForce = FIREFLY_CONFIG.REPEL_FORCE
                const multiplier = FIREFLY_CONFIG.REPEL_MULTIPLIER

                // Normalize direction vector (length 1)
                const normX = dx / dist
                const normY = dy / dist

                // Apply force to velocity
                f.vx = normX * baseForce * multiplier
                f.vy = normY * baseForce * multiplier

                // Mark as repelled to trigger special friction logic
                f.repelled = true
                f.repelStartX = f.x
                f.repelStartY = f.y
                f.repelDistanceTraveled = 0
            }
        }
    }

    /**
     * Updates a single firefly's position and state for one frame.
     * 
     * @param {Object} f - The firefly object
     * @param {number} w - Canvas width
     * @param {number} h - Canvas height
     * @param {number} speedMultiplier - Global speed modifier
     */
    const updateFirefly = (f, w, h, speedMultiplier) => {
        // --- 1. Pulsing Alpha (Glow Effect) ---
        // oscillate alpha value between MIN and MAX
        f.alpha += f.pulseDir * FIREFLY_CONFIG.PULSE_SPEED
        if (f.alpha >= FIREFLY_CONFIG.MAX_ALPHA) {
            f.alpha = FIREFLY_CONFIG.MAX_ALPHA
            f.pulseDir = -1 // Start fading out
        } else if (f.alpha <= FIREFLY_CONFIG.MIN_ALPHA) {
            f.alpha = FIREFLY_CONFIG.MIN_ALPHA
            f.pulseDir = 1 // Start brightening
        }

        // --- 2. Physics & interaction ---
        const velocityMagnitude = Math.hypot(f.vx, f.vy)

        if (velocityMagnitude > 0.1) {
            // APPLY REPULSION VELOCITY
            f.x += f.vx
            f.y += f.vy

            // Reset repelled state if it has traveled far enough
            if (f.repelled) {
                const dx = f.x - f.repelStartX
                const dy = f.y - f.repelStartY
                f.repelDistanceTraveled = Math.sqrt(dx * dx + dy * dy)
                if (f.repelDistanceTraveled > FIREFLY_CONFIG.INTERACTION_RADIUS + f.r) {
                    f.repelled = false
                }
            }

            // Apply Friction (Decay)
            // Use less friction (0.95) when repelled so they glide further
            // Use more friction (0.9) otherwise to stop quickly
            const decay = f.repelled ? 0.95 : 0.9
            f.vx *= decay
            f.vy *= decay
        } else {
            // Stop micro-movements
            f.repelled = false
        }

        // --- 3. Mouse Attraction ---
        // Only attract if not currently being repelled and mouse interaction exists
        if (!f.repelled && mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - f.x
            const dy = mouse.y - f.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            // Linear interpolation towards mouse if within range
            if (dist < FIREFLY_CONFIG.INTERACTION_RADIUS) {
                const attractionStrength = FIREFLY_CONFIG.ATTRACTION_STRENGTH
                f.x += dx * attractionStrength
                f.y += dy * attractionStrength
            }
        }

        // --- 4. Base Drift Movement ---
        // Apply natural wandering movement
        f.x += f.dx * speedMultiplier
        f.y += f.dy * speedMultiplier

        // --- 5. Screen Wrapping ---
        // If firefly leaves screen, wrap to opposite side
        if (f.x < 0 || f.x > w) f.dx *= -1 // Bounce off sides horizontally? No, logic says bounce DX
        // Wait, original logic: if x < 0 || x > w, dx *= -1 (Bounce)
        // Wraps Y:
        if (f.y < 0) f.y = h
        if (f.y > h) f.y = 0
    }

    /**
     * Draws a single firefly to the canvas context.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas 2D context
     * @param {Object} f - The firefly object
     */
    const drawFirefly = (ctx, f) => {
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)

        // Convert HEX color to RGB to apply alpha
        const rgb = hexToRgb(f.color) || { r: 255, g: 255, b: 0 }
        const colorString = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${f.alpha})`

        ctx.fillStyle = colorString

        // Add glow effect using shadow
        ctx.shadowColor = colorString
        ctx.shadowBlur = 8
        ctx.fill()
    }

    return {
        mouse,
        handleMouseMove,
        handleTouchMove,
        repelFireflies,
        updateFirefly,
        drawFirefly
    }
}
