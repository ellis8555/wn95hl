import GameInputForm from "@/components/client/GameInputForm";
import Standings from "@/components/server/standings/Standings";

export const metadata = {
  title: "wn95hl",
  description: "Home of nhl 95 leagues",
};

export default function Home() {
  return (
    <main>
      <h1 className="text-3xl text-center">wn95hl.com</h1>
      <GameInputForm />
      <Standings />
    </main>
  );
}
