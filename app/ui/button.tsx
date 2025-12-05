import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "flex h-10 items-center rounded-lg bg-primary px-xsmall text-sm font-medium text-white",
        className
      )}
    >
      {children}
    </button>
  );
}
