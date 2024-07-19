import Image from "next/image";
import CountdownTimer from "./components/CountDownTimer";

export default function Home() {
  return (
    <main className="bg-gray-100">
      <CountdownTimer />
    </main>
  );
}
