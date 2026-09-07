import { prisma } from "@/lib/prisma";
import { BlockManager } from "@/components/admin/BlockManager";

export default async function AdminBlocksPage() {
  const blocks = await prisma.residentBlock.findMany({
    orderBy: { blockName: "asc" },
  });

  return (
    <div>
      <BlockManager initialBlocks={blocks} />
    </div>
  );
}
