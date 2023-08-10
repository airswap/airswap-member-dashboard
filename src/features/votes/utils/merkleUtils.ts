import BigNumber from "bignumber.js";
import { encodePacked, keccak256 } from "viem";

export const generateMerkleLeaf = (vote: {
  /** Voter address */
  voter: `0x${string}`;
  /** Voter voting power from snapshot. Amount of sAST tokens, will be a float */
  vp: number;
}) =>
  keccak256(
    encodePacked(
      ["address", "uint256"],
      [
        vote.voter,
        BigInt(
          new BigNumber(vote.vp)
            .multipliedBy(10 ** 4)
            .toFixed(0, BigNumber.ROUND_FLOOR),
        ),
      ],
    ),
  );
