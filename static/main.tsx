import { useState } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";
import { Dominio } from "../src/components/Dominio";
import { Intro } from "../src/components/Intro";
function App() {
  const [intro, setIntro] = useState(true);
  return (
    <>
      <Dominio />
      {intro && <Intro onDone={() => setIntro(false)} />}
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
