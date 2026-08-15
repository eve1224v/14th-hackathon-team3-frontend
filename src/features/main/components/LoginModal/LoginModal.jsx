import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./LoginModal.module.css";

import logoIcon2 from "../../../../assets/icons/logo2.svg";
import eyeIcon from "../../../../assets/icons/eyeIcon.svg";

import { login } from "../../../../api/authApi";

function LoginModal({ onClose, onSignupClick }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await login(email, password);

      console.log("로그인 응답:", response);

      const userId = response.data.userId;

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", String(userId));

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("로그인 실패:", error);

      if (error.response?.status === 400) {
        setErrorMessage(
          error.response?.data?.message ||
            "이메일 또는 비밀번호를 확인해주세요."
        );
      } else if (error.response?.status === 401) {
        setErrorMessage(
          error.response?.data?.message ||
            "이메일 또는 비밀번호가 올바르지 않습니다."
        );
      } else {
        setErrorMessage("로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <img className={styles.logo} src={logoIcon2} alt="RelAi" />

        <h2>다시 오신 것을 환영합니다</h2>

        <p className={styles.description}>
          팀의 최신 진행 상황과 내 이슈를 확인하세요.
        </p>

        <div className={styles.field}>
          <label htmlFor="loginEmail">EMAIL</label>

          <input
            id="loginEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="loginPassword">PW</label>

          <div className={styles.passwordWrapper}>
            <input
              id="loginPassword"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
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

        {errorMessage && (
          <p className={styles.errorMessage}>
            {errorMessage}
          </p>
        )}

        <div className={styles.optionRow}>
          <button
            type="button"
            className={styles.findPassword}
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>

        <button
          type="button"
          className={styles.loginButton}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>

        <div className={styles.signupArea}>
          <span>아직 계정이 없으신가요?</span>

          <button
            type="button"
            onClick={onSignupClick}
          >
            회원가입
          </button>
        </div>
      </section>
    </div>
  );
}

export default LoginModal;