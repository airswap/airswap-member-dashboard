import { MdChevronRight } from "react-icons/md";
import { twJoin } from "tailwind-merge";
import { Checkbox } from "../common/Checkbox";

export const VoteLoadingSkeleton = ({ type }: { type: "past" | "present" }) => {
  return (
    <div className="ring-1 ring-gray-800 px-5 py-4 flex flex-row items-center justify-between animate-pulse">
      <div className="flex flex-row gap-5 items-center">
        {type === "past" ? (
          <Checkbox disabled className="animate-pulse" />
        ) : (
          <div
            className={twJoin([
              "w-3 h-3 rounded-full mx-1.5 bg-gray-800 animate-pulse",
            ])}
          />
        )}
        <span className="h-4 my-1 w-32 bg-gray-900 rounded animate-pulse"></span>
        <span className="h-4 my-1 -mx-3 w-24 bg-gray-900 rounded animate-pulse"></span>
      </div>

      <div className="flex flex-row">
        <div
          className={twJoin([
            "text-xs leading-6 uppercase font-bold px-4 py-1 rounded-full",
            "ring-1 ring-gray-800 flex flex-row gap-2 items-center",
            "text-font-secondary",
          ])}
        >
          <span
            className={
              "bg-gray-900 rounded animate-pulse h-4 my-1 text-transparent leading-none"
            }
          >
            Loading Please Wait
          </span>
        </div>
        {type === "past" && (
          <MdChevronRight
            size={32}
            className="rotate-90 animate-pulse text-gray-700 ml-4"
          />
        )}
      </div>
    </div>
  );
};

export const VoteLoadingHeaderSkeleton = () => (
  <div className="flex flex-row items-center gap-4">
    <div className="flex flex-row gap-1.5 animate-pulse">
      <span className="text-xs font-bold uppercase text-gray-500 my-.5 h-3 bg-gray-800 w-8 rounded-sm"></span>
      <span className="text-xs font-bold uppercase text-gray-500 my-.5 h-3 bg-gray-800 w-14 rounded-sm"></span>
    </div>
    <div className="h-px flex-1 bg-gray-800"></div>
  </div>
);

const NUM_LIVE_LOADING = 3;
const NUM_PAST_LOADING = 9;

export const VoteListSkeletons = () => (
  <>
    {/* Loading state */}
    <VoteLoadingHeaderSkeleton />
    <div className="flex flex-col gap-2">
      {new Array(NUM_LIVE_LOADING).fill(null).map(() => (
        <VoteLoadingSkeleton type="present" />
      ))}
    </div>
    <VoteLoadingHeaderSkeleton />
    <div className="flex flex-col gap-2">
      {new Array(NUM_PAST_LOADING).fill(null).map(() => (
        <VoteLoadingSkeleton type="past" />
      ))}
    </div>
  </>
);
