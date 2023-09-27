import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

// TODO: this button needs more work, including
// - hover states, pressed states, focus-visible states, etc.
// - More variants

const buttonVariants = tv({
  base:
    "font-bold px-5 py-3 uppercase transition-all duration-150" +
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70",
  variants: {
    color: {
      primary: "bg-airswap-blue text-white hover:border-white",
      transparent: "border border-gray-800 hover:border-white",
      black: "bg-black border border-gray-800 hover:border-white",
      none: "bg-transparent",
    },
    rounded: {
      true: "rounded-full",
      false: "rounded-[3px]",
      leftTrue: "rounded-l-[3px]",
      leftFalse: "rounded-l-[3px]",
      rightTrue: "rounded-r-[3px]",
      rightFalse: "rounded-r-[3px]",
      none: "rounded-none",
    },
    size: {
      small: "text-xs py-1 px-3",
      smallest: "p-0 -mt-1.5",
    },
  },
  defaultVariants: {
    rounded: true,
    color: "transparent",
  },
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface ButtonProps {
  children?: ReactNode;
  className?: string;
}

export const Button = ({
  children,
  className,
  rounded,
  size,
  color,
  disabled,
  ...rest
}: ButtonProps &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > &
  ButtonVariants) => {
  return (
    <button
      className={twMerge(buttonVariants({ color, rounded, size }), className)}
      {...rest}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
