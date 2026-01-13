"use client";

import { useEffect, useState } from "react";

interface ProfileData {
  about: string[];
}

export default function About() {
  const [mounted, setMounted] = useState(false);
  const [about, setAbout] = useState<string[]>([
    "I'm a Senior Java Backend Developer with over 6 years of experience architecting and building scalable microservices for high-traffic applications. My expertise lies in designing robust backend systems that handle millions of requests while maintaining performance and reliability.",
    "Throughout my career, I've worked on critical systems at Infoedge (Naukri.com) and various startups, focusing on domains like job portals, subscription management, payment processing, and licensing servers. I'm passionate about clean architecture, performance optimization, and building systems that scale.",
    "My approach combines deep technical knowledge with a focus on solving real-world business problems. I specialize in microservices architecture, ensuring systems are not only functional but also maintainable, testable, and ready for future growth.",
  ]);

  useEffect(() => {
    setMounted(true);
    // Fetch profile data
    fetch("/api/data/profile")
      .then((res) => res.json())
      .then((data: any) => {
        // Check if data is valid and not an error object
        if (data && !data.error && Array.isArray(data.about)) {
          setAbout(data.about);
        } else if (data.error) {
          console.error("API error:", data.error);
          // Keep default values
        }
      })
      .catch((err) => {
        console.error("Error loading about:", err);
        // Keep default values
      });
  }, []);

  return (
    <section id="about" className="py-20 px-4 md:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          About Me
        </h2>
        <div
          className={`space-y-6 text-lg leading-relaxed text-muted-foreground transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {about.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
