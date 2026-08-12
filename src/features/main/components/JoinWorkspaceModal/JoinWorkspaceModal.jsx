import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./JoinWorkspaceModal.module.css";

import logoIcon2 from "../../../../assets/icons/logo2.svg";
import { ROUTES } from "../../../../router/routes.constant";

function JoinWorkspaceModal({ onClose }) {
  const navigate = useNavigate();

  const [inviteCode, setInviteCode] = useState("");

  const handleEnter = () => {
    // 추후 API 연결 시 여기서 초대 코드 검증 가능
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
          <h2 className={styles.title}>초대 코드로 입장하기</h2>

          <p className={styles.description}>받은 초대 코드를 입력해 주세요.</p>

          <div className={styles.formArea}>
            <label htmlFor="inviteCode">초대 코드</label>

            <input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />

            <button
              type="button"
              className={styles.enterButton}
              onClick={handleEnter}
            >
              입장
            </button>
          </div>
        </div>

        <img className={styles.logo} src={logoIcon2} alt="RelAi" />
      </section>
    </div>
  );
}

export default JoinWorkspaceModal;
