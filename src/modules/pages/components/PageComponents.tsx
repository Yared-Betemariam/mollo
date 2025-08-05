"use client";

import {
  AboutNode,
  CertificatesNode,
  ContactNode,
  EducationNode,
  FooterNode,
  HeaderNode,
  HeroNode,
  ImageGalleryNode,
  ProjectsNode,
  SkillsNode,
  TestimonialsNode,
  VideoGalleryNode,
} from "../editor";

import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Expand } from "lucide-react";
import ReactMarkdown from "react-markdown";

function FullscreenMedia({ src, isVideo }: { src: string; isVideo?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2">
          <Expand />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-black/90">
        {isVideo ? (
          <video controls className="w-full h-auto">
            <source src={src} />
          </video>
        ) : (
          <img src={src} className="w-full h-auto" />
        )}
      </DialogContent>
    </Dialog>
  );
}

export function HeaderSection({ node }: { node: HeaderNode }) {
  switch (node.template) {
    default:
      return (
        <header
          id={node.type}
          className={`hero ${node.template} py-6 border-b border-border/50`}
        >
          <section className="wrapper flex items-center justify-between">
            <nav className="flex gap-2 items-center">
              {node.links.map((item) => {
                return (
                  <a key={item.title} href={item.url}>
                    {item.title}
                  </a>
                );
              })}
            </nav>
          </section>
        </header>
      );
  }
}
export function HeroSection({ node }: { node: HeroNode }) {
  switch (node.template) {
    default:
      return (
        <section id={node.type} className={`hero ${node.template}`}>
          <div className="container items-center justify-center flex flex-col gap-2 py-20">
            <h1 className="text-5xl font-bold">{node.title}</h1>
            <ReactMarkdown>{node.description}</ReactMarkdown>
          </div>
        </section>
      );
  }
}

export function AboutSection({ node }: { node: AboutNode }) {
  switch (node.template) {
    default:
      return (
        <section id={node.type} className={`about ${node.template} py-16`}>
          <div className="container mx-auto">
            <ReactMarkdown>{node.description}</ReactMarkdown>
          </div>
        </section>
      );
  }
}

export function EducationSection({ node }: { node: EducationNode }) {
  switch (node.template) {
    default:
      return (
        <section id={node.type} className={`education ${node.template} py-16`}>
          <div className="container mx-auto">
            {node.description && (
              <ReactMarkdown>{node.description}</ReactMarkdown>
            )}
            <ul className="timeline mt-6">
              {node.timeline.map((item, i) => (
                <li key={i} className="mb-4">
                  <strong>
                    {item.startDate} – {item.endDate || "Present"}
                  </strong>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
  }
}

export function CertificatesSection({ node }: { node: CertificatesNode }) {
  switch (node.template) {
    default:
      return (
        <section
          id={node.type}
          className={`certificates ${node.template} py-16`}
        >
          <div className="container mx-auto">
            {node.description && (
              <ReactMarkdown>{node.description}</ReactMarkdown>
            )}
            <Carousel className="mt-6">
              {node.imageUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Certificate ${i + 1}`}
                  className="rounded-lg"
                />
              ))}
            </Carousel>
          </div>
        </section>
      );
  }
}

export function SkillsSection({ node }: { node: SkillsNode }) {
  switch (node.template) {
    default:
      return (
        <section id={node.type} className={`skills ${node.template} py-16`}>
          <div className="container mx-auto">
            {node.description && (
              <ReactMarkdown>{node.description}</ReactMarkdown>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              {node.skills.map((skill) => (
                <div key={skill.name} className="text-center">
                  {skill.iconUrl && (
                    <img
                      src={skill.iconUrl}
                      alt={skill.name}
                      className="mx-auto mb-2 h-12"
                    />
                  )}
                  <h5>{skill.name}</h5>
                  <progress
                    value={skill.proficiency}
                    max={100}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      );
  }
}

export function ProjectsSection({ node }: { node: ProjectsNode }) {
  switch (node.template) {
    default:
      return (
        <section id={node.type} className={`projects ${node.template} py-16`}>
          <div className="container mx-auto">
            {node.projects.map((proj, i: number) => (
              <div key={i} className="space-y-4">
                <h4 className="font-semibold">{proj.name}</h4>
                <p>{proj.description}</p>
                <Carousel>
                  {proj.imageUrls.map((url: string, j: number) => (
                    <img
                      key={j}
                      src={url}
                      alt={`${proj.name} image ${j + 1}`}
                      className="rounded-lg"
                    />
                  ))}
                </Carousel>
              </div>
            ))}
          </div>
        </section>
      );
  }
}

export function VideoGallerySection({ node }: { node: VideoGalleryNode }) {
  switch (node.template) {
    default:
      return (
        <section
          id={node.type}
          className={`video-gallery ${node.template} py-16`}
        >
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {node.videos?.map((url: string, i: number) => (
              <div key={i} className="relative group">
                <video src={url} className="w-full rounded-lg" muted />
                <FullscreenMedia src={url} isVideo />
              </div>
            ))}
            {node.groups?.flatMap((group) =>
              group.videoUrls.map((url: string, idx: number) => (
                <div key={group.title + idx} className="relative group">
                  <video src={url} className="w-full rounded-lg" muted />
                  <FullscreenMedia src={url} isVideo />
                </div>
              ))
            )}
          </div>
        </section>
      );
  }
}

export function ImageGallerySection({ node }: { node: ImageGalleryNode }) {
  switch (node.template) {
    default:
      return (
        <section
          id={node.type}
          className={`image-gallery ${node.template} py-16`}
        >
          <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {(node.images ?? []).map((url: string, i: number) => (
              <div key={i} className="relative group">
                <img
                  src={url}
                  alt={`Gallery ${i}`}
                  className="w-full rounded-lg"
                />
                <FullscreenMedia src={url} />
              </div>
            ))}
            {node.groups?.flatMap((group) =>
              group.imageUrls.map((url: string, idx: number) => (
                <div key={group.title + idx} className="relative group">
                  <img
                    src={url}
                    alt={`${group.title} ${idx}`}
                    className="w-full rounded-lg"
                  />
                  <FullscreenMedia src={url} />
                </div>
              ))
            )}
          </div>
        </section>
      );
  }
}

export function TestimonialsSection({ node }: { node: TestimonialsNode }) {
  switch (node.template) {
    default:
      return (
        <section
          id={node.type}
          className={`testimonials ${node.template} py-16`}
        >
          <div className="container mx-auto">
            <Carousel className="mt-6">
              {node.testimonials.map((t, i: number) => (
                <div key={i} className="p-6">
                  {t.pictureUrl && (
                    <img
                      src={t.pictureUrl}
                      alt={t.name}
                      className="w-24 h-24 rounded-full mx-auto"
                    />
                  )}
                  <h5 className="mt-4 font-semibold">{t.name}</h5>
                  {t.jobDescription && (
                    <p className="italic">{t.jobDescription}</p>
                  )}
                  <p className="mt-2">“{t.feedback}”</p>
                  <p className="mt-2">⭐ {t.rating}/5</p>
                </div>
              ))}
            </Carousel>
          </div>
        </section>
      );
  }
}

export function ContactSection({ node }: { node: ContactNode }) {
  switch (node.template) {
    default:
      return (
        <section id={node.type} className={`contact ${node.template} py-16`}>
          <div className="container mx-auto space-y-4">
            <div className="flex space-x-2">
              {node.socialLinks.map((s) => (
                <Button key={s.platform} asChild>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.platform}
                  </a>
                </Button>
              ))}
            </div>
            {node.address && <p>📍 {node.address}</p>}
            {node.phoneNumber && <p>📞 {node.phoneNumber}</p>}
            {node.email && <p>✉️ {node.email}</p>}
          </div>
        </section>
      );
  }
}

export function FooterSection({ node }: { node: FooterNode }) {
  switch (node.template) {
    default:
      return (
        <footer
          id={node.type}
          className={`footer ${node.template} py-6 text-center border-y opacity-50`}
        >
          <p>{node.text}</p>
        </footer>
      );
  }
}
