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
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, getDateStringByIso } from "@/lib/utils";
import { getDate } from "date-fns";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaQuoteRight,
  FaTelegram,
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import PhotoAlbum, {
  Photo,
  RenderImageContext,
  RenderImageProps,
} from "react-photo-album";
import { getHeaderlinks, getImageDimensions } from "../utils";
import { FullscreenMedia } from "@/components/custom/fullscreen-media";

// utils components

export type GalleryImage = {
  src: string;
  width: number;
  height: number;
};

function renderNextImage(
  { alt = "", title, sizes }: RenderImageProps,
  { photo, width, height }: RenderImageContext
) {
  return (
    <div
      style={{
        // width: "100%",
        position: "relative",
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <img src={photo.src} alt={alt} title={title} sizes={sizes} />
      <FullscreenMedia src={photo.src} />
    </div>
  );
}

export function MasonryGallery({ urls }: { urls: string[] }) {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    async function fetchDimensions() {
      const results = await Promise.all(
        urls.map(async (url) => {
          const { width, height } = await getImageDimensions(url);
          return { src: url, width, height };
        })
      );
      setPhotos(results);
    }
    fetchDimensions();
  }, [urls]);

  if (!photos.length) return <div>Loading images...</div>;

  return (
    <div className="max-w-full mx-0 my-auto">
      <PhotoAlbum
        layout="masonry"
        photos={photos}
        columns={(containerWidth) => {
          if (containerWidth < 640) return 1;
          if (containerWidth < 1024) return 2;
          return 3;
        }}
        spacing={8}
        render={{ image: renderNextImage }}
      />
    </div>
  );
}

// main components
export function HeaderSection({
  node,
  nodes,
}: {
  node: HeaderNode;
  nodes: PageNode[];
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        // Or a specific scroll threshold like 50px
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = useMemo(() => getHeaderlinks(nodes), [nodes]);
  const contactNode = useMemo(
    () => nodes.find((item) => item.type == NodeType.SectionContact),
    [nodes]
  );

  const contactButton = contactNode ? (
    <Link href={contactNode?.type}>
      <Button
        size={"xl"}
        className="bg-gradient-to-b h-12! from-[var(--primary-light)] to-[var(--primary-darker)] dark:text-white dark:brightness-110 rounded-full"
      >
        {"Contact"}
      </Button>
    </Link>
  ) : null;

  switch (node.template) {
    default:
      return (
        <header
          id={node.type}
          className={cn(
            `fixed z-50 w-full h-20 top-0 inset-x-0 ${node.template}`,
            isScrolled && "border-b bg-white dark:bg-black"
          )}
        >
          <section className="page-wrapper h-full  flex items-center">
            <div className="flex items-center gap-3">
              {node.showIcon && (
                <img
                  width={80}
                  height={80}
                  alt="logo"
                  className="w-10 rounded-md"
                  src={
                    (nodes[0].type == NodeType.PageMetadata
                      ? nodes[0].iconUrl
                      : undefined) || "/logo.png"
                  }
                />
              )}
              {node.iconText && (
                <h2 className="text-2xl font-semibold tracking-tight">
                  {node.iconText}
                </h2>
              )}
            </div>
            {node.showLinks && (
              <>
                <nav className="hidden sm:flex ml-auto gap-4 items-center">
                  {links.map((item) => {
                    if (item.title == "Contact") {
                      return contactButton;
                    }
                    return (
                      <Link key={item.title} href={item.url}>
                        <span className="opacity-65 hover:opacity-100 duration-200 transition-all hover:text-primary">
                          {item.title}
                        </span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="flex ml-auto sm:hidden items-center gap-3">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant={"outline"} size={"icon"}>
                        <FiMenu className="text-gray-900 group-hover/trigger:text-gray-800 duration-300 transition-all" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="rounded h-full w-72 py-10 pt-14 flex flex-col px-8 gap-2">
                      <SheetTitle className="sr-only">
                        This is mobile menu sheet
                      </SheetTitle>
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
                      <hr className="my-2" />
                      {links.map((item) => (
                        <SheetClose
                          key={item.title}
                          className="text-start border-none outline-none focus-visible:outline-none active:ring-0 m-0"
                        >
                          <Link
                            href={item.url}
                            className={cn(
                              "text-gray-900/90 opacity-80",
                              "transition-all duration-300 text-[15px] md:text-[17px]"
                            )}
                          >
                            {item.title}
                          </Link>
                        </SheetClose>
                      ))}
                    </SheetContent>
                  </Sheet>
                  {contactButton}
                </div>
              </>
            )}
            {!node.showLinks && (
              <div className="flex items-center ml-auto"> {contactButton}</div>
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
          style={{
            ...(node.imageUrl && node.isImageBackgroud
              ? {
                  backgroundImage: `url(${node.imageUrl})`,
                  backgroundOrigin: "cover",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }
              : {}),
          }}
          id={node.type}
          className={`hero flex ${node.template}`}
        >
          <div
            className={cn(
              "page-wrapper flex items-center gap-6 ",
              node.imageUrl && !node.isImageBackgroud
                ? " pb-24 pt-44"
                : "pb-28 pt-48 justify-center"
            )}
          >
            <div
              className={cn(
                "flex flex-col gap-10",
                (!node.imageUrl || node.isImageBackgroud) &&
                  "items-center justify-center max-w-xl text-center"
              )}
            >
              <p className="page-subtitle">{node.subtitle}</p>
              <h1 className="page-h1 font-[family-name:var(--theme-font)]">
                {node.title}
              </h1>
              <p className="text-2xl">{node.description}</p>
            </div>
            {node.imageUrl && !node.isImageBackgroud && (
              <img
                width={400}
                height={400}
                alt="hero-img"
                src={node.imageUrl}
                className="max-h-64 mx-auto w-auto object-cover"
              />
            )}
          </div>
        </section>
      );
  }
}

export function AboutSection({ node }: { node: AboutNode }) {
  switch (node.template) {
    default:
      return (
        <section
          id={node.type}
          className={`bg-[var(--primary-darker)]/5 dark:bg-[var(--primary-light)]/5 brightness-75 dark:brightness-100 ${node.template} py-16`}
        >
          <div className="page-wrapper flex flex-col gap-6">
            <h2 className="page-h2 font-[family-name:var(--theme-font)]">
              About me
            </h2>
            <p className="text-3xl opacity-75 indent-12">{node.description}</p>
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
          <div className="page-wrapper flex flex-col gap-4">
            <h2 className="page-h2 font-[family-name:var(--theme-font)]">
              Education
            </h2>
            {node.description && <p className="text">{node.description}</p>}
            <ul className="timeline px-4 mt-10">
              {node.timeline.map((item, i) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative flex group/expbox",
                    i !== node.timeline.length - 1 &&
                      "border-l-[2px] border-gray-950/40 dark:border-gray-50/40 border-dashed"
                  )}
                >
                  <span className="w-[1.8rem] h-[1.8rem] absolute top-0 -left-[0.9rem] rounded-full bg-zinc-200 dark:bg-zinc-800 flex">
                    <span className="bg-primary brightness-90 dark:brightness-110 group-hover/expbox:w-full group-hover/expbox:h-full duration-300 transition-all w-3 h-3 rounded-full mx-auto my-auto" />
                  </span>
                  <div className="mb-10 ml-10 text-base flex flex-col px-4 border border-border/10 rounded-lg drop-shadow">
                    <span>
                      {getDateStringByIso(item.startDate)} –{" "}
                      {item.endDate ? getDate(item.endDate) : "Present"}
                    </span>
                    <p className="page-h4 mt-2">{item.title}</p>
                    <p className="text">{item.description}</p>
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
          className={`page-wrapper certificates ${node.template} py-16`}
        >
          <h2 className="page-h2 font-[family-name:var(--theme-font)]">
            Certificates
          </h2>
          <div className="mx-auto">
            <ScrollArea className="bg-zinc-900/10 rounded-md border whitespace-nowrap mt-6">
              <div className="flex space-x-4 w-max p-4">
                {node.imageUrls.map((url, i) => (
                  <div
                    key={i}
                    className="relative min-w-96 overflow-hidden max-w-72 aspect-video rounded-md group bg-black"
                  >
                    <img
                      src={url}
                      alt={`Certificate ${i + 1}`}
                      className="absolute inset-0 object-cover object-center"
                    />
                    <FullscreenMedia src={url} />
                  </div>
                ))}
                {node.imageUrls.map((url, i) => (
                  <div
                    key={i}
                    className="relative min-w-96 overflow-hidden max-w-72 aspect-video group bg-black"
                  >
                    <img
                      src={url}
                      alt={`Certificate ${i + 1}`}
                      className="absolute inset-0 object-cover object-center"
                    />
                    <FullscreenMedia src={url} />
                  </div>
                ))}
              </div>
              <ScrollBar
                orientation="horizontal"
                className="min-h-[10px] pb-[2px] px-2"
              />
            </ScrollArea>
          </div>
        </section>
      );
  }
}

export function SkillsSection({ node }: { node: SkillsNode }) {
  switch (node.template) {
    default:
      return (
        <section id={node.type} className={`skills ${node.template} py-24`}>
          <div className="page-wrapper flex flex-col gap-6">
            <h2 className="page-h2 font-[family-name:var(--theme-font)]">
              Skills
            </h2>
            {node.description && <p className="text">{node.description}</p>}
            <div className="grid grid-cols-1 sm:gird-cols-2 md:grid-cols-3 gap-8 mt-6">
              {node.skills.map((skill) => (
                <div key={skill.name} className="flex flex-col gap-2 relative">
                  <h3 className="page-h4 z-10 absolute px-2 left-4 top-1/2 -translate-y-1/2  from-white to-zinc-100">
                    {skill.name}
                  </h3>
                  <Progress
                    value={Number(skill.proficiency)}
                    max={100}
                    className="w-full h-12 rounded-xl brightness-75"
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
        <section id={node.type} className={`projects ${node.template} `}>
          <div className="flex flex-col divide-y border-y">
            {node.projects.map((proj, i: number) => (
              <div
                key={i}
                className="space-y-4 page-wrapper py-20 flex flex-col gap-4"
              >
                <h4 className="page-h2 font-[family-name:var(--theme-font)]">
                  {proj.name}
                </h4>
                <p className="text">{proj.description}</p>
                <MasonryGallery urls={proj.imageUrls || []} />
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
          className={`image-gallery flex flex-col ${node.template}`}
        >
          <div className="page-wrapper py-16 flex flex-col">
            <MasonryGallery urls={node.images || []} />
          </div>

          <div className="flex flex-col border-y divide-y">
            {node.groups &&
              node.groups.map((group) => (
                <div
                  key={group.id}
                  className="flex page-wrapper py-14 flex-col gap-8"
                >
                  <h3 className="page-h3">{group.title}</h3>
                  <MasonryGallery urls={group.imageUrls || []} />
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
          className={`testimonials ${node.template} py-24`}
        >
          <div className="page-wrapper flex flex-col gap-12 items-center">
            <h2 className="page-h2 font-[family-name:var(--theme-font)]">
              Testimonials
            </h2>
            <div className="gap-6 grid grid-cols-2">
              {node.testimonials.map((t, i: number) => {
                return (
                  <div
                    key={i}
                    className="min-w-64 rounded-xl flex flex-col bg-[var(--primary-darker)]/5 border gap-4 max-w-80 p-8 h-fit"
                  >
                    <FaQuoteRight className="size-6 fill-current text-primary brightness-75" />

                    <p className="text-2xl opacity-90 font-medium">
                      {t.feedback}
                    </p>

                    <div className="flex mt-4">
                      {t.picture && (
                        <img
                          src={t.picture}
                          alt={t.name}
                          className="w-24 h-24 rounded-full mx-auto"
                        />
                      )}
                      <div className="opacity-90 flex-col">
                        <p className="text-xl">{t.name}</p>
                        {t.jobDescription && (
                          <p className="opacity-75">{t.jobDescription}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
        <section
          id={node.type}
          style={{
            backgroundColor: "var(--primary-dark)",
          }}
          className={`${node.template} border-t-2 pb-20 text-white`}
        >
          <div className="page-wrapper items-center py-24 justify-center flex flex-col gap-6">
            <h2
              className={cn(
                "page-h2 from-white to-gray-500 font-[family-name:var(--theme-font)]"
              )}
            >
              Contacts{" "}
            </h2>
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {node.phoneNumber && (
                  <div className="border border-border/20 gap-5 rounded-full px-8 py-4 drop-shadow-xl drop-shadow-black bg-black flex items-center">
                    <Phone className="size-6 text-primary drop-shadow-lg drop-shadow-primary/75" />
                    <div className="flex flex-col">
                      <span className="text-base opacity-60">tel +251</span>
                      <p className="text-lg">{node.phoneNumber}</p>
                    </div>
                  </div>
                )}
                {node.email && (
                  <div className="border border-border/20 gap-5 rounded-full px-8 py-4 drop-shadow-xl drop-shadow-black bg-black flex items-center">
                    <Mail className="fill- size-6 text-primary drop-shadow-lg drop-shadow-primary/75" />
                    <div className="flex flex-col">
                      <span className="text-base opacity-60">email</span>
                      <p className="text-lg">{node.email}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-6">
                {node.socialLinks.map((s) => (
                  <Link
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={s.url}
                    className="hover:scale-120 transition-all duration-300 opacity-50 hover:opacity-100"
                  >
                    {s.platform == "Facebook" && (
                      <FaFacebook className="size-10" />
                    )}
                    {s.platform == "Telegram" && (
                      <FaTelegram className="size-10" />
                    )}
                    {s.platform == "Instagram" && (
                      <FaInstagram className="size-10" />
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
          className={`footer absolute bottom-0 inset-x-0 ${node.template} py-8 text-center text-white border-t border-border/20 bg-black/25 backdrop-blur-xl`}
        >
          <p className="opacity-25 text-lg">{node.text}</p>
        </footer>
      );
  }
}
