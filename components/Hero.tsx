"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ProfileData {
  name: string;
  title: string;
  description: string;
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: "Kuldeep Vaishnav",
    title: "Senior Java Backend Developer",
    description: "Building scalable microservices and robust backend systems with 6+ years of experience in enterprise-grade applications",
  });

  useEffect(() => {
    setMounted(true);
    // Fetch profile data
    fetch("/api/data/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error loading profile:", err));
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div
          className={`transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-7xl">
            {profile.name}
          </h1>
          <p className="mb-4 text-2xl font-semibold text-muted-foreground md:text-3xl">
            {profile.title}
          </p>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {profile.description}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get In Touch
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Projects
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 animate-bounce">
        <ChevronDown className="h-6 w-6 text-muted-foreground" />
      </div>
    </section>
  );
}
