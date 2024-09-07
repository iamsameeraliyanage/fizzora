"use client";

import FloatingCan from "@/components/FloatingCan";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Content } from "@prismicio/client";
import {
  Cloud,
  Clouds,
  Environment,
  // OrbitControls,
  Text,
} from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type SkyDiveSceneProps = {
  sentence: string | null;
  flavor: Content.SkyDiveSliceDefaultPrimary["flavor"];
};

export default function Scene({ sentence, flavor }: SkyDiveSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const canRef = useRef<THREE.Group>(null);
  const cloud1Ref = useRef<THREE.Group>(null);
  const cloud2Ref = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const wordsRef = useRef<THREE.Group>(null);

  const ANGLE = (75 * Math.PI) / 180;

  const getXPosition = (distance: number) => {
    return distance * Math.cos(ANGLE);
  };
  const getYPosition = (distance: number) => {
    return distance * Math.sin(ANGLE);
  };

  const getXYPosition = (distance: number) => {
    return {
      x: getXPosition(distance),
      y: getYPosition(-1 * distance),
    };
  };

  useGSAP(() => {
    if (
      !groupRef.current ||
      !canRef.current ||
      !cloudsRef.current ||
      !cloud1Ref.current ||
      !cloud2Ref.current ||
      !wordsRef.current
    ) {
      return;
    }
    //Set init position
    gsap.set(cloudsRef.current.position, { z: 10 });
    gsap.set(canRef.current.position, {
      ...getXYPosition(-4),
    });
    gsap.set(
      wordsRef.current.children.map((childWord) => childWord.position),
      {
        ...getXYPosition(7),
        z: 2,
      }
    );

    // Spining the can
    gsap.to(canRef.current.rotation, {
      y: Math.PI * 2,
      duration: 1.7,
      repeat: -1,
      ease: "none",
    });

    //Infinite clouds movement
    const Distance = 15;
    const Duration = 6;

    gsap.set([cloud2Ref.current.position, cloud1Ref.current.position], {
      ...getXYPosition(Distance),
    });

    gsap.to(cloud1Ref.current.position, {
      y: `+=${getYPosition(Distance * 2)}`,
      x: `+=${getXPosition(Distance * -2)}`,
      ease: "none",
      duration: Duration,
      repeat: -1,
    });

    gsap.to(cloud2Ref.current.position, {
      y: `+=${getYPosition(Distance * 2)}`,
      x: `+=${getXPosition(Distance * -2)}`,
      ease: "none",
      duration: Duration,
      delay: Duration / 2,
      repeat: -1,
    });

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".skydive",
        pin: true,
        start: "top top",
        end: "+=1500",
        scrub: 1.5,
      },
    });

    scrollTl
      .to("body", {
        backgroundColor: "#c0f0f5",
        overwrite: "auto",
        duration: 0.1,
      })
      .to(cloudsRef.current.position, { z: 0, duration: 0.3 }, 0)
      .to(canRef.current.position, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
      .to(
        wordsRef.current.children.map((childWord) => childWord.position),
        {
          keyframes: [
            {
              x: 0,
              y: 0,
              z: -1,
            },
            {
              ...getXYPosition(-7),
              z: -7,
            },
          ],
          stagger: 0.3,
        },
        0
      )
      .to(canRef.current.position, {
        ...getXYPosition(4),
        duration: 0.5,
        ease: "back.in(1.7)",
      })
      .to(cloudsRef.current.position, { z: 7, duration: 0.5 });
  }, []);

  return (
    <group ref={groupRef}>
      <group rotation={[0, 0, 0.5]}>
        <FloatingCan
          ref={canRef}
          flavor={flavor}
          rotationIntensity={0}
          floatIntensity={3}
          floatSpeed={3}
        >
          <pointLight intensity={30} color="#8c0413" decay={0.6} />
        </FloatingCan>
      </group>
      <Clouds ref={cloudsRef}>
        <Cloud ref={cloud1Ref} bounds={[10, 10, 2]} />
        <Cloud ref={cloud2Ref} bounds={[10, 10, 2]} />
      </Clouds>
      <group ref={wordsRef}>
        {sentence && <ThreeText sentence={sentence} color={"#f97315"} />}
      </group>
      {/* <OrbitControls /> */}
      <ambientLight intensity={2} color={"#9ddefa"} />
      <Environment files={"./hdr/field.hdr"} environmentIntensity={1.5} />
    </group>
  );
}

function ThreeText({ sentence, color }: { sentence: string; color?: string }) {
  const words = sentence.toUpperCase().split(" ");

  const material = new THREE.MeshLambertMaterial();

  const isDesktop = useMediaQuery("(min-width: 768px)", true);

  return words.map((word, index) => {
    return (
      <Text
        key={`${index}-${word}`}
        scale={isDesktop ? 1 : 0.5}
        material={material}
        font="./fonts/Alpino-Variable.woff"
        color={color}
        fontWeight={900}
        anchorX={"center"}
        anchorY={"middle"}
        characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ.,?!"
      >
        {word}
      </Text>
    );
  });
}
