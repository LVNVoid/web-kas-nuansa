import { getGetBlocksUseCase } from "@/di/container";
import { BlockManager } from "@/presentation/components/admin/BlockManager";

export default async function AdminBlocksPage() {
  const getBlocks = getGetBlocksUseCase();
  const blocks = await getBlocks.execute();

  return (
    <div>
      <BlockManager initialBlocks={blocks} />
    </div>
  );
}
