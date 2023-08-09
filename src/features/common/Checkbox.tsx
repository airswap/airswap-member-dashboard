import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { twJoin, twMerge } from "tailwind-merge";

export const Checkbox = ({ className }: { className?: string }) => {
  const [checked, setChecked] = useState<RadixCheckbox.CheckedState>(false);

  return (
    <RadixCheckbox.Root
      checked={checked}
      onCheckedChange={setChecked}
      className={twMerge([
        "group",
        "w-6 h-6 border border-dark-inactive rounded-sm bg-dark-checkbox relative",
        "data-[state=checked]:border-accent-blue data-[state=unchecked]:active:bg-accent-blue data-[state=unchecked]:active:bg-opacity-50",
        "transition-colors duration-100",
        "outline-none focus-visible:ring-1 ring-white",
        className,
      ])}
    >
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
