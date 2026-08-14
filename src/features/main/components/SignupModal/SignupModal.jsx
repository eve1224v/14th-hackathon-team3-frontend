import { useState } from "react";

import styles from "./SignupModal.module.css";

import logoIcon2 from "../../../../assets/icons/logo2.svg";
import eyeIcon from "../../../../assets/icons/eyeIcon.svg";

function SignupModal({ onClose, onLoginClick, onSignupComplete }) {
  const [name, setName] = useState("");

  const handleSignup = () => {
    if (!name.trim()) {
      return;
    }

    /*
      입력한 이름을 부모 컴포넌트로 전달
    */
    onSignupComplete(name.trim());
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
          {/* =========================
              왼쪽
          ========================= */}

          <div className={styles.leftColumn}>
            <div className={styles.field}>
              <label htmlFor="signupName">이름</label>

              <input
                id="signupName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="signupEmail">업무용 이메일</label>

              <div className={styles.inlineInput}>
                <input
                  id="signupEmail"
                  type="email"
                  placeholder="name@company.com"
                />

                <button type="button">인증</button>
              </div>
            </div>

            <div className={styles.inlineInput}>
              <input type="text" placeholder="인증코드를 입력하세요." />

              <button type="button">완료</button>
            </div>
          </div>

          {/* =========================
              오른쪽
          ========================= */}

          <div className={styles.rightColumn}>
            <div className={styles.field}>
              <label htmlFor="signupPassword">비밀번호</label>

              <div className={styles.passwordWrapper}>
                <input
                  id="signupPassword"
                  type="password"
                  placeholder="8자 이상 입력"
                />

                <button
                  type="button"
                  className={styles.eyeButton}
                  aria-label="비밀번호 보기"
                >
                  <img src={eyeIcon} alt="" />
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="signupPasswordCheck">비밀번호 확인</label>

              <div className={styles.passwordWrapper}>
                <input
                  id="signupPasswordCheck"
                  type="password"
                  placeholder="비밀번호 다시 입력"
                />

                <button
                  type="button"
                  className={styles.eyeButton}
                  aria-label="비밀번호 보기"
                >
                  <img src={eyeIcon} alt="" />
                </button>
              </div>
            </div>

            <button
              type="button"
              className={styles.signupButton}
              onClick={handleSignup}
            >
              회원가입
            </button>
          </div>
        </div>

        {/* =========================
            Divider
        ========================= */}

        <div className={styles.divider}>
          <span />

          <p>또는</p>

          <span />
        </div>

        {/* =========================
            Social
        ========================= */}

        {/* =========================
            로그인
        ========================= */}

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
