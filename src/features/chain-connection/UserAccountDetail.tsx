import { useClickOutside } from "@react-hookz/web";
import { useRef } from "react";
import { MdLogout } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
} from "wagmi";
import defaultEnsAvatar from "../../assets/avatar.svg";

export const UserAccountDetail = ({
  showUserAccountDetail,
  setShowUserAccountDetail,
}: {
  showUserAccountDetail: boolean;
  setShowUserAccountDetail: (showUserAccountDetail: boolean) => void;
}) => {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: avatar } = useEnsAvatar({ name: ensName });
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const { data, isError } = useBalance({ address });

  const ref = useRef(null);

  useClickOutside(ref, () => {
    setShowUserAccountDetail(false);
  });

  const handleDisconnect = () => {
    setShowUserAccountDetail(false);
    disconnect();
  };

  const defaultAvatar = (
    <img src={defaultEnsAvatar} alt="ENS avatar" className="rounded-full" />
  );

  return (
    <div
      ref={ref}
      className={twJoin(
        "flex flex-row items-center absolute z-50 p-2 top-20 border rounded-lg bg-gray-900 border-gray-800 uppercase",
        !showUserAccountDetail && "hidden",
      )}
    >
      <div className="rounded-full mr-2">{avatar || defaultAvatar}</div>
      <div className="flex flex-col text-left semibold font-loos">
        <span className="text-gray-500 text-xs">{chain?.name}</span>
        <span>
          {!isError
            ? `${Number(data?.formatted).toFixed(4)} ${data?.symbol}`
            : "Error fetching balance"}
        </span>
      </div>
      <button
        onClick={handleDisconnect}
        className={twJoin(!isError ? "ml-16" : "ml-8", "hover:cursor-pointer")}
      >
        <MdLogout size="20" style={{ color: "#6B7280" }} />
      </button>
    </div>
  );
};
