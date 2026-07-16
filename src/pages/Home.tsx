import About from "../components/About.tsx";
import Hero from "../components/Hero";
import Transactions from "./Transactions";
import type { User } from "../types/userTypes";

type HomeProps = {
  currentUser: User | null;
  onSignIn: () => void;
  onSignUp: () => void;
  onLogout: () => void;
};

const Home = ({ currentUser, onSignIn, onSignUp, onLogout }: HomeProps) => {
  if (currentUser) {
    return <Transactions currentUser={currentUser} onLogout={onLogout} />;
  }

  return (
    <main className="home mx-auto flex min-h-screen w-full flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <Hero
        currentUser={currentUser}
        onLogout={onLogout}
        onSignIn={onSignIn}
        onSignUp={onSignUp}
      />
      <About />
    </main>
  );
};

export default Home;
