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
export function useFireflyPhysics() {
    const mouse = { x: null, y: null }

    const handleMouseMove = (e) => {
        mouse.x = e.clientX
        mouse.y = e.clientY
    }

    const handleTouchMove = (e) => {
        const touch = e.touches[0]
        if (touch) {
            mouse.x = touch.clientX
            mouse.y = touch.clientY
        }
    }

    const repelFireflies = (fireflies, x, y) => {
        for (let f of fireflies) {
            const dx = f.x - x
            const dy = f.y - y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < FIREFLY_CONFIG.INTERACTION_RADIUS) {
                const baseForce = FIREFLY_CONFIG.REPEL_FORCE
                const multiplier = FIREFLY_CONFIG.REPEL_MULTIPLIER
                const normX = dx / dist
                const normY = dy / dist

                f.vx = normX * baseForce * multiplier
                f.vy = normY * baseForce * multiplier
                f.repelled = true
                f.repelStartX = f.x
                f.repelStartY = f.y
                f.repelDistanceTraveled = 0
            }
        }
    }

    const updateFirefly = (f, w, h, speedMultiplier) => {
        // Pulsing alpha
        f.alpha += f.pulseDir * FIREFLY_CONFIG.PULSE_SPEED
        if (f.alpha >= FIREFLY_CONFIG.MAX_ALPHA) {
            f.alpha = FIREFLY_CONFIG.MAX_ALPHA
            f.pulseDir = -1
        } else if (f.alpha <= FIREFLY_CONFIG.MIN_ALPHA) {
            f.alpha = FIREFLY_CONFIG.MIN_ALPHA
            f.pulseDir = 1
        }

        const velocityMagnitude = Math.hypot(f.vx, f.vy)

        if (velocityMagnitude > 0.1) {
            // Repelled motion
            f.x += f.vx
            f.y += f.vy

            // Track distance traveled since repel start
            if (f.repelled) {
                const dx = f.x - f.repelStartX
                const dy = f.y - f.repelStartY
                f.repelDistanceTraveled = Math.sqrt(dx * dx + dy * dy)
                if (f.repelDistanceTraveled >= FIREFLY_CONFIG.INTERACTION_RADIUS) {
                    f.repelled = false
                }
            }

            // Velocity decay
            f.vx *= 0.9
            f.vy *= 0.9
        } else if (!f.repelled && mouse.x !== null && mouse.y !== null) {
            // Attraction
            const dx = mouse.x - f.x
            const dy = mouse.y - f.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < FIREFLY_CONFIG.INTERACTION_RADIUS) {
                const attractionStrength = FIREFLY_CONFIG.ATTRACTION_STRENGTH
                f.x += dx * attractionStrength
                f.y += dy * attractionStrength
            } else {
                // Reset repelled status if far enough
                f.repelled = false
            }
        } else {
            f.repelled = false
        }

        // Base drift
        f.x += f.dx * speedMultiplier
        f.y += f.dy * speedMultiplier

        // Screen wrap
        if (f.x < 0 || f.x > w) f.dx *= -1
        if (f.y < 0) f.y = h
        if (f.y > h) f.y = 0
    }

    const drawFirefly = (ctx, f) => {
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)

        // Draw firefly
        const rgb = hexToRgb(f.color) || { r: 255, g: 255, b: 0 }
        const colorString = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${f.alpha})`

        ctx.fillStyle = colorString
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
