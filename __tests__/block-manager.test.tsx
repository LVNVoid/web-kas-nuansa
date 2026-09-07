import React from "react";
import { render, screen } from "@testing-library/react";
import { BlockManager, ResidentBlockData } from "@/components/admin/BlockManager";

jest.mock("@/app/actions/blocks", () => ({
  createBlockAction: jest.fn(),
  updateBlockAction: jest.fn(),
  deleteBlockAction: jest.fn(),
}));

describe("Admin - BlockManager Component", () => {
  const mockBlocks: ResidentBlockData[] = [
    {
      id: "b1",
      blockName: "B1",
      ownerName: "Pak Budi",
      phone: "08123456789",
      isOccupied: true,
      notes: "Dekat pos satpam",
    },
    {
      id: "b2",
      blockName: "B2",
      ownerName: null,
      phone: null,
      isOccupied: false,
      notes: null,
    },
  ];

  it("renders block list and stats correctly", () => {
    render(<BlockManager initialBlocks={mockBlocks} />);

    expect(screen.getByText("Master Data Blok Hunian")).toBeInTheDocument();
    expect(screen.getByText("Total 2 unit (1 dihuni, 1 kosong)")).toBeInTheDocument();
    expect(screen.getByText("Pak Budi")).toBeInTheDocument();
    expect(screen.getByText("Dihuni")).toBeInTheDocument();
    expect(screen.getByText("Kosong")).toBeInTheDocument();
  });
});
