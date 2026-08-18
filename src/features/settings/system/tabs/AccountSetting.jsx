import { useState } from "react";

import PasswordChangeModal from "../components/PasswordChangeModal";

import pencilIcon from "../../../../assets/icons/pencilIcon.svg";

function AccountSetting({ userEmail, onLogout, styles }) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <>
      <div className={styles.systemPage}>
        <h3>계정</h3>

        <h4>기본 정보</h4>

        <div className={styles.systemGroup}>
          <div className={styles.systemRow}>
            <div>
              <strong>
                아이디 <span>(Email)</span>
              </strong>
            </div>

            <input value={userEmail} readOnly />
          </div>

          <div className={styles.systemRow}>
            <div>
              <strong>비밀번호</strong>
            </div>

            <div className={styles.passwordArea}>
              <input type="password" value="12345678" readOnly />

              <button
                type="button"
                className={styles.passwordChangeButton}
                onClick={() => setIsPasswordModalOpen(true)}
              >
                <img src={pencilIcon} alt="" />

                <span>변경</span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.dangerSection}>
          <div className={styles.dangerRow}>
            <div>
              <strong>로그아웃</strong>

              <p>현재 계정에서 로그아웃합니다.</p>
            </div>

            <button type="button" onClick={onLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {isPasswordModalOpen && (
        <PasswordChangeModal
          onClose={() => setIsPasswordModalOpen(false)}
          styles={styles}
        />
      )}
    </>
  );
}

export default AccountSetting;
