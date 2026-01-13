"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin } from "lucide-react";

interface ContactData {
  email: string;
  linkedin: string;
}

export default function Contact() {
  const [mounted, setMounted] = useState(false);
  const [contact, setContact] = useState<ContactData>({
    email: "your.email@example.com",
    linkedin: "https://linkedin.com/in/yourprofile",
  });

  useEffect(() => {
    setMounted(true);
    // Fetch profile data for contact info
    fetch("/api/data/profile")
      .then((res) => res.json())
      .then((data: { contact: ContactData }) => {
        if (data.contact) {
          setContact(data.contact);
        }
      })
      .catch((err) => console.error("Error loading contact:", err));
  }, []);

  return (
    <section id="contact" className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-12 text-4xl font-bold tracking-tight text-foreground md:text-5xl text-center">
          Get In Touch
        </h2>
        <div
          className={`transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Card>
            <CardHeader>
              <CardTitle>Let's Connect</CardTitle>
              <CardDescription>
                I'm always open to discussing backend architecture, microservices, or new
                opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    window.location.href = `mailto:${contact.email}`;
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    window.open(contact.linkedin, "_blank");
                  }}
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Button>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Feel free to reach out for collaborations, consulting, or just to say hello!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
