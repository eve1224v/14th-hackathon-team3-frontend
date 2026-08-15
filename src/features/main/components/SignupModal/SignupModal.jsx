import { useEffect, useState } from "react";

import styles from "./SignupModal.module.css";

import logoIcon2 from "../../../../assets/icons/logo2.svg";
import eyeIcon from "../../../../assets/icons/eyeIcon.svg";

import {
  requestEmailVerification,
  verifyEmailVerification,
} from "../../../../api/authApi";

function SignupModal({ onClose, onLoginClick, onSignupComplete }) {
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

    /*
      인증 이후 이메일을 변경하면
      다시 인증해야 함
    */
    if (isEmailVerified) {
      setIsEmailVerified(false);

      setIsVerificationSent(false);

      setVerificationCode("");

      setVerificationMessage("이메일이 변경되었습니다. 다시 인증해주세요.");

      setVerificationMessageType("error");
    }
  };

  /* =========================================
     이메일 인증번호 요청
  ========================================= */

  const handleSendVerification = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailMessage("이메일을 입력해주세요.");

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

      setEmailMessage(result?.message || "인증번호가 이메일로 발송되었습니다.");

      setEmailMessageType("success");
    } catch (error) {
      console.error("이메일 인증번호 요청 실패:", error);

      switch (error.code) {
        case "400INVALID_INPUT_VALUE":
          setEmailMessage("올바른 이메일 형식으로 입력해주세요.");
          break;

        case "409DUPLICATE_EMAIL":
          setEmailMessage("이미 가입된 이메일입니다.");
          break;

        case "429VERIFICATION_REQUEST_TOO_FREQUENT":
          setEmailMessage("인증번호 발송 후 60초 뒤에 다시 요청해주세요.");
          break;

        case "500EMAIL_SEND_FAILED":
          setEmailMessage(
            "이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.",
          );
          break;

        default:
          setEmailMessage(error.message || "인증번호 발송에 실패했습니다.");
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
      setVerificationMessage("이메일을 입력해주세요.");

      setVerificationMessageType("error");

      return;
    }

    if (!trimmedCode) {
      setVerificationMessage("인증번호를 입력해주세요.");

      setVerificationMessageType("error");

      return;
    }

    if (!/^\d{6}$/.test(trimmedCode)) {
      setVerificationMessage("인증번호는 6자리 숫자입니다.");

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
          result?.message || "이메일 인증이 완료되었습니다.",
        );

        setVerificationMessageType("success");

        return;
      }

      setVerificationMessage("이메일 인증에 실패했습니다.");

      setVerificationMessageType("error");
    } catch (error) {
      console.error("이메일 인증번호 검증 실패:", error);

      setIsEmailVerified(false);

      switch (error.code) {
        case "400INVALID_INPUT_VALUE":
          setVerificationMessage("이메일 또는 인증번호 형식을 확인해주세요.");
          break;

        case "400INVALID_VERIFICATION_CODE":
          setVerificationMessage("인증번호가 일치하지 않습니다.");
          break;

        case "400EXPIRED_VERIFICATION_CODE":
          setVerificationMessage(
            "인증번호가 만료되었습니다. 인증번호를 다시 요청해주세요.",
          );
          break;

        case "400VERIFICATION_ATTEMPTS_EXCEEDED":
          setVerificationMessage(
            "인증번호 입력 가능 횟수를 초과했습니다. 인증번호를 다시 요청해주세요.",
          );
          break;

        case "404EMAIL_VERIFICATION_NOT_FOUND":
          setVerificationMessage(
            "해당 이메일의 인증 요청이 없습니다. 인증번호를 먼저 요청해주세요.",
          );
          break;

        default:
          setVerificationMessage(
            error.message || "이메일 인증에 실패했습니다.",
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

  const handleSignup = () => {
    setSignupMessage("");

    const trimmedName = name.trim();

    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setSignupMessage("이름을 입력해주세요.");

      return;
    }

    if (!trimmedEmail) {
      setSignupMessage("업무용 이메일을 입력해주세요.");

      return;
    }

    if (!isEmailVerified) {
      setSignupMessage("이메일 인증을 완료해주세요.");

      return;
    }

    if (!password) {
      setSignupMessage("비밀번호를 입력해주세요.");

      return;
    }

    if (password.length < 8) {
      setSignupMessage("비밀번호는 8자 이상 입력해주세요.");

      return;
    }

    if (!passwordCheck) {
      setSignupMessage("비밀번호 확인을 입력해주세요.");

      return;
    }

    if (password !== passwordCheck) {
      setSignupMessage("비밀번호가 일치하지 않습니다.");

      return;
    }

    /*
      회원가입 API가 아직 없으므로
      현재는 프론트에서 사용자 정보 저장
    */

    localStorage.setItem("userName", trimmedName);

    localStorage.setItem("userEmail", trimmedEmail);

    /*
      Sidebar에게
      사용자 정보 변경 알림
    */

    window.dispatchEvent(new Event("userInfoUpdated"));

    /*
      기존 부모 컴포넌트 처리
    */

    onSignupComplete(trimmedName);
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <img className={styles.logo} src={logoIcon2} alt="RelAi" />

        <h2>글로벌 협업을 시작하세요.</h2>

        <p className={styles.description}>시차가 달라도 업무는 계속됩니다.</p>

        <div className={styles.formGrid}>
          {/* =================================
              왼쪽
          ================================= */}

          <div className={styles.leftColumn}>
            {/* 이름 */}

            <div className={styles.field}>
              <label htmlFor="signupName">이름</label>

              <input
                id="signupName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 이메일 */}

            <div className={styles.field}>
              <label htmlFor="signupEmail">업무용 이메일</label>

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
                    ? "인증완료"
                    : isSendingEmail
                      ? "전송중"
                      : remainingSeconds > 0
                        ? `${remainingSeconds}초`
                        : "인증"}
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

            {/* 인증번호 */}

            <div className={styles.field}>
              <div className={styles.inlineInput}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="인증코드를 입력하세요."
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
                    ? "완료"
                    : isVerifyingEmail
                      ? "확인중"
                      : "완료"}
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

          {/* =================================
              오른쪽
          ================================= */}

          <div className={styles.rightColumn}>
            {/* 비밀번호 */}

            <div className={styles.field}>
              <label htmlFor="signupPassword">비밀번호</label>

              <div className={styles.passwordWrapper}>
                <input
                  id="signupPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="8자 이상 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className={styles.eyeButton}
                  aria-label="비밀번호 보기"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <img src={eyeIcon} alt="" />
                </button>
              </div>
            </div>

            {/* 비밀번호 확인 */}

            <div className={styles.field}>
              <label htmlFor="signupPasswordCheck">비밀번호 확인</label>

              <div className={styles.passwordWrapper}>
                <input
                  id="signupPasswordCheck"
                  type={showPasswordCheck ? "text" : "password"}
                  placeholder="비밀번호 다시 입력"
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                />

                <button
                  type="button"
                  className={styles.eyeButton}
                  aria-label="비밀번호 보기"
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
            >
              회원가입
            </button>
          </div>
        </div>

        {/* =================================
            Divider
        ================================= */}

        <div className={styles.divider}>
          <span />

          <p>또는</p>

          <span />
        </div>

        {/* =================================
            로그인
        ================================= */}

        <div className={styles.loginArea}>
          <span>이미 계정이 있으신가요?</span>

          <button type="button" onClick={onLoginClick}>
            로그인
          </button>
        </div>
      </section>
    </div>
  );
}

export default SignupModal;
