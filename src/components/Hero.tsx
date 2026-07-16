import Button from "./Button";

const Hero = () => {
  return (
    <section className="hero flex min-h-96 w-full items-center justify-center px-6 py-16">
      <div className="titleContainer flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-4xl font-bold">Penny Wise</h1>
        <p className="text-lg text-center">Dangerously smart money management</p>
        <Button variant="primary">Sign Up</Button>
      </div>
    </section>
  );
};

export default Hero;
