import { Connector } from "wagmi";

type UniqueConnectors = { [k: string]: Connector };

export const filterUniqueConnectors = (connectors: Connector[]) => {
  const uniqueConnectors: UniqueConnectors = {};

  connectors.forEach((connector: Connector) => {
    !uniqueConnectors[connector.name]
      ? (uniqueConnectors[connector.name] = connector)
      : null;
  });

  return Object.values(uniqueConnectors);
};
