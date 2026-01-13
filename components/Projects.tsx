"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Zap, Shield, LucideIcon } from "lucide-react";

interface ProjectData {
  title: string;
  description: string;
  architecture: string;
  technologies: string[];
  icon: string;
}

const iconMap: Record<string, LucideIcon> = {
  Code,
  Database,
  Zap,
  Shield,
};

export default function Projects() {
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    setMounted(true);
    // Fetch projects data
    fetch("/api/data/projects")
      .then((res) => res.json())
      .then((data: ProjectData[]) => setProjects(data))
      .catch((err) => console.error("Error loading projects:", err));
  }, []);

  return (
    <section id="projects" className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Key Projects
        </h2>
        {projects.length === 0 ? (
          <p className="text-muted-foreground">No projects available.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => {
            const Icon = iconMap[project.icon] || Code;
            const delays = ["delay-0", "delay-100", "delay-200", "delay-300"];
            return (
              <div
                key={index}
                className={`transition-all duration-1000 ${delays[index] || "delay-0"} ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-foreground">
                        Architecture:
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {project.architecture}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-foreground">Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </section>
  );
}
