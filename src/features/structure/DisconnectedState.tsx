export const DisconnectedState = ({}: {}) => {
  return (
    <div className="flex flex-col gap-3 max-w-prose justify-center self-center justify-self-center">
      <h1 className="text-2xl font-bold text-white">AirSwap Voter Dashboard</h1>
      <p className="text-gray-500 text-[15px] leading-6">
        <span>
          Connect your wallet to manage AST staking, vote on DAO proposals, and
          claim rewards for participating in the decentralized governance
          process.{" "}
        </span>
      </p>
      <p>
        <a
          className="underline text-gray-500 transition-colors hover:text-gray-50"
          href="https://about.airswap.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </a>
      </p>
    </div>
  );
};
