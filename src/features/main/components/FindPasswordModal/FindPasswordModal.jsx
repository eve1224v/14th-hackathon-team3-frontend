import { useState } from "react";

import styles from "./FindPasswordModal.module.css";

import {
  requestPasswordReset,
  verifyPasswordReset,
  resetPassword,
} from "../../../../api/authApi";

function FindPasswordModal({ onClose }) {
  const [step, setStep] = useState("verify");

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [resetToken, setResetToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [isSendingCode, setIsSendingCode] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);

  const [isResetting, setIsResetting] = useState(false);

  const [codeSent, setCodeSent] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  /* =========================================
     인증번호 요청
  ========================================= */

  const handleSendCode = async () => {
    const trimmedEmail = email.trim();

    setErrorMessage("");
    setSuccessMessage("");

    if (!trimmedEmail) {
      setErrorMessage("이메일을 입력해주세요.");

      return;
    }

    try {
      setIsSendingCode(true);

      const result = await requestPasswordReset(trimmedEmail);

      console.log("인증번호 요청 성공:", result);

      setCodeSent(true);

      setSuccessMessage(
        result?.message || "비밀번호 재설정 안내를 확인해주세요.",
      );
    } catch (error) {
      console.error("인증번호 요청 실패:", error);

      switch (error.code) {
        case "400INVALID_INPUT_VALUE":
          setErrorMessage("이메일 형식을 확인해주세요.");
          break;

        case "500EMAIL_SEND_FAILED":
          setErrorMessage("이메일 발송에 실패했습니다.");
          break;

        default:
          setErrorMessage(error.message || "인증번호 요청에 실패했습니다.");
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  /* =========================================
     인증번호 검증
  ========================================= */

  const handleVerify = async () => {
    const trimmedEmail = email.trim();

    const trimmedCode = verificationCode.trim();

    setErrorMessage("");
    setSuccessMessage("");

    if (!trimmedEmail) {
      setErrorMessage("이메일을 입력해주세요.");

      return;
    }

    if (!trimmedCode) {
      setErrorMessage("인증 코드를 입력해주세요.");

      return;
    }

    try {
      setIsVerifying(true);

      const result = await verifyPasswordReset({
        email: trimmedEmail,
        verificationCode: trimmedCode,
      });

      console.log("비밀번호 재설정 인증 성공:", result);

      const token = result?.data?.resetToken;

      if (!token) {
        setErrorMessage("비밀번호 재설정 토큰을 받지 못했습니다.");

        return;
      }

      setResetToken(token);

      setStep("reset");
    } catch (error) {
      console.error("인증번호 검증 실패:", error);

      switch (error.code) {
        case "400INVALID_INPUT_VALUE":
          setErrorMessage("입력한 정보를 확인해주세요.");
          break;

        case "400INVALID_VERIFICATION_CODE":
          setErrorMessage("인증번호가 일치하지 않습니다.");
          break;

        case "400EXPIRED_VERIFICATION_CODE":
          setErrorMessage("인증번호가 만료되었거나 이미 사용되었습니다.");
          break;

        case "400VERIFICATION_ATTEMPTS_EXCEEDED":
          setErrorMessage("인증번호 입력 가능 횟수를 초과했습니다.");
          break;

        case "400PASSWORD_RESET_NOT_VERIFIED":
          setErrorMessage("비밀번호 재설정 인증 요청을 찾을 수 없습니다.");
          break;

        default:
          setErrorMessage(error.message || "인증번호 확인에 실패했습니다.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  /* =========================================
     새 비밀번호 설정
  ========================================= */

  const handleResetPassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!newPassword) {
      setErrorMessage("새 비밀번호를 입력해주세요.");

      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("비밀번호는 8자 이상 입력해주세요.");

      return;
    }

    const passwordByteLength = new TextEncoder().encode(newPassword).length;

    if (passwordByteLength > 72) {
      setErrorMessage("비밀번호는 72바이트 이하로 입력해주세요.");

      return;
    }

    if (!newPasswordConfirm) {
      setErrorMessage("새 비밀번호를 다시 입력해주세요.");

      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");

      return;
    }

    if (!resetToken) {
      setErrorMessage(
        "비밀번호 재설정 인증 정보가 없습니다. 다시 인증해주세요.",
      );

      return;
    }

    try {
      setIsResetting(true);

      const result = await resetPassword({
        email: email.trim(),
        resetToken,
        newPassword,
        newPasswordConfirm,
      });

      console.log("비밀번호 변경 성공:", result);

      setSuccessMessage(result?.message || "비밀번호가 변경되었습니다.");

      setStep("success");
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);

      switch (error.code) {
        case "400INVALID_INPUT_VALUE":
          setErrorMessage("입력한 비밀번호를 확인해주세요.");
          break;

        case "400PASSWORD_MISMATCH":
          setErrorMessage("비밀번호가 일치하지 않습니다.");
          break;

        case "400PASSWORD_RESET_NOT_VERIFIED":
          setErrorMessage(
            "비밀번호 재설정 인증이 완료되지 않았거나 이미 사용되었습니다.",
          );
          break;

        case "400INVALID_PASSWORD_RESET_TOKEN":
          setErrorMessage("비밀번호 재설정 인증 정보가 올바르지 않습니다.");
          break;

        case "400EXPIRED_PASSWORD_RESET_TOKEN":
          setErrorMessage(
            "비밀번호 재설정 인증 시간이 만료되었습니다. 다시 인증해주세요.",
          );
          break;

        default:
          setErrorMessage(error.message || "비밀번호 변경에 실패했습니다.");
      }
    } finally {
      setIsResetting(false);
    }
  };

  /* =========================================
     인증 화면
  ========================================= */

  if (step === "verify") {
    return (
      <div className={styles.overlay} onMouseDown={onClose}>
        <section
          className={styles.modal}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <h2 className={styles.title}>비밀번호 찾기</h2>

          <div className={styles.emailArea}>
            <label htmlFor="findPasswordEmail">이메일 인증</label>

            <input
              id="findPasswordEmail"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                setErrorMessage("");
                setSuccessMessage("");
              }}
            />

            <button
              type="button"
              className={styles.codeButton}
              onClick={handleSendCode}
              disabled={isSendingCode}
            >
              {isSendingCode
                ? "전송 중..."
                : codeSent
                  ? "다시 받기"
                  : "코드 받기"}
            </button>

            {successMessage && (
              <p className={styles.successMessage}>{successMessage}</p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="verificationCode">인증 코드</label>

            <input
              id="verificationCode"
              type="text"
              placeholder="인증 코드 입력"
              value={verificationCode}
              onChange={(e) => {
                setVerificationCode(e.target.value);

                setErrorMessage("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isVerifying) {
                  handleVerify();
                }
              }}
            />
          </div>

          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}

          <div className={styles.buttonArea}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              취소
            </button>

            <button
              type="button"
              className={styles.confirmButton}
              onClick={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? "인증 중..." : "인증"}
            </button>
          </div>
        </section>
      </div>
    );
  }

  /* =========================================
     새 비밀번호 설정 화면
  ========================================= */

  if (step === "reset") {
    return (
      <div className={styles.overlay} onMouseDown={onClose}>
        <section
          className={styles.modal}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <h2 className={styles.title}>비밀번호 찾기</h2>

          <div className={styles.field}>
            <label htmlFor="newPassword">새 비밀번호</label>

            <input
              id="newPassword"
              type="password"
              placeholder="8자 이상"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);

                setErrorMessage("");
              }}
            />

            <input
              id="newPasswordConfirm"
              type="password"
              placeholder="새 비밀번호 확인"
              value={newPasswordConfirm}
              onChange={(e) => {
                setNewPasswordConfirm(e.target.value);

                setErrorMessage("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isResetting) {
                  handleResetPassword();
                }
              }}
            />
          </div>

          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}

          <div className={styles.buttonArea}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              취소
            </button>

            <button
              type="button"
              className={styles.confirmButton}
              onClick={handleResetPassword}
              disabled={isResetting}
            >
              {isResetting ? "변경 중..." : "완료"}
            </button>
          </div>
        </section>
      </div>
    );
  }

  /* =========================================
     완료
  ========================================= */

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={styles.successModal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2>비밀번호 변경 완료</h2>

        <p>
          {successMessage || "비밀번호가 변경되었습니다."}
          <br />새 비밀번호로 로그인해주세요.
        </p>

        <button
          type="button"
          className={styles.successButton}
          onClick={onClose}
        >
          확인
        </button>
      </section>
    </div>
  );
}

export default FindPasswordModal;
