import { useState } from "react";
import { GoNoEntry } from "react-icons/go";
import { getAddress } from "viem";
import { useChainId } from "wagmi";
import { Button } from "../common/Button";
import { useMultipleTokenInfo } from "../common/hooks/useMultipleTokenInfo";
import { useClaimSelectionStore } from "../votes/store/useClaimSelectionStore";

export const CustomTokensForm = () => {
  const chainId = useChainId();

  const { tokens, addToken, removeToken, setShowCustomTokensModal } =
    useClaimSelectionStore((state) => ({
      tokens: state.customTokens,
      addToken: state.addCustomToken,
      removeToken: state.removeCustomToken,
      setShowCustomTokensModal: state.setShowCustomTokensModal,
    }));

  // 0x163f8C2467924be0ae7B5347228CABF260318753
  console.log(tokens);

  const [newTokenAddress, setNewTokenAddress] = useState<string>("");
  const tokensForChain = tokens[chainId] || [];

  const isEnteredTextFullAddress = /^0x[a-fA-F0-9]{40}$/.test(newTokenAddress);
  const checksummedAddress = isEnteredTextFullAddress
    ? getAddress(newTokenAddress)
    : undefined;
  const isEnteredAddressAlreadyInList =
    checksummedAddress && tokensForChain.includes(checksummedAddress);

  // Look up the tokeninfo for the entered address
  const [{ data: enteredTokenInfo, isLoading: enteredTokenInfoLoading }] =
    useMultipleTokenInfo({
      chainId,
      tokenAddresses: [checksummedAddress!],
      enabled: checksummedAddress !== undefined,
    });

  const tokenInfoQueries = useMultipleTokenInfo({
    chainId,
    tokenAddresses: tokensForChain,
    enabled: tokensForChain.length > 0,
  });

  return (
    <div className="flex flex-col w-[320px] max-h-[300px]">
      <input
        type="text"
        value={newTokenAddress}
        onChange={(e) => setNewTokenAddress(e.target.value)}
        placeholder="Search name or paste address"
        className="bg-[#030712] border border-gray-800 px-4 py-3 placeholder:text-[#6E7686] col-span-full rounded-[4px] text-white outline-none focus:border-white/80"
      />

      {checksummedAddress && (
        <div className="border border-gray-800 p-4 rounded mt-6 flex justify-between">
          {enteredTokenInfoLoading && (
            <>
              <div className="flex flex-col gap-2 items-start">
                <div className="font-medium text-transparent bg-gray-500 animate-pulse h-5">
                  AST
                </div>
                <div className="text-gray-400 text-transparent bg-gray-500 animate-pulse h-5">
                  AirSwap Token
                </div>
              </div>
              <Button
                type="button"
                className="uppercase"
                rounded={false}
                disabled
              >
                <span className="text-transparent bg-gray-500 animate-pulse">
                  Import
                </span>
              </Button>
            </>
          )}
          {enteredTokenInfo && (
            <>
              <div className="flex flex-col">
                <div className="font-medium">{enteredTokenInfo.symbol}</div>
                <div className="text-gray-400">{enteredTokenInfo.name}</div>
              </div>
              <Button
                type="button"
                className="uppercase"
                rounded={false}
                onClick={() => {
                  addToken(chainId, checksummedAddress!);
                  setNewTokenAddress("");
                }}
              >
                Import
              </Button>
            </>
          )}
        </div>
      )}

      <div className="flex flex-col mt-4 gap-4">
        {tokensForChain.map((tokenAddress, i) => {
          return (
            <div
              key={tokenAddress}
              className="flex flex-row items-center gap-4 self-center"
            >
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-4 justify-between">
                  <span className="font-medium">
                    {tokenInfoQueries[i].data?.symbol}
                  </span>
                  <span className="text-gray-400">
                    {tokenInfoQueries[i].data?.name}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-gray-600">
                  {tokenAddress}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeToken(chainId, tokenAddress)}
              >
                <GoNoEntry size={20} className="text-gray-200" />
              </button>
            </div>
          );
        })}
      </div>

      <Button
        className="mt-8"
        type="button"
        color="primary"
        rounded={false}
        onClick={() => setShowCustomTokensModal(false)}
      >
        Done
      </Button>
    </div>
  );
};
