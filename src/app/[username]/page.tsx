import { NodeType } from "@/modules/pages/editor";
import { toReact } from "@/modules/pages/utils";
import { trpc } from "@/trpc/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { unknown } from "zod";
import "react-photo-album/masonry.css";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

const getPageDataByUsername = cache(async (username: string) => {
  const data = await trpc.pages.data.call(unknown, username);

  if (!data.data?.definition) {
    return null;
  }

  return data.data.definition;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  if (!username) return {};

  const project = await getPageDataByUsername(username);
  if (!project) return {};

  const pageMetaData = project.nodes.find(
    (item) => item.type == NodeType.PageMetadata
  );
  if (!pageMetaData) return {};

  const title = pageMetaData.title || `${username}'s Portfolio`;

  return {
    title: {
      default: title,
      template: title,
    },
    ...(pageMetaData.iconUrl
      ? {
          icons: {
            icon: pageMetaData.iconUrl,
          },
        }
      : {}),
    openGraph: {
      title,
      url: `https://${username}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`,
    },
    alternates: {
      canonical: `https://${username}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`,
    },
  };
}

const Page = async ({ params }: Props) => {
  const { username } = await params;
  if (!username) return notFound();

  const project = await getPageDataByUsername(username);
  if (!project) return notFound();

  if (project.nodes.length <= 0) return notFound();

  return (
    <>
      {toReact(project.nodes, project.template)}{" "}
      <a
        target="_blank"
        href="https://mollo.orpad.cc"
        className="w-fit h-fit border border-zinc-900/25 flex items-center gap-2 font-sans rounded-xl text-sm p-1 px-2 opacity-70 hover:opacity-90 duration-300 transition-all drop-shadow-sm bg-gradient-to-b from-blue-500 to-blue-700 text-white fixed bottom-2 right-2 md:bottom-4 md:right-4 z-50"
      >
        <img
          src="https://mollo.orpad.cc/logo.png"
          width={15}
          height={15}
          alt="orpad logo"
          className="size-4"
        />
        <span>Made with Mollo</span>
      </a>
    </>
  );
};

export default Page;
