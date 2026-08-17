import { useState } from "react";
import { useTranslation } from "react-i18next";

import PasswordChangeModal from "../components/PasswordChangeModal";

import pencilIcon from "../../../../assets/icons/pencilIcon.svg";

function AccountSetting({ userEmail, onLogout, styles }) {
  const { t } = useTranslation();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <>
      <div className={styles.systemPage}>
        <h3>{t("account.title")}</h3>

        <h4>{t("account.basicInfo")}</h4>

        <div className={styles.systemGroup}>
          <div className={styles.systemRow}>
            <div>
              <strong>
                {t("account.id")} <span>(Email)</span>
              </strong>
            </div>

            <input value={userEmail} readOnly />
          </div>

          <div className={styles.systemRow}>
            <div>
              <strong>{t("account.password")}</strong>
            </div>

            <div className={styles.passwordArea}>
              <input type="password" value="12345678" readOnly />

              <button
                type="button"
                className={styles.passwordChangeButton}
                onClick={() => setIsPasswordModalOpen(true)}
              >
                <img src={pencilIcon} alt="" />

                <span>{t("account.change")}</span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.dangerSection}>
          <div className={styles.dangerRow}>
            <div>
              <strong>{t("account.logout")}</strong>

              <p>{t("account.logoutDescription")}</p>
            </div>

            <button type="button" onClick={onLogout}>
              {t("account.logout")}
            </button>
          </div>

          <div className={styles.dangerRow}>
            <div>
              <strong>{t("account.deleteAccount")}</strong>

              <p>{t("account.deleteAccountDescription")}</p>
            </div>

            <button type="button">{t("account.deleteAccount")}</button>
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
