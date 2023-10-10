import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { AnimatePresence, motion } from "framer-motion";
import { twJoin, twMerge } from "tailwind-merge";

export const Checkbox = ({
  className,
  isOptionButton,
  checked,
  ...rest
}: {
  className?: string;
  isOptionButton?: boolean;
} & RadixCheckbox.CheckboxProps) => {
  return (
    <RadixCheckbox.Root
      className={twMerge([
        "group",
        "w-6 h-6 border border-gray-500 rounded-sm bg-gray-950 relative",
        "transition-colors duration-150 touch-none",
        !isOptionButton && "data-[state=checked]:border-airswap-blue",
        !isOptionButton &&
          "data-[state=unchecked]:active:bg-airswap-blue data-[state=unchecked]:active:bg-opacity-50 data-[state=unchecked]:transition-none",
        "!outline-none focus-visible:ring-1 ring-airswap-blue ring-offset-2 ring-offset-gray-950",
        "disabled:bg-gray-950 disabled:border-gray-800 disabled:pointer-events-none",
        isOptionButton && "rounded-full",
        className,
      ])}
      checked={checked}
      {...rest}
    >
      {/* This div holds the checkmark shown on hover. */}
      {!isOptionButton && (
        <div
          className={twJoin([
            "absolute inset-0 bg-gray-900 flex items-center justify-center pointer-events-none",
            "group-hover:opacity-100 opacity-0", // Appear on hover
            "transition-opacity duration-150",
            "group-active:bg-opacity-0 transition-none", // so we can see through to the "pressed" state of the parent
          ])}
        >
          <svg
            className="absolute inset-[5px] text-gray-500 h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              key="check"
              d="M3,13 L9,19 22,5"
              stroke={"currentColor"}
              strokeWidth={3}
            />
          </svg>
        </div>
      )}

      {isOptionButton && (
        <div
          className={twJoin([
            "absolute inset-1 rounded-full transition-all duration-150",
            "bg-gray-700 group-hover:opacity-100 opacity-0 scale-75 group-hover:scale-100",
            "group-active:bg-airswap-blue/50",
          ])}
        />
      )}

      {/* This div is the checked state. */}
      <AnimatePresence mode="sync">
        {checked && (
          <motion.div
            key="box"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.09 }}
            className={twJoin([
              "absolute inset-0 bg-airswap-blue flex items-center justify-center pointer-events-none",
              "group-active:bg-opacity-50 group-data-[state=unchecked]:bg-opacity-50",
              "transition-colors duration-100",
              isOptionButton && "rounded-full inset-1",
            ])}
          ></motion.div>
        )}
        {!isOptionButton && (
          <svg
            className="absolute inset-[5px] text-white h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
          >
            <motion.path
              key="check"
              animate={{ pathLength: checked ? 1 : 0 }}
              transition={{
                duration: 0.09,
              }}
              exit={{ opacity: 0 }}
              d="M3,13 L9,19 22,5"
              stroke={"currentColor"}
              strokeWidth={3}
            />
          </svg>
        )}
      </AnimatePresence>
    </RadixCheckbox.Root>
  );
};
