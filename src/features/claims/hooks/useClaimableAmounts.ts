import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { getAddress } from "viem";
import { Address, useChainId } from "wagmi";
import { useMultipleTokenInfo } from "../../common/hooks/useMultipleTokenInfo";
import { useClaimSelectionStore } from "../../votes/store/useClaimSelectionStore";
import {
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

  const savedCustomTokens = useClaimSelectionStore(
    (state) => state.customTokens,
  );

  const { tokenList, tokenAddresses, customTokens } = useMemo(() => {
    const isTestnet = testnets.includes(chainId);
    const tokens = isTestnet
      ? testnetClaimableTokens[chainId]
      : claimableTokens[chainId];

    if (isTestnet) {
      return {
        tokenList: tokens,
        tokenAddresses: tokens as Address[],
        customTokens: [] as Address[],
      };
    }

    const defaultTokens: Address[] = tokens as Address[];

    // filter out custom tokens that are already in the tokenList.
    const customTokensForChain = savedCustomTokens[chainId] || [];
    const checksummedTokenList = defaultTokens.map((token) =>
      getAddress(token),
    );
    const customTokensNotInDefaults = customTokensForChain.filter(
      (customToken) => !checksummedTokenList.includes(customToken),
    );

    return {
      tokenList: customTokensNotInDefaults.length
        ? [...defaultTokens, ...customTokensNotInDefaults]
        : (defaultTokens as Address[]),
      tokenAddresses: customTokensNotInDefaults.length
        ? [...defaultTokens, ...customTokensNotInDefaults]
        : (defaultTokens as Address[]),
      customTokens: customTokensNotInDefaults,
    };
  }, [savedCustomTokens, chainId]);

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
    tokenAddresses: tokenList
      .map((token) => {
        const addr =
          typeof token === "object" ? token.mainnetEquivalentAddress : token;
        return typeof token === "object"
          ? token.mainnetEquivalentAddress
          : token;
      })
      .concat(chainId === 1 ? customTokens : []),
  });

  return useMemo(() => {
    const data = tokenList
      .map((token, index) => {
        const address = typeof token === "object" ? token.address : token;
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
          isCustomToken: customTokens.includes(getAddress(address)),
        };
      })
      .sort((a, b) => (b.claimableValue || 0) - (a.claimableValue || 0));
    return { data, refetch };
  }, [
    prices,
    tokenInfoResults,
    claimableAmounts,
    tokenList,
    refetch,
    customTokens,
  ]);
};
