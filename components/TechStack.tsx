"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const techCategories = [
  {
    category: "Backend Framework",
    technologies: ["Java", "Spring Boot", "Spring Cloud", "Spring Batch"],
  },
  {
    category: "Architecture",
    technologies: ["Microservices", "RESTful APIs", "Event-Driven Architecture"],
  },
  {
    category: "Databases",
    technologies: ["MySQL", "MongoDB", "Redis"],
  },
  {
    category: "Messaging & Streaming",
    technologies: ["Kafka (Basic)"],
  },
  {
    category: "DevOps & Infrastructure",
    technologies: ["Docker (Basic)", "Kubernetes (Basic)", "CI/CD"],
  },
  {
    category: "Domain Expertise",
    technologies: ["Job Portals", "Subscription Systems", "Payment Systems", "Licensing"],
  },
];

export default function TechStack() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="tech-stack" className="py-20 px-4 md:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Tech Stack
        </h2>
        <div
          className={`grid gap-4 md:grid-cols-2 transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {techCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-muted px-3 py-1 text-sm text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
