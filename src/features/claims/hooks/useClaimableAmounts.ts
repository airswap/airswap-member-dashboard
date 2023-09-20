import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { useChainId } from "wagmi";
import { useMultipleTokenInfo } from "../../common/hooks/useMultipleTokenInfo";
import { claimableTokens } from "../config/claimableTokens";
import { useClaimCalculations } from "./useClaimCalculations";
import { useDefiLlamaBatchPrices } from "./useDefillamaBatchPrices";

const empty: string[] = [];

export const useClaimableAmounts = (points: number) => {
  const chainId = useChainId();
  const tokenList =
    claimableTokens[chainId === 1 ? "mainnet" : chainId] || empty;

  const { data: claimableAmounts } = useClaimCalculations(
    points,
    tokenList.map((token) => token.address),
  );

  const tokenInfoResults = useMultipleTokenInfo({
    chainId,
    tokenAddresses: tokenList.map((token) => token.address),
  });

  const { data: prices } = useDefiLlamaBatchPrices(
    tokenList.map((token) => token.mainnetEquivalentAddress || token.address),
  );

  return useMemo(() => {
    return tokenList
      .map((_, index) => {
        const tokenInfo = tokenInfoResults[index].data;
        const price = prices?.[index].price;
        const claimableAmount = claimableAmounts?.[index];
        const claimableValue =
          tokenInfo?.decimals &&
          price &&
          claimableAmount &&
          new BigNumber(claimableAmount.toString())
            .dividedBy(10 ** tokenInfo.decimals)
            .multipliedBy(price)
            .toNumber();

        return {
          claimableAmount,
          tokenInfo,
          price,
          claimableValue,
        };
      })
      .sort((a, b) => (b.claimableValue || 0) - (a.claimableValue || 0));
  }, [prices, tokenInfoResults, claimableAmounts, tokenList]);
};
