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
  NodeType,
  PageNode,
  ProjectsNode,
  SkillsNode,
  TestimonialsNode,
  VideoGalleryNode,
} from "../editor";

import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Expand } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTelegram } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { getHeaderlinks } from "../utils";
import { Progress } from "@/components/ui/progress";
import { cn, getDateStringByIso } from "@/lib/utils";
import { getDate } from "date-fns";

function FullscreenMedia({ src, isVideo }: { src: string; isVideo?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2">
          <Expand />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-black/90">
        <DialogTitle className="sr-only">Image</DialogTitle>
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

export function HeaderSection({
  node,
  nodes,
}: {
  node: HeaderNode;
  nodes: PageNode[];
}) {
  switch (node.template) {
    default:
      const links = getHeaderlinks(nodes);
      return (
        <header
          id={node.type}
          className={`fixed z-50 top-0 inset-x-0 ${node.template} pt-4`}
        >
          <section className="w-fit rounded-full flex items-center gap-4 border border-border/50 px-3 mx-auto bg-black/5 backdrop-blur-md py-3 pr-4">
            {node.showIcon && (
              <img
                width={80}
                height={80}
                alt="logo"
                className="w-10"
                src={
                  (nodes[0].type == NodeType.PageMetadata
                    ? nodes[0].iconUrl
                    : undefined) || "/logo.png"
                }
              />
            )}
            {node.iconText && <p>{node.iconText}</p>}
            {node.showLinks && (
              <nav className="flex ml-6 gap-4 items-center">
                {links.map((item) => {
                  return (
                    <Link key={item.title} href={item.url}>
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            )}
          </section>
        </header>
      );
  }
}
export function HeroSection({ node }: { node: HeroNode }) {
  switch (node.template) {
    default:
      return (
        <section
          id={node.type}
          className={`hero flex border-b  ${node.template}`}
        >
          <div className="wrapper flex gap-6 pb-40 pt-64">
            <div className="flex flex-col gap-6">
              <h1 className="page-h1">{node.title}</h1>
              <p className="max-w-[56ch]">{node.description}</p>
            </div>
            <Image
              width={400}
              height={400}
              alt="hero-img"
              src={"/logo.png"}
              className=""
            />
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
          <div className="wrapper flex flex-col gap-6">
            <h2 className="h2">About me</h2>
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
          <div className="wrapper flex flex-col gap-4">
            <h2 className="page-h2">Education</h2>
            {node.description && (
              <ReactMarkdown>{node.description}</ReactMarkdown>
            )}
            <ul className="timeline px-4 mt-6">
              {node.timeline.map((item, i) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative  flex",
                    i !== node.timeline.length - 1 &&
                      "border-l-[1.5px] group/expbox border-gray-950/40 border-dashed"
                  )}
                >
                  <span className="w-[1.8rem] h-[1.8rem] absolute top-0 -left-[0.9rem] rounded-full bg-gray-700 flex">
                    <span className="bg-primary/40 group-hover/expbox:w-full group-hover/expbox:h-full duration-300 transition-all w-3 h-3 rounded-full mx-auto my-auto" />
                  </span>
                  <div className="mb-8 ml-8 text-base flex flex-col p-4 border border-gray-900/20 rounded-lg drop-shadow bg-black/5">
                    <span className="text-sm">
                      {getDateStringByIso(item.startDate)} –{" "}
                      {item.endDate ? getDate(item.endDate) : "Present"}
                    </span>
                    <p>
                      <em className="text-primary">{item.title}</em>
                    </p>
                    <p>{item.description}</p>
                  </div>
                </div>
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
          className={`wrapper certificates ${node.template} py-16`}
        >
          <h2 className="h2">Certificates</h2>
          <div className="mx-auto">
            <Carousel className="mt-6">
              {node.imageUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Certificate ${i + 1}`}
                  className="rounded-lg max-w-40"
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
          <div className="wrapper flex flex-col gap-6">
            <h2 className="page-h2">Skills</h2>
            {node.description && (
              <ReactMarkdown>{node.description}</ReactMarkdown>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              {node.skills.map((skill) => (
                <div key={skill.name} className="flex flex-col gap-2">
                  <h3 className="page-h3">{skill.name}</h3>
                  <Progress
                    value={Number(skill.proficiency)}
                    max={100}
                    className="w-full max-w-32 h-2 rounded-full"
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
          <div className="wrapper flex flex-col">
            {node.projects.map((proj, i: number) => (
              <div key={i} className="space-y-4 py-10 flex flex-col gap-4">
                <h4 className="page-h3">{proj.name}</h4>
                <p>{proj.description}</p>
                <div>
                  {proj.imageUrls.map((url: string, j: number) => (
                    <img
                      key={j}
                      src={url}
                      alt={`${proj.name} image ${j + 1}`}
                      className="rounded-lg"
                    />
                  ))}
                </div>
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
          <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          className={`image-gallery flex flex-col gap-6 ${node.template} py-16`}
        >
          <div className="wrapper flex flex-col">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
            </div>

            {node.groups &&
              node.groups.map((group) => (
                <div key={group.id} className="flex py-6 flex-col gap-4">
                  <h3 className="page-h3">{group.title}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {group.imageUrls.map((url: string, idx: number) => (
                      <div key={group.title + idx} className="relative group">
                        <img
                          src={url}
                          alt={`${group.title} ${idx}`}
                          className="w-full rounded-lg"
                        />
                        <FullscreenMedia src={url} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
          <div className="wrapper flex flex-col gap-6">
            <h2 className="page-h2">Testimonials</h2>
            <div className="flex gap-4">
              {node.testimonials.map((t, i: number) => (
                <div key={i} className="p-6 border">
                  {t.picture && (
                    <img
                      src={t.picture}
                      alt={t.name}
                      className="w-24 h-24 rounded-full mx-auto"
                    />
                  )}
                  <p className="mt-2 text-2xl">{t.feedback}</p>

                  <p className="mt-4 font-semibold">{t.name}</p>
                  {t.jobDescription && (
                    <p className="italic">{t.jobDescription}</p>
                  )}
                  <p className="mt-2">⭐ {t.rating}/5</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
  }
}

export function ContactSection({ node }: { node: ContactNode }) {
  switch (node.template) {
    default:
      return (
        <section id={node.type} className={`${node.template} border-t-2 py-16`}>
          <div className="wrapper flex flex-col gap-6">
            <h2 className="page-h2">Contact</h2>
            <p>Let&apos;s know if you have any questions</p>

            <div className="flex flex-col gap-4">
              {node.phoneNumber && <p>📞 {node.phoneNumber}</p>}
              {node.email && <p>✉️ {node.email}</p>}

              <div className="flex gap-6">
                {node.socialLinks.map((s) => (
                  <Link
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={s.url}
                    className=""
                  >
                    {s.platform == "Facebook" && (
                      <FaFacebook className="size-8" />
                    )}
                    {s.platform == "Telegram" && (
                      <FaTelegram className="size-8" />
                    )}
                    {s.platform == "Instagram" && (
                      <FaInstagram className="size-8" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
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
