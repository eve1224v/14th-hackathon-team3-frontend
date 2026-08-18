import { useState } from "react";

import styles from "./LoginModal.module.css";

import logoIcon2 from "../../../../assets/icons/logo2.svg";
import eyeIcon from "../../../../assets/icons/eyeIcon.svg";

import { login } from "../../../../api/authApi";

import FindPasswordModal from "../FindPasswordModal/FindPasswordModal";

function LoginModal({ onClose, onSignupClick, onLoginComplete }) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [showFindPassword, setShowFindPassword] = useState(false);

  /* =========================================
     로그인
  ========================================= */

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    setErrorMessage("");

    if (!trimmedEmail) {
      setErrorMessage("이메일을 입력해주세요.");

      return;
    }

    if (!password) {
      setErrorMessage("비밀번호를 입력해주세요.");

      return;
    }

    try {
      setIsLoading(true);

      /* =========================================
         1. 로그인 API
      ========================================= */

      const result = await login(trimmedEmail, password);

      console.log("로그인 성공:", result);

      const accessToken = result?.data?.accessToken;

      const userId = result?.data?.userId;

      if (!accessToken) {
        setErrorMessage("로그인 토큰을 받지 못했습니다.");

        return;
      }

      /* =========================================
         2. 이전 로그인 정보 정리
      ========================================= */

      localStorage.removeItem("accessToken");

      localStorage.removeItem("refreshToken");

      /* =========================================
         3. 인증 정보 저장
      ========================================= */

      localStorage.setItem("accessToken", accessToken);

      localStorage.setItem("isLoggedIn", "true");

      localStorage.setItem("userEmail", trimmedEmail);

      if (userId) {
        localStorage.setItem("userId", String(userId));
      }

      /*
        기존 사용자 로그인

        신규 사용자 플래그 제거
      */

      localStorage.removeItem("isNewUser");

      /* =========================================
         4. 이전 Workspace 선택 정보 초기화
      ========================================= */

      localStorage.removeItem("workspaceId");

      localStorage.removeItem("workspaceName");

      localStorage.removeItem("workspaceCompanyName");

      localStorage.removeItem("selectedWorkspace");

      /* =========================================
         5. 사용자 정보 갱신
      ========================================= */

      window.dispatchEvent(new Event("userInfoUpdated"));

      window.dispatchEvent(new Event("authChanged"));

      /* =========================================
         6. 기존 사용자 → 메인
      ========================================= */

      if (onLoginComplete) {
        onLoginComplete(result);
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("로그인 실패:", error);

      switch (error.code) {
        case "400INVALID_INPUT_VALUE":
          setErrorMessage("이메일 또는 비밀번호를 확인해주세요.");

          break;

        case "401UNAUTHORIZED":
        case "401INVALID_LOGIN_CREDENTIALS":
          setErrorMessage("이메일 또는 비밀번호가 일치하지 않습니다.");

          break;

        default:
          setErrorMessage(error.message || "로그인에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================
     Enter
  ========================================= */

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  /* =========================================
     비밀번호 찾기
  ========================================= */

  if (showFindPassword) {
    return <FindPasswordModal onClose={() => setShowFindPassword(false)} />;
  }

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <img className={styles.logo} src={logoIcon2} alt="RelAi" />

        <h2>다시 만나서 반가워요.</h2>

        <p className={styles.description}>글로벌 협업을 계속하세요.</p>

        <div className={styles.form}>
          {/* 이메일 */}

          <div className={styles.field}>
            <label htmlFor="loginEmail">업무용 이메일</label>

            <input
              id="loginEmail"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                setErrorMessage("");
              }}
              onKeyDown={handleKeyDown}
              autoComplete="email"
            />
          </div>

          {/* 비밀번호 */}

          <div className={styles.field}>
            <label htmlFor="loginPassword">비밀번호</label>

            <div className={styles.passwordWrapper}>
              <input
                id="loginPassword"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  setErrorMessage("");
                }}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />

              <button
                type="button"
                className={styles.eyeButton}
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <img src={eyeIcon} alt="" />
              </button>
            </div>
          </div>

          {/* 비밀번호 찾기 */}

          <div className={styles.optionRow}>
            <button
              type="button"
              className={styles.findPassword}
              onClick={() => setShowFindPassword(true)}
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>

          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}

          <button
            type="button"
            className={styles.loginButton}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </div>

        <div className={styles.signupArea}>
          <span>아직 계정이 없으신가요?</span>

          <button type="button" onClick={onSignupClick}>
            회원가입
          </button>
        </div>
      </section>
    </div>
  );
}

export default LoginModal;
