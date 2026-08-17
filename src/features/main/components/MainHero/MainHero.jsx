import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import styles from "./MainHero.module.css";

import JoinWorkspaceModal from "../JoinWorkspaceModal/JoinWorkspaceModal";

import { ROUTES } from "../../../../router/routes.constant";

function MainHero({ onLoginClick, onSignupClick }) {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  return (
    <>
      <section className={styles.hero}>
        {/* =========================================
            TITLE
        ========================================= */}

        <h2 className={styles.title}>{t("mainHero.title")}</h2>

        {/* =========================================
            DESCRIPTION
        ========================================= */}

        <p className={styles.description}>{t("mainHero.description")}</p>

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
              {t("mainHero.createNewWorkspace")}
            </button>

            <button
              type="button"
              className={styles.joinWorkspaceButton}
              onClick={() => setIsJoinModalOpen(true)}
            >
              {t("mainHero.joinInvitedWorkspace")}
            </button>
          </div>
        ) : (
          <>
            <button type="button" className={styles.workspaceButton}>
              {t("mainHero.createWorkspace")}
            </button>

            <div className={styles.authArea}>
              <button type="button" onClick={onLoginClick}>
                {t("login.login")}
              </button>

              <button type="button" onClick={onSignupClick}>
                {t("login.signup")}
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
