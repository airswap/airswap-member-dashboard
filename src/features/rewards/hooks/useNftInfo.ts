import { useQuery } from "@tanstack/react-query";
import { Address, useChainId, useContractRead } from "wagmi";
import { erc1155Abi } from "../../../contracts/erc1155Abi";

type AirSwapNftInfo = {
  created_by: string;
  description: string;
  image: string;
  name: string;
};

export const useNftInfo = ({
  address: nftAddress,
  id,
}: {
  address: Address;
  id: bigint;
}) => {
  const chainId = useChainId();

  const { data: uri } = useContractRead({
    address: nftAddress,
    abi: erc1155Abi,
    chainId,
    functionName: "uri",
    args: [id],
  });

  return useQuery<AirSwapNftInfo, Error, AirSwapNftInfo>({
    queryKey: ["nftInfo", nftAddress, id],
    queryFn: async () => {
      // Handle IPFS URLs (convert ipfs:// to https://ipfs.io/ipfs/)
      let url = uri as string;
      if (url.startsWith("ipfs://")) {
        url = url.replace("ipfs://", "https://ipfs.io/ipfs/");
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.status}`);
      }

      const jsonData = await response.json();
      return jsonData;
    },
    enabled: !!uri,
  });
};
