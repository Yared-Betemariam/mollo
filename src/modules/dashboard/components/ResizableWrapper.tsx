"use client";

import FormWarning from "@/components/custom/FormWarning";
import Hint from "@/components/custom/hint";
import { PagePreviewer } from "@/components/custom/page-previewer";
import { ScrollAreaWrapper } from "@/components/custom/scrollarea-wrapper";
import SheetWrapper from "@/components/custom/sheet-wrapper";
import Logo from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { free_limits, pricing_plans } from "@/data";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, countMediaUrls } from "@/lib/utils";
import UserButton from "@/modules/auth/components/UserButton";
import { useBilling } from "@/modules/auth/hooks";
import { useModalStore } from "@/modules/modals/store";
import AddNode from "@/modules/pages/components/AddNode";
import { usePage } from "@/modules/pages/hooks";
import { channel, usePageInfoStore } from "@/modules/pages/store";
import { trpc } from "@/trpc/client";
import { Limits } from "@/types";
import { Loader, Monitor, Play, Share, Smartphone, Stars } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { toast } from "sonner";
import HeaderWrapper from "./HeaderWrapper";

type Props = {
  children: React.ReactNode;
};

const ResizableWrapper = ({ children }: Props) => {
  const { nodes, addNode, page } = usePage();
  const {
    isUserActive,
    isSubscriptionExpired,
    plan,
    isLoading: isBillingLoading,
  } = useBilling();
  const isMobile = useIsMobile();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");
  const utils = trpc.useUtils();

  const noChanges = useMemo(() => {
    return JSON.stringify(page?.definition.nodes) == JSON.stringify(nodes);
  }, [nodes, page]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!noChanges) {
        event.preventDefault();
        event.returnValue =
          "Are you sure you want to close? You have unsaved changes.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [noChanges]);

  const { mutate, isPending } = trpc.pages.updateDefinition.useMutation({
    onError: (er) => {
      console.log(er);
      toast.error("Error saving changes! Try again");
    },
    onSuccess: (data) => {
      utils.pages.user.setData(undefined, (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            definition: {
              nodes: data.data,
              template: old.data.definition.template,
            },
          },
        };
      });
      toast.success("Changes saved!");
    },
  });

  const updatePage = trpc.pages.update.useMutation({
    onError: (er) => {
      console.log(er);
      toast.error("Error updating page! Try again");
    },
    onSuccess: () => {
      toast.success(`Page ${!page?.published ? "published" : "unpublished"}!`);
      utils.pages.user.invalidate();
    },
  });

  useEffect(() => {
    channel.postMessage({ nodes, template: page?.definition.template });
  }, [nodes]);

  useEffect(() => {
    const planLimits: Limits =
      pricing_plans.find((p) => p.id === plan)?.limits || free_limits;

    usePageInfoStore.getState().setInfo({
      status: isUserActive ? "active" : "disabled",
      isExpired: isSubscriptionExpired,
      imageCount: countMediaUrls(nodes, "image"),
      videoCount: countMediaUrls(nodes, "video"),
      limits: planLimits,
    });
  }, [nodes, isBillingLoading, plan]);

  const links = [
    {
      name: "Help",
      href: "/help",
    },
  ];

  const handlePublish = () => {
    if (page) {
      updatePage.mutate({
        id: page.id,
        username: page.username,
        published: !page.published,
      });
    } else {
      toast.error("Page not found!");
    }
  };

  const saveChanges = () => {
    if (!page) {
      toast.error("Page not found!");
      return;
    }

    mutate({
      id: Number(page.id),
      nodes,
      template: page.definition.template,
      username: page.username,
    });
  };

  const SaveButton = (
    <Button
      size={"sm"}
      disabled={isPending || noChanges}
      onClick={() => saveChanges()}
      variant={"outline"}
    >
      {isPending && <Loader className="size-4 animate-spin" />} {"Save"}
    </Button>
  );

  const previewCpt = (
    <>
      <HeaderWrapper className="justify-between">
        <div className="flex gap-2 items-center text-zinc-900/50">
          <Play className="size-5" />
          <span>Preview</span>
        </div>
        <div
          className={cn(
            "flex opacity-0 group-hover/pcp:opacity-100 duration-200 transition-all items-center gap-2",
            isMobile && "pr-11"
          )}
        >
          <Button
            size="sm"
            onClick={() => setDeviceView("mobile")}
            className={cn(
              "size-8 px-2",
              deviceView == "mobile"
                ? ""
                : "bg-primary/10! text-zinc-900! hover:bg-primary/25!"
            )}
          >
            <Smartphone className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            onClick={() => setDeviceView("desktop")}
            className={cn(
              "size-8 px-2 ",
              deviceView == "desktop"
                ? ""
                : "bg-primary/10! text-zinc-900! hover:bg-primary/25!"
            )}
          >
            <Monitor className="h-3.5 w-3.5" />
          </Button>
        </div>
      </HeaderWrapper>

      {page && (
        <PagePreviewer
          deviceView={deviceView}
          onFrameLoad={() => {
            setTimeout(() => {
              channel.postMessage({
                nodes,
                template: page?.definition.template,
              });
            }, 50);
          }}
          className={cn(
            isMobile ? "" : "max-h-[calc(100vh-7rem)]",
            "rounded-lg overflow-hidden shadow-[0_-10px_50px_-12px] shadow-black/25 h-full flex-1 flex flex-col w-full max-w-[45rem] mx-auto"
          )}
        />
      )}
    </>
  );

  const PublishButton =
    !isBillingLoading && plan !== "free" ? (
      <Button
        variant={!page?.published ? "default" : "outline"}
        disabled={
          !isUserActive ||
          !noChanges ||
          isPending ||
          updatePage.isPending ||
          isBillingLoading ||
          isSubscriptionExpired
        }
        onClick={() => {
          handlePublish();
        }}
        className={cn(
          "rounded-xl",
          page?.published
            ? "text-red-800! border-red-900/25 bg-red-50 h-8 px-3 drop-shadow-[2px_2px] drop-shadow-red-800/25"
            : "bg-gradient-to-br from-blue-800/90 h-8 to-blue-950/90 drop-shadow-[3px_3px] drop-shadow-blue-800/50"
        )}
      >
        {!page?.published && (
          <Stars className={cn(updatePage.isPending && "animate-spin")} />
        )}
        {page?.published
          ? updatePage.isPending
            ? "Unpublishing..."
            : "Unpublish"
          : updatePage.isPending
          ? "Publishing..."
          : "Publish"}
      </Button>
    ) : null;

  return (
    <ResizablePanelGroup
      id="wrapper"
      direction="horizontal"
      className="w-full flex-1"
    >
      <ResizablePanel minSize={35} defaultSize={50}>
        <ScrollAreaWrapper>
          <HeaderWrapper>
            <Logo logo />
            <div className="flex gap-4 h-full items-center">
              {links.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.name}
                </Link>
              ))}
            </div>

            {!isBillingLoading && plan && (
              <Hint desc="Your current plan">
                <Badge
                  className={cn("text-sm capitalize", {
                    "bg-yellow-800/10 text-sm text-yellow-900": plan == "free",
                    "bg-emerald-800/10 text-sm text-emerald-900":
                      plan == "starter",
                    "bg-blue-800/10 text-sm text-blue-900": plan == "pro",
                    "bg-amber-800/10 text-sm text-amber-900": plan == "premium",
                  })}
                >
                  {plan}
                </Badge>
              </Hint>
            )}
            {!isBillingLoading && plan == "free" && (
              <Link
                href={"/billing"}
                className="border border-blue-800/20 bg-blue-50 text-sm font-medium px-3 h-7 flex items-center rounded-full text-blue-800  drop-shadow-[2px_2px] drop-shadow-blue-800/25"
              >
                <span>Upgrade plan</span>
              </Link>
            )}
            {!isBillingLoading && !isUserActive && (
              <Hint desc="Your account is not active. Please contact support to activate your account.">
                <Badge className="bg-red-800/10 text-sm text-red-900">
                  <FaExclamationTriangle /> Disabled
                </Badge>
              </Hint>
            )}
            {!isBillingLoading && isSubscriptionExpired && (
              <Hint desc="Your subscription has expired. Please renew your subscription to continue using the service.">
                <Badge className="bg-yellow-800/10 text-sm text-yellow-900">
                  <FaExclamationTriangle /> Expired
                </Badge>
              </Hint>
            )}
            <div className="mr-auto" />

            {PublishButton}

            <UserButton />
          </HeaderWrapper>
          <div className="h-14 items-center px-4 flex  justify-start gap-3">
            <Button
              size={"sm"}
              onClick={() =>
                useModalStore
                  .getState()
                  .openModal({ open: "share", data: page?.username || null })
              }
            >
              <Share /> Share
            </Button>
            {SaveButton}
            {!noChanges && (
              <Hint desc="Save before you do anything!">
                <FormWarning message="Unsaved changes" />
              </Hint>
            )}
            <span className="mr-auto" />
            {isMobile && (
              <>
                <Button
                  size={"sm"}
                  onClick={() => {
                    setPreviewOpen(true);
                  }}
                  variant={"outline"}
                >
                  <Play /> Preview
                </Button>
              </>
            )}
            <AddNode
              addNode={(node) => {
                if (nodes.length >= 20) {
                  toast.error("You can only have 20 nodes on a page.");
                  return;
                }
                addNode(node);
              }}
            />
          </div>
          <main className="flex flex-col h-full">{children}</main>
        </ScrollAreaWrapper>
      </ResizablePanel>

      {!isMobile ? (
        <>
          <ResizableHandle withHandle />

          <ResizablePanel
            className="relative group/pcp flex flex-col justify-between bg-zinc-100"
            minSize={35}
            defaultSize={50}
          >
            {previewCpt}
          </ResizablePanel>
        </>
      ) : null}

      <SheetWrapper
        title="Preview"
        previewMode
        open={previewOpen}
        onOpen={(value) => setPreviewOpen(value)}
      >
        {previewCpt}
      </SheetWrapper>
    </ResizablePanelGroup>
  );
};

export default ResizableWrapper;
