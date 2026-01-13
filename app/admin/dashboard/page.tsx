"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isAuthenticated, setAuthenticated } from "@/lib/auth";
import { LogOut, Save, Loader2 } from "lucide-react";

interface ProfileData {
  name: string;
  title: string;
  description: string;
  about: string[];
  contact: {
    email: string;
    linkedin: string;
  };
}

interface SkillsData {
  strongSkills: string[];
  basicSkills: string[];
}

interface ProjectData {
  title: string;
  description: string;
  architecture: string;
  technologies: string[];
  icon: string;
}

interface ExperienceData {
  company: string;
  role: string;
  period: string;
  description: string;
  achievements: string[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "skills" | "projects" | "experience">("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form data states
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    title: "",
    description: "",
    about: [""],
    contact: { email: "", linkedin: "" },
  });
  const [skillsData, setSkillsData] = useState<SkillsData>({
    strongSkills: [""],
    basicSkills: [""],
  });
  const [projectsData, setProjectsData] = useState<ProjectData[]>([]);
  const [experienceData, setExperienceData] = useState<ExperienceData[]>([]);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/admin/login");
      return;
    }

    // Load data
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profile, skills, projects, experience] = await Promise.all([
        fetch("/api/data/profile").then((r) => r.json()),
        fetch("/api/data/skills").then((r) => r.json()),
        fetch("/api/data/projects").then((r) => r.json()),
        fetch("/api/data/experience").then((r) => r.json()),
      ]);

      setProfileData(profile);
      setSkillsData(skills);
      setProjectsData(projects);
      setExperienceData(experience);
    } catch (error) {
      console.error("Error loading data:", error);
      setMessage({ type: "error", text: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    router.push("/admin/login");
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      let data: any;
      let type: string;

      switch (activeTab) {
        case "profile":
          data = profileData;
          type = "profile";
          break;
        case "skills":
          data = skillsData;
          type = "skills";
          break;
        case "projects":
          data = projectsData;
          type = "projects";
          break;
        case "experience":
          data = experienceData;
          type = "experience";
          break;
      }

      const response = await fetch(`/api/data/${type}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          message: `Update ${type} data via admin dashboard`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save");
      }

      setMessage({ type: "success", text: "Data saved successfully!" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to save data" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {(["profile", "skills", "projects", "experience"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Forms */}
        <Card>
          <CardHeader>
            <CardTitle>Edit {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</CardTitle>
            <CardDescription>
              Make changes and click Save to update the data in GitHub
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeTab === "profile" && (
              <ProfileForm data={profileData} onChange={setProfileData} />
            )}
            {activeTab === "skills" && (
              <SkillsForm data={skillsData} onChange={setSkillsData} />
            )}
            {activeTab === "projects" && (
              <ProjectsForm data={projectsData} onChange={setProjectsData} />
            )}
            {activeTab === "experience" && (
              <ExperienceForm data={experienceData} onChange={setExperienceData} />
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Profile Form Component
function ProfileForm({
  data,
  onChange,
}: {
  data: ProfileData;
  onChange: (data: ProfileData) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>About Paragraphs (one per line)</Label>
        <Textarea
          value={data.about.join("\n")}
          onChange={(e) =>
            onChange({ ...data, about: e.target.value.split("\n").filter((p) => p.trim()) })
          }
          rows={6}
        />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          value={data.contact.email}
          onChange={(e) =>
            onChange({ ...data, contact: { ...data.contact, email: e.target.value } })
          }
        />
      </div>
      <div className="space-y-2">
        <Label>LinkedIn URL</Label>
        <Input
          value={data.contact.linkedin}
          onChange={(e) =>
            onChange({ ...data, contact: { ...data.contact, linkedin: e.target.value } })
          }
        />
      </div>
    </div>
  );
}

// Skills Form Component
function SkillsForm({
  data,
  onChange,
}: {
  data: SkillsData;
  onChange: (data: SkillsData) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Strong Skills (comma-separated)</Label>
        <Input
          value={data.strongSkills.join(", ")}
          onChange={(e) =>
            onChange({
              ...data,
              strongSkills: e.target.value.split(",").map((s) => s.trim()).filter((s) => s),
            })
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Basic Skills (comma-separated)</Label>
        <Input
          value={data.basicSkills.join(", ")}
          onChange={(e) =>
            onChange({
              ...data,
              basicSkills: e.target.value.split(",").map((s) => s.trim()).filter((s) => s),
            })
          }
        />
      </div>
    </div>
  );
}

// Projects Form Component
function ProjectsForm({
  data,
  onChange,
}: {
  data: ProjectData[];
  onChange: (data: ProjectData[]) => void;
}) {
  const updateProject = (index: number, field: keyof ProjectData, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addProject = () => {
    onChange([
      ...data,
      {
        title: "",
        description: "",
        architecture: "",
        technologies: [],
        icon: "Code",
      },
    ]);
  };

  const removeProject = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {data.map((project, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Project {index + 1}</CardTitle>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeProject(index)}
              >
                Remove
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={project.title}
                onChange={(e) => updateProject(index, "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={project.description}
                onChange={(e) => updateProject(index, "description", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Architecture</Label>
              <Textarea
                value={project.architecture}
                onChange={(e) => updateProject(index, "architecture", e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Technologies (comma-separated)</Label>
              <Input
                value={project.technologies.join(", ")}
                onChange={(e) =>
                  updateProject(
                    index,
                    "technologies",
                    e.target.value.split(",").map((t) => t.trim()).filter((t) => t)
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Icon (Code, Database, Zap, Shield, etc.)</Label>
              <Input
                value={project.icon}
                onChange={(e) => updateProject(index, "icon", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" onClick={addProject}>
        Add Project
      </Button>
    </div>
  );
}

// Experience Form Component
function ExperienceForm({
  data,
  onChange,
}: {
  data: ExperienceData[];
  onChange: (data: ExperienceData[]) => void;
}) {
  const updateExperience = (index: number, field: keyof ExperienceData, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addExperience = () => {
    onChange([
      ...data,
      {
        company: "",
        role: "",
        period: "",
        description: "",
        achievements: [],
      },
    ]);
  };

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {data.map((exp, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Experience {index + 1}</CardTitle>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeExperience(index)}
              >
                Remove
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(index, "company", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={exp.role}
                onChange={(e) => updateExperience(index, "role", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Period</Label>
              <Input
                value={exp.period}
                onChange={(e) => updateExperience(index, "period", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(index, "description", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Achievements (one per line)</Label>
              <Textarea
                value={exp.achievements.join("\n")}
                onChange={(e) =>
                  updateExperience(
                    index,
                    "achievements",
                    e.target.value.split("\n").filter((a) => a.trim())
                  )
                }
                rows={6}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" onClick={addExperience}>
        Add Experience
      </Button>
    </div>
  );
}
