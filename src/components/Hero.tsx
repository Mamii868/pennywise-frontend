import Button from "./Button";
import type { User } from "../types/userTypes";
import balloon from "../assets/balloon.svg";

type HeroProps = {
  currentUser: User | null;
  onSignIn: () => void;
  onSignUp: () => void;
  onLogout: () => void;
};

const Hero = ({ currentUser, onSignIn, onSignUp, onLogout }: HeroProps) => {
  return (
    <section className="hero flex min-h-96 w-full items-center justify-center px-6 py-16">
      <div className="titleContainer flex flex-col items-center justify-center gap-4 text-center">
        <div className="logoContainer flex items-center justify-center gap-2">
          <img
            src={balloon}
            alt="Penny Wise Logo"
            className="h-12 w-12 rounded-full"
          />
          <h1 className="text-clown-red text-6xl font-semibold tracking-[0.2em] uppercase">
            Penny Wise
          </h1>
        </div>

        <p className="text-center text-lg">
          Dangerously smart money management
        </p>
        {currentUser ? (
          <>
            <p className="text-dark-subtext">
              Signed in as {currentUser.username}
            </p>
            <Button onClick={onLogout} variant="outline">
              Sign out
            </Button>
          </>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={onSignUp} variant="primary">
              Sign Up
            </Button>
            <Button onClick={onSignIn} variant="outline">
              Sign In
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
