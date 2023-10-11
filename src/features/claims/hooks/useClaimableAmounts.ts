import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { Address, useChainId } from "wagmi";
import { useMultipleTokenInfo } from "../../common/hooks/useMultipleTokenInfo";
import {
  TestnetClaimableToken,
  claimableTokens,
  testnetClaimableTokens,
} from "../config/claimableTokens";
import { useClaimCalculations } from "./useClaimCalculations";
import {
  SupportedChainId,
  useDefiLlamaBatchPrices,
} from "./useDefillamaBatchPrices";

const testnets = Object.keys(testnetClaimableTokens).map((t) => parseInt(t));

export const useClaimableAmounts = (points: number) => {
  const chainId = useChainId() as SupportedChainId;

  const isTestnet = testnets.includes(chainId);

  const tokenList = isTestnet
    ? testnetClaimableTokens[chainId]
    : claimableTokens[chainId];

  const tokenAddresses = isTestnet
    ? (tokenList as TestnetClaimableToken[]).map((t) => t.address)
    : (tokenList as Address[]);

  const { data: claimableAmounts, refetch } = useClaimCalculations(
    points,
    tokenAddresses,
  );

  const tokenInfoResults = useMultipleTokenInfo({
    chainId,
    tokenAddresses: tokenAddresses,
  });

  const { data: prices } = useDefiLlamaBatchPrices({
    chainId,
    tokenAddresses: tokenList.map((token) =>
      typeof token === "object" ? token.mainnetEquivalentAddress : token,
    ),
  });

  return useMemo(() => {
    const data = tokenList
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
    return { data, refetch };
  }, [prices, tokenInfoResults, claimableAmounts, tokenList, refetch]);
};
