import Dropdown from "@/components/custom/dropdown";
import Hint from "@/components/custom/hint";
import { ScrollAreaWrapper } from "@/components/custom/scrollarea-wrapper";
import { AnimatedAccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, getDateStringByIso } from "@/lib/utils";
import { useModalStore } from "@/modules/modals/store";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash } from "lucide-react";
import { useMemo } from "react";
import { BsInfo } from "react-icons/bs";
import {
  AboutNode,
  ContactNode,
  EducationNode,
  FooterNode,
  HeaderNode,
  HeroNode,
  NodeType,
  PageMetadataNode,
  PageNode,
  SkillsNode,
  TestimonialsNode,
} from "../../editor";
import { getHeaderlinks, getNodeTypeInfo } from "../../utils";
import ColorPicker from "./ColorPicker";
import ValueChanger from "./ValueChanger";
import { useNodesStore } from "../../store";
import { Progress } from "@/components/ui/progress";

interface Props {
  node: PageNode;
  isActive: boolean;
  toggleNode: () => void;
  moveNodeUp: () => void;
  moveNodeDown: () => void;
  deleteNode: () => void;
  isMain?: boolean;
  editNode: <T extends PageNode>(updates: Partial<T>) => void;
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
}: Props) => {
  const nodeInfo = useMemo(() => getNodeTypeInfo(node.type), [node]);
  const nodes = useNodesStore((state) => state.nodes);

  const contents = () => {
    switch (node.type) {
      case NodeType.PageMetadata:
        return (
          <>
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
            <ValueChanger
              label="Page Description"
              type="textarea"
              onChange={(value) => {
                editNode<PageMetadataNode>({
                  ...node,
                  description: value,
                });
              }}
              value={node.description}
            />
            <div className="flex gap-4">
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
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => {
                  editNode<HeaderNode>({
                    ...node,
                    links: getHeaderlinks(nodes),
                  });
                }}
              >
                Update links
              </Button>
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
            <div className="flex gap-5">
              <div className="flex gap-2 items-center">
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
            <div className="flex flex-col-reverse w-full gap-0.5">
              <ScrollAreaWrapper className="flex-1 grid grid-cols-1 max-h-36 w-full">
                {node.timeline.map((item, i) => (
                  <div
                    key={i}
                    className="border items-center flex py-2 rounded-md px-3 mb-2"
                  >
                    <div className="flex flex-1 flex-col gap-1">
                      <p className="font-medium">{item.title}</p>
                      <span className="text-xs opacity-50">
                        {getDateStringByIso(item.startDate)}{" "}
                        {item.endDate ?
                          `- ${getDateStringByIso(item.endDate)}`: '- Present'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <Button
                        variant={"ghost"}
                        size={"sm"}
                        onClick={() =>
                          useModalStore.getState().openModal({
                            open: "education",
                            data: { node: node, education: item },
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
                          editNode<EducationNode>({
                            ...node,
                            timeline: node.timeline.filter(
                              (edu) => edu.id !== item.id
                            ),
                          })
                        }
                        className="gap-2 size-7"
                      >
                        <Trash className="text-destructive!" />
                      </Button>
                    </div>
                  </div>
                ))}
                {node.timeline.length <= 0 && (
                  <span>No education items here</span>
                )}
              </ScrollAreaWrapper>
              <Button
                size={"sm"}
                onClick={() =>
                  useModalStore
                    .getState()
                    .openModal({ open: "education", data: { node: node } })
                }
                className="size-8 ml-auto rounded-md"
              >
                <Plus className="size-4" />
              </Button>
            </div>
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
            <div className="flex flex-col-reverse w-full gap-0.5">
              <ScrollAreaWrapper className="flex-1 grid grid-cols-2 sm:grid-cols-3 max-h-36 w-full">
                {node.skills.map((item, i) => (
                  <div
                    key={i}
                    className="border items-center flex py-2 rounded-md px-3 mb-2"
                  >
                    <div className="flex flex-1 flex-col gap-2">
                      <p className="font-medium">{item.name}</p>
                      <Progress
                        className="max-w-32"
                        value={Number(item.proficiency)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <Button
                        variant={"ghost"}
                        size={"sm"}
                        onClick={() =>
                          useModalStore.getState().openModal({
                            open: "skill",
                            data: { node: node, skill: item },
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
                          editNode<SkillsNode>({
                            ...node,
                            skills: node.skills.filter(
                              (test) => test.id !== item.id
                            ),
                          })
                        }
                        className="gap-2 size-7"
                      >
                        <Trash className="text-destructive!" />
                      </Button>
                    </div>
                  </div>
                ))}
                {node.skills.length <= 0 && <span>No skills here</span>}
              </ScrollAreaWrapper>
              <Button
                size={"sm"}
                onClick={() =>
                  useModalStore
                    .getState()
                    .openModal({ open: "skill", data: { node: node } })
                }
                className="size-8 ml-auto rounded-md"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </>
        );
      case NodeType.SectionProjects:
        return <></>;
      case NodeType.SectionCertificates:
        return <></>;
      case NodeType.SectionVideoGallery:
        return <></>;
      case NodeType.SectionImageGallery:
        return <></>;
      case NodeType.SectionTestimonials:
        return (
          <div className="flex flex-col w-full gap-0.5">
            <ScrollAreaWrapper className="flex flex-1 flex-col max-h-36 w-full p-0.5">
              {node.testimonials.map((item, i) => (
                <div
                  key={i}
                  className="border flex py-1.5 rounded-md px-2 mb-2"
                >
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm opacity-50">
                      Testimonial #{i + 1}
                    </span>
                    <p>{item.feedback}</p>
                  </div>
                  <div className="flex h-full items-start">
                    <Button
                      variant={"ghost"}
                      size={"sm"}
                      onClick={() =>
                        useModalStore.getState().openModal({
                          open: "testimonial",
                          data: { node: node, testimonial: item },
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
                        editNode<TestimonialsNode>({
                          ...node,
                          testimonials: node.testimonials.filter(
                            (test) => test.id !== item.id
                          ),
                        })
                      }
                      className="gap-2 size-7"
                    >
                      <Trash className="text-destructive!" />
                    </Button>
                  </div>
                </div>
              ))}
              {node.testimonials.length <= 0 && (
                <span>No testimonails here</span>
              )}
            </ScrollAreaWrapper>
            <Button
              size={"sm"}
              onClick={() =>
                useModalStore
                  .getState()
                  .openModal({ open: "testimonial", data: { node: node } })
              }
              className="size-8 ml-auto rounded-md"
            >
              <Plus className="size-4" />
            </Button>
          </div>
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
            isActive && "text-primary font-semibold"
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
                  "p-1 aspect-square rounded-md hover:bg-zinc-900/15 hover:cursor-pointer",
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
