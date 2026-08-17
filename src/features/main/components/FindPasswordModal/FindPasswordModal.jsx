import { useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./FindPasswordModal.module.css";

import {
  requestPasswordReset,
  verifyPasswordReset,
  resetPassword,
} from "../../../../api/authApi";

function FindPasswordModal({ onClose }) {
  const { t } = useTranslation();

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
      setErrorMessage(t("findPassword.errors.emailRequired"));

      return;
    }

    try {
      setIsSendingCode(true);

      const result = await requestPasswordReset(trimmedEmail);

      console.log("인증번호 요청 성공:", result);

      setCodeSent(true);

      setSuccessMessage(
        result?.message || t("findPassword.messages.checkResetGuide"),
      );
    } catch (error) {
      console.error("인증번호 요청 실패:", error);

      switch (error.code) {
        case "400INVALID_INPUT_VALUE":
          setErrorMessage(t("findPassword.errors.invalidEmail"));
          break;

        case "500EMAIL_SEND_FAILED":
          setErrorMessage(t("findPassword.errors.emailSendFailed"));
          break;

        default:
          setErrorMessage(
            error.message || t("findPassword.errors.codeRequestFailed"),
          );
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
      setErrorMessage(t("findPassword.errors.emailRequired"));

      return;
    }

    if (!trimmedCode) {
      setErrorMessage(t("findPassword.errors.verificationCodeRequired"));

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
        setErrorMessage(t("findPassword.errors.noResetToken"));

        return;
      }

      setResetToken(token);

      setStep("reset");
    } catch (error) {
      console.error("인증번호 검증 실패:", error);

      switch (error.code) {
        case "400INVALID_INPUT_VALUE":
          setErrorMessage(t("findPassword.errors.invalidInput"));
          break;

        case "400INVALID_VERIFICATION_CODE":
          setErrorMessage(t("findPassword.errors.invalidVerificationCode"));
          break;

        case "400EXPIRED_VERIFICATION_CODE":
          setErrorMessage(t("findPassword.errors.expiredVerificationCode"));
          break;

        case "400VERIFICATION_ATTEMPTS_EXCEEDED":
          setErrorMessage(
            t("findPassword.errors.verificationAttemptsExceeded"),
          );
          break;

        case "400PASSWORD_RESET_NOT_VERIFIED":
          setErrorMessage(t("findPassword.errors.resetRequestNotFound"));
          break;

        default:
          setErrorMessage(
            error.message || t("findPassword.errors.verificationFailed"),
          );
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
      setErrorMessage(t("findPassword.errors.newPasswordRequired"));

      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage(t("findPassword.errors.passwordTooShort"));

      return;
    }

    const passwordByteLength = new TextEncoder().encode(newPassword).length;

    if (passwordByteLength > 72) {
      setErrorMessage(t("findPassword.errors.passwordTooLong"));

      return;
    }

    if (!newPasswordConfirm) {
      setErrorMessage(t("findPassword.errors.passwordConfirmRequired"));

      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setErrorMessage(t("findPassword.errors.passwordMismatch"));

      return;
    }

    if (!resetToken) {
      setErrorMessage(t("findPassword.errors.noResetVerification"));

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

      setSuccessMessage(
        result?.message || t("findPassword.messages.passwordChanged"),
      );

      setStep("success");
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);

      switch (error.code) {
        case "400INVALID_INPUT_VALUE":
          setErrorMessage(t("findPassword.errors.invalidPassword"));
          break;

        case "400PASSWORD_MISMATCH":
          setErrorMessage(t("findPassword.errors.passwordMismatch"));
          break;

        case "400PASSWORD_RESET_NOT_VERIFIED":
          setErrorMessage(t("findPassword.errors.resetNotVerified"));
          break;

        case "400INVALID_PASSWORD_RESET_TOKEN":
          setErrorMessage(t("findPassword.errors.invalidResetToken"));
          break;

        case "400EXPIRED_PASSWORD_RESET_TOKEN":
          setErrorMessage(t("findPassword.errors.expiredResetToken"));
          break;

        default:
          setErrorMessage(
            error.message || t("findPassword.errors.resetFailed"),
          );
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
          <h2 className={styles.title}>{t("findPassword.title")}</h2>

          <div className={styles.emailArea}>
            <label htmlFor="findPasswordEmail">
              {t("findPassword.emailVerification")}
            </label>

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
                ? t("findPassword.sending")
                : codeSent
                  ? t("findPassword.resend")
                  : t("findPassword.getCode")}
            </button>

            {successMessage && (
              <p className={styles.successMessage}>{successMessage}</p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="verificationCode">
              {t("findPassword.verificationCode")}
            </label>

            <input
              id="verificationCode"
              type="text"
              placeholder={t("findPassword.verificationCodePlaceholder")}
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
              {t("common.cancel")}
            </button>

            <button
              type="button"
              className={styles.confirmButton}
              onClick={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying
                ? t("findPassword.verifying")
                : t("findPassword.verify")}
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
          <h2 className={styles.title}>{t("findPassword.title")}</h2>

          <div className={styles.field}>
            <label htmlFor="newPassword">{t("findPassword.newPassword")}</label>

            <input
              id="newPassword"
              type="password"
              placeholder={t("findPassword.passwordPlaceholder")}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);

                setErrorMessage("");
              }}
            />

            <input
              id="newPasswordConfirm"
              type="password"
              placeholder={t("findPassword.passwordConfirmPlaceholder")}
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
              {t("common.cancel")}
            </button>

            <button
              type="button"
              className={styles.confirmButton}
              onClick={handleResetPassword}
              disabled={isResetting}
            >
              {isResetting
                ? t("findPassword.changing")
                : t("findPassword.complete")}
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
        <h2>{t("findPassword.successTitle")}</h2>

        <p>
          {successMessage || t("findPassword.messages.passwordChanged")}

          <br />

          {t("findPassword.loginWithNewPassword")}
        </p>

        <button
          type="button"
          className={styles.successButton}
          onClick={onClose}
        >
          {t("common.confirm")}
        </button>
      </section>
    </div>
  );
}

export default FindPasswordModal;
