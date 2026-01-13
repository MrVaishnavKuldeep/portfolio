"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building2, Calendar } from "lucide-react";

interface ExperienceData {
  company: string;
  role: string;
  period: string;
  description: string;
  achievements: string[];
}

export default function Experience() {
  const [mounted, setMounted] = useState(false);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);

  useEffect(() => {
    setMounted(true);
    // Fetch experience data
    fetch("/api/data/experience")
      .then((res) => res.json())
      .then((data: ExperienceData[]) => setExperiences(data))
      .catch((err) => console.error("Error loading experience:", err));
  }, []);

  return (
    <section id="experience" className="py-20 px-4 md:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Experience
        </h2>
        {experiences.length === 0 ? (
          <p className="text-muted-foreground">No experience available.</p>
        ) : (
          <div className="space-y-8">
            {experiences.map((exp, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ${
                index === 0 ? "delay-0" : "delay-200"
              } ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <CardTitle className="text-2xl">{exp.company}</CardTitle>
                      </div>
                      <CardDescription className="text-lg font-semibold text-foreground">
                        {exp.role}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{exp.period}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                  <Separator />
                  <div>
                    <h4 className="mb-3 font-semibold text-foreground">Key Achievements:</h4>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
}
