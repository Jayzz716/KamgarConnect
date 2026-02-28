'use client'

import { useEffect, useRef } from 'react'

export function MouseTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = window.innerWidth
        let height = window.innerHeight

        canvas.width = width
        canvas.height = height

        const spacing = 40 // Distance between dots
        const dots: { x: number; y: number; originX: number; originY: number }[] = []

        // Initialize grid of dots
        for (let x = 0; x < width; x += spacing) {
            for (let y = 0; y < height; y += spacing) {
                dots.push({
                    x: x,
                    y: y,
                    originX: x,
                    originY: y,
                })
            }
        }

        const mouse = { x: -1000, y: -1000 }
        const radius = 100 // Area of effect

        const handleMouseMove = (e: MouseEvent) => {
            // Adjust for canvas position if needed, here it's fixed inset-0
            mouse.x = e.clientX
            mouse.y = e.clientY
        }

        const handleMouseLeave = () => {
            mouse.x = -1000
            mouse.y = -1000
        }

        const handleResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height

            // Re-initialize dots on resize to fill screen
            dots.length = 0
            for (let x = 0; x < width; x += spacing) {
                for (let y = 0; y < height; y += spacing) {
                    dots.push({
                        x: x,
                        y: y,
                        originX: x,
                        originY: y,
                    })
                }
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseleave', handleMouseLeave)
        window.addEventListener('resize', handleResize)

        let animationFrameId: number

        const render = () => {
            ctx.clearRect(0, 0, width, height)
            ctx.fillStyle = 'rgba(71, 85, 105, 0.8)' // Darker slate-600

            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i]
                const dx = mouse.x - dot.originX
                const dy = mouse.y - dot.originY
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < radius) {
                    const force = (radius - distance) / radius
                    const angle = Math.atan2(dy, dx)
                    const targetX = dot.originX - Math.cos(angle) * force * 40 // Increased push distance
                    const targetY = dot.originY - Math.sin(angle) * force * 40

                    dot.x += (targetX - dot.x) * 0.2
                    dot.y += (targetY - dot.y) * 0.2
                } else {
                    // Spring back to origin
                    dot.x += (dot.originX - dot.x) * 0.1
                    dot.y += (dot.originY - dot.y) * 0.1
                }

                ctx.beginPath()
                ctx.arc(dot.x, dot.y, 2.5, 0, Math.PI * 2) // Increased dot size
                ctx.fill()
            }

            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseleave', handleMouseLeave)
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0 opacity-100 block"
        />
    )
}
