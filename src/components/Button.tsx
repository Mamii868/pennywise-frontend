interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-6 py-3 rounded-xl font-bold transition-all duration-300 text-sm hover:cursor-pointer";

  const variants = {
    primary:
      "bg-clown-red text-dark-text hover:bg-blood-red hover:text-dark-text",
    secondary:
      "bg-light-darkbg text-dark-text hover:bg-blood-red hover:text-light-text",
    outline:
      "border-2 border-clown-red text-dark-text hover:bg-blood-red hover:text-light-text",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
