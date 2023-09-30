import { encodePacked, keccak256 } from "viem";

export const ACTIVATE_TREE_ID = keccak256(
  encodePacked(["string"], ["activate"]),
);
