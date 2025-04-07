import type { SVGProps } from "react";
import spriteHref from "../assets/sprite.svg";
import type { IconName } from "../generated/icons";

interface Props extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export const Icon = ({ name, ...props }: Props) => {
  return (
    <svg aria-hidden {...props}>
      <use href={`${spriteHref}#${name}`} />
    </svg>
  );
};
