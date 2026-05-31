"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Hero — "Intro Around Avatar"
 *
 * A transparent, waving 3D character sits in the centre while a greeting,
 * role card, experience stat and skill chips float / bob around it.
 *
 * The wave is a transparent CSS sprite (8 green-keyed frames in one PNG),
 * so it plays in every browser on any background — no video codec needed.
 *
 * SETUP
 *  1. Copy wave-strip.png to:  public/assets/wave-strip.png
 *  2. Paste the keyframes block (see hero-animations.css) into app/globals.css
 */

interface ProfileData {
  name: string;
  title: string;
}

const SKILLS = ["Java", "Spring Boot", "Microservices", "Kafka", "MongoDB"];

// Floating-label positions on the desktop orbit stage (percentages).
type Pos = { left: string; top: string; delay: number; dur: number };
const POS: Record<string, Pos> = {
  bubble: { left: "4%", top: "14%", delay: 0.1, dur: 5.5 },
  role: { left: "62%", top: "8%", delay: 0.35, dur: 6 },
  stat: { left: "0%", top: "54%", delay: 0.55, dur: 5 },
  java: { left: "2%", top: "32%", delay: 1.2, dur: 5.6 },
  spring: { left: "70%", top: "46%", delay: 0.7, dur: 5.4 },
  micro: { left: "76%", top: "62%", delay: 0.95, dur: 6.2 },
  kafka: { left: "58%", top: "80%", delay: 1.1, dur: 5.8 },
  mongo: { left: "12%", top: "82%", delay: 0.85, dur: 6 },
};

function Float({
  pos,
  className = "",
  children,
}: {
  pos: Pos;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`kv-float absolute z-10 ${className}`}
      style={{ left: pos.left, top: pos.top, animationDelay: `${pos.delay}s` }}
    >
      <div className="kv-bob" style={{ ["--dur" as string]: `${pos.dur}s`, animationDelay: `${pos.delay}s` }}>
        {children}
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block whitespace-nowrap rounded-full border border-border bg-background px-3.5 py-2 font-mono text-[13px] text-foreground shadow-[0_8px_20px_-12px_rgba(20,20,20,0.3)]">
      {children}
    </span>
  );
}

function Avatar() {
  // overflow-hidden box clipped to ONE sprite cell; the wide strip slides via CSS steps()
  return (
    <div className="relative h-[340px] w-[158px] overflow-hidden sm:h-[400px] sm:w-[186px] lg:h-[440px] lg:w-[205px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/wave-strip.png"
        alt="Kuldeep Vaishnav waving"
        className="kv-wave-strip block h-full w-auto max-w-none origin-top-left"
      />
    </div>
  );
}

function FloorShadow() {
  return (
    <div
      className="pointer-events-none mx-auto -mt-2 h-[34px] w-[200px] rounded-[50%] blur-[2px]"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(20,20,20,0.20) 0%, rgba(20,20,20,0.10) 45%, rgba(20,20,20,0) 72%)",
      }}
    />
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: "Kuldeep Vaishnav",
    title: "Senior Java Backend Engineer",
  });

  useEffect(() => {
    setMounted(true);
    fetch("/api/data/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setProfile((p) => ({ ...p, ...data }));
      })
      .catch(() => {});
  }, []);

  const goTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-24 md:px-8">
      {/* ---------- Desktop / tablet: orbit stage ---------- */}
      <div className="relative mx-auto hidden h-[560px] w-full max-w-[920px] lg:block">
        {/* avatar dead-centre */}
        <div className="absolute bottom-0 left-1/2 z-[2] -translate-x-1/2">
          <Avatar />
          <FloorShadow />
        </div>

        <Float pos={POS.bubble}>
          <div className="flex flex-col rounded-[16px_16px_16px_4px] bg-foreground px-[18px] py-3.5 leading-tight text-background shadow-[0_12px_30px_-12px_rgba(20,20,20,0.45)]">
            <span className="text-[13px] text-background/60">Hi there —</span>
            <strong className="text-[19px] font-bold tracking-tight">I&rsquo;m {profile.name.split(" ")[0]}</strong>
          </div>
        </Float>

        <Float pos={POS.role}>
          <div className="flex flex-col gap-1.5 rounded-[14px] border border-border bg-background px-[18px] py-3.5 text-left shadow-[0_14px_34px_-18px_rgba(20,20,20,0.3)]">
            <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">ROLE</span>
            <span className="text-[17px] font-bold leading-tight tracking-tight">{profile.title}</span>
          </div>
        </Float>

        <Float pos={POS.stat}>
          <div className="flex items-baseline gap-2.5">
            <span className="text-[46px] font-extrabold leading-none tracking-tight">7+</span>
            <span className="text-left text-[13px] leading-snug text-muted-foreground">
              years building
              <br />
              scalable systems
            </span>
          </div>
        </Float>

        <Float pos={POS.java}><Chip>Java</Chip></Float>
        <Float pos={POS.spring}><Chip>Spring Boot</Chip></Float>
        <Float pos={POS.micro}><Chip>Microservices</Chip></Float>
        <Float pos={POS.kafka}><Chip>Kafka</Chip></Float>
        <Float pos={POS.mongo}><Chip>MongoDB</Chip></Float>
      </div>

      {/* ---------- Mobile: stacked ---------- */}
      <div
        className={`flex w-full flex-col items-center text-center transition-all duration-1000 lg:hidden ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="font-mono text-[12px] tracking-[0.2em] text-muted-foreground">
          HI THERE — I&rsquo;M {profile.name.split(" ")[0].toUpperCase()}
        </div>
        <Avatar />
        <FloorShadow />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">{profile.name}</h1>
        <p className="mt-2 text-lg font-semibold text-muted-foreground">{profile.title}</p>
        <div className="mt-5 flex max-w-xs flex-wrap justify-center gap-2">
          {SKILLS.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      </div>

      {/* ---------- CTAs ---------- */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Button size="lg" className="w-full sm:w-auto" onClick={() => goTo("contact")}>
          Get In Touch
        </Button>
        <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => goTo("projects")}>
          View Projects
        </Button>
      </div>
    </section>
  );
}
