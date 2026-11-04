import { createFileRoute } from "@tanstack/react-router";
import { Dominio } from "@/components/Dominio";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Dominio />;
}
