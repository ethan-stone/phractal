import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Node from "../../components/Node";
import { trpc } from "../../utils/trpc";

const Nodes: NextPage = () => {
  const router = useRouter();
  const { status } = useSession({ required: true });
  const { isLoading, data, fetchNextPage, isFetchingNextPage } =
    trpc.useInfiniteQuery(
      [
        "nodes.list",
        {
          take: 1
        }
      ],
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: status === "authenticated"
      }
    );

  if (isLoading || status === "loading" || isFetchingNextPage)
    return <div>Loading</div>;

  console.log(data);

  const nodeItems = data?.pages
    .reduce<typeof data["pages"][0]["items"]>(
      (acc, currentValue) => acc.concat(currentValue.items),
      []
    )
    .map((item) => (
      <Node
        key={item.id}
        name={item.name}
        tags={item.tags.map((t) => t.name)}
        onClick={() => router.push(`/nodes/${item.id}`)}
      />
    ));

  return (
    <div className="flex flex-col min-h-screen bg-neutral-800">
      <div className="grid grid-cols-6">{nodeItems}</div>
      <button onClick={() => fetchNextPage()}>Next Page</button>
    </div>
  );
};

export default Nodes;
