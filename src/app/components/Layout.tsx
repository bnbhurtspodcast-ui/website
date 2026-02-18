import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AudioPlayer } from "./AudioPlayer";
import { useState } from "react";
import { Episode } from "../data/episodes";

export function Layout() {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#112B4F] via-[#1a3d5f] to-[#112B4F] flex flex-col">
      <Header />
      <main className="flex-1 pb-24">
        <Outlet context={{ setCurrentEpisode }} />
      </main>
      <Footer />
      <AudioPlayer episode={currentEpisode} />
    </div>
  );
}