import { useCallback, useEffect, useRef, useState } from "react"
import confetti from "canvas-confetti"

import { ForgiveArena } from "@/components/ForgiveArena"
import { Heart, Lock } from "@/components/Icons"
import { YayDialog } from "@/components/YayDialog"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { BlurFade } from "@/components/ui/blur-fade"
import { Confetti } from "@/components/ui/confetti"
import { Marquee } from "@/components/ui/marquee"
import { Particles } from "@/components/ui/particles"
import { SparklesText } from "@/components/ui/sparkles-text"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"

const STRIP = [
  "meri sonna ji",
  "i'm sorry",
  "i love you",
  "forgive me?",
  "100% yours",
]

const LETTER =
  "Anjali, I'm really sorry. I know sometimes I'm not able to give you the time and care you deserve, and I know that must feel really bad. I'm not great at saying all this out loud, but I never want you to doubt how much you mean to me. Deep down I love you soo soo much meri sonna ji. Please forgive your golu."

const REASONS = [
  "the way you say my name when you're sleepy",
  "your laugh in the middle of a sentence",
  "how you take care of everyone and forget yourself",
  "your terrible puns",
  "how you remember the small things i mention once",
  "how patient you are with me",
  "the way you get excited about tiny things",
  "your voice when you're telling me about your day",
]

function Gate({ open, children, label }) {
  return (
    <div className="relative">
      <div className={open ? "locked-off" : "locked"} aria-hidden={!open}>
        {children}
      </div>
      {!open && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center pt-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-night/70 px-4 py-2 text-xs tracking-wide text-cream/70 backdrop-blur-sm">
            <Lock className="size-3 text-gold/80" />
            {label}
          </span>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const confettiRef = useRef(null)
  const [forgiven, setForgiven] = useState(false)
  const [dialog, setDialog] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem("anjali-forgiven") === "1") setForgiven(true)
    } catch {
      /* private mode, no problem */
    }
  }, [])

  const poppers = useCallback(() => {
    // a real heart shape (not an emoji) so it renders on every device, tinted by the palette
    const hearts = [
      confetti.shapeFromPath({
        path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
        matrix: [1.5, 0, 0, 1.5, -8, -7],
      }),
    ]
    const base = {
      ticks: 320,
      decay: 0.92,
      gravity: 0.85,
      colors: ["#e4557a", "#ffa2b4", "#f4c9a4", "#fdf1ec"],
      zIndex: 80,
    }
    confettiRef.current?.fire({
      ...base,
      particleCount: 110,
      spread: 100,
      startVelocity: 55,
      scalar: 1.05,
      origin: { x: 0.5, y: 0.75 },
    })
    window.setTimeout(
      () =>
        confettiRef.current?.fire({
          ...base,
          particleCount: 22,
          spread: 120,
          startVelocity: 42,
          shapes: hearts,
          scalar: 1.6,
          origin: { x: 0.22, y: 0.78 },
        }),
      160
    )
    window.setTimeout(
      () =>
        confettiRef.current?.fire({
          ...base,
          particleCount: 22,
          spread: 120,
          startVelocity: 42,
          shapes: hearts,
          scalar: 1.6,
          origin: { x: 0.78, y: 0.78 },
        }),
      300
    )
    window.setTimeout(
      () =>
        confettiRef.current?.fire({
          ...base,
          particleCount: 70,
          spread: 140,
          startVelocity: 32,
          scalar: 0.9,
          origin: { x: 0.5, y: 0.95 },
        }),
      620
    )
  }, [])

  const onForgive = useCallback(() => {
    setForgiven(true)
    try {
      localStorage.setItem("anjali-forgiven", "1")
    } catch {
      /* ignore */
    }
    poppers()
    // let the poppers land before the menu slides up
    window.setTimeout(() => setDialog(true), 700)
  }, [poppers])

  const jump = useCallback((id) => {
    setDialog(false)
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 220)
  }, [])

  return (
    <div className="relative min-h-svh overflow-x-hidden bg-night">
      <Confetti
        ref={confettiRef}
        manualstart
        className="pointer-events-none fixed inset-0 z-[80] h-full w-full"
      />

      <div className="pointer-events-none fixed inset-0 z-0">
        <Particles className="absolute inset-0" quantity={70} size={0.5} color="#f4c9a4" ease={70} />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-cream/[0.07] bg-night/80 backdrop-blur-xl">
        <div className="shell flex items-center justify-between py-4">
          <span className="hand text-lg text-cream/65">for anjali</span>
          <div className="flex items-center gap-2.5 rounded-full border border-cream/10 bg-night/55 px-3.5 py-1.5 backdrop-blur-md">
            <span
              className={`size-1.5 rounded-full ${forgiven ? "bg-rose" : "bg-gold/70 animate-pulse-soft"}`}
            />
            {forgiven ? (
              <span className="text-[0.7rem] tracking-wide text-rose">100% forgiven ✓</span>
            ) : (
              <AnimatedShinyText className="text-[0.7rem] tracking-wide">
                waiting for forgiveness…
              </AnimatedShinyText>
            )}
          </div>
        </div>
      </header>

      {/* ───────────────────────── hero ───────────────────────── */}
      <AuroraBackground className="h-auto items-stretch justify-start overflow-hidden bg-night pb-6 dark:bg-night">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(13,7,13,0.15),rgba(13,7,13,0.92))]" />
        <div className="pointer-events-none absolute top-[-12rem] left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-rosedeep/25 blur-[140px]" />
        <div className="shell relative z-10 pt-28 pb-10 sm:pt-32">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <BlurFade delay={0.05} direction="up">
                <p className="eyebrow">for anjali</p>
              </BlurFade>

              <BlurFade delay={0.15} direction="up">
                <div
                  role="heading"
                  aria-level="1"
                  aria-label="Hello, my most beautiful girlfriend"
                  className="mt-5 font-display text-[2.55rem] leading-[0.98] font-normal text-cream sm:text-6xl lg:text-[4.4rem]"
                >
                  <span className="block">Hello, my</span>
                  <SparklesText
                    className="inline-block font-display text-[2.55rem] leading-[1.05] font-normal tracking-tight text-rose italic sm:text-6xl lg:text-[4.4rem]"
                    colors={{ first: "#f4c9a4", second: "#ffa2b4" }}
                    sparklesCount={6}
                  >
                    most beautiful
                  </SparklesText>
                  <span className="block">girlfriend</span>
                </div>
              </BlurFade>

              <BlurFade delay={0.3} direction="up">
                <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-cream/65 sm:text-base">
                  I'm sorry about the time I haven't given you. It's easier to write this down
                  than to say it, so read it once, and then press the button at the end.
                </p>
              </BlurFade>

              <BlurFade delay={0.42} direction="up">
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#letter"
                    className="rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-[#2a0a15] transition-transform hover:-translate-y-0.5"
                  >
                    read it ↓
                  </a>
                </div>
              </BlurFade>
            </div>

            <BlurFade delay={0.2} direction="up" className="relative">
              <div className="relative mx-auto w-[82%] max-w-[19rem] sm:max-w-[21rem] lg:w-full">
                <div className="animate-pulse-soft absolute -inset-6 rounded-t-full rounded-b-[3rem] bg-[radial-gradient(closest-side,rgba(228,85,122,0.5),transparent)] blur-2xl" />
                <div className="arch photo-glow relative border border-cream/15">
                  <img
                    src="/anjali.webp"
                    alt="Anjali, smiling, in a black blazer"
                    width={720}
                    height={956}
                    className="block w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
                </div>
                <div className="animate-hover-heart absolute -top-2 -left-3 -rotate-6 rounded-full bg-rose px-3 py-1 text-[0.65rem] font-semibold text-[#3a0d1c] shadow-lg sm:-left-6">
                  my favourite person
                </div>
                <div className="animate-hover-heart absolute right-0 bottom-16 inline-flex rotate-6 items-center gap-1 rounded-full border border-cream/20 bg-night/80 px-3 py-1 text-[0.65rem] text-cream/80 backdrop-blur-sm">
                  sonna ji
                  <Heart className="size-2.5 text-rose" />
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </AuroraBackground>

      {/* ───────────────────────── marquee ───────────────────────── */}
      <div className="relative z-10 border-y border-cream/10 bg-wine/50">
        <Marquee pauseOnHover className="[--duration:42s] [--gap:2.5rem] py-3">
          {STRIP.map((s) => (
            <span key={s} className="flex items-center gap-3 whitespace-nowrap text-sm text-cream/70">
              <span className="text-rose">✦</span>
              {s}
            </span>
          ))}
        </Marquee>
      </div>

      {/* ───────────────────────── the letter ───────────────────────── */}
      <section id="letter" className="relative z-10 scroll-mt-20 py-20 sm:py-28">
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            <BlurFade inView direction="up">
              <p className="eyebrow">sorry, anjali</p>
            </BlurFade>

            <BlurFade inView delay={0.08} direction="up">
              <TextGenerateEffect
                words={LETTER}
                className="mt-6"
                textClassName="font-display font-normal text-[1.32rem] leading-[1.65] tracking-[-0.01em] text-cream/90 sm:text-[1.6rem] sm:leading-[1.6]"
                duration={0.45}
                staggerDelay={0.03}
              />
            </BlurFade>

            <BlurFade inView delay={0.2} direction="up">
              <p className="hand mt-8 text-right text-lg text-rose/90">— your golu</p>
            </BlurFade>

          </div>
        </div>
      </section>

      {/* ───────────────────────── the question ───────────────────────── */}
      <section id="forgive" className="relative z-10 pb-24 sm:pb-32">
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            <BlurFade inView direction="up">
              <h2 className="text-3xl sm:text-[2.6rem]">so… forgive me?</h2>
            </BlurFade>

            <div className="mt-10">
              {forgiven ? (
                <div className="paper rounded-[2rem] p-8 text-center">
                  <Heart className="mx-auto size-9 text-rose" />
                  <h3 className="mt-3 text-2xl">you already forgave me</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-cream/60">
                    Thank you, sonna ji.
                  </p>
                  <button
                    type="button"
                    onClick={() => setDialog(true)}
                    className="mt-6 cursor-pointer rounded-full bg-rose px-5 py-2.5 text-sm font-semibold text-[#300c18] transition-transform hover:-translate-y-0.5"
                  >
                    open the yay menu
                  </button>
                </div>
              ) : (
                <ForgiveArena forgiven={forgiven} onForgive={onForgive} />
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ───────────────────────── reasons (unlocks) ───────────────────────── */}
      <section id="reasons" className="relative z-10 scroll-mt-20 pb-24 sm:pb-28">
        <div className="shell">
          <div className="mx-auto max-w-4xl">
            <BlurFade inView direction="up">
              <h2 className="text-3xl sm:text-[2.6rem]">why i love you</h2>
            </BlurFade>

            <Gate open={forgiven} label="unlocks when you forgive me">
              <div className="relative mt-8 flex flex-col gap-3 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                <Marquee reverse pauseOnHover className="[--duration:34s] [--gap:0.75rem] p-0">
                  {REASONS.slice(0, 4).map((r) => (
                    <span
                      key={r}
                      className="rounded-full border border-cream/12 bg-cream/[0.04] px-4 py-2 text-sm whitespace-nowrap text-cream/75"
                    >
                      {r}
                    </span>
                  ))}
                </Marquee>
                <Marquee pauseOnHover className="[--duration:38s] [--gap:0.75rem] p-0">
                  {REASONS.slice(4).map((r) => (
                    <span
                      key={r}
                      className="rounded-full border border-cream/12 bg-cream/[0.04] px-4 py-2 text-sm whitespace-nowrap text-cream/75"
                    >
                      {r}
                    </span>
                  ))}
                </Marquee>
              </div>
            </Gate>
          </div>
        </div>
      </section>

      {/* ───────────────────────── footer ───────────────────────── */}
      <footer className="relative z-10 border-t border-cream/10 py-12">
        <div className="shell flex flex-col items-center gap-4 text-center">
          <p className="hand text-2xl text-cream/80">for anjali, always.</p>
          <p className="text-xs tracking-[0.2em] text-cream/35 uppercase">sorry, golu</p>
          {forgiven && (
            <button
              type="button"
              onClick={poppers}
              className="mt-1 cursor-pointer rounded-full border border-cream/20 px-4 py-2 text-xs text-cream/65 transition-colors hover:border-rose/50 hover:text-cream"
            >
              one more time
              <Heart className="ml-1.5 inline size-3 text-rose" />
            </button>
          )}
        </div>
      </footer>

      <YayDialog
        open={dialog}
        onClose={() => setDialog(false)}
        onPoppers={poppers}
        onJump={jump}
      />
    </div>
  )
}
