import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import styles from "./JoinWorkspaceModal.module.css";

import logoIcon2 from "../../../../assets/icons/logo2.svg";

import { ROUTES } from "../../../../router/routes.constant";

function JoinWorkspaceModal({ onClose }) {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [inviteCode, setInviteCode] = useState("");

  /* =========================================
     입장
  ========================================= */

  const handleEnter = () => {
    /*
      추후 API 연결 시
      여기서 초대 코드 검증 가능
    */

    if (!inviteCode.trim()) {
      return;
    }

    navigate(ROUTES.JOIN_WORKSPACE);
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <section
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.content}>
          {/* =========================================
              TITLE
          ========================================= */}

          <h2 className={styles.title}>{t("joinWorkspace.title")}</h2>

          {/* =========================================
              DESCRIPTION
          ========================================= */}

          <p className={styles.description}>{t("joinWorkspace.description")}</p>

          {/* =========================================
              FORM
          ========================================= */}

          <div className={styles.formArea}>
            <label htmlFor="inviteCode">{t("joinWorkspace.inviteCode")}</label>

            <input
              id="inviteCode"
              type="text"
              value={inviteCode}
              placeholder={t("joinWorkspace.inviteCodePlaceholder")}
              onChange={(e) => setInviteCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEnter();
                }
              }}
            />

            <button
              type="button"
              className={styles.enterButton}
              onClick={handleEnter}
              disabled={!inviteCode.trim()}
            >
              {t("joinWorkspace.enter")}
            </button>
          </div>
        </div>

        {/* =========================================
            LOGO
        ========================================= */}

        <img className={styles.logo} src={logoIcon2} alt="RelAi" />
      </section>
    </div>
  );
}

export default JoinWorkspaceModal;
