const About = () => {
  return (
    <section className="flex w-full justify-center px-6 py-12">
      <div className="flex w-full max-w-4xl flex-col gap-3 rounded-3xl bg-dark-lightbg px-6 py-8 text-center shadow-lg shadow-black/20">
        <h2 className="text-2xl font-bold">About Penny Wise</h2>
        <p className="text-dark-subtext">
          Penny Wise helps you keep track of your money with a simple, focused
          dashboard for planning, saving, and making better spending decisions.
        </p>
      </div>
    </section>
  );
};

export default About;