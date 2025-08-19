"use client";

import DataTable from "@/components/custom/data-table";
import { countMediaUrls } from "@/lib/utils";
import { usePages } from "../hooks";

const Page = () => {
  const { pages, users, isPagesLoading } = usePages();

  return (
    <>
      <div className="flex flex-col border-b pt-2 pb-6 gap-1 px-5">
        <h1 className="h3">Pages</h1>
        <p>
          Here is the list of all the websites pages created by mollo users.
        </p>
      </div>
      <DataTable
        columns={[
          {
            name: "User",
            key: "user_id",
            render: (value) => {
              const user = users.find((user) => user.id === value);
              return user ? user.email : "Unknown User";
            },
          },
          { name: "Username", key: "username", isBold: true },
          { name: "Nodes data", key: "nodes_data" },
          { name: "Published", key: "published" },
          { name: "Published date", key: "published_date", isDate: true },
        ]}
        isLoading={isPagesLoading}
        data={pages.map((page) => ({
          ...page,
          definition: null,
          nodes_data: `${countMediaUrls(
            page.definition.nodes,
            "image"
          )} Images, ${countMediaUrls(page.definition.nodes, "video")} Videos`,
        }))}
      />
    </>
  );
};

export default Page;
