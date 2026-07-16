import { useState } from "react";
import { logoutUser } from "./api/user/logoutUser";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import type { User } from "./types/userTypes";

type AuthMode = "login" | "signup";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");

  const openAuthModal = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      setCurrentUser(null);
    }
  };

  return (
    <>
      <Home
        currentUser={currentUser}
        onLogout={() => void handleLogout()}
        onSignIn={() => openAuthModal("login")}
        onSignUp={() => openAuthModal("signup")}
      />
      {isAuthModalOpen && (
        <AuthModal
          initialMode={authMode}
          onAuthenticated={setCurrentUser}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
}

export default App;
