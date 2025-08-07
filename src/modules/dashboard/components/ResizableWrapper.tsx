"use client";

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
import UserButton from "@/modules/auth/components/UserButton";
import AddNode from "@/modules/pages/components/AddNode";
import PagePreview from "@/modules/pages/components/PagePreview";
import { usePage } from "@/modules/pages/hooks";
import { trpc } from "@/trpc/client";
import { Loader, Play } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import HeaderWrapper from "./HeaderWrapper";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
};

const ResizableWrapper = ({ children }: Props) => {
  const { nodes, addNode, page } = usePage();
  const isMobile = useIsMobile();
  const [previewOpen, setPreviewOpen] = useState(false);

  const { mutate, isPending } = trpc.pages.updateDefinition.useMutation({
    onError: (er) => {
      console.log(er);
      toast.error("Error saving changes! Try again");
    },
    onSuccess: () => {
      toast.success("Changes saved!");
    },
  });

  const links = [
    {
      name: "Help",
      href: "/help",
    },
    {
      name: "Feedback",
      href: "/feedback",
    },
  ];

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

  const SaveButton = (
    <Button
      disabled={isPending}
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
        {!isMobile && (
          <div className="flex items-center gap-3">
            {SaveButton}
            <Button disabled>Publish</Button>
          </div>
        )}
      </HeaderWrapper>
      <ScrollAreaWrapper
        className={cn(
          "rounded-lg  shadow-[0_-10px_50px_-12px] shadow-black/25 min-h-full max-w-3xl mx-auto",
          isMobile ? "max-h-[calc(80vh-3rem)]" : "max-h-[calc(100vh-6rem)]"
        )}
      >
        <PagePreview nodes={nodes} />
      </ScrollAreaWrapper>
    </>
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
            <div className="flex gap-4 ml-auto h-full items-center">
              {links.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.name}
                </Link>
              ))}
              <UserButton />
            </div>
          </HeaderWrapper>
          <div className="h-14 items-center px-4 flex  justify-start gap-3">
            {SaveButton}
            <span className="mr-auto" />
            {isMobile && (
              <>
                <Button
                  onClick={() => setPreviewOpen(true)}
                  variant={"outline"}
                >
                  <Play /> Preview
                </Button>
              </>
            )}
            <AddNode
              addNode={(node) => {
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
