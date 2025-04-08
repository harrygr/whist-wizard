import classNames from "classnames";

type Props = React.ComponentProps<"button">;

export const NumberButton = ({ disabled, ...props }: Props) => {
  return (
    <button
      disabled={disabled}
      className={classNames(
        "h-10 grid place-items-center font-semibold rounded border",
        disabled
          ? "bg-stone-100 border-stone-300 cursor-not-allowed"
          : "bg-stone-50 border-stone-500 cursor-pointer hover:bg-stone-100"
      )}
      {...props}
    />
  );
};
