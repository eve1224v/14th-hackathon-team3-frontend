import { useNavigate } from "react-router-dom";

import styles from "./LoginModal.module.css";

import logoIcon2 from "../../../../assets/icons/logo2.svg";
import eyeIcon from "../../../../assets/icons/eyeIcon.svg";

function LoginModal({ onClose, onSignupClick }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");

    navigate("/");
    window.location.reload();
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
          <input id="loginEmail" type="email" />
        </div>

        <div className={styles.field}>
          <label htmlFor="loginPassword">PW</label>

          <div className={styles.passwordWrapper}>
            <input id="loginPassword" type="password" />

            <button
              type="button"
              className={styles.eyeButton}
              aria-label="비밀번호 보기"
            >
              <img src={eyeIcon} alt="" />
            </button>
          </div>
        </div>

        <div className={styles.optionRow}>
          <button type="button" className={styles.findPassword}>
            비밀번호를 잊으셨나요?
          </button>
        </div>

        <button
          type="button"
          className={styles.loginButton}
          onClick={handleLogin}
        >
          로그인
        </button>

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
