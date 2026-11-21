import { useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"

import { Heart } from "@/components/Icons"

const ITEMS = [
  {
    id: "letter",
    kicker: "01",
    label: "read the letter again",
    hint: "the part i should have said out loud",
  },
  {
    id: "promises",
    kicker: "02",
    label: "my twelve promises",
    hint: "small, boring, kept — not big and forgotten",
  },
  {
    id: "reasons",
    kicker: "03",
    label: "why i love you",
    hint: "a list that could honestly be longer",
  },
]

export function YayDialog({ open, onClose, onPoppers, onJump }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="absolute inset-0 bg-night/85 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="yay-title"
            initial={{ y: 40, opacity: 0, scale: 0.97, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ y: 30, opacity: 0, scale: 0.98, filter: "blur(8px)" }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="relative max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] border border-cream/12 bg-plum/95 p-6 shadow-[0_-30px_120px_-40px_rgba(228,85,122,0.7)] sm:rounded-[2rem] sm:p-8"
          >
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-rosedeep/40 blur-3xl" />

            <div className="relative">
              <p className="eyebrow">status update</p>
              <h2 id="yay-title" className="mt-2 text-4xl leading-[1.05] sm:text-5xl">
                yay{" "}
                <Heart className="inline size-7 align-baseline text-rose sm:size-8" />
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/70">
                A hundred percent. Not fifty, not ninety-nine. Thank you, meri sonna ji — you
                have no idea how much lighter that makes me. Pick something from the menu, or
                just close this and stay a while.
              </p>

              <div className="mt-6 space-y-2">
                {ITEMS.map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => onJump(it.id)}
                    className="group flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-cream/10 bg-cream/[0.03] px-4 py-3.5 text-left transition-all hover:border-rose/40 hover:bg-rose/[0.07]"
                  >
                    <span className="text-[0.65rem] tracking-[0.2em] text-gold/70">
                      {it.kicker}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-cream">{it.label}</span>
                      <span className="block text-xs text-cream/45">{it.hint}</span>
                    </span>
                    <span className="text-cream/30 transition-transform group-hover:translate-x-1 group-hover:text-rose">
                      →
                    </span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={onPoppers}
                  className="group flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-rose/25 bg-rose/[0.08] px-4 py-3.5 text-left transition-all hover:border-rose/60 hover:bg-rose/[0.14]"
                >
                  <span className="text-[0.65rem] tracking-[0.2em] text-gold/70">04</span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-cream">
                      one more round of poppers
                    </span>
                    <span className="flex items-center gap-1 text-xs text-cream/45">
                      for good measure
                      <Heart className="size-2.5 text-rose" />
                    </span>
                  </span>
                  <span className="text-cream/30 transition-transform group-hover:translate-x-1 group-hover:text-rose">
                    →
                  </span>
                </button>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-cream/10 pt-4">
                <p className="hand text-sm text-cream/55">ps. i meant every single word.</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer rounded-full border border-cream/20 px-4 py-2 text-xs text-cream/70 transition-colors hover:border-cream/40 hover:text-cream"
                >
                  close for now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
