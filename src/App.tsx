import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./styles/global.css";
import "./lib/dayjs";

import { Header } from "./components/Headers";
import { SumeryTable } from "./components/SumeryTable";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
        <Header />
        <SumeryTable />
      </div>
    </div>
  );
}

// iniciar app npm run dev
