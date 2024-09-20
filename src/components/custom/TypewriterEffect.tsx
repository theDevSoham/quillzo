"use client";

import dynamic from "next/dynamic";

const TypewriterEffect = ({ str }: { str: string }) => {
  const Typewriter = dynamic(() => import("typewriter-effect"), {
    ssr: false,
    loading: (): JSX.Element => <p>Loading...</p>,
  });

  return (
    <Typewriter
      onInit={(typewriter) => {
        typewriter.typeString(str).pause().start();
      }}
    />
  );
};

export default TypewriterEffect;
