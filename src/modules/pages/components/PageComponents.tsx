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

import { FullscreenMedia } from "@/components/custom/fullscreen-media";
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
import { CSSProperties, useEffect, useMemo, useState } from "react";
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
import { GatesColor, getHeaderlinks, getImageDimensions } from "../utils";

export type GalleryImage = {
  src: string;
  width: number;
  height: number;
};

type VideoGalleryProps = {
  urls: string[];
  className?: string;
};

type Classified = {
  portraits: string[];
  landscapes: string[];
};

const VideoGallery: React.FC<VideoGalleryProps> = ({ urls, className }) => {
  const [classified, setClassified] = useState<Classified | undefined>(
    undefined
  );

  useEffect(() => {
    const classify = async () => {
      const portraits: string[] = [];
      const landscapes: string[] = [];

      await Promise.all(
        urls.map(
          (url) =>
            new Promise<void>((resolve) => {
              const video = document.createElement("video");
              video.src = url;
              video.onloadedmetadata = () => {
                const ratio = video.videoWidth / video.videoHeight;
                if (ratio > 1) {
                  landscapes.push(url); // landscape
                } else {
                  portraits.push(url); // portrait
                }
                resolve();
              };
              video.onerror = () => resolve(); // skip if error
            })
        )
      );

      setClassified({ portraits, landscapes });
    };

    classify();
  }, [urls]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {urls.length >= 1 && !classified && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((url) => (
              <div
                key={url}
                className="rounded-xl h-96 bg-black/5 animate-pulse"
              />
            ))}
          </div>
        </>
      )}

      {classified && classified.portraits.length > 0 && (
        <div
          className={cn("grid grid-cols-1 sm:grid-cls-2 md:grid-cols-3 gap-4")}
        >
          {classified.portraits.map((url, i) => (
            <div
              key={`p-${i}`}
              className="relative overflow-hidden rounded-xl shadow-md aspect-[9/16]"
            >
              <video
                src={url}
                controls
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {classified && classified.landscapes.length > 0 && (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4")}>
          {classified.landscapes.map((url, i) => (
            <div
              key={`l-${i}`}
              className="relative overflow-hidden rounded-xl shadow-md aspect-video"
            >
              <video
                src={url}
                controls
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function renderNextImage(
  { alt = "", title, sizes }: RenderImageProps,
  { photo, width, height }: RenderImageContext
) {
  return (
    <div
      style={{
        aspectRatio: `${width} / ${height}`,
      }}
      className="group relative"
    >
      <img src={photo.src} alt={alt} title={title} sizes={sizes} />
      <FullscreenMedia aspect={width / height} src={photo.src} />
    </div>
  );
}

export function MasonryGallery({
  urls,
  className,
}: {
  urls: string[];
  className?: string;
}) {
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

  return (
    <div className={cn("max-w-full mx-0 my-auto", className)}>
      {photos.length ? (
        <PhotoAlbum
          layout="masonry"
          photos={photos}
          columns={(containerWidth) => {
            if (containerWidth < 640) return 1;
            if (containerWidth < 1024) return 2;
            return 3;
          }}
          spacing={16}
          render={{ image: renderNextImage }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {urls.map((url) => (
            <div
              key={url}
              className="rounded-xl h-64 bg-black/5 animate-pulse"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function HeaderSection({
  node,
  nodes,
  isDark,
}: {
  node: HeaderNode;
  nodes: PageNode[];
  isDark?: boolean;
}) {
  const links = useMemo(() => getHeaderlinks(nodes), [nodes]);
  const contactNode = useMemo(
    () => nodes.find((item) => item.type == NodeType.SectionContact),
    [nodes]
  );

  const contactButton = contactNode ? (
    <Link href={`#${contactNode?.type}`}>
      <Button
        size={"xl"}
        className="bg-gradient-to-br cursor-pointer hover:opacity-80 duration-300 transition-all h-11! from-[var(--primary-light)] to-[var(--primary-darker)] dark:text-white dark:brightness-110 rounded-md"
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
          className={cn(`z-50 border-b w-full h-[6.5rem] ${node.template}`)}
        >
          <section className="page-wrapper page-p py-0 border-x h-full gap-6 flex items-center">
            <div className="flex items-center border-r pr-8 sm:pr-10 h-full gap-4">
              {node.showIcon && (
                <img
                  width={80}
                  height={80}
                  alt="logo"
                  className={cn("w-10 rounded-md")}
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
                <nav className="hidden sm:flex mr-auto gap-4 items-center">
                  {links.map((item) => {
                    if (item.title == "Contact") {
                      return;
                    }
                    return (
                      <Link key={item.title} href={item.url}>
                        <span className="opacity-65 dark:opacity-85 hover:opacity-100 duration-200 transition-all hover:text-primary">
                          {item.title}
                        </span>
                      </Link>
                    );
                  })}
                </nav>

                <Sheet>
                  <SheetTrigger className="sm:hidden" asChild>
                    <Button variant={"outline"} size={"icon"}>
                      <FiMenu className="text-gray-900 dark:text-white group-hover/trigger:text-gray-800 duration-300 transition-all" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className={cn(
                      "rounded-r-md h-full w-72 flex flex-col gap-2",
                      isDark && "dark"
                    )}
                  >
                    <SheetTitle className="sr-only">
                      This is mobile menu sheet
                    </SheetTitle>
                    <div className="flex px-10 pt-10 pb-6">
                      <img
                        width={80}
                        height={80}
                        alt="logo"
                        className="w-10 rounded-md drop-shadow-md"
                        src={
                          (nodes[0].type == NodeType.PageMetadata
                            ? nodes[0].iconUrl
                            : undefined) || "/logo.png"
                        }
                      />
                    </div>
                    <hr className="my-2" />
                    <div className="px-10 flex flex-col gap-4 py-6">
                      {links.map((item) => (
                        <SheetClose
                          key={item.title}
                          className="text-start border-none outline-none focus-visible:outline-none active:ring-0 m-0"
                        >
                          <Link
                            href={item.url}
                            className={cn(
                              "text-gray-900/90 dark:text-gray-200 opacity-80",
                              "transition-all duration-300 text-3xl"
                            )}
                          >
                            {item.title}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
            <div className="flex items-center ml-auto"> {contactButton}</div>
          </section>
        </header>
      );
  }
}

export function descriptionCpt(desc?: string | undefined) {
  return desc
    ? desc
        .trim()
        .split("\n")
        .map((line) => (
          <p key={line} className="text-xl leading-relaxed! opacity-75">
            {line}
          </p>
        ))
    : null;
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
          className={`hero flex border-b ${node.template}`}
        >
          <div
            className={cn(
              "page-wrapper flex items-center gap-6",
              node.imageUrl && !node.isImageBackgroud
                ? "py-20"
                : "py-24 justify-center"
            )}
          >
            <div
              className={cn(
                "flex flex-col gap-10",
                (!node.imageUrl || node.isImageBackgroud) &&
                  "items-center justify-center max-w-[42rem] text-center"
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
        <section id={node.type} className={`${node.template}`}>
          <div className="page-wrapper border-b border-x flex flex-col sm:flex-row">
            <h2 className="page-h2 page-side font-[family-name:var(--theme-font)] bg-[var(--primary-darker)]/25">
              About
            </h2>
            <div className="flex flex-col gap-4 page-p">
              {descriptionCpt(node.description)}
            </div>
          </div>
        </section>
      );
  }
}

export function EducationSection({ node }: { node: EducationNode }) {
  switch (node.template) {
    default:
      return (
        <section id={node.type} className={`education ${node.template}`}>
          <div className="page-wrapper border-x border-b flex flex-col sm:flex-row">
            <h2 className="page-h2 page-side font-[family-name:var(--theme-font)]">
              Education
            </h2>
            <div className="flex flex-col page-p gap-12">
              <ul className="timeline flex flex-col">
                {node.timeline.map((item, i) => (
                  <div
                    key={item.id}
                    className={cn("relative gap-6 flex group/expbox")}
                  >
                    <div className="min-w-48 text-base flex flex-col border border-border/10 rounded-lg drop-shadow">
                      <span className="opacity-80 font-medium">
                        {getDateStringByIso(item.startDate)} –{" "}
                        {item.endDate ? getDate(item.endDate) : "Present"}
                      </span>
                      <p className="page-h4 text-[var(--primary-darker)] mt-2">
                        {item.title}
                      </p>
                      {i !== node.timeline.length - 1 && (
                        <span className="border-r border-[var(--primary-dark)]/20 my-3 flex-1 h-full mr-auto ml-[20%]" />
                      )}
                    </div>
                    <div className="flex pb-10 flex-col gap-4">
                      {descriptionCpt(item.description)}
                    </div>
                  </div>
                ))}
              </ul>
              {node.description && (
                <div className="flex flex-col gap-4">
                  {descriptionCpt(node.description)}
                </div>
              )}
            </div>
          </div>
        </section>
      );
  }
}

export function SkillsSection({ node }: { node: SkillsNode }) {
  switch (node.template) {
    default:
      return (
        <section id={node.type} className={`skills ${node.template}`}>
          <div className="page-wrapper border-x border-b flex flex-col sm:flex-row">
            <h2 className="page-h2 page-side font-[family-name:var(--theme-font)]">
              Skills
            </h2>
            <div className="flex flex-col flex-1 page-p gap-12">
              {node.description && (
                <div className="flex flex-col gap-4">
                  {descriptionCpt(node.description)}
                </div>
              )}

              <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-8">
                {node.skills.map((skill) => (
                  <div key={skill.name} className="flex flex-col gap-3">
                    <h3 className="page-h4">{skill.name}</h3>
                    <Progress
                      value={Number(skill.proficiency)}
                      max={100}
                      className="w-full h-3 max-w-36 rounded-md brightness-75"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
  }
}

export function ProjectsSection({
  node,
  isDark,
}: {
  node: ProjectsNode;
  isDark?: boolean;
}) {
  switch (node.template) {
    default:
      return (
        <section id={node.type} className={cn(`projects ${node.template}`)}>
          <div className="border-b">
            <div className="border-x page-wrapper py-10">
              <h2 className="page-h2 text-center font-[family-name:var(--theme-font)] bg-[var(--primary-darker)]/25">
                Projects
              </h2>
            </div>
          </div>
          <div className="flex flex-col divide-y border-b">
            {node.projects.map((proj, i: number) => (
              <div
                style={
                  {
                    ...(isDark
                      ? { "--border": "#ffffff0d" }
                      : { "--border": "#0000000d" }),
                  } as CSSProperties
                }
                key={i}
                className={cn("", GatesColor(i, "b"))}
              >
                <div className="page-wrapper border-x flex flex-col">
                  <div className="flex flex-col sm:flex-row gap-8 sm:gap-0 page-p py-10 border-b">
                    <h4 className="page-h2 min-w-[50%] font-[family-name:var(--theme-font)]">
                      {proj.name}
                    </h4>
                    <div className="flex flex-col gap-4">
                      {descriptionCpt(proj.description)}
                    </div>
                  </div>
                  <MasonryGallery
                    className={"p-5"}
                    urls={proj.imageUrls || []}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="border-b">
            <div className="border-x page-wrapper py-4" />
          </div>
        </section>
      );
  }
}

export function VideoGallerySection({
  node,
  isDark,
}: {
  node: VideoGalleryNode;
  isDark?: boolean;
}) {
  switch (node.template) {
    default:
      return (
        <section
          id={node.type}
          className={`video-gallery ${node.template} flex flex-col`}
        >
          <div className="page-wrapper border-x py-10 gap-8 flex flex-col">
            <h2 className="page-h2 text-center font-[family-name:var(--theme-font)]">
              Videos
            </h2>
            <VideoGallery className="p-5" urls={[...(node.videos || [])]} />
          </div>

          <div className="flex flex-col border-y divide-y">
            {node.groups &&
              node.groups.map((group, i) => (
                <div
                  style={
                    {
                      ...(isDark
                        ? { "--border": "#ffffff0d" }
                        : { "--border": "#0000000d" }),
                    } as CSSProperties
                  }
                  key={group.id}
                  className={cn("flex flex-col gap-8", GatesColor(i, "b"))}
                >
                  <div className="page-wrapper border-x py-10 gap-5 flex flex-col">
                    <h2 className="page-h3 text-center font-[family-name:var(--theme-font)]">
                      {group.title}
                    </h2>
                    <VideoGallery
                      className="p-5"
                      urls={group.videoUrls || []}
                    />
                  </div>
                </div>
              ))}
          </div>
        </section>
      );
  }
}

export function ImageGallerySection({
  node,
  isDark,
}: {
  node: ImageGalleryNode;
  isDark?: boolean;
}) {
  switch (node.template) {
    default:
      return (
        <section
          id={node.type}
          className={`image-gallery flex flex-col ${node.template}`}
        >
          <div className="page-wrapper border-x py-10 gap-8 flex flex-col">
            <h2 className="page-h2 text-center font-[family-name:var(--theme-font)]">
              Images
            </h2>
            <MasonryGallery className="p-5" urls={node.images || []} />
          </div>

          <div className="flex flex-col border-y divide-y">
            {node.groups &&
              node.groups.map((group, i) => (
                <div
                  style={
                    {
                      ...(isDark
                        ? { "--border": "#ffffff0d" }
                        : { "--border": "#0000000d" }),
                    } as CSSProperties
                  }
                  key={group.id}
                  className={cn("flex flex-col gap-8", GatesColor(i, "b"))}
                >
                  <div className="page-wrapper border-x py-10 gap-5 flex flex-col">
                    <h2 className="page-h3 text-center font-[family-name:var(--theme-font)]">
                      {group.title}
                    </h2>
                    <MasonryGallery
                      className="p-5"
                      urls={group.imageUrls || []}
                    />
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
        <section id={node.type} className={`testimonials ${node.template}`}>
          <div className="page-wrapper flex flex-col sm:flex-row border-x border-b">
            <h2 className="page-h2 page-side min-w-[50%] font-[family-name:var(--theme-font)]">
              Testimonials
            </h2>
            <div className="flex-1 sm:mt-4 sm:border-t border-b mb-4 flex flex-col divide-y">
              {node.testimonials.map((t, i: number) => {
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex px-12 py-8 flex-col gap-4 h-fit",
                      GatesColor(i, "b")
                    )}
                  >
                    <FaQuoteRight className="size-8 fill-current opacity-20 mb-2" />

                    <p className="text-2xl mb-6 opacity-90 font-normal">
                      {t.feedback}
                    </p>

                    <div className="opacity-90 text-right flex flex-col gap-1 ml-auto">
                      <p className="text-2xl font-medium">{t.name}</p>
                      {t.jobDescription && (
                        <p className="opacity-75">{t.jobDescription}</p>
                      )}
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

export function CertificatesSection({ node }: { node: CertificatesNode }) {
  switch (node.template) {
    default:
      return (
        <section
          id={node.type}
          className={`page-wrapper border-x border-b page-p px-0 certificates ${node.template}`}
        >
          <h2 className="page-h2 mb-8 text-center font-[family-name:var(--theme-font)]">
            Certificates
          </h2>
          <ScrollArea>
            <div className="flex space-x-4 w-max px-4 pb-6">
              {node.imageUrls.map((url, i) => (
                <div
                  key={i}
                  className="relative shadow-lg overflow-hidden rounded-md group border border-[var(--primary-dark)]/20"
                >
                  <img
                    loading="lazy"
                    src={url}
                    width={300}
                    alt={`Certificate ${i + 1}`}
                    className="min-h-[14.5rem] h-[15rem] w-auto object-cover object-center"
                  />
                  <FullscreenMedia aspect={16 / 9} src={url} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
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
          style={
            {
              backgroundColor: "var(--primary-dark)",
              "--border": "#ffffff33",
            } as CSSProperties
          }
          className={`${node.template} border-t-2 pb-20 text-white`}
        >
          <div className="page-wrapper border-x flex flex-col sm:flex-row">
            <div className="flex flex-col gap-3 items-center sm:items-start justify-center page-side py-12 md:min-w-[50%]">
              <p className="uppercase text-primary">Get in touch</p>
              <h2
                className={cn(
                  "page-h2 from-white to-gray-500 font-[family-name:var(--theme-font)]"
                )}
              >
                Contact
              </h2>
              <div className="flex mt-2 justify-end gap-6">
                {node.socialLinks.map((s) => (
                  <Link
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={s.url}
                    className="hover:scale-120 transition-all duration-300 opacity-50 hover:opacity-100"
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
            <div className="flex flex-1 flex-col justify-center page-p py-12 items-center gap-4">
              {node.phoneNumber && (
                <div className="border border-border gap-5 rounded-full px-7 py-3 bg-black flex items-center">
                  <Phone className="size-6 text-primary drop-shadow-lg drop-shadow-primary/75" />
                  <div className="flex flex-col">
                    <span className="text-base opacity-60">tel +251</span>
                    <p className="text-lg">{node.phoneNumber}</p>
                  </div>
                </div>
              )}
              {node.email && (
                <div className="border border-border gap-5 rounded-full px-7 py-3  bg-black flex items-center">
                  <Mail className="fill- size-6 text-primary drop-shadow-lg drop-shadow-primary/75" />
                  <div className="flex flex-col">
                    <span className="text-base opacity-60">email</span>
                    <p className="text-lg">{node.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      );
  }
}

export function FooterSection({
  node,
  nodes,
}: {
  node: FooterNode;
  nodes: PageNode[];
}) {
  const contactNode = useMemo(
    () => nodes.find((item) => item.type == NodeType.SectionContact),
    [nodes]
  );
  switch (node.template) {
    default:
      return (
        <footer
          id={node.type}
          className={cn(
            `footer py-6 h-20 text-center dark:text-white border-t dark:bg-black/25 backdrop-blur-xl`,
            contactNode &&
              "absolute bottom-0 border-white/15 inset-x-0 text-white"
          )}
        >
          <p className="opacity-35 dark:opacity-50 text-lg">{node.text}</p>
        </footer>
      );
  }
}
