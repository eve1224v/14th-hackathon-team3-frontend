import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import styles from "./SignupModal.module.css";

import logoIcon2 from "../../../../assets/icons/logo2.svg";
import eyeIcon from "../../../../assets/icons/eyeIcon.svg";

import {
  requestEmailVerification,
  verifyEmailVerification,
  login,
} from "../../../../api/authApi";

/* =========================================
   API
========================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.likelion-bato.cloud";

/* =========================================
   회원가입 API

   POST /api/v1/users/signup
========================================= */

const signup = async ({ name, email, password, passwordConfirm }) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/signup`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      name,
      email,
      password,
      passwordConfirm,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || "회원가입에 실패했습니다.");

    error.status = response.status;

    error.code = data?.code;

    error.data = data?.data;

    throw error;
  }

  return data;
};

function SignupModal({ onClose, onLoginClick, onSignupComplete }) {
  const { t } = useTranslation();

  /* =========================================
     기본 입력값
  ========================================= */

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [verificationCode, setVerificationCode] = useState("");

  const [password, setPassword] = useState("");

  const [passwordCheck, setPasswordCheck] = useState("");

  /* =========================================
     비밀번호 보기
  ========================================= */

  const [showPassword, setShowPassword] = useState(false);

  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  /* =========================================
     이메일 인증 상태
  ========================================= */

  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  /* =========================================
     회원가입 상태
  ========================================= */

  const [isSigningUp, setIsSigningUp] = useState(false);

  /* =========================================
     60초 타이머
  ========================================= */

  const [remainingSeconds, setRemainingSeconds] = useState(0);

  /* =========================================
     메시지
  ========================================= */

  const [emailMessage, setEmailMessage] = useState("");

  const [emailMessageType, setEmailMessageType] = useState("");

  const [verificationMessage, setVerificationMessage] = useState("");

  const [verificationMessageType, setVerificationMessageType] = useState("");

  const [signupMessage, setSignupMessage] = useState("");

  /* =========================================
     60초 재요청 타이머
  ========================================= */

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [remainingSeconds]);

  /* =========================================
     이메일 변경
  ========================================= */

  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    setEmailMessage("");

    if (isEmailVerified) {
      setIsEmailVerified(false);

      setIsVerificationSent(false);

      setVerificationCode("");

      setVerificationMessage(t("signup.errors.emailChanged"));

      setVerificationMessageType("error");
    }
  };

  /* =========================================
     이메일 인증번호 요청
  ========================================= */

  const handleSendVerification = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailMessage(t("signup.errors.emailRequired"));

      setEmailMessageType("error");

      return;
    }

    if (remainingSeconds > 0) {
      return;
    }

    try {
      setIsSendingEmail(true);

      setEmailMessage("");

      setVerificationMessage("");

      const result = await requestEmailVerification(trimmedEmail);

      setIsVerificationSent(true);

      setIsEmailVerified(false);

      setVerificationCode("");

      setRemainingSeconds(60);

      setEmailMessage(result?.message || t("signup.messages.codeSent"));

      setEmailMessageType("success");
    } catch (error) {
      console.error("이메일 인증번호 요청 실패:", error);

      switch (error.code) {
        case "400INVALID_INPUT_VALUE":
          setEmailMessage(t("signup.errors.invalidEmail"));
          break;

        case "409DUPLICATE_EMAIL":
          setEmailMessage(t("signup.errors.duplicateEmail"));
          break;

        case "429VERIFICATION_REQUEST_TOO_FREQUENT":
          setEmailMessage(t("signup.errors.tooFrequent"));
          break;

        case "500EMAIL_SEND_FAILED":
          setEmailMessage(t("signup.errors.emailSendFailed"));
          break;

        default:
          setEmailMessage(error.message || t("signup.errors.codeSendFailed"));
      }

      setEmailMessageType("error");
    } finally {
      setIsSendingEmail(false);
    }
  };

  /* =========================================
     인증번호 검증
  ========================================= */

  const handleVerifyEmail = async () => {
    const trimmedEmail = email.trim();

    const trimmedCode = verificationCode.trim();

    if (!trimmedEmail) {
      setVerificationMessage(t("signup.errors.emailRequired"));

      setVerificationMessageType("error");

      return;
    }

    if (!trimmedCode) {
      setVerificationMessage(t("signup.errors.codeRequired"));

      setVerificationMessageType("error");

      return;
    }

    if (!/^\d{6}$/.test(trimmedCode)) {
      setVerificationMessage(t("signup.errors.codeSixDigits"));

      setVerificationMessageType("error");

      return;
    }

    try {
      setIsVerifyingEmail(true);

      setVerificationMessage("");

      const result = await verifyEmailVerification({
        email: trimmedEmail,

        verificationCode: trimmedCode,
      });

      if (result?.data?.verified === true) {
        setIsEmailVerified(true);

        setVerificationMessage(
          result?.message || t("signup.messages.emailVerified"),
        );

        setVerificationMessageType("success");

        return;
      }

      setVerificationMessage(t("signup.errors.verificationFailed"));

      setVerificationMessageType("error");
    } catch (error) {
      console.error("이메일 인증번호 검증 실패:", error);

      setIsEmailVerified(false);

      switch (error.code) {
        case "400INVALID_INPUT_VALUE":
          setVerificationMessage(t("signup.errors.invalidVerificationInput"));
          break;

        case "400INVALID_VERIFICATION_CODE":
          setVerificationMessage(t("signup.errors.invalidCode"));
          break;

        case "400EXPIRED_VERIFICATION_CODE":
          setVerificationMessage(t("signup.errors.expiredCode"));
          break;

        case "400VERIFICATION_ATTEMPTS_EXCEEDED":
          setVerificationMessage(t("signup.errors.attemptsExceeded"));
          break;

        case "404EMAIL_VERIFICATION_NOT_FOUND":
          setVerificationMessage(t("signup.errors.requestNotFound"));
          break;

        default:
          setVerificationMessage(
            error.message || t("signup.errors.verificationFailed"),
          );
      }

      setVerificationMessageType("error");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  /* =========================================
     회원가입
  ========================================= */

  const handleSignup = async () => {
    if (isSigningUp) {
      return;
    }

    setSignupMessage("");

    const trimmedName = name.trim();

    const trimmedEmail = email.trim();

    /* =========================================
       Validation
    ========================================= */

    if (!trimmedName) {
      setSignupMessage(t("signup.errors.nameRequired"));

      return;
    }

    if (!trimmedEmail) {
      setSignupMessage(t("signup.errors.workEmailRequired"));

      return;
    }

    if (!isEmailVerified) {
      setSignupMessage(t("signup.errors.emailVerificationRequired"));

      return;
    }

    if (!password) {
      setSignupMessage(t("signup.errors.passwordRequired"));

      return;
    }

    if (password.length < 8) {
      setSignupMessage(t("signup.errors.passwordTooShort"));

      return;
    }

    if (!passwordCheck) {
      setSignupMessage(t("signup.errors.passwordCheckRequired"));

      return;
    }

    if (password !== passwordCheck) {
      setSignupMessage(t("signup.errors.passwordMismatch"));

      return;
    }

    try {
      setIsSigningUp(true);

      /* =========================================
         1. 실제 회원가입 API
      ========================================= */

      const signupResult = await signup({
        name: trimmedName,

        email: trimmedEmail,

        password,

        passwordConfirm: passwordCheck,
      });

      console.log("회원가입 성공:", signupResult);

      const signupUserId = signupResult?.data?.userId;

      /* =========================================
         2. 회원가입 성공 → 자동 로그인
      ========================================= */

      const loginResult = await login(trimmedEmail, password);

      console.log("자동 로그인 성공:", loginResult);

      const accessToken = loginResult?.data?.accessToken;

      const loginUserId = loginResult?.data?.userId;

      if (!accessToken) {
        setSignupMessage(
          "회원가입은 완료되었지만 로그인 토큰을 받지 못했습니다.",
        );

        return;
      }

      /* =========================================
         3. 기존 인증정보 초기화
      ========================================= */

      localStorage.removeItem("accessToken");

      localStorage.removeItem("refreshToken");

      /* =========================================
         4. 자동 로그인 정보 저장
      ========================================= */

      localStorage.setItem("accessToken", accessToken);

      localStorage.setItem("isLoggedIn", "true");

      localStorage.setItem("isNewUser", "true");

      localStorage.setItem("userName", trimmedName);

      localStorage.setItem("userEmail", trimmedEmail);

      const finalUserId = loginUserId || signupUserId;

      if (finalUserId) {
        localStorage.setItem("userId", String(finalUserId));
      }

      /* =========================================
         5. 이전 Workspace 정보 초기화
      ========================================= */

      localStorage.removeItem("workspaceId");

      localStorage.removeItem("workspaceName");

      localStorage.removeItem("workspaceCompanyName");

      localStorage.removeItem("selectedWorkspace");

      /* =========================================
         6. 전역 상태 갱신
      ========================================= */

      window.dispatchEvent(new Event("userInfoUpdated"));

      window.dispatchEvent(new Event("authChanged"));

      /* =========================================
         7. 신규 사용자 → 온보딩
      ========================================= */

      if (onSignupComplete) {
        onSignupComplete(trimmedName);
      }
    } catch (error) {
      console.error("회원가입 실패:", error);

      switch (error.code) {
        case "409DUPLICATE_EMAIL":
          setSignupMessage("이미 가입된 이메일입니다.");
          break;

        case "400INVALID_INPUT_VALUE":
          setSignupMessage(error.message || "회원가입 입력값을 확인해주세요.");
          break;

        default:
          setSignupMessage(error.message || "회원가입에 실패했습니다.");
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <img className={styles.logo} src={logoIcon2} alt="RelAi" />

        <h2>{t("signup.title")}</h2>

        <p className={styles.description}>{t("signup.description")}</p>

        <div className={styles.formGrid}>
          {/* LEFT */}

          <div className={styles.leftColumn}>
            <div className={styles.field}>
              <label htmlFor="signupName">{t("signup.name")}</label>

              <input
                id="signupName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="signupEmail">{t("signup.workEmail")}</label>

              <div className={styles.inlineInput}>
                <input
                  id="signupEmail"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isEmailVerified}
                />

                <button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={
                    isSendingEmail || remainingSeconds > 0 || isEmailVerified
                  }
                >
                  {isEmailVerified
                    ? t("signup.verified")
                    : isSendingEmail
                      ? t("signup.sending")
                      : remainingSeconds > 0
                        ? t("signup.seconds", {
                            count: remainingSeconds,
                          })
                        : t("signup.verify")}
                </button>
              </div>

              {emailMessage && (
                <p
                  className={
                    emailMessageType === "success"
                      ? styles.successMessage
                      : styles.errorMessage
                  }
                >
                  {emailMessage}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <div className={styles.inlineInput}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder={t("signup.codePlaceholder")}
                  value={verificationCode}
                  disabled={!isVerificationSent || isEmailVerified}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");

                    setVerificationCode(value);
                  }}
                />

                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={
                    !isVerificationSent || isVerifyingEmail || isEmailVerified
                  }
                >
                  {isEmailVerified
                    ? t("signup.complete")
                    : isVerifyingEmail
                      ? t("signup.checking")
                      : t("signup.complete")}
                </button>
              </div>

              {verificationMessage && (
                <p
                  className={
                    verificationMessageType === "success"
                      ? styles.successMessage
                      : styles.errorMessage
                  }
                >
                  {verificationMessage}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT */}

          <div className={styles.rightColumn}>
            <div className={styles.field}>
              <label htmlFor="signupPassword">{t("signup.password")}</label>

              <div className={styles.passwordWrapper}>
                <input
                  id="signupPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("signup.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className={styles.eyeButton}
                  aria-label={
                    showPassword
                      ? t("signup.hidePassword")
                      : t("signup.showPassword")
                  }
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <img src={eyeIcon} alt="" />
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="signupPasswordCheck">
                {t("signup.passwordCheck")}
              </label>

              <div className={styles.passwordWrapper}>
                <input
                  id="signupPasswordCheck"
                  type={showPasswordCheck ? "text" : "password"}
                  placeholder={t("signup.passwordCheckPlaceholder")}
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                />

                <button
                  type="button"
                  className={styles.eyeButton}
                  aria-label={
                    showPasswordCheck
                      ? t("signup.hidePassword")
                      : t("signup.showPassword")
                  }
                  onClick={() => setShowPasswordCheck((prev) => !prev)}
                >
                  <img src={eyeIcon} alt="" />
                </button>
              </div>
            </div>

            {signupMessage && (
              <p className={styles.errorMessage}>{signupMessage}</p>
            )}

            <button
              type="button"
              className={styles.signupButton}
              onClick={handleSignup}
              disabled={isSigningUp}
            >
              {isSigningUp ? "가입 중..." : t("signup.signup")}
            </button>
          </div>
        </div>

        <div className={styles.divider}>
          <span />

          <p>{t("signup.or")}</p>

          <span />
        </div>

        <div className={styles.loginArea}>
          <span>{t("signup.alreadyHaveAccount")}</span>

          <button type="button" onClick={onLoginClick}>
            {t("login.login")}
          </button>
        </div>
      </section>
    </div>
  );
}

export default SignupModal;
