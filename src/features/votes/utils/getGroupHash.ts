import { encodePacked, keccak256 } from "viem";

export const getGroupHash = (ids: string[]) =>
  keccak256(encodePacked(new Array(ids.length).fill("bytes32"), ids.sort()));
