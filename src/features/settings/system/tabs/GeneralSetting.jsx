function GeneralSetting({
  systemForm,
  onChange,
  isLoading,
  errorMessage,
  styles,
}) {
  return (
    <div className={styles.systemPage}>
      <h3>일반</h3>

      <h4>워크스페이스 정보</h4>

      {/* =========================
          Loading
      ========================= */}

      {isLoading && (
        <p className={styles.generalStateText}>
          워크스페이스 정보를 불러오는 중입니다.
        </p>
      )}

      {/* =========================
          Error
      ========================= */}

      {!isLoading && errorMessage && (
        <p className={styles.generalErrorText}>{errorMessage}</p>
      )}

      {/* =========================
          Workspace
      ========================= */}

      {!isLoading && !errorMessage && (
        <div className={styles.systemGroup}>
          {/* 워크스페이스 이름 */}

          <div className={styles.systemRow}>
            <div>
              <strong>워크스페이스 이름</strong>

              <p>워크스페이스 이름을 설정합니다.</p>
            </div>

            <input
              name="workspaceName"
              value={systemForm.workspaceName}
              onChange={onChange}
            />
          </div>

          {/* 회사명 */}

          <div className={styles.systemRow}>
            <div>
              <strong>회사명</strong>

              <p>소속 회사명을 설정합니다.</p>
            </div>

            <input
              name="companyName"
              value={systemForm.companyName}
              onChange={onChange}
            />
          </div>

          {/* 파트너사 */}

          <div className={styles.systemRow}>
            <div>
              <strong>파트너사</strong>

              <p>협업 중인 파트너사를 설정합니다.</p>
            </div>

            <input
              name="partnerCompany"
              value={systemForm.partnerCompany}
              onChange={onChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneralSetting;
