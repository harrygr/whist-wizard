import classNames from "classnames";

type Props = React.ComponentProps<"button"> & {
  kind?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
};

export const Button = ({
  className,
  kind = "primary",
  size = "medium",
  ...props
}: Props) => {
  return (
    <button
      className={classNames(
        className,
        "px-6 py-2 border rounded   cursor-pointer",
        {
          "bg-fuchsia-300 border-fuchsia-400 text-fuchsia-800 hover:bg-fuchsia-400/50":
            kind === "primary",
          "bg-white border-stone-400 text-stone-600 hover:bg-stone-50":
            kind === "secondary",
          "text-xs h-9": size === "small",
        }
      )}
      {...props}
    />
  );
};
