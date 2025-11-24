'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number
  alpha: number
}

interface StarBackgroundProps {
  resistance?: number 
  starCount?: number 
}

export function StarBackground({ resistance = 150, starCount = 12 }: StarBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const STAR_COLOR = '#ffffff'
  const STAR_SIZE = 2 
  const STAR_MIN_SCALE = 0.2
  const OVERFLOW_THRESHOLD = 50

  const refs = useRef({
    stars: [] as Star[],
    velocity: { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 },
    pointer: { x: 0, y: 0 },
    width: 0,
    height: 0,
    scale: 1,
    touchInput: false
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const state = refs.current

    const resize = () => {
      state.scale = window.devicePixelRatio || 1
      state.width = window.innerWidth * state.scale
      state.height = window.innerHeight * state.scale
      
      canvas.width = state.width
      canvas.height = state.height
      
      const count = (window.innerWidth + window.innerHeight) / starCount
      
      state.stars = []
      for(let i = 0; i < count; i++) {
        state.stars.push({
          x: 0,
          y: 0,
          z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE),
          alpha: 0.5 + 0.5 * Math.random()
        })
      }
      
      state.stars.forEach(star => {
        star.x = Math.random() * state.width
        star.y = Math.random() * state.height
      })
    }

    const recycleStar = (star: Star) => {
        let direction = 'z'
        const vx = Math.abs(state.velocity.x)
        const vy = Math.abs(state.velocity.y)
        
        if(vx > 1 || vy > 1) {
          let axis
          if(vx > vy) axis = Math.random() < vx / (vx + vy) ? 'h' : 'v'
          else axis = Math.random() < vy / (vx + vy) ? 'v' : 'h'
          
          if(axis === 'h') direction = state.velocity.x > 0 ? 'l' : 'r'
          else direction = state.velocity.y > 0 ? 't' : 'b'
        }
        
        star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
        
        if(direction === 'z') {
          star.z = 0.1
          star.x = Math.random() * state.width
          star.y = Math.random() * state.height
        } else if(direction === 'l') {
          star.x = -OVERFLOW_THRESHOLD
          star.y = state.height * Math.random()
        } else if(direction === 'r') {
          star.x = state.width + OVERFLOW_THRESHOLD
          star.y = state.height * Math.random()
        } else if(direction === 't') {
          star.x = state.width * Math.random()
          star.y = -OVERFLOW_THRESHOLD
        } else if(direction === 'b') {
          star.x = state.width * Math.random()
          star.y = state.height + OVERFLOW_THRESHOLD
        }
    }

    const update = () => {
      state.velocity.tx *= 0.90
      state.velocity.ty *= 0.90

      state.velocity.x += (state.velocity.tx - state.velocity.x) * 0.8
      state.velocity.y += (state.velocity.ty - state.velocity.y) * 0.8

      state.stars.forEach(star => {
        star.x += state.velocity.x * star.z
        star.y += state.velocity.y * star.z
        
        star.x += (star.x - state.width/2) * state.velocity.z * star.z
        star.y += (star.y - state.height/2) * state.velocity.z * star.z
        star.z += state.velocity.z

        if(star.x < -OVERFLOW_THRESHOLD || star.x > state.width + OVERFLOW_THRESHOLD || 
           star.y < -OVERFLOW_THRESHOLD || star.y > state.height + OVERFLOW_THRESHOLD) {
          recycleStar(star)
        }
      })
    }

    const render = () => {
      context.clearRect(0, 0, state.width, state.height)
      
      state.stars.forEach(star => {
        context.beginPath()
        context.lineCap = 'round'
        context.lineWidth = STAR_SIZE * star.z * state.scale
        context.fillStyle = STAR_COLOR
        context.globalAlpha = 0.5 + 0.5 * Math.random()
        context.arc(star.x, star.y, context.lineWidth / 2, 0, Math.PI * 2)
        context.fill()
      })
    }

    const step = () => {
      update()
      render()
      requestRef.current = requestAnimationFrame(step)
    }

    const movePointer = (x: number, y: number) => {
      if(typeof state.pointer.x === 'number' && typeof state.pointer.y === 'number') {
        const ox = x - state.pointer.x
        const oy = y - state.pointer.y

        state.velocity.tx = state.velocity.tx + (ox / resistance * state.scale) * (state.touchInput ? 1 : -1)
        state.velocity.ty = state.velocity.ty + (oy / resistance * state.scale) * (state.touchInput ? 1 : -1)
      }
      state.pointer.x = x
      state.pointer.y = y
    }

    const onMouseMove = (e: MouseEvent) => {
      state.touchInput = false
      movePointer(e.clientX, e.clientY)
    }
    
    const onTouchMove = (e: TouchEvent) => {
      state.touchInput = true
      movePointer(e.touches[0].clientX, e.touches[0].clientY)
      // FIX: Removi o 'e.preventDefault()' que estava aqui.
      // Agora o scroll funciona E as estrelas mexem-se.
    }

    const onMouseLeave = () => {
      state.pointer.x = 0
      state.pointer.y = 0
    }

    resize()
    const requestRef = { current: requestAnimationFrame(step) }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    // FIX: Removi '{ passive: false }' para permitir o scroll nativo
    window.addEventListener('touchmove', onTouchMove)
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      cancelAnimationFrame(requestRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [resistance, starCount]) 

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full pointer-events-none"
    />
  )
}