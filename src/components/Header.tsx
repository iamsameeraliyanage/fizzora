import React from "react";
import { FizzoraLogo } from "./FizzoraLogo";

type Props = {};

export default function Header({}: Props) {
  return (
    <header className="-mb-28 flex justify-center py-4">
      <FizzoraLogo className="z-10 h-20 cursor-pointer text-sky-800" />
    </header>
  );
}
