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
     초대 링크 → 초대 토큰 추출
  ========================================= */

  const extractInviteToken = (value) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "";
    }

    try {
      /*
        전체 URL을 입력한 경우

        예)
        https://.../invite?token=ws_1234

        ↓

        ws_1234
      */

      if (
        trimmedValue.startsWith("http://") ||
        trimmedValue.startsWith("https://")
      ) {
        const url = new URL(trimmedValue);

        const token = url.searchParams.get("token");

        if (token) {
          return token;
        }

        return "";
      }
    } catch (error) {
      console.error("초대 링크 파싱 실패:", error);

      return "";
    }

    /*
      사용자가 토큰 자체를 입력한 경우

      예)
      ws_21967b227d714b91a3193f986f816a4c
    */

    return trimmedValue;
  };

  /* =========================================
     입장
  ========================================= */

  const handleEnter = () => {
    if (!inviteCode.trim()) {
      return;
    }

    const inviteToken = extractInviteToken(inviteCode);

    if (!inviteToken) {
      alert("올바른 초대 링크를 입력해주세요.");

      return;
    }

    /*
      JoinWorkspaceForm으로 초대 토큰 전달
    */

    navigate(ROUTES.JOIN_WORKSPACE, {
      state: {
        inviteToken,
      },
    });

    if (onClose) {
      onClose();
    }
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
