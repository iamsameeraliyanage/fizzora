import { LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import clsx from "clsx";
import React from "react";

interface ButtonProps {
  buttonLink: LinkField;
  buttonText: string | null;
  className?: string;
}

const Button = ({ buttonLink, buttonText, className }: ButtonProps) => {
  return (
    <PrismicNextLink
      className={clsx(
        "inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 font-medium text-white duration-150 hover:bg-orange-700 focus:outline-none focus:ring",
        className,
      )}
      field={buttonLink}
    >
      {buttonText}
    </PrismicNextLink>
  );
};

export default Button;
