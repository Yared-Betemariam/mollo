import Dropdown from "@/components/custom/dropdown";
import Hint from "@/components/custom/hint";
import { ScrollAreaWrapper } from "@/components/custom/scrollarea-wrapper";
import { AnimatedAccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn, getDateStringByIso } from "@/lib/utils";
import IconUploadDialog from "@/modules/modals/components/IconUpload";
import { useModalStore } from "@/modules/modals/store";
import ImagesUploadComponent from "@/modules/uploads/components/ImagesUpload";
import {
  ArrowDown,
  ArrowUp,
  ImageIcon,
  Pencil,
  Plus,
  Trash,
  Upload,
} from "lucide-react";
import { useMemo } from "react";
import { BsInfo } from "react-icons/bs";
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
  PageMetadataNode,
  PageNode,
  ProjectsNode,
  SkillsNode,
  TestimonialsNode,
  VideoGalleryNode,
} from "../../editor";
import { getNodeTypeInfo } from "../../utils";
import ColorPicker from "./ColorPicker";
import ValueChanger from "./ValueChanger";
import ImageUploadComponent from "@/modules/uploads/components/ImageUpload";
import NodeItems from "./NodeItems";
import { Info } from "@/types";
import VideosUploadComponent from "@/modules/uploads/components/VideosUpload";

interface Props {
  node: PageNode;
  isActive: boolean;
  toggleNode: () => void;
  moveNodeUp: () => void;
  moveNodeDown: () => void;
  deleteNode: () => void;
  isMain?: boolean;
  editNode: <T extends PageNode>(updates: Partial<T>) => void;
  info: Info | null;
}

const Node = ({
  node,
  isActive,
  toggleNode,
  editNode,
  moveNodeDown,
  moveNodeUp,
  deleteNode,
  isMain,
  info,
}: Props) => {
  const nodeInfo = useMemo(() => getNodeTypeInfo(node.type), [node]);

  const contents = () => {
    switch (node.type) {
      case NodeType.PageMetadata:
        return (
          <>
            <div className="flex gap-8">
              <div className="flex flex-col">
                <h2 className="text-base font-medium mb-2">Current Icon</h2>

                <div className="flex flex-col space-y-4">
                  {node.iconUrl ? (
                    <div className="relative w-fit">
                      <img
                        src={node.iconUrl || "/placeholder.svg"}
                        alt="Current icon"
                        className="size-20 object-cover rounded-lg border-2 border-muted"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                  )}

                  <IconUploadDialog
                    info={info}
                    currentIconUrl={node.iconUrl}
                    onIconChange={(value) => {
                      editNode<PageMetadataNode>({
                        ...node,
                        iconUrl: value,
                      });
                    }}
                    trigger={
                      <Button variant={"outline"} size={"xs"}>
                        <Upload className="h-4 w-4 mr-1" />
                        {node.iconUrl ? "Change Icon" : "Upload Icon"}
                      </Button>
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <ColorPicker
                  label="Theme Color"
                  color={node.themeColor || ""}
                  onChange={(value) => {
                    editNode<PageMetadataNode>({
                      ...node,
                      ...(value ? { themeColor: value } : {}),
                    });
                  }}
                />
                <Dropdown
                  value={node.themeFont}
                  label="Main Font"
                  options={[
                    {
                      value: "system-ui",
                      label: "System ui",
                    },
                    {
                      value: "serif",
                      label: "Serif",
                    },
                    {
                      value: "gill",
                      label: "Gill Sans",
                    },
                    {
                      value: "georgia",
                      label: "Georgia",
                    },
                    {
                      value: "cambria",
                      label: "Cambria",
                    },
                    {
                      value: "arial",
                      label: "Arial",
                    },
                    {
                      value: "sans-serif",
                      label: "Sans Serif",
                    },
                  ]}
                  onChange={(value) => {
                    editNode<PageMetadataNode>({
                      ...node,
                      ...(value ? { themeFont: value } : {}),
                    });
                  }}
                />
              </div>
            </div>
            <ValueChanger
              label="Page Title"
              onChange={(value) => {
                editNode<PageMetadataNode>({
                  ...node,
                  title: value,
                });
              }}
              value={node.title}
            />
          </>
        );
      case NodeType.SectionHeader:
        return (
          <div className="flex gap-6">
            <div className="flex max-w-[30%] flex-col gap-2">
              <div className="flex gap-2 items-center">
                <Checkbox
                  id="showIcon"
                  checked={node.showIcon || false}
                  onCheckedChange={() => {
                    editNode<HeaderNode>({
                      ...node,
                      showIcon: !node.showIcon,
                    });
                  }}
                />
                <label htmlFor="showIcon">Show Icon</label>
              </div>
              <div className="flex gap-2 items-center">
                <Checkbox
                  id="showLinks"
                  checked={node.showLinks || false}
                  onCheckedChange={() => {
                    editNode<HeaderNode>({
                      ...node,
                      showLinks: !node.showLinks,
                    });
                  }}
                />
                <label htmlFor="showIcon">Show Links</label>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <ValueChanger
                label="Icon text"
                onChange={(value) => {
                  editNode<HeaderNode>({
                    ...node,
                    iconText: value,
                  });
                }}
                value={node.iconText || ""}
              />
            </div>
          </div>
        );
      case NodeType.SectionHero:
        return (
          <>
            <ValueChanger
              label="Subtitle"
              onChange={(value) => {
                editNode<HeroNode>({
                  ...node,
                  subtitle: value,
                });
              }}
              value={node.subtitle}
            />
            <ValueChanger
              label="Title"
              onChange={(value) => {
                editNode<HeroNode>({
                  ...node,
                  title: value,
                });
              }}
              value={node.title}
            />
            <ValueChanger
              label="Description"
              type="textarea"
              onChange={(value) => {
                editNode<HeroNode>({
                  ...node,
                  description: value,
                });
              }}
              value={node.description}
            />
            <div className="flex gap-8">
              <ImageUploadComponent
                info={info}
                imageUrl={node.imageUrl || null}
                onChange={(imageUrl) => {
                  editNode<HeroNode>({
                    ...node,
                    ...(imageUrl ? { imageUrl } : { imageUrl: undefined }),
                  });
                }}
              />
              <div className="flex min-w-[30%] flex-col">
                <div className="flex items-center  gap-2">
                  <Checkbox
                    id="isImageBackgroud"
                    checked={node.isImageBackgroud || false}
                    onCheckedChange={() => {
                      editNode<HeroNode>({
                        ...node,
                        isImageBackgroud: !node.isImageBackgroud,
                      });
                    }}
                  />
                  <label htmlFor="isImageBackgroud">Is Backgroud Image</label>
                </div>
              </div>
            </div>
          </>
        );
      case NodeType.SectionAbout:
        return (
          <>
            <ValueChanger
              long
              label="Description"
              type="textarea"
              onChange={(value) => {
                editNode<AboutNode>({
                  ...node,
                  description: value,
                });
              }}
              value={node.description}
            />
          </>
        );
      case NodeType.SectionEducation:
        return (
          <>
            <ValueChanger
              label="Description"
              type="textarea"
              onChange={(value) => {
                editNode<EducationNode>({
                  ...node,
                  description: value,
                });
              }}
              value={node.description || ""}
            />
            <NodeItems
              onDelete={(id) => {
                editNode<EducationNode>({
                  ...node,
                  timeline: node.timeline?.filter((test) => test.id !== id),
                });
              }}
              node={node}
              name="Timeline"
              item_id="education"
              items={
                node.timeline?.map((item) => ({
                  id: item.id,
                  name: item.title,
                  item,
                  cpt: (
                    <p className="node-desc">
                      {getDateStringByIso(item.startDate)}{" "}
                      {item.endDate
                        ? `- ${getDateStringByIso(item.endDate)}`
                        : "- Present"}
                    </p>
                  ),
                })) || []
              }
            />
          </>
        );
      case NodeType.SectionSkills:
        return (
          <>
            <ValueChanger
              label="Description"
              type="textarea"
              onChange={(value) => {
                editNode<SkillsNode>({
                  ...node,
                  description: value,
                });
              }}
              value={node.description || ""}
            />
            <NodeItems
              onDelete={(id) => {
                editNode<SkillsNode>({
                  ...node,
                  skills: node.skills.filter((test) => test.id !== id),
                });
              }}
              node={node}
              name="Skills"
              item_id="skill"
              items={
                node.skills.map((item) => ({
                  id: item.id,
                  name: item.name,
                  item,
                  cpt: (
                    <Progress
                      className="max-w-32 mt-1"
                      value={Number(item.proficiency)}
                    />
                  ),
                })) || []
              }
            />
          </>
        );
      case NodeType.SectionProjects:
        return (
          <>
            <NodeItems
              onDelete={(id) => {
                editNode<ProjectsNode>({
                  ...node,
                  projects: node.projects.filter((test) => test.id !== id),
                });
              }}
              node={node}
              name="Projects"
              item_id="project"
              items={
                node.projects.map((item) => ({
                  id: item.id,
                  name: item.name,
                  item,
                  cpt: <p className="node-desc">{item.description}</p>,
                })) || []
              }
            />
          </>
        );
      case NodeType.SectionCertificates:
        return (
          <>
            <ImagesUploadComponent
              info={info}
              imageUrls={node.imageUrls}
              onChange={(imageUrls) =>
                editNode<CertificatesNode>({ ...node, imageUrls })
              }
            />
          </>
        );
      case NodeType.SectionVideoGallery:
        return (
          <>
            <VideosUploadComponent
              info={info}
              videoUrls={node.videos || []}
              onChange={(videos) =>
                editNode<VideoGalleryNode>({ ...node, videos })
              }
            />
            <NodeItems
              onDelete={(id) => {
                editNode<VideoGalleryNode>({
                  ...node,
                  groups: node.groups?.filter((test) => test.id !== id),
                });
              }}
              node={node}
              name="Video Groups"
              item_id="videoGalleryGroup"
              items={
                node.groups?.map((item) => ({
                  id: item.id,
                  name: item.title,
                  item,
                })) || []
              }
            />
            <div className="flex flex-col w-full gap-0.5">
              <ScrollAreaWrapper className="flex flex-1 flex-col max-h-36 w-full p-0.5">
                {node.groups && node.groups.length > 0 ? (
                  node.groups.map((group, i) => (
                    <div
                      key={group.id || i}
                      className="border flex py-1.5 rounded-md px-2 mb-2"
                    >
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm opacity-50">
                          Group #{i + 1}
                        </span>
                        <p className="font-medium">{group.title}</p>
                      </div>
                      <div className="flex h-full items-start">
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          onClick={() =>
                            useModalStore.getState().openModal({
                              open: "videoGalleryGroup",
                              data: { node, group },
                            })
                          }
                          className="gap-2 size-7"
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size={"sm"}
                          variant={"ghost"}
                          onClick={() =>
                            editNode<VideoGalleryNode>({
                              ...node,
                              groups: (node.groups || []).filter(
                                (g) => g.id !== group.id
                              ),
                            })
                          }
                          className="gap-2 size-7"
                        >
                          <Trash className="text-destructive!" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <span>No video groups here</span>
                )}
              </ScrollAreaWrapper>
              <Button
                size={"sm"}
                onClick={() =>
                  useModalStore
                    .getState()
                    .openModal({ open: "videoGalleryGroup", data: { node } })
                }
                className="size-8 ml-auto rounded-md"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </>
        );
      case NodeType.SectionImageGallery:
        return (
          <>
            <ImagesUploadComponent
              info={info}
              imageUrls={node.images || []}
              onChange={(images) =>
                editNode<ImageGalleryNode>({ ...node, images })
              }
            />
            <NodeItems
              onDelete={(id) => {
                editNode<ImageGalleryNode>({
                  ...node,
                  groups: node.groups?.filter((test) => test.id !== id),
                });
              }}
              node={node}
              name="Image Groups"
              item_id="imageGalleryGroup"
              items={
                node.groups?.map((item) => ({
                  id: item.id,
                  name: item.title,
                  item,
                })) || []
              }
            />
          </>
        );
      case NodeType.SectionTestimonials:
        return (
          <NodeItems
            onDelete={(id) => {
              editNode<TestimonialsNode>({
                ...node,
                testimonials: node.testimonials?.filter(
                  (test) => test.id !== id
                ),
              });
            }}
            node={node}
            name="Testimonials"
            item_id="testimonial"
            items={
              node.testimonials?.map((item) => ({
                id: item.id,
                name: item.name,
                item,
                cpt: <p className="node-desc">{item.jobDescription}</p>,
              })) || []
            }
          />
        );
      case NodeType.SectionContact:
        return (
          <>
            <div className="flex flex-col gap-1">
              <label className="opacity-70">Social links</label>
              <div className="flex flex-col gap-2">
                {node.socialLinks.map((item) => (
                  <div key={item.platform} className="flex items-center gap-2">
                    <span className="w-20">{item.platform}</span>
                    <ValueChanger
                      className="flex-1"
                      onChange={(value) => {
                        editNode<ContactNode>({
                          ...node,
                          socialLinks: node.socialLinks.map((link) =>
                            link.platform == item.platform
                              ? { ...item, url: value }
                              : link
                          ),
                        });
                      }}
                      value={item.url}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ValueChanger
                label="Email"
                placeHolder="email@email.com"
                onChange={(value) => {
                  editNode<ContactNode>({
                    ...node,
                    ...(value ? { email: value } : {}),
                  });
                }}
                value={node.email || ""}
              />
              <ValueChanger
                label="Phone"
                placeHolder="0901010101"
                onChange={(value) => {
                  editNode<ContactNode>({
                    ...node,
                    ...(value ? { phoneNumber: value } : {}),
                  });
                }}
                value={node.phoneNumber || ""}
              />
            </div>
          </>
        );
      case NodeType.SectionFooter:
        return (
          <>
            <ValueChanger
              label="Content"
              onChange={(value) => {
                editNode<FooterNode>({
                  ...node,
                  text: value,
                });
              }}
              value={node.text}
            />
          </>
        );
      default:
        return <></>;
    }
  };

  const nodeActions = [
    {
      title: "Move Up",
      desc: "Move node up",
      Icon: ArrowUp,
      onClick: moveNodeUp,
    },
    {
      title: "Move Down",
      desc: "Move node down",
      Icon: ArrowDown,
      onClick: moveNodeDown,
    },
    {
      title: "Delete",
      desc: "Delte node",
      Icon: Trash,
      onClick: deleteNode,
    },
  ];

  return (
    <>
      {/* Trigger */}
      <div
        className={cn(
          "flex group/item py-3.5 px-4 items-center justify-between gap-2",
          isActive && "border-b sticky z-10 bg-white top-0 border-border/25"
        )}
      >
        <p
          onClick={() => toggleNode()}
          className={cn(
            "hover:text-primary h-full text-[17px] cursor-pointer transition-all duration-200",
            isActive && "text-sky-800 font-semibold"
          )}
        >
          {nodeInfo.title}
        </p>
        <Hint
          className="border rounded-full mr-auto"
          desc={nodeInfo.description}
        >
          <BsInfo className="size-4" />
        </Hint>
        {!isMain && (
          <div className="hidden group-hover/item:flex gap-2 items-center">
            {nodeActions.map((action) => (
              <span
                key={action.desc}
                onClick={action.onClick}
                className={cn(
                  "p-1 aspect-square rounded-md hover:bg-zinc-900/[0.075] hover:cursor-pointer",
                  action.title == "Delete" && "text-destructive"
                )}
              >
                <action.Icon className="size-4 opacity-70" />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <AnimatedAccordionContent
        isActive={isActive}
        className="px-4 flex border-b border-border/50 flex-col gap-3"
      >
        <div className="-mb-2" />
        {contents()}
        <div className="mb-2" />
      </AnimatedAccordionContent>
    </>
  );
};

export default Node;
