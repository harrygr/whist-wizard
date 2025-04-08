import classNames from "classnames";
import React from "react";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
  inputClassName?: string;
  hideLabel?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className, inputClassName, label, hideLabel = false, ...props }, ref) => {
    const id = React.useId();

    return (
      <div className={classNames(className)}>
        <label
          htmlFor={`${id}-i`}
          className={classNames(
            hideLabel ? "sr-only" : undefined,
            "block text-sm text-stone-500 mb-1"
          )}
        >
          {label}
        </label>
        <input
          id={`${id}-i`}
          className={classNames(
            inputClassName,
            "border border-stone-400 rounded h-9 px-2 max-w-full"
          )}
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);
