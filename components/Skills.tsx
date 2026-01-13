"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillsData {
  strongSkills: string[];
  basicSkills: string[];
}

export default function Skills() {
  const [mounted, setMounted] = useState(false);
  const [skills, setSkills] = useState<SkillsData>({
    strongSkills: ["Java", "Spring Boot", "Microservices", "MySQL", "MongoDB", "Redis", "Spring Cloud", "Spring Batch"],
    basicSkills: ["Kafka", "Docker", "Kubernetes"],
  });

  useEffect(() => {
    setMounted(true);
    // Fetch skills data
    fetch("/api/data/skills")
      .then((res) => res.json())
      .then((data: SkillsData) => setSkills(data))
      .catch((err) => console.error("Error loading skills:", err));
  }, []);

  return (
    <section id="skills" className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Skills
        </h2>
        <div
          className={`grid gap-6 md:grid-cols-2 transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Card>
            <CardHeader>
              <CardTitle>Strong Expertise</CardTitle>
              <CardDescription>Technologies I work with daily</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.strongSkills.map((skill) => (
                  <Badge key={skill} variant="default" className="text-sm px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Basic Knowledge</CardTitle>
              <CardDescription>Technologies I'm familiar with</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.basicSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-sm px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
