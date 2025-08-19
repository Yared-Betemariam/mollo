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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Expand, Phone, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaFacebook, FaInstagram, FaTelegram } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { GoMail } from "react-icons/go";
import PhotoAlbum, {
  Photo,
  RenderImageContext,
  RenderImageProps,
} from "react-photo-album";
import { getHeaderlinks, getImageDimensions } from "../utils";

// utils components
function FullscreenMedia({ src, isVideo }: { src: string; isVideo?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/40"
        >
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
      {/* <ColumnsPhotoAlbum
        photos={photos}
        // render={{ image: renderNextImage }}
        // defaultContainerWidth={1200}
        // sizes={{
        //   size: "1168px",
        //   sizes: [
        //     { viewport: "(max-width: 1200px)", size: "calc(100vw - 32px)" },
        //   ],
        // }}
      /> */}
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

  switch (node.template) {
    default:
      return (
        <header
          id={node.type}
          className={cn(
            `fixed z-50 w-full h-20 top-0 inset-x-0 ${node.template}`,
            isScrolled && "border-b bg-white"
          )}
        >
          <section className="wrapper h-full  flex items-center">
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
              <>
                <nav className="hidden sm:flex ml-auto gap-4 items-center">
                  {links.map((item) => {
                    return (
                      <Link
                        className={cn(item.title === "Contact" && "ml-3")}
                        key={item.title}
                        href={item.url}
                      >
                        {item.title === "Contact" ? (
                          <Button
                            style={{
                              backgroundColor: "var(--primary-darker)",
                            }}
                          >
                            {item.title}
                          </Button>
                        ) : (
                          <span className="opacity-65 hover:opacity-100 duration-200 transition-all hover:text-primary">
                            {item.title}
                          </span>
                        )}
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
                  {contactNode && (
                    <Link href={contactNode.type}>
                      <Button
                        style={{
                          backgroundColor: "var(--primary-darker)",
                        }}
                      >
                        {"Contact"}
                      </Button>
                    </Link>
                  )}
                </div>
              </>
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
        <section id={node.type} className={`hero flex ${node.template}`}>
          {node.imageUrl && !node.isImageBackgroud ? (
            <div className="wrapper flex items-center gap-6 pb-24 pt-44">
              <div className="flex max-w-[60%] flex-col gap-6">
                <h1 className="page-h1">{node.title}</h1>
                <p className="max-w-[56ch]">{node.description}</p>
              </div>
              <img
                width={400}
                height={400}
                alt="hero-img"
                src={node.imageUrl}
                className="max-h-64 object-cover"
              />
            </div>
          ) : (
            <div
              style={{
                ...(node.imageUrl && node.isImageBackgroud
                  ? {
                      backgroundImage: `url(${node.imageUrl})`,
                      backgroundOrigin: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }
                  : {}),
              }}
              className="wrapper flex flex-col items-center justify-center gap-6 pb-32 pt-56"
            >
              <div className="flex flex-col items-center justify-center max-w-xl gap-8 text-center">
                <h1 className="page-h1">{node.title}</h1>
                <p className="text">{node.description}</p>
              </div>
            </div>
          )}
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
          style={{
            backgroundColor: "var(--primary-dark-bg)",
          }}
          className={`about ${node.template} py-16  border-y`}
        >
          <div className="wrapper flex flex-col gap-6">
            <h2 className="h3">About me</h2>
            <p className="big-text">{node.description}</p>
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
            {node.description && <p className="text">{node.description}</p>}
            <ul className="timeline px-4 mt-10">
              {node.timeline.map((item, i) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative flex group/expbox",
                    i !== node.timeline.length - 1 &&
                      "border-l-[2px] border-gray-950/40 border-dashed"
                  )}
                >
                  <span className="w-[1.8rem] h-[1.8rem] absolute top-0 -left-[0.9rem] rounded-full bg-gray-200 flex">
                    <span className="bg-primary brightness-75 group-hover/expbox:w-full group-hover/expbox:h-full duration-300 transition-all w-3 h-3 rounded-full mx-auto my-auto" />
                  </span>
                  <div className="mb-8 ml-8 text-base flex flex-col p-4 border border-border/10 rounded-lg drop-shadow bg-black/5">
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
          className={`wrapper certificates ${node.template} py-16`}
        >
          <h2 className="page-h2">Certificates</h2>
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
          <div className="wrapper flex flex-col gap-6">
            <h2 className="page-h2">Skills</h2>
            {node.description && <p className="text">{node.description}</p>}
            <div className="grid grid-cols-1 sm:gird-cols-2 md:grid-cols-4 gap-8 mt-6">
              {node.skills.map((skill) => (
                <div key={skill.name} className="flex flex-col gap-2">
                  <h3 className="page-h3">{skill.name}</h3>
                  <Progress
                    value={Number(skill.proficiency)}
                    max={100}
                    className="w-full h-2 rounded-full"
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
                className="space-y-4 wrapper py-20 flex flex-col gap-4"
              >
                <h4 className="page-h2">{proj.name}</h4>
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
          <div className="wrapper py-16 flex flex-col">
            <MasonryGallery urls={node.images || []} />
          </div>

          <div className="flex flex-col border-y divide-y">
            {node.groups &&
              node.groups.map((group) => (
                <div
                  key={group.id}
                  className="flex wrapper py-14 flex-col gap-8"
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
          className={`testimonials ${node.template} py-16`}
        >
          <div className="wrapper flex flex-col gap-6">
            <h2 className="page-h2">Testimonials</h2>
            <div className="flex flex-wrap gap-12">
              {node.testimonials.map((t, i: number) => {
                const fullStars = Math.floor(Number(t.rating));

                return (
                  <div key={i} className="py-6 min-w-64">
                    <p className="big-text">
                      <span className="font-black opacity-50">
                        &apos;&apos;
                      </span>{" "}
                      {t.feedback}{" "}
                      <span className="font-black opacity-50">
                        &apos;&apos;
                      </span>
                    </p>

                    <div className="flex mt-6">
                      {t.picture && (
                        <img
                          src={t.picture}
                          alt={t.name}
                          className="w-24 h-24 rounded-full mx-auto"
                        />
                      )}
                      <div className="flex flex-col">
                        <p className="page-h4">{t.name}</p>
                        {t.jobDescription && (
                          <p className="text-lg -mt-1.5 tracking-tight opacity-70">
                            {t.jobDescription}
                          </p>
                        )}
                        <div className="flex mt-1 gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`size-4 fill-current ${
                                i < fullStars ? "text-primary" : "text-zinc-200"
                              }`}
                            />
                            // <div
                            //   key={i}
                            //   className="relative flex h-8 w-8 items-center justify-center"
                            // >
                            //   <div
                            //     className={`absolute inset-0 flex items-center justify-center ${
                            //       i < fullStars ? "bg-primary" : "bg-zinc-200"
                            //     }`}
                            //   >
                            //   </div>

                            //   {hasHalfStar && i === fullStars && (
                            //     <div className="absolute inset-0 flex items-center justify-center">
                            //       <div className="absolute inset-y-0 left-0 h-full w-1/2 bg-orange-500" />
                            //       <Star className="absolute h-6 w-6 text-white fill-current mx-auto" />
                            //     </div>
                            //   )}
                            // </div>
                          ))}
                        </div>
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
          className={`${node.template} border-t-2 py-24 text-white`}
        >
          <div className="wrapper items-center justify-center flex flex-col gap-6">
            <h2 className="page-h2 from-white to-gray-500">Contacts </h2>
            <p className="text-light">
              Let&apos;s know if you have any questions
            </p>

            <div className="flex flex-col items-center gap-6">
              <div
                style={{
                  color: "var(--primary-light)",
                }}
                className="flex flex-col md:flex-row items-center gap-6"
              >
                {node.phoneNumber && (
                  <div className="border border-border/25 gap-3 rounded-full px-4 pr-5 py-1 bg-primary/5 flex items-center">
                    <Phone className="fill-current size-6" />
                    <div className="flex flex-col -space-y-1">
                      <span className="text-base opacity-60">tel +251</span>
                      <p className="text-lg">{node.phoneNumber}</p>
                    </div>
                  </div>
                )}
                {node.email && (
                  <div className="border border-border/25 gap-3 rounded-full px-4 pr-5 py-1 bg-primary/5 flex items-center">
                    <GoMail className="fill-current size-7" />
                    <div className="flex flex-col -space-y-1">
                      <span className="text-base opacity-60">Email</span>
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
                    className="hover:scale-120 transition-all duration-300"
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
          className={`footer ${node.template} py-6 text-center text-white border-t border-border/20`}
          style={{
            backgroundColor: "var(--primary-dark)",
          }}
        >
          <p className="opacity-20">{node.text}</p>
        </footer>
      );
  }
}
