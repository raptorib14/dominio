import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dominio } from "@/components/Dominio";
import { Intro } from "@/components/Intro";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [intro, setIntro] = useState(true);
  return (
    <>
      <Dominio />
      {intro && <Intro onDone={() => setIntro(false)} />}
    </>
  );
}
