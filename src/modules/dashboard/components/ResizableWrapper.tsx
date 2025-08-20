"use client";

import { PagePreviewer } from "@/components/custom/page-previewer";
import { ScrollAreaWrapper } from "@/components/custom/scrollarea-wrapper";
import SheetWrapper from "@/components/custom/sheet-wrapper";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, countMediaUrls } from "@/lib/utils";
import UserButton from "@/modules/auth/components/UserButton";
import { useModalStore } from "@/modules/modals/store";
import AddNode from "@/modules/pages/components/AddNode";
import { usePage } from "@/modules/pages/hooks";
import { channel, usePageInfoStore } from "@/modules/pages/store";
import { trpc } from "@/trpc/client";
import {
  Loader,
  Monitor,
  Play,
  Share,
  Smartphone,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import HeaderWrapper from "./HeaderWrapper";
import { useBilling } from "@/modules/auth/hooks";
import { Badge } from "@/components/ui/badge";
import { FaExclamationTriangle } from "react-icons/fa";
import Hint from "@/components/custom/hint";
import { pricing_plans } from "@/data";
import { Limits } from "@/types";

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
  const [zoom, setZoom] = useState(100);
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");
  const utils = trpc.useUtils();

  const noChanges = useMemo(() => {
    return JSON.stringify(page?.definition.nodes) == JSON.stringify(nodes);
  }, [nodes, page]);

  const { mutate, isPending } = trpc.pages.updateDefinition.useMutation({
    onError: (er) => {
      console.log(er);
      toast.error("Error saving changes! Try again");
    },
    onSuccess: () => {
      toast.success("Changes saved!");

      utils.pages.user.invalidate();
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
    channel.postMessage({ nodes });
  }, [nodes]);

  useEffect(() => {
    const planLimits: Limits = pricing_plans.find((p) => p.id === plan)
      ?.limits || {
      maxImages: 3,
      maxVideos: 0,
      maxImageSize: 1,
      maxVideoSize: 10,
    };

    usePageInfoStore.getState().setInfo({
      status: isUserActive ? "active" : "disabled",
      isExpired: isSubscriptionExpired,
      imageCount: countMediaUrls(nodes, "image"),
      videoCount: countMediaUrls(nodes, "video"),
      limits: planLimits,
    });
  }, [nodes, isBillingLoading]);

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
        base_template: page.base_template,
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
    });
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 50));
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
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="h-7 w-7 p-0"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="h-7 w-7 p-0"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className={cn("flex items-center gap-1", isMobile && "pr-9")}>
          <Button
            variant={deviceView === "mobile" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDeviceView("mobile")}
            className="size-8 px-2"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={deviceView === "desktop" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDeviceView("desktop")}
            className="size-8 px-2"
          >
            <Monitor className="h-3.5 w-3.5" />
          </Button>
        </div>
      </HeaderWrapper>

      {page && (
        <PagePreviewer
          zoom={zoom}
          deviceView={deviceView}
          onFrameLoad={() => {
            setTimeout(() => {
              channel.postMessage({ nodes });
            }, 50);
          }}
          className={cn(
            isMobile ? "" : "max-h-[calc(100vh-7rem)]",
            "rounded-lg overflow-hidden shadow-[0_-10px_50px_-12px] shadow-black/25 h-full flex-1 flex flex-col w-full max-w-3xl mx-auto"
          )}
        />
      )}
    </>
  );

  const PublishButton = (
    <Button
      variant={!page?.published ? "default" : "outline"}
      disabled={
        !isUserActive || !noChanges || isPending || updatePage.isPending
      }
      onClick={() => {
        handlePublish();
      }}
    >
      {page?.published ? "Unpublish" : "Publish"}
    </Button>
  );

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
            className="relative flex flex-col justify-between bg-zinc-100"
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
