import { useCallback, useEffect, useRef, useState } from "react"
import confetti from "canvas-confetti"

import { ForgiveArena } from "@/components/ForgiveArena"
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
  "sorry, golu",
  "you are my favourite notification",
  "i'll do better",
  "100% yours",
  "forgive me?",
  "still your biggest fan",
  "the best thing in my phone",
]

const WRONGS = [
  {
    did: "I answered in half sentences.",
    got: "You learned to finish my thoughts on your own.",
  },
  {
    did: "“Five minutes” at nine p.m.",
    got: "You stayed up till one anyway. Without complaining.",
  },
  {
    did: "I asked about my day first.",
    got: "You quietly stopped telling me about yours.",
  },
]

const LETTER =
  "Anjali, I'm really sorry. I know that sometimes I'm not able to give you the time and the care you deserve — that I disappear into my own day and leave you waiting on the other side of it. You never asked for much. A reply. A call that didn't get cut short. Me noticing when your voice went quiet. And deep down, past every deadline and every distracted message, I love you soo soo much, meri sonna ji. Please forgive your golu."

const PROMISES = [
  "Your call comes before the next commit.",
  "No phone after eleven. You get the last hour of my day, not the leftovers.",
  "Sunday is yours. Not “mostly” — yours.",
  "I ask about your day before I talk about mine.",
  "I say thank you for the small things, out loud, every single time.",
  "When I'm overwhelmed I tell you. I don't go quiet on you.",
  "I remember the things you mention once, in passing.",
  "I show up on time, or I tell you why before you have to ask.",
  "Your bad days get my full attention, not my “we'll talk tomorrow”.",
  "I apologise properly — no “but”, no defending, no score-keeping.",
  "I brag about you to people who have never met you.",
  "I choose you again on the boring days. Especially the boring days.",
]

const REASONS = [
  "the way you say my name when you're sleepy",
  "your laugh arriving in the middle of a sentence",
  "how you carry everyone and forget to sit down",
  "your terrible, perfect puns",
  "the way you fight for the small things",
  "how you remember what I said once, in passing",
  "your handwriting on the note stuck to the fridge",
  "the little noise you make when the tea is good",
  "how brave you are and how little you ask for",
  "your patience with a boy who is still learning",
  "the fact that you're reading this at all",
]

function Gate({ open, children, label }) {
  return (
    <div className="relative">
      <div className={open ? "locked-off" : "locked"} aria-hidden={!open}>
        {children}
      </div>
      {!open && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center pt-10">
          <span className="rounded-full border border-cream/15 bg-night/70 px-4 py-2 text-xs tracking-wide text-cream/70 backdrop-blur-sm">
            🔒 {label}
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
    const hearts = [
      confetti.shapeFromText({ text: "🤍", scalar: 2.4 }),
      confetti.shapeFromText({ text: "💗", scalar: 2.2 }),
      confetti.shapeFromText({ text: "🎉", scalar: 2 }),
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
          particleCount: 34,
          spread: 120,
          startVelocity: 42,
          shapes: hearts,
          scalar: 2.2,
          origin: { x: 0.25, y: 0.8 },
        }),
      160
    )
    window.setTimeout(
      () =>
        confettiRef.current?.fire({
          ...base,
          particleCount: 34,
          spread: 120,
          startVelocity: 42,
          shapes: hearts,
          scalar: 2.2,
          origin: { x: 0.75, y: 0.8 },
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

      <header className="fixed inset-x-0 top-0 z-50">
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
                <p className="eyebrow">a small apology · built at 1 a.m. · for anjali</p>
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
                  I owe you more than one sorry, so I built you an entire page instead of sending
                  a two-line text at midnight. Read it slowly. There's a button at the end, and it
                  is genuinely trying to be pressed.
                </p>
              </BlurFade>

              <BlurFade delay={0.42} direction="up">
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#letter"
                    className="rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-[#2a0a15] transition-transform hover:-translate-y-0.5"
                  >
                    start here ↓
                  </a>
                  <span className="hand text-sm text-cream/45">two minutes. no rush.</span>
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
                  <p className="hand absolute inset-x-0 bottom-3 text-center text-xs text-cream/85">
                    her, being unfair in a blazer
                  </p>
                </div>
                <div className="animate-hover-heart absolute -top-2 -left-3 -rotate-6 rounded-full bg-rose px-3 py-1 text-[0.65rem] font-semibold text-[#3a0d1c] shadow-lg sm:-left-6">
                  my favourite person
                </div>
                <div className="animate-hover-heart absolute right-0 bottom-16 rotate-6 rounded-full border border-cream/20 bg-night/80 px-3 py-1 text-[0.65rem] text-cream/80 backdrop-blur-sm">
                  sonna ji 🤍
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
              <p className="eyebrow">the part i should have said out loud</p>
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
              <p className="hand mt-8 text-right text-lg text-rose/90">
                — your golu, who is still learning
              </p>
            </BlurFade>

            <div className="hairline my-12" />

            <BlurFade inView direction="up">
              <p className="max-w-xl text-sm leading-relaxed text-cream/55">
                None of that was your fault. It was me, being careless with the one person who
                never once ran out of patience for me.
              </p>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ───────────────────────── what i got wrong ───────────────────────── */}
      <section className="relative z-10 pb-20 sm:pb-28">
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            <BlurFade inView direction="up">
              <h2 className="text-3xl sm:text-[2.4rem]">what i got wrong</h2>
            </BlurFade>
            <ul className="mt-8 border-y border-cream/10">
              {WRONGS.map((w, i) => (
                <li key={w.did} className="border-b border-cream/10 last:border-b-0">
                  <BlurFade inView delay={i * 0.08} direction="up">
                    <div className="grid gap-1 py-6 sm:grid-cols-2 sm:gap-10">
                      <p className="font-display text-lg text-cream/95 sm:text-xl">{w.did}</p>
                      <p className="text-sm leading-relaxed text-cream/50 sm:text-base">
                        {w.got}
                      </p>
                    </div>
                  </BlurFade>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────────────────── the question ───────────────────────── */}
      <section id="forgive" className="relative z-10 pb-24 sm:pb-32">
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            <BlurFade inView direction="up">
              <p className="eyebrow">okay. here's the question.</p>
              <h2 className="mt-3 text-3xl sm:text-[2.6rem]">
                Three buttons. Two of them are cowards.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream/55 sm:text-base">
                Only one of them means it. The other two have legs, and no intention of letting
                you press them — I checked.
              </p>
            </BlurFade>

            <div className="mt-10">
              {forgiven ? (
                <div className="paper rounded-[2rem] p-8 text-center">
                  <p className="text-4xl">🥹</p>
                  <h3 className="mt-3 text-2xl">you already forgave me</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-cream/60">
                    Thank you again, sonna ji. The menu is still here if you want it.
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

            <p className="mt-6 text-center text-[0.7rem] tracking-wide text-cream/35">
              warning: this section is rigged in your favour.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── promises (unlocks) ───────────────────────── */}
      <section id="promises" className="relative z-10 scroll-mt-20 pb-24 sm:pb-28">
        <div className="shell">
          <div className="mx-auto max-w-4xl">
            <BlurFade inView direction="up">
              <p className="eyebrow">not big promises. boring ones, kept.</p>
              <h2 className="mt-3 text-3xl sm:text-[2.6rem]">twelve promises</h2>
            </BlurFade>

            <Gate open={forgiven} label="unlocks when you forgive me">
              <ol className="mt-10 grid gap-x-12 gap-y-0 sm:grid-cols-2">
                {PROMISES.map((p, i) => (
                  <li key={p} className="border-b border-cream/10 py-5">
                    <div className="flex gap-4">
                      <span className="mt-1 text-[0.65rem] tracking-[0.18em] text-gold/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-relaxed text-cream/75 sm:text-[0.95rem]">
                        {p}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Gate>
          </div>
        </div>
      </section>

      {/* ───────────────────────── reasons (unlocks) ───────────────────────── */}
      <section id="reasons" className="relative z-10 scroll-mt-20 pb-24 sm:pb-28">
        <div className="shell">
          <div className="mx-auto max-w-4xl">
            <BlurFade inView direction="up">
              <p className="eyebrow">a list i should say out loud more often</p>
              <h2 className="mt-3 text-3xl sm:text-[2.6rem]">why i love you</h2>
            </BlurFade>

            <Gate open={forgiven} label="also unlocks when you forgive me">
              <div className="relative mt-10 flex flex-col gap-3 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                <Marquee reverse pauseOnHover className="[--duration:34s] [--gap:0.75rem] p-0">
                  {REASONS.slice(0, 6).map((r) => (
                    <span
                      key={r}
                      className="rounded-full border border-cream/12 bg-cream/[0.04] px-4 py-2 text-sm whitespace-nowrap text-cream/75"
                    >
                      {r}
                    </span>
                  ))}
                </Marquee>
                <Marquee pauseOnHover className="[--duration:38s] [--gap:0.75rem] p-0">
                  {REASONS.slice(6).map((r) => (
                    <span
                      key={r}
                      className="rounded-full border border-cream/12 bg-cream/[0.04] px-4 py-2 text-sm whitespace-nowrap text-cream/75"
                    >
                      {r}
                    </span>
                  ))}
                </Marquee>
              </div>

              <p className="hand mt-8 text-center text-base text-cream/50 sm:text-lg">
                and about a hundred more i'll tell you in person, one bad day at a time.
              </p>
            </Gate>
          </div>
        </div>
      </section>

      {/* ───────────────────────── footer ───────────────────────── */}
      <footer className="relative z-10 border-t border-cream/10 py-12">
        <div className="shell flex flex-col items-center gap-4 text-center">
          <p className="hand text-2xl text-cream/80">for anjali, always.</p>
          <p className="max-w-md text-xs leading-relaxed text-cream/40">
            made slowly, on purpose, at 1 a.m. — no templates, no shortcuts, only one very sorry
            golu · 21 november 2026
          </p>
          {forgiven && (
            <button
              type="button"
              onClick={poppers}
              className="mt-1 cursor-pointer rounded-full border border-cream/20 px-4 py-2 text-xs text-cream/65 transition-colors hover:border-rose/50 hover:text-cream"
            >
              say it again 🎉
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
