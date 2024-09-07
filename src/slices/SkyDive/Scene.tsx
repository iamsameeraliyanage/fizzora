"use client";

import { useRef } from "react";
import { Group } from "three";

type Props = {};

function Scene({}: Props) {
  const groupRef = useRef<Group>(null);

  return <div>Scene</div>;
}

export default Scene;
