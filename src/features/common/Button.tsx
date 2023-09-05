import { ReactNode } from "react";
import { ImSpinner8 } from "react-icons/im";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";
import { StakeOrUnstake, Status } from "../staking/types/StakingTypes";
import { buttonLoadingSpinner } from "../staking/utils/helpers";

// TODO: this button needs more work, including
// - disabled states, hover states, pressed states, focus-visible states, etc.
// - a `loading` boolean prop that disables the button and shows a spinner
// - More variants

const buttonVariants = tv({
  base:
    "font-bold px-5 py-3 transition-colors duration-150" +
    " disabled:pointer-events-none disabled:cursor-not-allowed",
  variants: {
    color: {
      primary: "bg-accent-blue text-white hover:border-white",
      transparent: "border border-border-dark hover:border-white",
    },
    rounded: {
      true: "rounded-full",
      false: "rounded-none",
    },
    size: {
      small: "text-xs py-1 px-3",
    },
  },
  defaultVariants: {
    rounded: true,
    color: "transparent",
  },
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

type LoadingSpinnerArgs = {
  stakeOrUnstake: StakeOrUnstake;
  needsApproval: boolean;
  statusApprove: Status;
  statusStake: Status;
  statusUnstake: Status;
};

interface ButtonProps {
  children?: ReactNode;
  className?: string;
  isDisabled?: boolean;
  loadingSpinnerArgs?: LoadingSpinnerArgs;
}

export const Button = ({
  children,
  className,
  rounded,
  size,
  color,
  isDisabled = false,
  loadingSpinnerArgs,
  ...rest
}: ButtonProps &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > &
  ButtonVariants) => {
  const isLoadingSpinner =
    loadingSpinnerArgs && buttonLoadingSpinner(loadingSpinnerArgs);

  return (
    <button
      className={twMerge(buttonVariants({ color, rounded, size }), className)}
      {...rest}
      disabled={isDisabled}
    >
      {isLoadingSpinner && <ImSpinner8 className="animate-spin mr-2 " />}
      {children}
    </button>
  );
};
