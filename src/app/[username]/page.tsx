import { NodeType } from "@/modules/pages/editor";
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
  // const ogImage = pageMetaData.ogImage || pageMetaData.images?.[0] || undefined;
  const ogImage = undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
      url: `https://${username}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : [],
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

  return <div>{JSON.stringify(project.nodes)}</div>;
};

export default Page;
