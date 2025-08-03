import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { StartSession } from "../components/StartSession";
import { JoinSession } from "../components/JoinSession";
import Footer from "../components/Footer";

const Home = () => {
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const openStartModal = () => setIsStartModalOpen(true);
  const closeStartModal = () => setIsStartModalOpen(false);

  const openJoinModal = () => setIsJoinModalOpen(true);
  const closeJoinModal = () => setIsJoinModalOpen(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <Hero
        onStartSessionClick={openStartModal}
        onJoinSessionClick={openJoinModal}
      />
      <StartSession isOpen={isStartModalOpen} onClose={closeStartModal} />
      <JoinSession isOpen={isJoinModalOpen} onClose={closeJoinModal} />
      <Footer/>
    </div>
  );
};

export default Home;
