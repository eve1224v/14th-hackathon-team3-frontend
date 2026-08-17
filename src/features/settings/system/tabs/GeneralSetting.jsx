import { useTranslation } from "react-i18next";

function GeneralSetting({
  systemForm,
  onChange,
  isLoading,
  errorMessage,
  styles,
}) {
  const { t } = useTranslation();

  return (
    <div className={styles.systemPage}>
      <h3>{t("settings.general")}</h3>

      <h4>{t("settings.workspaceInfo")}</h4>

      {isLoading && (
        <p className={styles.generalStateText}>
          {t("settings.workspaceLoading")}
        </p>
      )}

      {!isLoading && errorMessage && (
        <p className={styles.generalErrorText}>{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && (
        <div className={styles.systemGroup}>
          <div className={styles.systemRow}>
            <div>
              <strong>{t("settings.workspaceName")}</strong>

              <p>{t("settings.workspaceNameDescription")}</p>
            </div>

            <input
              name="workspaceName"
              value={systemForm.workspaceName}
              onChange={onChange}
            />
          </div>

          <div className={styles.systemRow}>
            <div>
              <strong>{t("settings.companyName")}</strong>

              <p>{t("settings.companyNameDescription")}</p>
            </div>

            <input
              name="companyName"
              value={systemForm.companyName}
              onChange={onChange}
            />
          </div>

          <div className={styles.systemRow}>
            <div>
              <strong>{t("settings.partnerCompany")}</strong>

              <p>{t("settings.partnerCompanyDescription")}</p>
            </div>

            <input
              name="partnerCompany"
              value={systemForm.partnerCompany}
              onChange={onChange}
            />
          </div>
        </div>
      )}

      <div className={styles.systemSection}>
        <h4>{t("settings.basicSettings")}</h4>

        <div className={styles.systemGroup}>
          <div className={styles.systemRow}>
            <div>
              <strong>{t("settings.language")}</strong>

              <p>{t("settings.languageDescription")}</p>
            </div>

            <select
              name="language"
              value={systemForm.language}
              onChange={onChange}
            >
              <option value="ko">{t("languages.korean")}</option>

              <option value="en">{t("languages.english")}</option>

              <option value="ja">{t("languages.japanese")}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralSetting;
