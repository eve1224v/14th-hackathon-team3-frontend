import { useState } from "react";

import MainLayout from "../../../../components/MainLayout/MainLayout";

import MainHero from "../../components/MainHero/MainHero";

import LoginModal from "../../components/LoginModal/LoginModal";
import SignupModal from "../../components/SignupModal/SignupModal";
import OnboardingModal from "../../components/OnboardingModal/OnboardingModal";

import JoinWorkspaceModal from "../../components/JoinWorkspaceModal/JoinWorkspaceModal";

function MainPage() {
  /* =========================
     Modal State
  ========================= */

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const [isJoinWorkspaceOpen, setIsJoinWorkspaceOpen] = useState(false);

  /* =========================
     회원가입 사용자 이름
  ========================= */

  const [signupUserName, setSignupUserName] = useState("");

  /* =========================
     로그인 Modal 열기
  ========================= */

  const handleLoginClick = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  /* =========================
     회원가입 Modal 열기
  ========================= */

  const handleSignupClick = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  /* =========================
     회원가입 완료
  ========================= */

  const handleSignupComplete = (name) => {
    // SignupModal에서 입력한 사용자 이름 저장
    setSignupUserName(name);

    // 로그인 상태 저장
    localStorage.setItem("isLoggedIn", "true");

    // 회원가입 Modal 닫기
    setIsSignupOpen(false);

    // Onboarding Modal 열기
    setIsOnboardingOpen(true);
  };

  /* =========================
     Onboarding 닫기
  ========================= */

  const handleOnboardingClose = () => {
    setIsOnboardingOpen(false);

    /*
      Sidebar와 MainHero가 localStorage의
      로그인 상태를 다시 읽도록 갱신
    */
    window.location.reload();
  };

  /* =========================
     초대받은 Workspace
  ========================= */

  const handleJoinWorkspaceClick = () => {
    setIsJoinWorkspaceOpen(true);
  };

  return (
    <MainLayout>
      {/* =========================
          Main Hero
      ========================= */}

      <MainHero
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onJoinWorkspaceClick={handleJoinWorkspaceClick}
      />

      {/* =========================
          Login Modal
      ========================= */}

      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onSignupClick={handleSignupClick}
        />
      )}

      {/* =========================
          Signup Modal
      ========================= */}

      {isSignupOpen && (
        <SignupModal
          onClose={() => setIsSignupOpen(false)}
          onLoginClick={handleLoginClick}
          onSignupComplete={handleSignupComplete}
        />
      )}

      {/* =========================
          Onboarding Modal
      ========================= */}

      {isOnboardingOpen && (
        <OnboardingModal
          userName={signupUserName}
          onClose={handleOnboardingClose}
        />
      )}

      {/* =========================
          Join Workspace Modal
      ========================= */}

      {isJoinWorkspaceOpen && (
        <JoinWorkspaceModal onClose={() => setIsJoinWorkspaceOpen(false)} />
      )}
    </MainLayout>
  );
}

export default MainPage;
