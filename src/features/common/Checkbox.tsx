import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { AnimatePresence, motion } from "framer-motion";
import { twJoin, twMerge } from "tailwind-merge";

export const Checkbox = ({
  className,
  checked,
  ...rest
}: { className?: string } & RadixCheckbox.CheckboxProps) => {
  return (
    <RadixCheckbox.Root
      className={twMerge([
        "group",
        "w-6 h-6 border border-dark-inactive rounded-sm bg-dark-checkbox relative",
        "transition-colors duration-150 touch-none",
        "data-[state=checked]:border-accent-blue",
        "data-[state=unchecked]:active:bg-accent-blue data-[state=unchecked]:active:bg-opacity-50 data-[state=unchecked]:transition-none",
        "!outline-none focus-visible:ring-1 ring-accent-blue ring-offset-2 ring-offset-bg-dark",
        "disabled:bg-dark-checkbox-bg-inactive disabled:border-dark-checkbox-border-inactive disabled:pointer-events-none",
        className,
      ])}
      {...rest}
    >
      {/* This div holds the checkmark shown on hover. */}
      <div
        className={twJoin([
          "absolute inset-0 bg-dark-checkbox-hovered flex items-center justify-center pointer-events-none",
          "group-hover:opacity-100 opacity-0", // Appear on hover
          "transition-opacity duration-150",
          "group-active:bg-opacity-0 transition-none", // so we can see through to the "pressed" state of the parent
        ])}
      >
        <svg
          className="absolute inset-[5px] text-dark-inactive"
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
              "absolute inset-0 bg-accent-blue flex items-center justify-center pointer-events-none",
              "group-active:bg-opacity-50 group-data-[state=unchecked]:bg-opacity-50",
              "transition-colors duration-100",
            ])}
          ></motion.div>
        )}
        <svg
          className="absolute inset-[5px] text-white"
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
      </AnimatePresence>
    </RadixCheckbox.Root>
  );
};
