import { NodeType } from "@/modules/pages/editor";
import { toReact } from "@/modules/pages/utils";
import { trpc } from "@/trpc/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { unknown } from "zod";

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
  const description =
    pageMetaData.description || `Welcome to ${username}'s portfolio`;

  return {
    title: {
      default: title,
      template: title,
    },
    description,
    ...(pageMetaData.iconUrl
      ? {
          icons: [
            {
              rel: "icon",
              url: pageMetaData.iconUrl,
              href: pageMetaData.iconUrl,
            },
          ],
        }
      : {}),
    openGraph: {
      title,
      description,
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

  return <>{toReact(project.nodes)}</>;
};

export default Page;
