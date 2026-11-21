import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { Heart } from "@/components/Icons"
import { Meteors } from "@/components/ui/meteors"
import { ShimmerButton } from "@/components/ui/shimmer-button"

const TAUNTS = [
  "nope. try the big one.",
  "it moved again.",
  "the big one works.",
  "almost, sonna ji.",
]

const REDUCED = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

export function ForgiveArena({ forgiven, onForgive }) {
  const arenaRef = useRef(null)
  const items = useRef([])
  const pointer = useRef({ x: -9999, y: -9999 })
  const raf = useRef(0)
  const start = useRef(0)
  const [attempts, setAttempts] = useState(0)
  const [taunt, setTaunt] = useState(null)
  const attemptsRef = useRef(0)

  const tauntNow = useCallback(() => {
    attemptsRef.current += 1
    setAttempts(attemptsRef.current)
    const text = TAUNTS[Math.floor(Math.random() * TAUNTS.length)]
    setTaunt({ text, id: attemptsRef.current })
  }, [])

  useEffect(() => {
    const arena = arenaRef.current
    if (!arena) return
    const reduce = REDUCED()

    // collect the three draggable pieces and give them a home
    const nodes = [...arena.querySelectorAll("[data-drift]")]
    items.current = nodes.map((el, i) => {
      const rect = el.getBoundingClientRect()
      const a = arena.getBoundingClientRect()
      const kind = el.dataset.drift
      const home =
        kind === "full"
          ? { x: a.width * 0.5, y: a.height * 0.42 }
          : kind === "half"
            ? { x: a.width * 0.24, y: a.height * 0.8 }
            : { x: a.width * 0.76, y: a.height * 0.8 }
      return {
        el,
        kind,
        w: rect.width,
        h: rect.height,
        x: home.x,
        y: home.y,
        vx: 0,
        vy: 0,
        rot: 0,
        phase: i * 1.7,
        scale: 1,
      }
    })

    const onMove = (e) => {
      const r = arena.getBoundingClientRect()
      pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onLeave = () => {
      pointer.current = { x: -9999, y: -9999 }
    }
    arena.addEventListener("pointermove", onMove)
    arena.addEventListener("pointerleave", onLeave)

    const tick = (now) => {
      if (!start.current) start.current = now
      const t = (now - start.current) / 1000
      const dt = Math.min(0.034, (now - (tick.prev || now)) / 1000 || 0.016)
      tick.prev = now

      const a = arena.getBoundingClientRect()
      const grow = 1 + Math.min(attemptsRef.current, 7) * 0.035

      for (const it of items.current) {
        if (it.kind === "full") {
          // drifts on a slow, lazy orbit — it moves, but it never hides
          const ampX = Math.min(a.width * 0.2, 150)
          const ampY = Math.min(a.height * 0.1, 26)
          const drift = reduce ? 0 : 1
          it.x = a.width * 0.5 + Math.sin(t * 0.42 + it.phase) * ampX * drift
          it.y = a.height * 0.44 + Math.cos(t * 0.61 + it.phase) * ampY * drift
          it.scale = (reduce ? 1 : grow) * (1 + Math.sin(t * 1.6) * 0.012)
        } else {
          const px = pointer.current.x
          const py = pointer.current.y
          const dx = it.x - px
          const dy = it.y - py
          const dist = Math.hypot(dx, dy) || 1
          const R = 210
          if (!reduce && dist < R) {
            const force = (1 - dist / R) ** 1.4 * 3400
            it.vx += (dx / dist) * force * dt
            it.vy += (dy / dist) * force * dt
          }
          // a little wander so they look alive even when you're not hunting them
          if (!reduce) {
            it.vx += Math.sin(t * 1.1 + it.phase) * 26 * dt
            it.vy += Math.cos(t * 0.83 + it.phase * 1.3) * 22 * dt
          }
          const damp = Math.exp(-2.6 * dt)
          it.vx *= damp
          it.vy *= damp
          const speed = Math.hypot(it.vx, it.vy)
          if (speed > 1500) {
            it.vx = (it.vx / speed) * 1500
            it.vy = (it.vy / speed) * 1500
          }
          it.x += it.vx * dt
          it.y += it.vy * dt

          const padX = Math.max(it.w / 2 + 6, 44)
          const padY = it.h / 2 + 6
          if (it.x < padX) { it.x = padX; it.vx = Math.abs(it.vx) * 0.85 }
          if (it.x > a.width - padX) { it.x = a.width - padX; it.vx = -Math.abs(it.vx) * 0.85 }
          if (it.y < padY) { it.y = padY; it.vy = Math.abs(it.vy) * 0.85 }
          if (it.y > a.height - padY) { it.y = a.height - padY; it.vy = -Math.abs(it.vy) * 0.85 }
          it.rot = Math.max(-14, Math.min(14, it.vx / 90))
        }

        it.el.style.transform = `translate3d(${it.x - it.w / 2}px, ${it.y - it.h / 2}px, 0) rotate(${it.rot}deg) scale(${it.scale})`
      }

      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)

    const ro = new ResizeObserver(() => {
      const a = arena.getBoundingClientRect()
      for (const it of items.current) {
        it.x = Math.max(it.w / 2 + 6, Math.min(it.x, a.width - it.w / 2 - 6))
        it.y = Math.max(it.h / 2 + 6, Math.min(it.y, a.height - it.h / 2 - 6))
      }
    })
    ro.observe(arena)

    return () => {
      cancelAnimationFrame(raf.current)
      ro.disconnect()
      arena.removeEventListener("pointermove", onMove)
      arena.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  // let a button escape from wherever the pointer is right now
  const shove = (el, power = 1) => {
    const arena = arenaRef.current
    if (!arena) return
    const it = items.current.find((i) => i.el === el)
    if (!it) return
    const a = arena.getBoundingClientRect()
    const p = pointer.current.x < -999 ? { x: a.width / 2, y: a.height / 2 } : pointer.current
    const dx = it.x - p.x
    const dy = it.y - p.y
    const d = Math.hypot(dx, dy) || 1
    it.vx += (dx / d) * 900 * power
    it.vy += (dy / d) * 700 * power
  }

  const dodge = (e) => {
    e.preventDefault()
    shove(e.currentTarget, 1.15)
    tauntNow()
  }

  const hint =
    attempts === 0
      ? "press the big one."
      : `${attempts} attempt${attempts > 1 ? "s" : ""}. it never works.`

  return (
    <div className="relative">
      <div
        ref={arenaRef}
        className="grain relative h-[26rem] w-full overflow-hidden rounded-[2rem] border border-cream/10 bg-[radial-gradient(120%_120%_at_50%_-10%,rgba(228,85,122,0.22),transparent_60%),radial-gradient(90%_90%_at_80%_110%,rgba(244,201,164,0.14),transparent_60%)] sm:h-[24rem]"
      >
        <Meteors number={12} className="opacity-40" />

        <div
          data-drift="half"
          className="absolute top-0 left-0 will-change-transform"
          style={{ transform: "translate3d(-50%, -50%, 0)" }}
        >
          <button
            type="button"
            onPointerDown={dodge}
            onPointerEnter={(e) => shove(e.currentTarget, 0.75)}
            onClick={dodge}
            className="cursor-pointer rounded-full border border-cream/25 bg-plum/70 px-5 py-3 text-sm text-cream/90 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.9)] backdrop-blur-sm transition-colors hover:border-rose/50 sm:px-6"
          >
            forgive 50%
          </button>
        </div>

        <div
          data-drift="no"
          className="absolute top-0 left-0 will-change-transform"
          style={{ transform: "translate3d(-50%, -50%, 0)" }}
        >
          <button
            type="button"
            onPointerDown={dodge}
            onPointerEnter={(e) => shove(e.currentTarget, 0.75)}
            onClick={dodge}
            className="cursor-pointer rounded-full border border-cream/25 bg-plum/70 px-5 py-3 text-sm text-cream/90 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.9)] backdrop-blur-sm transition-colors hover:border-rose/50 sm:px-6"
          >
            don't forgive
          </button>
        </div>

        <div
          data-drift="full"
          className="absolute top-0 left-0 z-10 will-change-transform"
          style={{ transform: "translate3d(-50%, -50%, 0)" }}
        >
          <ShimmerButton
            onClick={onForgive}
            disabled={forgiven}
            shimmerColor="#ffd9c2"
            shimmerDuration="2.6s"
            background="linear-gradient(180deg,#e4557a,#a32c52)"
            className="px-6 py-3.5 text-sm font-semibold tracking-wide text-[#2a0a15] shadow-[0_18px_60px_-18px_rgba(228,85,122,0.85)] sm:px-8 sm:py-4 sm:text-base"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              forgive 100%
              <Heart className="size-3.5" />
            </span>
          </ShimmerButton>
        </div>
      </div>

      <div className="mt-5 flex min-h-14 flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm text-muted/80">{hint}</p>
        <div className="h-6">
          <AnimatePresence mode="wait">
            {taunt && (
              <motion.p
                key={taunt.id}
                initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                transition={{ duration: 0.25 }}
                className="hand text-base text-rose"
              >
                {taunt.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
