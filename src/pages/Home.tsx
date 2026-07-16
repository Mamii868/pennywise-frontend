import Hero from "../components/Hero";
import About from "../components/About.tsx";

const Home = () => {
  return (
    <main className="home mx-auto flex min-h-screen w-full flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <Hero />
      <About />
    </main>
  );
};

export default Home;
