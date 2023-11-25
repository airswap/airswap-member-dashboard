import { Address, useChainId } from "wagmi";
import { SupportedChainId, useDefiLlamaBatchPrices } from "../features/claims/hooks/useDefillamaBatchPrices";
import { TestnetClaimableToken, claimableTokens, testnetClaimableTokens } from "../features/claims/config/claimableTokens";
import { useMultipleTokenInfo } from "../features/common/hooks/useMultipleTokenInfo";
import { useSplitsBalances } from "./useSplitsBalances";
import { useMemo } from "react";
import BigNumber from "bignumber.js";

const testnets = Object.keys(testnetClaimableTokens).map((t) => parseInt(t));

export const useSplitsAmounts = () => {
  const chainId = useChainId() as SupportedChainId;

  const isTestnet = testnets.includes(chainId);

  const tokenList = isTestnet
    ? testnetClaimableTokens[chainId]
    : claimableTokens[chainId];

  const tokenAddresses = isTestnet
    ? (tokenList as TestnetClaimableToken[]).map((t) => t.address)
    : (tokenList as Address[]);

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

  const splitsBalancesResults = useSplitsBalances({ chainId, tokenAddresses });

  return useMemo(() => {
    return tokenList
      .map((_, index) => {
        const tokenInfo = tokenInfoResults[index].data;
        const price = prices?.[index].price;
        const splitsBalances = splitsBalancesResults[index].data;

        if (tokenInfo === undefined ||
          tokenInfo.decimals === undefined ||
          price === undefined ||
          splitsBalances === undefined ||
          splitsBalances.toDistribute === undefined ||
          splitsBalances.toWithdraw === undefined ||
          splitsBalances.claimable === undefined) {
          return {
            isLoading: true,
            data: undefined
          }
        }
        else {
          const toDistribute =
            new BigNumber(splitsBalances.toDistribute.toString())
              .dividedBy(10 ** tokenInfo.decimals);

          const toWithdraw =
            new BigNumber(splitsBalances.toWithdraw.toString())
              .dividedBy(10 ** tokenInfo.decimals);

          const claimable =
            new BigNumber(splitsBalances.claimable.toString())
              .dividedBy(10 ** tokenInfo.decimals);

          const total = toDistribute.plus(toWithdraw).plus(claimable);

          return {
            isLoading: false,
            data: {
              tokenInfo,
              price,
              toDistribute: toDistribute.toNumber(),
              toDistributeUsdValue: toDistribute.multipliedBy(price).toNumber(),
              toWithdraw: toWithdraw.toNumber(),
              toWithdrawUsdValue: toWithdraw.multipliedBy(price).toNumber(),
              claimable: claimable.toNumber(),
              claimableUsdValue: claimable.multipliedBy(price).toNumber(),
              total: total.toNumber(),
              totalUsdValue: total.multipliedBy(price).toNumber()
            }
          };
        }
      })
      .sort((a, b) => (b.data?.totalUsdValue || 0) - (a.data?.totalUsdValue || 0));

  }, [prices, tokenInfoResults, splitsBalancesResults, tokenList]);
}