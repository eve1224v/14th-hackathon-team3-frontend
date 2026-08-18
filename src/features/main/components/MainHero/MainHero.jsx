import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./MainHero.module.css";

import JoinWorkspaceModal from "../JoinWorkspaceModal/JoinWorkspaceModal";

import { ROUTES } from "../../../../router/routes.constant";

function MainHero({ onLoginClick, onSignupClick }) {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  return (
    <>
      <section className={styles.hero}>
        {/* =========================================
            TITLE
        ========================================= */}

        <h2 className={styles.title}>글로벌 협업, 끊김 없이 이어가보세요</h2>

        {/* =========================================
            DESCRIPTION
        ========================================= */}

        <p className={styles.description}>
          언어와 시간대를 넘어 인수인계·소통·프로젝트 관리를 하나의
          워크스페이스에서 관리하세요.
        </p>

        {/* =========================================
            LOGIN 상태
        ========================================= */}

        {isLoggedIn ? (
          <div className={styles.workspaceActions}>
            <button
              type="button"
              className={styles.createWorkspaceButton}
              onClick={() => navigate(ROUTES.CREATE_WORKSPACE)}
            >
              새 워크스페이스 만들기
            </button>

            <button
              type="button"
              className={styles.joinWorkspaceButton}
              onClick={() => setIsJoinModalOpen(true)}
            >
              초대받은 워크스페이스 참여하기
            </button>
          </div>
        ) : (
          <>
            <button type="button" className={styles.workspaceButton}>
              워크스페이스 만들기
            </button>

            <div className={styles.authArea}>
              <button type="button" onClick={onLoginClick}>
                로그인
              </button>

              <button type="button" onClick={onSignupClick}>
                회원가입
              </button>
            </div>
          </>
        )}
      </section>

      {isJoinModalOpen && (
        <JoinWorkspaceModal onClose={() => setIsJoinModalOpen(false)} />
      )}
    </>
  );
}

export default MainHero;
