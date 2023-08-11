import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

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
  },
  defaultVariants: {
    rounded: true,
    color: "transparent",
  },
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

export const Button = ({
  children,
  className,
  rounded,
  color,
  ...rest
}: {
  children?: ReactNode;
  className?: string;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  ButtonVariants) => {
  return (
    <button
      className={twMerge(buttonVariants({ color, rounded }), className)}
      {...rest}
    >
      {children}
    </button>
  );
};
