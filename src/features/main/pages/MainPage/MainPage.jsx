import { useState } from "react";

import MainLayout from "../../../../components/MainLayout/MainLayout";
import MainHero from "../../components/MainHero/MainHero";
import LoginModal from "../../components/LoginModal/LoginModal";
import SignupModal from "../../components/SignupModal/SignupModal";
import OnboardingModal from "../../components/OnboardingModal/OnboardingModal";

import styles from "./MainPage.module.css";

function MainPage() {
  const [modal, setModal] = useState(null);

  return (
    <MainLayout>
      <div className={styles.glowSmall} />
      <div className={styles.glowLarge} />

      <MainHero
        onLoginClick={() => setModal("login")}
        onSignupClick={() => setModal("signup")}
      />

      {modal === "login" && (
        <LoginModal
          onClose={() => setModal(null)}
          onSignupClick={() => setModal("signup")}
        />
      )}

      {modal === "signup" && (
        <SignupModal
          onClose={() => setModal(null)}
          onLoginClick={() => setModal("login")}
          onSignupComplete={() => setModal("onboarding")}
        />
      )}

      {modal === "onboarding" && (
        <OnboardingModal
          onClose={() => setModal(null)}
        />
      )}
    </MainLayout>
  );
}

export default MainPage;