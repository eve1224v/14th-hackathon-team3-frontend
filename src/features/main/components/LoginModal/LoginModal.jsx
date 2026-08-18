import { useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./LoginModal.module.css";

import logoIcon2 from "../../../../assets/icons/logo2.svg";
import eyeIcon from "../../../../assets/icons/eyeIcon.svg";

import { login } from "../../../../api/authApi";
import { getUserLanguage } from "../../../../api/userApi";

import FindPasswordModal from "../FindPasswordModal/FindPasswordModal";

function LoginModal({ onClose, onSignupClick, onLoginComplete }) {
  const { t, i18n } = useTranslation();

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
      setErrorMessage(t("login.errors.emailRequired"));

      return;
    }

    if (!password) {
      setErrorMessage(t("login.errors.passwordRequired"));

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
        setErrorMessage(t("login.errors.noAccessToken"));

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
         5. 사용자 기본 언어 조회
      ========================================= */

      try {
        const languageResult = await getUserLanguage();

        console.log("로그인 후 기본 언어 조회 성공:", languageResult);

        const language = languageResult?.data?.language || "ko";

        localStorage.setItem("userLanguage", language);

        if (i18n.language !== language) {
          await i18n.changeLanguage(language);
        }
      } catch (languageError) {
        console.error("로그인 후 기본 언어 조회 실패:", languageError);

        const fallbackLanguage = localStorage.getItem("userLanguage") || "ko";

        localStorage.setItem("userLanguage", fallbackLanguage);

        if (i18n.language !== fallbackLanguage) {
          await i18n.changeLanguage(fallbackLanguage);
        }
      }

      /* =========================================
         6. 사용자 정보 갱신
      ========================================= */

      window.dispatchEvent(new Event("userInfoUpdated"));

      window.dispatchEvent(new Event("authChanged"));

      /* =========================================
         7. 기존 사용자 → 메인
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
          setErrorMessage(t("login.errors.invalidInput"));

          break;

        case "401UNAUTHORIZED":
        case "401INVALID_LOGIN_CREDENTIALS":
          setErrorMessage(t("login.errors.unauthorized"));

          break;

        default:
          setErrorMessage(error.message || t("login.errors.loginFailed"));
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

        <h2>{t("login.title")}</h2>

        <p className={styles.description}>{t("login.description")}</p>

        <div className={styles.form}>
          {/* 이메일 */}

          <div className={styles.field}>
            <label htmlFor="loginEmail">{t("login.workEmail")}</label>

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
            <label htmlFor="loginPassword">{t("login.password")}</label>

            <div className={styles.passwordWrapper}>
              <input
                id="loginPassword"
                type={showPassword ? "text" : "password"}
                placeholder={t("login.passwordPlaceholder")}
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
                aria-label={
                  showPassword
                    ? t("login.hidePassword")
                    : t("login.showPassword")
                }
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
              {t("login.forgotPassword")}
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
            {isLoading ? t("login.loggingIn") : t("login.login")}
          </button>
        </div>

        <div className={styles.signupArea}>
          <span>{t("login.noAccount")}</span>

          <button type="button" onClick={onSignupClick}>
            {t("login.signup")}
          </button>
        </div>
      </section>
    </div>
  );
}

export default LoginModal;
